"use client"

import type {
  OrderDraft,
  PaymentGateway,
  PaymentOrder,
  PaymentStatus,
} from "../types"
import {
  canTransition,
  effectiveStatus,
  normalizePhone,
  parseOrder,
  PAYMENT_WINDOW_MS,
  validateDraft,
} from "./order-rules"

const EVENT = "ngampus-payment-preview"
const key = (id: string) => `${EVENT}:${id}`

export function readOrderSnapshot(id: string) {
  try {
    return sessionStorage.getItem(key(id))
  } catch {
    return null
  }
}
/** Only orders created in this browser tab; replace with an authorized API later. */
export function listPreviewOrders(): PaymentOrder[] {
  try {
    const orders: PaymentOrder[] = []
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const storageKey = sessionStorage.key(i)
      if (!storageKey?.startsWith(`${EVENT}:`)) continue
      const order = parseOrder(sessionStorage.getItem(storageKey))
      if (order && storageKey === key(order.id)) orders.push(order)
    }
    return orders
  } catch {
    return []
  }
}
export function subscribeOrders(listener: () => void) {
  window.addEventListener(EVENT, listener)
  window.addEventListener("storage", listener)
  return () => {
    window.removeEventListener(EVENT, listener)
    window.removeEventListener("storage", listener)
  }
}
function save(order: PaymentOrder) {
  try {
    sessionStorage.setItem(key(order.id), JSON.stringify(order))
  } catch {
    throw new Error(
      "Pratinjau membutuhkan penyimpanan sesi browser. Aktifkan penyimpanan lalu coba lagi."
    )
  }
  window.dispatchEvent(new Event(EVENT))
  return order
}
function read(id: string) {
  const order = parseOrder(readOrderSnapshot(id))
  return order?.id === id ? order : null
}

export const previewGateway: PaymentGateway = {
  async createOrder(draft: OrderDraft) {
    validateDraft(draft)
    const now = Date.now()
    return save({
      ...draft,
      phone: normalizePhone(draft.phone),
      id: `NGP-${crypto.randomUUID()}`,
      mode: "preview",
      status: "pending",
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + PAYMENT_WINDOW_MS).toISOString(),
      updatedAt: new Date(now).toISOString(),
    })
  },
  async getOrder(id) {
    return read(id)
  },
  async startPayment(id) {
    const order = read(id)
    if (!order || effectiveStatus(order) !== "pending")
      throw new Error(
        "Pesanan ini sudah tidak dapat dibayar. Buat pesanan baru."
      )
    return { checkoutUrl: `/pembayaran/${encodeURIComponent(id)}/qris` }
  },
}

/** Preview-only controls. Never use client-side transitions to confirm real payments. */
export function simulateStatus(id: string, status: PaymentStatus) {
  const order = read(id)
  if (!order) throw new Error("Pesanan tidak ditemukan di sesi ini.")
  if (!canTransition(effectiveStatus(order), status))
    throw new Error(
      "Status pesanan telah berubah. Muat ulang halaman untuk melanjutkan."
    )
  return save({ ...order, status, updatedAt: new Date().toISOString() })
}
