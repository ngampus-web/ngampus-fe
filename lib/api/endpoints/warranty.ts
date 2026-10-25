/**
 * Warranty claims API — docs/API-CONTRACT.md §9. All endpoints require login.
 */

import { apiClient } from "../client"
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

  get(code: string) {
    return apiClient.get<ClaimDetail>(
      `/warranty/claims/${encodeURIComponent(code)}`
    )
  },

  create(body: CreateClaimRequest) {
    return apiClient.post<ClaimDetail>("/warranty/claims", body)
  },
}
