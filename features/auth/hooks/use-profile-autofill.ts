"use client"

import { useEffect, useRef } from "react"

import { useAuthStore } from "@/lib/stores/auth"
import type { User } from "@/types/api"

/** `628…` from the profile as people type it (`08…`). */
export const localPhone = (phone: string | null) =>
  phone ? phone.replace(/^62/, "0") : ""

/**
 * Fills checkout contact fields once the session is known (login is optional).
 * Setters should keep what the user already typed.
 */
export function useProfileAutofill(fill: (user: User) => void) {
  const user = useAuthStore((s) => s.user)
  const done = useRef(false)
  useEffect(() => {
    // Once per mount: later profile changes never overwrite typed values.
    if (!user || done.current) return
    done.current = true
    fill(user)
  }, [user, fill])
}
