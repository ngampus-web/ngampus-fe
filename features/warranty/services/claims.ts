// Pure helpers for the claim center (no "@/" imports: loaded by scripts/verify-features.mjs).

type Status = "submitted" | "reviewing" | "accepted" | "rejected" | "resolved"
type Event = { status: Status; at: string; note: string | null }

export type ClaimFilter = "semua" | "in_progress" | "resolved" | "rejected"

export const claimFilters: { id: ClaimFilter; label: string }[] = [
  { id: "semua", label: "Semua Klaim" },
  { id: "in_progress", label: "Dalam Proses" },
  { id: "resolved", label: "Selesai" },
  { id: "rejected", label: "Ditolak" },
]

// docs/ERD.md claim_category — the six categories from the brief.
export const claimCategories = [
  { value: "logged_out", label: "Akun Ter-logout Otomatis" },
  { value: "password_changed", label: "Password Salah/Diubah" },
  { value: "quota_limit", label: "Limit Pemakaian/Kuota Tercapai" },
  { value: "suspended", label: "Akun Disuspend/Terblokir Platform" },
  { value: "invalid_license", label: "Lisensi/Tautan Invite Tidak Valid" },
  { value: "other", label: "Masalah Teknis Lainnya" },
] as const

export function categoryLabel(value: string) {
  return claimCategories.find((c) => c.value === value)?.label ?? value
}

export type ClaimTone = "progress" | "success" | "danger"

export const toneClass: Record<ClaimTone, string> = {
  progress: "text-amber-700",
  success: "text-emerald-700",
  danger: "text-red-600",
}

/** Table status column: Dalam Proses / Selesai / Ditolak. */
export function claimStatus(status: Status): {
  label: string
  tone: ClaimTone
} {
  if (status === "resolved") return { label: "Selesai", tone: "success" }
  if (status === "rejected") return { label: "Ditolak", tone: "danger" }
  return { label: "Dalam Proses", tone: "progress" }
}

/** Sub-status at the top right of the detail modal. */
export function cornerStatus(status: Status) {
  if (status === "resolved") return "Proses Selesai"
  if (status === "rejected") return "Klaim Ditolak"
  if (status === "accepted") return "Sedang Ditangani"
  return "Menunggu Review"
}

export type StepState = "done" | "failed" | "pending"
export interface ClaimStep {
  title: string
  at: string | null
  note: string | null
  state: StepState
}

/** Brief timeline: diajukan → dicek sistem → diterima/ditolak (→ selesai). */
export function claimSteps(status: Status, timeline: Event[]): ClaimStep[] {
  const find = (s: Status) => timeline.find((e) => e.status === s) ?? null
  const step = (
    title: string,
    s: Status,
    state: StepState = find(s) ? "done" : "pending"
  ): ClaimStep => ({
    title,
    at: find(s)?.at ?? null,
    note: find(s)?.note ?? null,
    state,
  })
  const steps = [
    step("Klaim Berhasil Diajukan", "submitted"),
    step("Klaim Dicek Sistem", "reviewing"),
  ]
  if (status === "rejected") {
    steps.push(step("Klaim Ditolak", "rejected", "failed"))
    return steps
  }
  steps.push(step("Klaim Diterima (Admin akan segera menghubungi)", "accepted"))
  if (status === "accepted" || status === "resolved")
    steps.push(step("Proses Selesai", "resolved"))
  return steps
}

/** Screenshot rules (docs/API-CONTRACT.md §3 claim_evidence). */
export const EVIDENCE_TYPES = ["image/jpeg", "image/png", "image/webp"]
export const EVIDENCE_MAX_BYTES = 5 * 1024 * 1024
export const EVIDENCE_MAX_FILES = 3

/** Indonesian error for a picked screenshot, or null when it is fine. */
export function evidenceError(file: { type: string; size: number }) {
  if (!EVIDENCE_TYPES.includes(file.type))
    return "Screenshot harus berupa JPG, PNG, atau WEBP."
  if (file.size > EVIDENCE_MAX_BYTES) return "Ukuran screenshot maksimal 5 MB."
  return null
}

export function formatClaimTime(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  })
    .format(new Date(iso))
    .replace(", ", " · ")
}
