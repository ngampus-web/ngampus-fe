/**
 * Authentication API endpoints — docs/API-CONTRACT.md §2
 */

import { apiClient } from "../client"
import type {
  ApiResponse,
  AuthApp,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/api"

const noRefresh = { skipRefresh: true }

export const authApi = {
  login(body: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>(
      "/auth/login",
      { app: "web", ...body },
      noRefresh
    )
  },

  register(body: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>("/auth/register", body, noRefresh)
  },

  refresh(app: AuthApp = "web"): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>("/auth/refresh", { app }, noRefresh)
  },

  logout(app: AuthApp = "web"): Promise<ApiResponse<null>> {
    return apiClient.post<null>("/auth/logout", { app }, noRefresh)
  },

  getMe(): Promise<ApiResponse<User>> {
    return apiClient.get<User>("/auth/me")
  },

  updateMe(body: { name?: string; phone?: string | null }) {
    return apiClient.patch<User>("/auth/me", body)
  },

  changePassword(body: { currentPassword: string; newPassword: string }) {
    return apiClient.post<null>("/auth/change-password", body)
  },

  requestPasswordReset(email: string, turnstileToken?: string) {
    return apiClient.post<null>(
      "/auth/forgot-password",
      { email, turnstileToken },
      noRefresh
    )
  },

  resetPassword(token: string, newPassword: string) {
    return apiClient.post<null>(
      "/auth/reset-password",
      { token, newPassword },
      noRefresh
    )
  },

  verifyEmail(token: string) {
    return apiClient.post<null>("/auth/verify-email", { token }, noRefresh)
  },

  resendVerification() {
    return apiClient.post<null>("/auth/resend-verification")
  },
}
