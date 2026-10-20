/**
 * Auth state. The access token lives in memory only; the session survives
 * reloads through the httpOnly refresh cookie (`initAuth`).
 */

"use client"

import { create } from "zustand"
import { apiClient, authApi } from "@/lib/api"
import type { RegisterRequest, User } from "@/types/api"

type Status = "idle" | "loading" | "authenticated" | "guest"
type Result =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

interface AuthState {
  user: User | null
  token: string | null
  status: Status
  login: (email: string, password: string, remember: boolean) => Promise<Result>
  register: (body: RegisterRequest) => Promise<Result>
  logout: () => Promise<void>
  setUser: (user: User) => void
  initAuth: () => Promise<void>
}

let refreshing: Promise<string | null> | null = null

export const useAuthStore = create<AuthState>()((set, get) => {
  /** Single-flight refresh shared by initAuth and the API client. */
  const refresh = () => {
    refreshing ??= authApi
      .refresh()
      .then((res) => {
        if (res.success) {
          set({
            user: res.data.user,
            token: res.data.accessToken,
            status: "authenticated",
          })
          return res.data.accessToken
        }
        set({ user: null, token: null, status: "guest" })
        return null
      })
      .finally(() => {
        refreshing = null
      })
    return refreshing
  }

  apiClient.setTokenProvider({ getToken: () => get().token, refresh })

  const fail = (error: {
    message: string
    details?: Record<string, unknown>
  }): Result => ({
    success: false,
    error: error.message,
    fieldErrors: error.details?.fieldErrors as
      Record<string, string[]> | undefined,
  })

  return {
    user: null,
    token: null,
    status: "idle",

    login: async (email, password, remember) => {
      const res = await authApi.login({ email, password, remember })
      if (!res.success) return fail(res.error)
      set({
        user: res.data.user,
        token: res.data.accessToken,
        status: "authenticated",
      })
      return { success: true }
    },

    register: async (body) => {
      const res = await authApi.register(body)
      if (!res.success) return fail(res.error)
      set({
        user: res.data.user,
        token: res.data.accessToken,
        status: "authenticated",
      })
      return { success: true }
    },

    logout: async () => {
      await authApi.logout()
      set({ user: null, token: null, status: "guest" })
    },

    setUser: (user) => set({ user }),

    initAuth: async () => {
      if (get().status !== "idle") return
      set({ status: "loading" })
      await refresh()
    },
  }
})
