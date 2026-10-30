import type { PDFDocument } from "pdf-lib"

export const LOCKED_PDF =
  "PDF terkunci password. Buka kuncinya dulu, lalu unggah lagi."

/** Loads a PDF with pdf-lib; locked or broken files get a clear message. */
export async function loadPdf(
  bytes: Uint8Array,
  name: string
): Promise<PDFDocument> {
  const { PDFDocument } = await import("pdf-lib")
  try {
    return await PDFDocument.load(bytes)
  } catch (error) {
    // pdf-lib's ES5 build breaks `instanceof EncryptedPDFError`; match its message.
    if (error instanceof Error && /is encrypted/i.test(error.message))
      throw new Error(`${name}: ${LOCKED_PDF}`)
    throw new Error(
      `${name}: file PDF rusak atau tidak valid. Ekspor ulang sebagai PDF lalu coba lagi.`
    )
  }
}

/** Same pdf.js build and assets as the plagiarism word counter. */
export async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs")
  const assets = `/pdfjs/${pdfjs.version}`
  pdfjs.GlobalWorkerOptions.workerSrc = `${assets}/pdf.worker.min.mjs`
  return {
    pdfjs,
    options: {
      cMapUrl: `${assets}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `${assets}/standard_fonts/`,
      wasmUrl: `${assets}/wasm/`,
    },
  }
}
