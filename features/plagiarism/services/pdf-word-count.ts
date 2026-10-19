/** Extract locally: file contents never leave the browser. */
export async function countPdfWords(file: Blob): Promise<number> {
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
    let total = 0
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
      total += (
        text
          .normalize("NFKC")
          .match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) ?? []
      ).length
      page.cleanup()
    }
    if (total === 0) {
      throw new Error(
        "Tidak ada teks yang dapat dihitung. Jika PDF berupa hasil scan atau gambar, lakukan OCR terlebih dahulu."
      )
    }
    return total
  } catch (error) {
    if (error instanceof Error && error.name === "PasswordException") {
      throw new Error(
        "PDF dilindungi kata sandi. Buka proteksinya lalu pilih ulang file."
      )
    }
    if (error instanceof Error && error.name === "InvalidPDFException") {
      throw new Error(
        "File PDF rusak atau tidak valid. Ekspor ulang sebagai PDF lalu coba lagi."
      )
    }
    throw error
  } finally {
    await task.destroy()
  }
}
