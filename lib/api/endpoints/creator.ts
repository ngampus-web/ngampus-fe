/**
 * Ngampus Creator API — docs/API-CONTRACT.md §10. Login uses /auth/login.
 */

import { apiClient } from "../client"
import type {
  AuthResponse,
  CreateSubmissionRequest,
  CreateWithdrawalRequest,
  CreatorMe,
  CreatorProfile,
  CreatorRegisterRequest,
  CreatorSubmission,
  CreatorWithdrawal,
} from "@/types/api"

function page(query: { page?: number; perPage?: number }) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value))
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

export const creatorApi = {
  register(body: CreatorRegisterRequest) {
    return apiClient.post<AuthResponse>("/creator/register", body, {
      skipRefresh: true,
    })
  },

  join(whatsapp: string) {
    return apiClient.post<CreatorProfile>("/creator/join", { whatsapp })
  },

  me() {
    return apiClient.get<CreatorMe>("/creator/me")
  },

  submissions(query: { page?: number; perPage?: number } = {}) {
    return apiClient.get<CreatorSubmission[]>(
      `/creator/submissions${page(query)}`
    )
  },

  submit(body: CreateSubmissionRequest) {
    return apiClient.post<CreatorSubmission>("/creator/submissions", body)
  },

  withdrawals(query: { page?: number; perPage?: number } = {}) {
    return apiClient.get<CreatorWithdrawal[]>(
      `/creator/withdrawals${page(query)}`
    )
  },

  withdraw(body: CreateWithdrawalRequest) {
    return apiClient.post<CreatorWithdrawal>("/creator/withdrawals", body)
  },
}
