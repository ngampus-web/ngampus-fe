import type { ParaphrasePrice } from "../services/pricing"
const number = (value: number) =>
  value.toLocaleString("id-ID", { maximumFractionDigits: 2 })
export function PriceBreakdown({ price }: { price: ParaphrasePrice }) {
  return (
    <div
      className="space-y-3 text-xs leading-5"
      aria-label="Rincian harga parafrase"
    >
      <div className="flex justify-between gap-3">
        <span className="text-subtle">
          {number(price.wordCount)} kata × Rp{number(price.ratePerWord)}
        </span>
        <span className="shrink-0">Rp {number(price.wordCost)}</span>
      </div>
      <div className="flex justify-between gap-3">
        <span className="text-subtle">
          Penurunan {number(price.reduction)} poin × Rp
          {number(price.ratePerPoint)}
        </span>
        <span className="shrink-0">Rp {number(price.reductionCost)}</span>
      </div>
      <div className="flex justify-between gap-3">
        <span>Harga dasar</span>
        <span>Rp {number(price.basePrice)}</span>
      </div>
      <div className="flex justify-between gap-3">
        <span>Multiplier pengerjaan</span>
        <span>×{number(price.multiplier)}</span>
      </div>
    </div>
  )
}
