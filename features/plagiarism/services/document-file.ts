import { extractDocxText } from "@/features/paraphrase/services/docx-word-count"

import { countChars, countWords, extractPdfText } from "./pdf-word-count"

// Cek AI accepts the formats GPTZero reads (docs/prd/07-document-check.md).
const MIME: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
  txt: "text/plain",
}

export const AI_CHECK_ACCEPT = `.pdf,.docx,.doc,.txt,${Object.values(MIME).join(",")}`

const extension = (file: File) => file.name.toLowerCase().split(".").pop() ?? ""

export const isAiCheckFile = (file: File) => extension(file) in MIME

/** Browsers often leave `file.type` empty for Word files. */
export const documentMime = (file: File) => MIME[extension(file)] ?? file.type

export interface DocumentStats {
  words: number
  chars: number
}

/**
 * Local word and character count for the price preview; the server counts
 * again. Legacy `.doc` files cannot be read in the browser and return null.
 */
export async function analyzeDocument(
  file: File
): Promise<DocumentStats | null> {
  const ext = extension(file)
  const text =
    ext === "pdf"
      ? await extractPdfText(file)
      : ext === "docx"
        ? await extractDocxText(file)
        : ext === "txt"
          ? await file.text()
          : null
  if (text === null) return null
  const words = countWords(text)
  if (!words)
    throw new Error(
      ext === "pdf"
        ? "Tidak ada teks yang dapat dihitung. Jika PDF berupa hasil scan atau gambar, lakukan OCR terlebih dahulu."
        : "Tidak ada teks dalam dokumen. Gunakan dokumen yang berisi tulisan, bukan hanya gambar."
    )
  return { words, chars: countChars(text) }
}

export interface AiCheckPricing {
  startingPrice: number
  baseWords: number
  stepPrice: number
  stepWords: number
  maxSizeMb: number
  minWords: number
  maxChars: number
}

/** Fallback when the API is unreachable; the live values come from `/services/document`. */
export const aiCheckPricing: AiCheckPricing = {
  startingPrice: 6000,
  baseWords: 6000,
  stepPrice: 1000,
  stepWords: 1000,
  maxSizeMb: 50,
  minWords: 250,
  maxChars: 50000,
}

/** Same rule as the server: base price, then one step per started block of words. */
export function quoteAiCheck(p: AiCheckPricing, words: number) {
  const steps = Math.max(0, Math.ceil((words - p.baseWords) / p.stepWords))
  return {
    base: p.startingPrice,
    extraWords: steps * p.stepWords,
    extra: steps * p.stepPrice,
    total: p.startingPrice + steps * p.stepPrice,
  }
}
