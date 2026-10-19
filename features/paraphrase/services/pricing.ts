import type { ParaphraseDetails } from "../types"
import { turnaroundOptions } from "../options"
import { applyPriceFormula } from "./price-formula"

type PricingInput = Pick<
  ParaphraseDetails,
  "wordCount" | "service" | "turnaround"
> & {
  reports: Pick<
    ParaphraseDetails["reports"][number],
    "type" | "initialScore" | "targetScore"
  >[]
}
export function calculateParaphrasePrice(input: PricingInput) {
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
      targetScore < 10 ||
      targetScore >= initialScore ||
      Math.abs(initialScore * 100 - Math.round(initialScore * 100)) >
        0.000001 ||
      Math.abs(targetScore * 100 - Math.round(targetScore * 100)) > 0.000001
    ) {
      throw new Error(
        "Isi skor dan target yang valid (maksimal dua angka desimal). Target minimal 10% dan di bawah skor awal."
      )
    }
    reductionHundredths +=
      Math.round(initialScore * 100) - Math.round(targetScore * 100)
  }
  const option = turnaroundOptions.find((t) => t.id === turnaround)
  if (!option) throw new Error("Pilih paket pengerjaan.")
  // 10,000 words uses the third tier, following the supplied worked example.
  const [ratePerWord, ratePerPoint] =
    wordCount <= 5000
      ? [5.5, 2500]
      : wordCount < 10000
        ? [5, 3250]
        : wordCount < 15000
          ? [4.5, 4000]
          : [4, 4750]
  return applyPriceFormula({
    wordCount,
    reduction: reductionHundredths / 100,
    ratePerWord,
    ratePerPoint,
    multiplier: option.multiplier,
  })
}
export type ParaphrasePrice = ReturnType<typeof calculateParaphrasePrice>
