import {
  paraphraseRates,
  type ParaphraseRates,
} from "@/features/paraphrase/services/pricing"
import type { Turnaround } from "@/features/paraphrase/types"
import { serverGet } from "@/lib/api/server"

import { aiCheckPricing, type AiCheckPricing } from "./document-file"

interface DocumentServices {
  aiCheck: AiCheckPricing
  paraphrase: Omit<ParaphraseRates, "multipliers"> & {
    turnarounds: { id: Turnaround; multiplier: number }[]
  }
}

async function load() {
  try {
    return (await serverGet<DocumentServices>("/services/document")).data
  } catch {
    return null
  }
}

/** Cek AI prices and limits from Pengaturan admin; falls back to the defaults. */
export async function getAiCheckPricing(): Promise<AiCheckPricing> {
  const data = await load()
  return { ...aiCheckPricing, ...data?.aiCheck }
}

/** Paraphrase rates from Pengaturan admin; falls back to the defaults. */
export async function getParaphraseRates(): Promise<ParaphraseRates> {
  const p = (await load())?.paraphrase
  if (!p) return paraphraseRates
  return {
    tiers: p.tiers ?? paraphraseRates.tiers,
    minTarget: p.minTarget ?? paraphraseRates.minTarget,
    minPrice: p.minPrice ?? paraphraseRates.minPrice,
    multipliers: {
      ...paraphraseRates.multipliers,
      ...Object.fromEntries(p.turnarounds.map((t) => [t.id, t.multiplier])),
    },
  }
}
