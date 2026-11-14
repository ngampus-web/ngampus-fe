/** Mirrors ngampus-be `modules/catalog/stock.ts`: 0 sold out, 1–5 limited, 6+ available. */
export type StockLevel = "sold_out" | "limited" | "available"

type StockInfo = {
  isInStock: boolean
  stock?: number
  stockLevel?: StockLevel
}

/** The level from the API; derived from `isInStock` when an older API omits it. */
export function stockLevelOf(p: StockInfo): StockLevel {
  return p.stockLevel ?? (p.isInStock ? "available" : "sold_out")
}

export const STOCK_BADGE: Record<
  StockLevel,
  { label: string; className: string }
> = {
  sold_out: {
    label: "Habis",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  limited: {
    label: "Terbatas",
    className: "border-amber-300 bg-amber-50 text-amber-800",
  },
  available: {
    label: "Tersedia",
    className: "border-green-200 bg-green-50 text-green-700",
  },
}

/**
 * What the customer reads: "Habis", "Tersisa 2" (1–5 left) or "Tersedia 10"
 * (more than 5). Without a count (older API) it falls back to the level name.
 */
export function stockText(p: StockInfo): string {
  const level = stockLevelOf(p)
  if (level === "sold_out") return "Habis"
  if (p.stock === undefined) return STOCK_BADGE[level].label
  return level === "limited" ? `Tersisa ${p.stock}` : `Tersedia ${p.stock}`
}
