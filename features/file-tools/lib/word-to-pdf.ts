import type { PDFDocument } from "pdf-lib"

import { UserFacingError } from "@/lib/errors"
import { canvasBytes, freeCanvas } from "./image"

const MAX_PAGES = 50
const PX_TO_PT = 72 / 96

/** Render DOCX pages locally, isolated from app styles and remote resources. */
export async function addWordPages(pdf: PDFDocument, file: File) {
  const [{ renderAsync }, { default: html2canvas }] = await Promise.all([
    import("docx-preview"),
    import("html2canvas"),
  ])
  const frame = document.createElement("iframe")
  frame.setAttribute("sandbox", "allow-same-origin")
  frame.setAttribute("aria-hidden", "true")
  frame.tabIndex = -1
  frame.style.cssText =
    "position:fixed;left:-20000px;top:0;width:1200px;height:1600px;border:0;pointer-events:none"
  document.body.append(frame)

  try {
    const doc = frame.contentDocument
    if (!doc) throw new Error("DOCX preview frame unavailable")
    doc.open()
    doc.write(`<!doctype html><html><head>
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; font-src data: blob:; style-src 'unsafe-inline'">
      <style>body{margin:0}</style>
      </head><body></body></html>`)
    doc.close()

    await renderAsync(await file.arrayBuffer(), doc.body, doc.head, {
      inWrapper: false,
      useBase64URL: true,
      renderAltChunks: false,
      ignoreLastRenderedPageBreak: false,
    })
    await Promise.all([
      doc.fonts.ready,
      ...Array.from(doc.images, (image) =>
        image.decode().catch(() => undefined)
      ),
    ])

    const sections = Array.from(
      doc.querySelectorAll<HTMLElement>("section.docx")
    )
    if (!sections.length) throw new Error("DOCX has no renderable sections")

    let pageCount = 0
    for (const section of sections) {
      const width = section.offsetWidth
      const height = section.scrollHeight
      const nominalHeight = Number.parseFloat(
        getComputedStyle(section).minHeight
      )
      // Some documents have no stored page breaks. Split overflowing content
      // at the paper height so it doesn't become a single oversized PDF page.
      const pageHeight = Math.round(
        nominalHeight > 0 ? nominalHeight : width * Math.SQRT2
      )
      if (!width || !height || !pageHeight)
        throw new Error("Invalid DOCX page size")
      const sectionPages = Math.ceil(height / pageHeight)
      pageCount += sectionPages
      if (pageCount > MAX_PAGES) {
        throw new UserFacingError(
          `Pilih dokumen Word maksimal ${MAX_PAGES} halaman.`
        )
      }

      const scale = Math.min(2, 3200 / Math.max(width, pageHeight))
      for (let y = 0; y < height; y += pageHeight) {
        const options = {
          y,
          width,
          height: pageHeight,
          scale,
          backgroundColor: "#ffffff",
          logging: false,
        }
        // Native layout gives more accurate text baselines. The computed
        // renderer handles cropped slices and browsers that reject SVG capture.
        const canvas =
          sectionPages === 1
            ? await html2canvas(section, {
                ...options,
                foreignObjectRendering: true,
                onclone: (clonedDocument, target) => {
                  for (const page of clonedDocument.querySelectorAll(
                    "section.docx"
                  )) {
                    if (page !== target && !page.contains(target)) page.remove()
                  }
                },
              }).catch(() => html2canvas(section, options))
            : await html2canvas(section, options)
        try {
          const image = await pdf.embedJpg(
            await canvasBytes(canvas, "image/jpeg", 0.94)
          )
          const pageWidth = width * PX_TO_PT
          const pageHeightPt = pageHeight * PX_TO_PT
          pdf.addPage([pageWidth, pageHeightPt]).drawImage(image, {
            x: 0,
            y: 0,
            width: pageWidth,
            height: pageHeightPt,
          })
        } finally {
          freeCanvas(canvas)
        }
      }
    }
  } catch (error) {
    if (error instanceof UserFacingError) throw error
    throw new UserFacingError(
      `${file.name}: dokumen Word tidak bisa dirender. Pastikan DOCX tidak rusak atau terkunci.`
    )
  } finally {
    frame.remove()
  }
}
