/** Brief "Pricing NGAMPUS": every order costs at least this much. */
export const MIN_PARAPHRASE_PRICE = 25000

/** Calculate in hundredths of a rupiah; round only the final total. */
export function applyPriceFormula({
  wordCount,
  reduction,
  ratePerWord,
  ratePerPoint,
  multiplier,
}: {
  wordCount: number
  reduction: number
  ratePerWord: number
  ratePerPoint: number
  multiplier: number
}) {
  if (
    !Number.isSafeInteger(wordCount) ||
    wordCount <= 0 ||
    ![reduction, ratePerWord, ratePerPoint, multiplier].every(
      (value) => Number.isFinite(value) && value > 0
    )
  ) {
    throw new Error("Data perhitungan harga belum lengkap atau tidak valid.")
  }
  const wordCostMinor = wordCount * Math.round(ratePerWord * 100)
  const reductionCostMinor = Math.round(reduction * 100) * ratePerPoint
  const baseMinor = wordCostMinor + reductionCostMinor
  const formulaTotal = Math.round(
    (baseMinor * Math.round(multiplier * 100)) / 10000
  )
  if (!Number.isSafeInteger(formulaTotal) || formulaTotal <= 0)
    throw new Error("Total harga tidak valid.")
  const total = Math.max(formulaTotal, MIN_PARAPHRASE_PRICE)
  return {
    wordCount,
    reduction,
    ratePerWord,
    ratePerPoint,
    multiplier,
    wordCost: wordCostMinor / 100,
    reductionCost: reductionCostMinor / 100,
    basePrice: baseMinor / 100,
    /** Added to reach the minimum price (0 when the formula is above it). */
    minimumTopUp: total - formulaTotal,
    total,
  }
}
