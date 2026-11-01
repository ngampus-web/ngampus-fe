import { countWords } from "@/features/plagiarism/services/pdf-word-count"

export async function extractDocxText(file: Blob): Promise<string> {
  const { default: mammoth } = await import("mammoth/mammoth.browser.js")
  try {
    const result = await mammoth.extractRawText({
      arrayBuffer: await file.arrayBuffer(),
    })
    return result.value
  } catch {
    throw new Error(
      "DOCX tidak dapat dibaca. Pastikan file tidak rusak atau dilindungi kata sandi, lalu ekspor ulang sebagai DOCX."
    )
  }
}

export async function countDocxWords(file: Blob) {
  const count = countWords(await extractDocxText(file))
  if (!count)
    throw new Error(
      "Tidak ada teks dalam DOCX. Gunakan dokumen yang berisi tulisan, bukan hanya gambar."
    )
  return count
}
