import { countDocxWords } from "@/features/paraphrase/services/docx-word-count"

import { countPdfWords } from "./pdf-word-count"

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

const WORD = /[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu

/**
 * Local word count for the price preview; the server counts again. Legacy
 * `.doc` files cannot be read in the browser and return null.
 */
export async function countDocumentWords(file: File): Promise<number | null> {
  const ext = extension(file)
  if (ext === "pdf") return countPdfWords(file)
  if (ext === "docx") return countDocxWords(file)
  if (ext === "txt")
    return ((await file.text()).normalize("NFKC").match(WORD) ?? []).length
  return null
}

/** Same as the server `pricing.ai_check` defaults (brief "Data Plagiarisme Tools"). */
export const aiCheckPricing = {
  basePrice: 6000,
  baseWords: 6000,
  stepPrice: 1000,
  stepWords: 1000,
  maxSizeMb: 50,
  minWords: 250,
}

export function priceAiCheck(words: number | null | undefined) {
  const p = aiCheckPricing
  if (!words) return p.basePrice
  return (
    p.basePrice +
    Math.max(0, Math.ceil((words - p.baseWords) / p.stepWords)) * p.stepPrice
  )
}
