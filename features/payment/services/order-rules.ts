import { calculateParaphrasePrice } from "../../paraphrase/services/pricing"
import { validateParaphrase } from "../../paraphrase/services/validation"
import type { OrderDraft, PaymentOrder, PaymentStatus } from "../types"

export const PAYMENT_WINDOW_MS = 30 * 60 * 1000
export const statusLabels: Record<PaymentStatus, string> = {
  pending: "Menunggu Pembayaran",
  processing: "Sedang Diproses",
  completed: "Selesai",
  expired: "Pembayaran Kedaluwarsa",
  cancelled: "Pesanan Dibatalkan",
  failed: "Pembayaran Gagal",
}

export function normalizePhone(input: string) {
  const compact = input.trim().replace(/[\s()-]/g, "")
  const phone = compact.replace(/^\+62/, "62").replace(/^0/, "62")
  if (!/^628\d{7,11}$/.test(phone))
    throw new Error(
      "Masukkan nomor WhatsApp Indonesia yang valid, misalnya 081234567890."
    )
  return phone
}

export function validateMarketplaceEmail(value: string | undefined) {
  const email = value?.trim() ?? ""
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Masukkan alamat email yang valid.")
  return email
}

export function validateDraft(draft: OrderDraft) {
  normalizePhone(draft.phone)
  if (!Number.isSafeInteger(draft.amount) || draft.amount <= 0)
    throw new Error("Total pembayaran tidak valid.")
  const d = draft.details
  if (!d || !d.title?.trim() || !d.slug?.trim())
    throw new Error("Detail pesanan tidak lengkap.")
  if (d.kind === "marketplace") {
    if (d.customerEmail !== undefined) validateMarketplaceEmail(d.customerEmail)
    if (
      !(d.customerEmail || d.customerName?.trim()) ||
      !d.plan?.trim() ||
      !d.duration?.trim()
    )
      throw new Error("Lengkapi data pembeli, paket, dan durasi produk.")
  } else if (d.kind === "document") {
    if (!["turnitin", "cek-ai", "parafrase-manual"].includes(d.slug))
      throw new Error("Layanan dokumen tidak valid.")
    if (
      !d.fileName?.toLowerCase().endsWith(".pdf") ||
      !Number.isSafeInteger(d.fileSize) ||
      d.fileSize <= 0
    )
      throw new Error("Pilih dokumen PDF yang valid.")
    if (d.fileSize > 10 * 1024 * 1024)
      throw new Error("Ukuran dokumen maksimal 10 MB.")
    if (
      !Array.isArray(d.filters) ||
      !d.filters.every((f) => typeof f === "string")
    )
      throw new Error("Filter dokumen tidak valid.")
  } else if (d.kind === "paraphrase") {
    validateParaphrase(d)
    if (draft.amount !== calculateParaphrasePrice(d).total)
      throw new Error(
        "Harga parafrase tidak sesuai rincian pesanan. Buat ulang pesanan."
      )
  } else throw new Error("Jenis pesanan tidak valid.")
}

export function effectiveStatus(
  order: PaymentOrder,
  now = Date.now()
): PaymentStatus {
  return order.status === "pending" && now >= Date.parse(order.expiresAt)
    ? "expired"
    : order.status
}

export function canTransition(from: PaymentStatus, to: PaymentStatus) {
  return (
    (from === "pending" &&
      ["processing", "cancelled", "failed", "expired"].includes(to)) ||
    (from === "processing" && to === "completed")
  )
}

export function parseOrder(
  raw: string | null | undefined
): PaymentOrder | null {
  if (!raw) return null
  try {
    const o = JSON.parse(raw) as PaymentOrder
    if (
      o.mode !== "preview" ||
      typeof o.id !== "string" ||
      !/^NGP-[a-f0-9-]{36}$/.test(o.id) ||
      !Object.hasOwn(statusLabels, o.status)
    )
      return null
    if (
      ![o.createdAt, o.expiresAt, o.updatedAt].every(
        (d) => typeof d === "string" && Number.isFinite(Date.parse(d))
      )
    )
      return null
    validateDraft(o)
    return o
  } catch {
    return null
  }
}

export function rupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`
}
export function formatFileSize(value: number) {
  return value >= 1024 * 1024
    ? `${(value / 1024 / 1024).toFixed(2)} MB`
    : `${Math.max(value / 1024, 0.1).toFixed(1)} KB`
}
export function orderBackHref(order: PaymentOrder) {
  return order.details.kind === "marketplace"
    ? `/marketplace/${encodeURIComponent(order.details.slug)}`
    : `/cek-plagiarisme/${order.details.slug}`
}
