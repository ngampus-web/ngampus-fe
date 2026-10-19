"use client"

import { useMemo, useSyncExternalStore } from "react"
import {
  creatorSessionSnapshot,
  subscribeCreatorSession,
} from "../services/demo-session"
import type { CreatorSession } from "../types"

const serverSnapshot = () => undefined

/** undefined while hydrating; null when signed out. Demo UI state only. */
export function useCreatorSession(): CreatorSession | null | undefined {
  const raw = useSyncExternalStore(
    subscribeCreatorSession,
    creatorSessionSnapshot,
    serverSnapshot
  )
  return useMemo(() => {
    if (raw === undefined) return undefined
    if (!raw) return null
    try {
      const value = JSON.parse(raw)
      return typeof value?.name === "string" &&
        typeof value?.email === "string" &&
        value.name &&
        value.email
        ? { name: value.name, email: value.email }
        : null
    } catch {
      return null
    }
  }, [raw])
}
