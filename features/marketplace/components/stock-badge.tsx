import { cn } from "@/lib/utils"
import { STOCK_BADGE, stockLevelOf, stockText, type StockLevel } from "../stock"

/** Habis (red), Terbatas (yellow) or Tersedia (green). */
export function StockBadge({
  product,
  className,
}: {
  product: { isInStock: boolean; stock?: number; stockLevel?: StockLevel }
  className?: string
}) {
  const level = stockLevelOf(product)
  return (
    <span
      data-testid="stock-badge"
      data-level={level}
      className={cn(
        "rounded-full border px-3 py-2 text-sm font-medium tracking-[-0.02em]",
        STOCK_BADGE[level].className,
        className
      )}
    >
      {stockText(product)}
    </span>
  )
}
