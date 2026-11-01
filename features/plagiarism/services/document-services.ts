import type { Turnaround } from "@/features/paraphrase/types"
import { serverGet } from "@/lib/api/server"

import { type DocumentConfig, documentConfig } from "./document-config"

interface DocumentServicesResponse {
  turnitin: DocumentConfig["turnitin"]
  aiCheck: DocumentConfig["aiCheck"]
  paraphrase: Partial<Omit<DocumentConfig["paraphrase"], "multipliers">> & {
    turnarounds?: { id: Turnaround; multiplier: number }[]
  }
}

/** Prices and limits from Pengaturan admin; each value falls back to the defaults. */
export async function getDocumentConfig(): Promise<DocumentConfig> {
  let data: DocumentServicesResponse
  try {
    data = (await serverGet<DocumentServicesResponse>("/services/document"))
      .data
  } catch {
    return documentConfig
  }
  const fallback = documentConfig.paraphrase
  const p = data.paraphrase ?? {}
  return {
    aiCheck: { ...documentConfig.aiCheck, ...data.aiCheck },
    turnitin: { ...documentConfig.turnitin, ...data.turnitin },
    paraphrase: {
      tiers: p.tiers ?? fallback.tiers,
      minTarget: p.minTarget ?? fallback.minTarget,
      minPrice: p.minPrice ?? fallback.minPrice,
      maxFileMb: p.maxFileMb ?? fallback.maxFileMb,
      multipliers: {
        ...fallback.multipliers,
        ...Object.fromEntries(
          (p.turnarounds ?? []).map((t) => [t.id, t.multiplier])
        ),
      },
    },
  }
}
