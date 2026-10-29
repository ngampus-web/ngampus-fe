/**
 * Orders API — docs/API-CONTRACT.md §6–§7. Login is optional except for the
 * account list; guests open an order with its access token (`X-Order-Token`).
 */

/** Created orders carry the token that opens them without login. */
export type CreatedOrder = OrderDetail & { accessToken: string }

const uploadHeaders = (uploadToken?: string) =>
  uploadToken ? { headers: { "X-Upload-Token": uploadToken } } : undefined
const tokenOf = (code: string) => ({ headers: orderTokenHeaders(code) })

import { apiClient } from "../client"
import { orderTokenHeaders } from "@/lib/orders/order-tokens"
import type {
  OrderDetail,
  OrderStatus,
  OrderSummary,
  PaymentSession,
  PriceBreakdown,
} from "@/types/api"

export interface OrdersQuery {
  kind?: "marketplace" | "document"
  status?: OrderStatus
  q?: string
  page?: number
  perPage?: number
}

export const ordersApi = {
  list(query: OrdersQuery = {}) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== "") params.set(key, String(value))
    }
    const qs = params.toString()
    return apiClient.get<OrderSummary[]>(`/orders${qs ? `?${qs}` : ""}`)
  },

  get(code: string) {
    return apiClient.get<OrderDetail>(
      `/orders/${encodeURIComponent(code)}`,
      tokenOf(code)
    )
  },

  createMarketplace(body: {
    offerId: string
    customerEmail: string
    whatsapp: string
    promoCode?: string
  }) {
    return apiClient.post<CreatedOrder>("/orders/marketplace", body)
  },

  createParaphrase(
    body: {
      service: "turnitin" | "ai" | "combined"
      sourceFileId: string
      reports: {
        type: "turnitin" | "ai"
        fileId: string
        initialScore: number
        targetScore: number
      }[]
      language: "id" | "en"
      field?: string
      notes?: string
      turnaround: "relaxed" | "regular" | "urgent"
      customerName: string
      whatsapp: string
      promoCode?: string
    },
    uploadToken?: string
  ) {
    return apiClient.post<CreatedOrder>(
      "/orders/paraphrase",
      body,
      uploadHeaders(uploadToken)
    )
  },

  createAiCheck(
    body: {
      documentTitle: string
      fileId: string
      whatsapp: string
      promoCode?: string
    },
    uploadToken?: string
  ) {
    return apiClient.post<CreatedOrder>(
      "/orders/ai-check",
      body,
      uploadHeaders(uploadToken)
    )
  },

  /** Free re-upload after a failed document check. */
  resubmit(code: string, fileId: string, uploadToken?: string) {
    const headers = new Headers(orderTokenHeaders(code))
    if (uploadToken) headers.set("X-Upload-Token", uploadToken)
    return apiClient.post<OrderDetail>(
      `/orders/${encodeURIComponent(code)}/resubmit`,
      { fileId },
      { headers }
    )
  },

  /** Guests: invoice code + WhatsApp → the order and a new access token. */
  lookup(code: string, whatsapp: string) {
    return apiClient.post<CreatedOrder>("/orders/lookup", { code, whatsapp })
  },

  /** Presigned download of a completed order's result. */
  result(code: string) {
    return apiClient.get<{ url: string; expiresAt: string }>(
      `/orders/${encodeURIComponent(code)}/result`,
      tokenOf(code)
    )
  },

  cancel(code: string) {
    return apiClient.post<OrderDetail>(
      `/orders/${encodeURIComponent(code)}/cancel`,
      undefined,
      tokenOf(code)
    )
  },

  /** Creates (once) or returns the QRIS session. */
  pay(code: string) {
    return apiClient.post<PaymentSession>(
      `/orders/${encodeURIComponent(code)}/pay`,
      undefined,
      tokenOf(code)
    )
  },

  /** Development only (local payment provider). */
  simulatePayment(code: string, result: "paid" | "failed") {
    return apiClient.post<{ result: string }>(
      "/payments/local/simulate",
      { code, result },
      tokenOf(code)
    )
  },

  quote(body: { kind: "marketplace"; offerId: string; promoCode?: string }) {
    return apiClient.post<PriceBreakdown>("/pricing/quote", body)
  },
}
