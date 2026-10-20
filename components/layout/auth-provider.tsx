"use client"

import { useEffect } from "react"

import { useAuthStore } from "@/lib/stores/auth"

/** Restores the session from the refresh cookie once per page load. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initAuth = useAuthStore((s) => s.initAuth)
  useEffect(() => {
    void initAuth()
  }, [initAuth])
  return children
}
