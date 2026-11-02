import { UserFacingError } from "../../../lib/errors"
const WORD = /[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu

export const countWords = (text: string) =>
  (text.normalize("NFKC").match(WORD) ?? []).length

/** Characters as the server (and GPTZero) count them: spaces collapsed. */
export const countChars = (text: string) =>
  text.normalize("NFKC").replace(/\s+/g, " ").trim().length

/** Extract locally: file contents never leave the browser. */
export async function countPdfWords(file: Blob): Promise<number> {
  const total = countWords(await extractPdfText(file))
  if (total === 0) {
    throw new UserFacingError(
      "Tidak ada teks yang dapat dihitung. Jika PDF berupa hasil scan atau gambar, lakukan OCR terlebih dahulu."
    )
  }
  return total
}

/** Text of every page, joined like the server's analyzer. */
export async function extractPdfText(file: Blob): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs")
  const assets = `/pdfjs/${pdfjs.version}`
  if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = `${assets}/pdf.worker.min.mjs`
  }
  const task = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    ...(typeof window !== "undefined"
      ? {
          cMapUrl: `${assets}/cmaps/`,
          cMapPacked: true,
          standardFontDataUrl: `${assets}/standard_fonts/`,
          wasmUrl: `${assets}/wasm/`,
        }
      : {}),
    stopAtErrors: true,
  })
  try {
    const pdf = await task.promise
    let all = ""
    for (let number = 1; number <= pdf.numPages; number += 1) {
      const page = await pdf.getPage(number)
      const content = await page.getTextContent()
      // PDF.js inserts spaces for visual gaps. Do not add spaces between
      // every item: a single word can span several font or drawing runs.
      const text = content.items
        .map((item) =>
          "str" in item ? item.str + (item.hasEOL ? "\n" : "") : ""
        )
        .join("")
      all += text + "\n"
      page.cleanup()
    }
    return all
  } catch (error) {
    if (error instanceof Error && error.name === "PasswordException") {
      throw new UserFacingError(
        "PDF dilindungi kata sandi. Buka proteksinya lalu pilih ulang file."
      )
    }
    if (error instanceof Error && error.name === "InvalidPDFException") {
      throw new UserFacingError(
        "File PDF rusak atau tidak valid. Ekspor ulang sebagai PDF lalu coba lagi."
      )
    }
    throw error
  } finally {
    await task.destroy()
  }
}
