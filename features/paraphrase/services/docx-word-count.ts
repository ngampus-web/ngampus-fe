export async function countDocxWords(file: Blob) {
  const { default: mammoth } = await import("mammoth/mammoth.browser.js")
  let text: string
  try {
    const result = await mammoth.extractRawText({
      arrayBuffer: await file.arrayBuffer(),
    })
    text = result.value
  } catch {
    throw new Error(
      "DOCX tidak dapat dibaca. Pastikan file tidak rusak atau dilindungi kata sandi, lalu ekspor ulang sebagai DOCX."
    )
  }
  const count = (
    text.normalize("NFKC").match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) ??
    []
  ).length
  if (!count)
    throw new Error(
      "Tidak ada teks dalam DOCX. Gunakan dokumen yang berisi tulisan, bukan hanya gambar."
    )
  return count
}
