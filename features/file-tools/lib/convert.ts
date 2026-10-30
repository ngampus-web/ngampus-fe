import type { PDFDocument, PDFFont } from "pdf-lib"

import { extOf } from "./files"
import { loadPdf } from "./pdf"

// Ported from ngampus-app (PDFKilat). Office layouts (DOC, PPT, XLS) need a
// server-side converter; DOCX is converted as plain text.

const IMAGE_EXT = new Set(["png", "jpg", "jpeg", "webp", "gif", "bmp", "svg"])
const TEXT_EXT = new Set(["txt", "md", "csv", "json", "log"])

export const CONVERT_ACCEPT =
  ".pdf,.docx,.png,.jpg,.jpeg,.webp,.gif,.bmp,.svg,.txt,.md,.csv,.json,.log"

type Kind = "pdf" | "docx" | "image" | "text"

function kindOf(file: File): Kind | null {
  const ext = extOf(file.name)
  if (ext === "pdf") return "pdf"
  if (ext === "docx") return "docx"
  if (IMAGE_EXT.has(ext)) return "image"
  if (TEXT_EXT.has(ext)) return "text"
  return null
}

export const canConvert = (file: File) => kindOf(file) !== null

const A4: [number, number] = [595.28, 841.89]
const MARGIN = 50
const FONT_SIZE = 11
const LEADING = 16

// Standard fonts only cover WinAnsi; replace what they cannot draw.
const WIN_ANSI: Record<string, string> = {
  "—": "-",
  "–": "-",
  "“": '"',
  "”": '"',
  "‘": "'",
  "’": "'",
  "…": "...",
  "•": "*",
}

function toWinAnsi(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, (ch) => WIN_ANSI[ch] ?? "?")
}

function wrapLines(text: string, font: PDFFont, maxWidth: number) {
  const width = (s: string) => font.widthOfTextAtSize(s, FONT_SIZE)
  const lines: string[] = []
  for (const raw of toWinAnsi(text).split(/\r?\n/)) {
    let line = ""
    for (const word of raw.split(/\s+/)) {
      const test = line ? `${line} ${word}` : word
      if (width(test) <= maxWidth) {
        line = test
        continue
      }
      if (line) lines.push(line)
      line = ""
      // Hard-wrap words wider than the page (URLs, long numbers).
      for (const ch of word) {
        if (width(line + ch) > maxWidth) {
          lines.push(line)
          line = ch
        } else {
          line += ch
        }
      }
    }
    lines.push(line)
  }
  return lines
}

function drawText(doc: PDFDocument, font: PDFFont, text: string) {
  let page = doc.addPage(A4)
  const maxWidth = page.getWidth() - MARGIN * 2
  let y = page.getHeight() - MARGIN
  for (const line of wrapLines(text, font, maxWidth)) {
    if (y < MARGIN + LEADING) {
      page = doc.addPage(A4)
      y = page.getHeight() - MARGIN
    }
    page.drawText(line, { x: MARGIN, y, size: FONT_SIZE, font, maxWidth })
    y -= LEADING
  }
}

async function imageBytes(file: File) {
  const ext = extOf(file.name)
  if (ext === "jpg" || ext === "jpeg")
    return {
      kind: "jpg" as const,
      bytes: new Uint8Array(await file.arrayBuffer()),
    }
  if (ext === "png")
    return {
      kind: "png" as const,
      bytes: new Uint8Array(await file.arrayBuffer()),
    }

  // WEBP, GIF, BMP and SVG: draw through an <img> (scripts in SVG never run).
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () =>
        reject(new Error(`${file.name}: gambar tidak bisa dibaca.`))
      el.src = url
    })
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, img.naturalWidth || img.width)
    canvas.height = Math.max(1, img.naturalHeight || img.height)
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Browser ini tidak mendukung canvas.")
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) =>
          b
            ? resolve(b)
            : reject(new Error(`${file.name}: gambar tidak bisa diproses.`)),
        "image/jpeg",
        0.92
      )
    )
    return {
      kind: "jpg" as const,
      bytes: new Uint8Array(await blob.arrayBuffer()),
    }
  } finally {
    URL.revokeObjectURL(url)
  }
}

async function addImage(doc: PDFDocument, file: File) {
  const { kind, bytes } = await imageBytes(file)
  let img
  try {
    img = kind === "jpg" ? await doc.embedJpg(bytes) : await doc.embedPng(bytes)
  } catch {
    throw new Error(`${file.name}: gambar rusak atau tidak valid.`)
  }
  const landscape = img.width > img.height
  const [pageW, pageH] = landscape ? [A4[1], A4[0]] : A4
  const pad = 24
  const scale = Math.min(
    (pageW - pad * 2) / img.width,
    (pageH - pad * 2) / img.height
  )
  const w = img.width * scale
  const h = img.height * scale
  doc
    .addPage([pageW, pageH])
    .drawImage(img, {
      x: (pageW - w) / 2,
      y: (pageH - h) / 2,
      width: w,
      height: h,
    })
}

async function addDocx(doc: PDFDocument, file: File, font: PDFFont) {
  const { default: mammoth } = await import("mammoth/mammoth.browser.js")
  let text: string
  try {
    text = (
      await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
    ).value
  } catch {
    throw new Error(
      `${file.name}: DOCX tidak bisa dibaca. Pastikan file tidak rusak atau terkunci.`
    )
  }
  drawText(doc, font, `${file.name}\n\n${text.trim() || "(dokumen kosong)"}`)
}

async function addPdf(doc: PDFDocument, file: File) {
  const src = await loadPdf(new Uint8Array(await file.arrayBuffer()), file.name)
  const pages = await doc.copyPages(src, src.getPageIndices())
  pages.forEach((page) => doc.addPage(page))
}

/** Converts files into one PDF, in the order given. */
export async function convertToPdf(
  files: File[],
  onProgress?: (done: number, total: number) => void
): Promise<Uint8Array> {
  if (!files.length) throw new Error("Pilih file yang mau dikonversi.")
  const unsupported = files.find((f) => !canConvert(f))
  if (unsupported)
    throw new Error(`${unsupported.name}: format ini belum didukung.`)

  const { PDFDocument, StandardFonts } = await import("pdf-lib")
  const out = await PDFDocument.create()
  out.setTitle("Konversi PDF")
  out.setProducer("Ngampus File Tools")
  const font = await out.embedFont(StandardFonts.Helvetica)

  for (const [i, file] of files.entries()) {
    const kind = kindOf(file)
    if (kind === "pdf") await addPdf(out, file)
    else if (kind === "docx") await addDocx(out, file, font)
    else if (kind === "text")
      drawText(out, font, `${file.name}\n\n${await file.text()}`)
    else await addImage(out, file)
    onProgress?.(i + 1, files.length)
  }
  return out.save({ useObjectStreams: true })
}
