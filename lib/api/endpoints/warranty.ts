/**
 * Warranty claims API — docs/API-CONTRACT.md §9. List and eligible orders need
 * login; guests create and open claims with their order's access token.
 */

import { apiClient } from "../client"
import { orderTokens } from "@/lib/orders/order-tokens"
import type {
  ClaimDetail,
  ClaimSummary,
  ClaimTab,
  CreateClaimRequest,
  EligibleOrder,
} from "@/types/api"

export const warrantyApi = {
  eligibleOrders() {
    return apiClient.get<EligibleOrder[]>("/warranty/eligible-orders")
  },

  list(query: { status?: ClaimTab; page?: number; perPage?: number } = {}) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) params.set(key, String(value))
    }
    const qs = params.toString()
    return apiClient.get<ClaimSummary[]>(
      `/warranty/claims${qs ? `?${qs}` : ""}`
    )
  },

  /** Guests: the claim's order token is stored under the claim code. */
  get(code: string) {
    const token = orderTokens.get(code)
    return apiClient.get<ClaimDetail>(
      `/warranty/claims/${encodeURIComponent(code)}`,
      token ? { headers: { "X-Order-Token": token } } : undefined
    )
  },

  async create(body: CreateClaimRequest, uploadToken?: string) {
    const headers = new Headers()
    const token = orderTokens.get(body.orderCode)
    if (token) headers.set("X-Order-Token", token)
    if (uploadToken) headers.set("X-Upload-Token", uploadToken)
    const res = await apiClient.post<ClaimDetail>("/warranty/claims", body, {
      headers,
    })
    // The claim opens with the same token as its order.
    if (res.success && token) orderTokens.save(res.data.code, token)
    return res
  },
}
