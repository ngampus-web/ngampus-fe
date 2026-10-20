/**
 * API client for ngampus-be.
 * - Unwraps the `{ data, meta }` envelope and `{ error }` bodies.
 * - Sends cookies (refresh token) and the in-memory access token.
 * - On 401, refreshes the session once and retries the request.
 */

import { config } from "@/lib/config"
import type { ApiError, ApiResponse, PaginationMeta } from "@/types/api"

type TokenProvider = {
  getToken: () => string | null
  /** Returns a new access token, or null when the session is gone. */
  refresh: () => Promise<string | null>
}

type RequestOptions = RequestInit & {
  /** Skip the 401 → refresh → retry cycle (auth endpoints). */
  skipRefresh?: boolean
}

export class ApiClient {
  private baseUrl: string
  private tokens: TokenProvider | null = null

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || config.apiUrl
  }

  setTokenProvider(provider: TokenProvider | null) {
    this.tokens = provider
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
    retried = false
  ): Promise<ApiResponse<T>> {
    const { skipRefresh, ...init } = options
    const headers = new Headers(init.headers)
    if (init.body && !(init.body instanceof FormData)) {
      headers.set("Content-Type", "application/json")
    }
    const token = this.tokens?.getToken()
    if (token) headers.set("Authorization", `Bearer ${token}`)

    let response: Response
    try {
      response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...init,
        headers,
        credentials: "include",
      })
    } catch (error) {
      return {
        success: false,
        error: {
          message:
            error instanceof Error && error.message !== "Failed to fetch"
              ? error.message
              : "Tidak dapat terhubung ke server. Periksa koneksi kamu.",
          code: "NETWORK_ERROR",
          status: 0,
        },
      }
    }

    if (
      response.status === 401 &&
      !skipRefresh &&
      !retried &&
      this.tokens &&
      (await this.tokens.refresh())
    ) {
      return this.request<T>(endpoint, options, true)
    }

    const body = await response.json().catch(() => null)

    if (!response.ok) {
      const error: ApiError = {
        message: body?.error?.message || "Terjadi kesalahan, coba lagi.",
        code: body?.error?.code || "UNKNOWN_ERROR",
        status: response.status,
        details: body?.error?.details,
      }
      return { success: false, error }
    }

    return {
      success: true,
      data: body?.data as T,
      meta: body?.meta as PaginationMeta | undefined,
    }
  }

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  }

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  }

  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }

  /** multipart/form-data upload */
  upload<T>(endpoint: string, formData: FormData, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: formData,
    })
  }
}

export const apiClient = new ApiClient()
