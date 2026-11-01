import type { ParaphraseDetails, Turnaround } from "../types"
import { applyPriceFormula, MIN_PARAPHRASE_PRICE } from "./price-formula"

export interface ParaphraseRates {
  tiers: {
    maxWords: number | null
    ratePerWord: number
    ratePerPoint: number
  }[]
  multipliers: Record<Turnaround, number>
  minTarget: number
  minPrice: number
  maxFileMb: number
}

/** Fallback when the API is unreachable; live rates come from `/services/document`. */
export const paraphraseRates: ParaphraseRates = {
  tiers: [
    { maxWords: 5000, ratePerWord: 5.5, ratePerPoint: 2500 },
    { maxWords: 9999, ratePerWord: 5, ratePerPoint: 3250 },
    { maxWords: 14999, ratePerWord: 4.5, ratePerPoint: 4000 },
    { maxWords: null, ratePerWord: 4, ratePerPoint: 4750 },
  ],
  multipliers: { relaxed: 1, regular: 1.3, urgent: 1.5 },
  minTarget: 10,
  minPrice: MIN_PARAPHRASE_PRICE,
  maxFileMb: 25,
}

type PricingInput = Pick<
  ParaphraseDetails,
  "wordCount" | "service" | "turnaround"
> & {
  reports: Pick<
    ParaphraseDetails["reports"][number],
    "type" | "initialScore" | "targetScore"
  >[]
}
export function calculateParaphrasePrice(
  input: PricingInput,
  rates: ParaphraseRates = paraphraseRates
) {
  const { wordCount, service, turnaround, reports } = input
  if (!Number.isSafeInteger(wordCount) || wordCount <= 0)
    throw new Error("Jumlah kata belum tersedia.")
  const required = service === "combined" ? ["turnitin", "ai"] : [service]
  if (
    !["turnitin", "ai", "combined"].includes(service) ||
    reports.length !== required.length ||
    !required.every((type) => reports.some((r) => r.type === type))
  )
    throw new Error("Lengkapi skor layanan yang dipilih.")
  let reductionHundredths = 0
  for (const report of reports) {
    const { initialScore, targetScore } = report
    if (
      !Number.isFinite(initialScore) ||
      !Number.isFinite(targetScore) ||
      initialScore > 100 ||
      targetScore < rates.minTarget ||
      targetScore >= initialScore ||
      Math.abs(initialScore * 100 - Math.round(initialScore * 100)) >
        0.000001 ||
      Math.abs(targetScore * 100 - Math.round(targetScore * 100)) > 0.000001
    ) {
      throw new Error(
        `Isi skor dan target yang valid (maksimal dua angka desimal). Target minimal ${rates.minTarget}% dan di bawah skor awal.`
      )
    }
    reductionHundredths +=
      Math.round(initialScore * 100) - Math.round(targetScore * 100)
  }
  const multiplier = rates.multipliers[turnaround]
  if (!multiplier) throw new Error("Pilih paket pengerjaan.")
  // Same rule as the server: the first tier whose limit covers the document.
  const tier =
    rates.tiers.find((t) => t.maxWords === null || wordCount <= t.maxWords) ??
    rates.tiers[rates.tiers.length - 1]
  const { ratePerWord, ratePerPoint } = tier
  return applyPriceFormula({
    wordCount,
    reduction: reductionHundredths / 100,
    ratePerWord,
    ratePerPoint,
    multiplier,
    minPrice: rates.minPrice,
  })
}
export type ParaphrasePrice = ReturnType<typeof calculateParaphrasePrice>
