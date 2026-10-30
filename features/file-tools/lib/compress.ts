import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist"

import { loadPdf, loadPdfjs, LOCKED_PDF } from "./pdf"

// Ported from ngampus-app (PDFKilat): pages are re-drawn as JPEG aiming for a
// 35–50% smaller file; the result is never larger than the original.

type Attempt = { longEdge: number; quality: number }

/**
 * Long-edge pixel budget, not a multiplier of the PDF page: scans often use a
 * MediaBox already sized in pixels. Attempts go from sharpest to smallest.
 */
const TARGET_RATIO = 0.575
const MAX_SCALE = 3
const MIN_QUALITY = 0.4
const ATTEMPTS: Attempt[] = [
  { longEdge: 2400, quality: 0.86 },
  { longEdge: 2400, quality: 0.74 },
  { longEdge: 2400, quality: 0.62 },
  { longEdge: 1900, quality: 0.68 },
  { longEdge: 1600, quality: 0.56 },
  { longEdge: 1300, quality: 0.46 },
  { longEdge: 1100, quality: 0.4 },
]
// Aim for 42.5% savings, allowing outputs up to 65% of the original size.
const TARGET_SLACK = 0.65 / TARGET_RATIO
const MAX_FULL_PASSES = 3
const SEARCH_STEPS = 3

async function canvasToJpeg(canvas: HTMLCanvasElement, quality: number) {
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Gagal membuat gambar."))),
      "image/jpeg",
      quality
    )
  )
  const bytes = new Uint8Array(await blob.arrayBuffer())
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    throw new Error("Browser ini tidak bisa mengompres PDF. Coba browser lain.")
  }
  return bytes
}

function newCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Browser ini tidak mendukung canvas.")
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  return { canvas, ctx }
}

function release(canvas: HTMLCanvasElement) {
  canvas.width = 0
  canvas.height = 0
}

function pageBox(page: PDFPageProxy) {
  const viewport = page.getViewport({ scale: 1 })
  return {
    width: Math.max(1, viewport.width),
    height: Math.max(1, viewport.height),
  }
}

async function renderPage(page: PDFPageProxy, longEdge: number) {
  const box = pageBox(page)
  const scale = Math.min(
    MAX_SCALE,
    Math.max(0.05, longEdge / Math.max(box.width, box.height))
  )
  const viewport = page.getViewport({ scale })
  const { canvas, ctx } = newCanvas(
    Math.floor(viewport.width),
    Math.floor(viewport.height)
  )
  await page.render({ canvasContext: ctx, viewport, canvas, intent: "print" })
    .promise
  return canvas
}

function downscale(source: HTMLCanvasElement, longEdge: number) {
  const longest = Math.max(source.width, source.height)
  if (longest <= longEdge + 1) return source
  const ratio = longEdge / longest
  const { canvas, ctx } = newCanvas(source.width * ratio, source.height * ratio)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  return canvas
}

async function encode(base: HTMLCanvasElement, attempt: Attempt) {
  const baseEdge = Math.max(base.width, base.height)
  const canvas =
    attempt.longEdge >= baseEdge ? base : downscale(base, attempt.longEdge)
  try {
    return await canvasToJpeg(canvas, attempt.quality)
  } finally {
    if (canvas !== base) release(canvas)
  }
}

/** Short binary search for the best quality that still fits the budget. */
async function searchQuality(
  base: HTMLCanvasElement,
  longEdge: number,
  low: number,
  high: number,
  pageCount: number,
  budget: number,
  lowFits: boolean
) {
  let best: Attempt | null = lowFits ? { longEdge, quality: low } : null
  for (let step = 0; step < SEARCH_STEPS; step++) {
    const quality = Math.round(((low + high) / 2) * 100) / 100
    if (quality - low < 0.02 || high - quality < 0.02) break
    const jpeg = await encode(base, { longEdge, quality })
    if (jpeg.byteLength * pageCount <= budget) {
      best = { longEdge, quality }
      low = quality
    } else {
      high = quality
    }
  }
  return best
}

