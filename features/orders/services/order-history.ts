// Pure helpers for the Order History page (no "@/" imports: loaded by scripts/verify-features.mjs).

export type OrderSection = "document" | "marketplace"
type Kind = "marketplace" | "turnitin" | "ai_check" | "paraphrase"
type Status =
  | "pending"
  | "processing"
  | "completed"
  | "expired"
  | "cancelled"
  | "failed"
  | "refunded"

export interface HistoryCounts {
  total: number
  completed: number
  unpaid: number
}

export const sections: { id: OrderSection; label: string }[] = [
  { id: "document", label: "Plagiarism Checker" },
  { id: "marketplace", label: "Marketplace Account" },
]

export const serviceLabels: Record<Kind, string> = {
  marketplace: "Marketplace Account",
  turnitin: "Cek Turnitin",
  ai_check: "Cek AI",
  paraphrase: "Parafrase",
}

export type StatusTone = "success" | "progress" | "waiting" | "muted"

export const historyStatus: Record<
  Status,
  { label: string; tone: StatusTone }
> = {
  pending: { label: "Menunggu Pembayaran", tone: "waiting" },
  processing: { label: "Sedang Diproses", tone: "progress" },
  completed: { label: "Selesai", tone: "success" },
  expired: { label: "Tidak Dibayar", tone: "muted" },
  cancelled: { label: "Dibatalkan", tone: "muted" },
  failed: { label: "Gagal", tone: "muted" },
  refunded: { label: "Dikembalikan", tone: "muted" },
}

// docs/ERD.md — Turnitin filter options.
const filterLabels: Record<string, string> = {
  exclude_quotes: "Tanpa Kutipan",
  exclude_bibliography: "Tanpa Bibliografi",
  exclude_small_matches: "Tanpa Kecocokan Kecil",
}

/** Known filter codes become chip labels; anything else is shown as sent. */
export function filterLabel(filter: string) {
  return filterLabels[filter] ?? filter
}

/** `meta.counts` from `GET /orders`; zeros when the API omits it. */
export function readCounts(meta: unknown): HistoryCounts {
  const counts = (meta as { counts?: Partial<HistoryCounts> } | undefined)
    ?.counts
  return {
    total: counts?.total ?? 0,
    completed: counts?.completed ?? 0,
    unpaid: counts?.unpaid ?? 0,
  }
}

export function formatOrderDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso))
}
