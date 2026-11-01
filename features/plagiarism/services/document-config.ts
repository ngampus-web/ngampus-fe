import {
  paraphraseRates,
  type ParaphraseRates,
} from "@/features/paraphrase/services/pricing"

import { aiCheckPricing, type AiCheckPricing } from "./document-file"

export interface TurnitinPricing {
  startingPrice: number
  maxSizeMb: number
  maxPages: number
  maxWords: number
}

/** Prices and limits of every document service (Pengaturan admin). */
export interface DocumentConfig {
  aiCheck: AiCheckPricing
  turnitin: TurnitinPricing
  paraphrase: ParaphraseRates
}

/** Fallback when the API is unreachable. */
export const documentConfig: DocumentConfig = {
  aiCheck: aiCheckPricing,
  turnitin: {
    startingPrice: 7000,
    maxSizeMb: 10,
    maxPages: 200,
    maxWords: 60000,
  },
  paraphrase: paraphraseRates,
}

const num = (value: number) => value.toLocaleString("id-ID")
const rp = (value: number) => `Rp${num(value)}`

/** "Start Rp …/file" per service card. */
export function startPrices(c: DocumentConfig): Record<string, number> {
  return {
    turnitin: c.turnitin.startingPrice,
    "cek-ai": c.aiCheck.startingPrice,
    "parafrase-manual": c.paraphrase.minPrice,
  }
}

export function turnitinNoticeBody(t: TurnitinPricing) {
  return `Dokumen yang kamu cek maksimal ${num(t.maxSizeMb)} MB, ${num(t.maxPages)} halaman, atau ${num(t.maxWords)} kata. Tenang, dokumenmu dijamin 100% No-Repository dan tidak tersimpan di database Turnitin.`
}

export function aiCheckNoticeBody(a: AiCheckPricing) {
  return `Dokumen PDF, DOCX, DOC, atau TXT maksimal ${num(a.maxSizeMb)} MB, minimal ${num(a.minWords)} kata & maksimal ${num(a.maxChars)} karakter. ${rp(a.startingPrice)} untuk ${num(a.baseWords)} kata pertama, lalu ${rp(a.stepPrice)} per ${num(a.stepWords)} kata. Pengecekan menggunakan GPTZero untuk mendeteksi tulisan ChatGPT, Claude, Gemini, DeepSeek, dan AI lainnya, serta dokumen tidak tersimpan di database.`
}