/** Picks settings from page 1, estimating the whole file from it. */
async function chooseAttempt(
  page: PDFPageProxy,
  pageCount: number,
  originalSize: number
) {
  const budget = Math.floor(originalSize * TARGET_RATIO * TARGET_SLACK)
  const base = await renderPage(page, ATTEMPTS[0].longEdge)
  let best = ATTEMPTS[ATTEMPTS.length - 1]
  let bestBytes = Number.POSITIVE_INFINITY
  let previousOver: Attempt | null = null
  try {
    for (const [i, attempt] of ATTEMPTS.entries()) {
      const jpeg = await encode(base, attempt)
      if (jpeg.byteLength < bestBytes) {
        bestBytes = jpeg.byteLength
        best = attempt
      }
      if (jpeg.byteLength * pageCount <= budget) {
        let settings = attempt
        if (previousOver && previousOver.quality - attempt.quality > 0.03) {
          const sameEdge = previousOver.longEdge === attempt.longEdge
          settings =
            (await searchQuality(
              base,
              previousOver.longEdge,
              sameEdge ? attempt.quality : MIN_QUALITY,
              previousOver.quality,
              pageCount,
              budget,
              sameEdge
            )) ?? attempt
        }
        return { settings, fallback: ATTEMPTS.slice(i, i + 2), hopeless: false }
      }
      previousOver = attempt
    }
  } finally {
    release(base)
    page.cleanup()
  }
  return {
    settings: best,
    fallback: [best],
    hopeless: bestBytes * pageCount >= originalSize,
  }
}

async function rasterize(
  pdf: PDFDocumentProxy,
  attempt: Attempt,
  title: string,
  originalSize: number,
  stopAtBudget: boolean,
  onProgress?: (done: number, total: number) => void
) {
  const { PDFDocument } = await import("pdf-lib")
  const limit = stopAtBudget
    ? Math.floor(originalSize * TARGET_RATIO * TARGET_SLACK)
    : originalSize
  const out = await PDFDocument.create()
  out.setTitle(title)
  out.setProducer("Ngampus File Tools")
  let jpegSum = 0
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n)
    const box = pageBox(page)
    const canvas = await renderPage(page, attempt.longEdge)
    const jpeg = await canvasToJpeg(canvas, attempt.quality)
    release(canvas)
    page.cleanup()
    jpegSum += jpeg.byteLength
    if (jpegSum > limit) return null
    const img = await out.embedJpg(jpeg)
    out
      .addPage([box.width, box.height])
      .drawImage(img, { x: 0, y: 0, width: box.width, height: box.height })
    onProgress?.(n, pdf.numPages)
  }
  return out.save({ useObjectStreams: true })
}

async function rasterCompress(
  data: Uint8Array,
  title: string,
  onProgress?: (done: number, total: number) => void
) {
  const { pdfjs, options } = await loadPdfjs()
  const task = pdfjs.getDocument({ data: data.slice(), ...options })
  try {
    const pdf = await task.promise
    if (pdf.numPages < 1) return null
    const budget = Math.floor(data.byteLength * TARGET_RATIO * TARGET_SLACK)
    const choice = await chooseAttempt(
      await pdf.getPage(1),
      pdf.numPages,
      data.byteLength
    )
    if (choice.hopeless) return null
    const queue = [
      choice.settings,
      ...choice.fallback.filter((item) => item !== choice.settings),
    ]
    const passes = Math.min(MAX_FULL_PASSES, queue.length)
    let best: Uint8Array | null = null
    for (let pass = 0; pass < passes; pass++) {
      const bytes = await rasterize(
        pdf,
        queue[pass],
        title,
        data.byteLength,
        pass < passes - 1,
        onProgress
      )
      if (!bytes) continue
      if (bytes.byteLength <= budget) return bytes
      if (!best || bytes.byteLength < best.byteLength) best = bytes
    }
    return best && best.byteLength < data.byteLength ? best : null
  } catch (error) {
    if (error instanceof Error && error.name === "PasswordException")
      throw new Error(LOCKED_PDF)
    throw error
  } finally {
    await task.destroy()
  }
}

export async function compressPdf(
  file: File,
  onProgress?: (done: number, total: number) => void
): Promise<Uint8Array> {
  const data = new Uint8Array(await file.arrayBuffer())
  // Also rejects locked or broken files before rendering.
  const source = await loadPdf(data, file.name)
  const title = `${file.name.replace(/\.pdf$/i, "")} (kompres)`

  const raster = await rasterCompress(data, title, onProgress)
  if (raster && raster.byteLength < data.byteLength) return raster

  // Text-only PDFs barely shrink as images: rewrite instead, or keep the original.
  const { PDFDocument } = await import("pdf-lib")
  const out = await PDFDocument.create()
  out.setTitle(title)
  out.setProducer("Ngampus File Tools")
  const pages = await out.copyPages(source, source.getPageIndices())
  pages.forEach((page) => out.addPage(page))
  const rewritten = await out.save({ useObjectStreams: true })
  onProgress?.(1, 1)
  return rewritten.byteLength <= data.byteLength ? rewritten : data
}
