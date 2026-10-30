import { loadPdf } from "./pdf"

export async function mergePdfs(
  files: File[],
  onProgress?: (done: number, total: number) => void
): Promise<Uint8Array> {
  if (files.length < 2)
    throw new Error("Unggah minimal 2 file PDF untuk digabung.")
  const { PDFDocument } = await import("pdf-lib")
  const out = await PDFDocument.create()
  out.setTitle("Gabungan PDF")
  out.setProducer("Ngampus File Tools")

  for (const [i, file] of files.entries()) {
    const src = await loadPdf(
      new Uint8Array(await file.arrayBuffer()),
      file.name
    )
    const pages = await out.copyPages(src, src.getPageIndices())
    pages.forEach((page) => out.addPage(page))
    onProgress?.(i + 1, files.length)
  }
  return out.save({ useObjectStreams: true })
}
