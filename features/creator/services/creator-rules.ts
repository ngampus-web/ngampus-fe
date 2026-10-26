// Pure creator helpers (labels, money rules, routing); no React here.
import type {
  CreatorPlatformKey,
  SubmissionStatus,
  User,
  WithdrawalStatus,
} from "../../../types/api"

/** Labels the creator pages display. */
export type CreatorSubmitStatus = "Diproses" | "Ditolak" | "Diterima"
export type CreatorPlatform = "TikTok" | "Instagram" | "X / Thread"

export const PLATFORM_OPTIONS: {
  value: CreatorPlatformKey
  label: CreatorPlatform
}[] = [
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "x_threads", label: "X / Thread" },
]

export function platformLabel(platform: CreatorPlatformKey): CreatorPlatform {
  return PLATFORM_OPTIONS.find((p) => p.value === platform)!.label
}

export const SUBMISSION_STATUS: Record<
  SubmissionStatus,
  { label: CreatorSubmitStatus }
> = {
  pending: { label: "Diproses" },
  approved: { label: "Diterima" },
  rejected: { label: "Ditolak" },
}

export const WITHDRAWAL_STATUS: Record<WithdrawalStatus, { label: string }> = {
  pending: { label: "Diproses" },
  paid: { label: "Dibayar" },
  rejected: { label: "Ditolak" },
}

const wibParts = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Jakarta",
})

/** ISO → `YYYY-MM-DD HH:mm:ss` in WIB (dashboard history format). */
export function wibDateTime(iso: string) {
  const p = Object.fromEntries(
    wibParts.formatToParts(new Date(iso)).map((x) => [x.type, x.value])
  )
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`
}

export function rupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`
}

/** Client-side pre-check; the API enforces the same rules. */
export function withdrawalError(
  amount: number,
  rules: { min: number; balance: number }
) {
  if (!Number.isSafeInteger(amount) || amount < rules.min)
    return `Minimal withdraw ${rupiah(rules.min)}.`
  if (amount > rules.balance) return "Nominal melebihi saldo yang tersedia."
  return ""
}

/** Where "Submit Kontenmu!" leads for the current visitor. */
export function creatorEntryHref(user: User | null) {
  if (!user) return "/creator/daftar"
  return user.isCreator ? "/creator/submit?from=beranda" : "/creator/daftar"
}
