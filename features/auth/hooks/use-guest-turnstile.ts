"use client"

import { useState } from "react"

import { UserFacingError } from "@/lib/errors"
import { config } from "@/lib/config"
import { useAuthStore } from "@/lib/stores/auth"

export function useGuestTurnstile() {
  const user = useAuthStore((state) => state.user)
  const required = !user && !!config.turnstileSiteKey
  const [token, setToken] = useState<string>()
  const [resetKey, setResetKey] = useState(0)

  function consume() {
    if (!required) return undefined
    if (!token)
      throw new UserFacingError(
        "Selesaikan verifikasi keamanan terlebih dahulu."
      )
    setToken(undefined)
    setResetKey((value) => value + 1)
    return token
  }

  return {
    required,
    ready: !required || !!token,
    consume,
    widget: { onToken: setToken, resetKey },
  }
}
