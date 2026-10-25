/**
 * Orders API — docs/API-CONTRACT.md §6–§7. All endpoints require login.
 */

import { apiClient } from "../client"
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
    return apiClient.get<OrderDetail>(`/orders/${encodeURIComponent(code)}`)
  },

  createMarketplace(body: {
    offerId: string
    customerName: string
    customerEmail: string
    whatsapp: string
    promoCode?: string
  }) {
    return apiClient.post<OrderDetail>("/orders/marketplace", body)
  },

  cancel(code: string) {
    return apiClient.post<OrderDetail>(
      `/orders/${encodeURIComponent(code)}/cancel`
    )
  },

  /** Creates (once) or returns the QRIS session. */
  pay(code: string) {
    return apiClient.post<PaymentSession>(
      `/orders/${encodeURIComponent(code)}/pay`
    )
  },

  /** Development only (local payment provider). */
  simulatePayment(code: string, result: "paid" | "failed") {
    return apiClient.post<{ result: string }>("/payments/local/simulate", {
      code,
      result,
    })
  },

  quote(body: { kind: "marketplace"; offerId: string; promoCode?: string }) {
    return apiClient.post<PriceBreakdown>("/pricing/quote", body)
  },
}
