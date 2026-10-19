// UI demo only: sessionStorage does not authenticate or authorize a user.
// Replace this adapter with server-validated sessions when backend auth is added.
import type { CreatorSession } from "../types"
export type { CreatorSession } from "../types"

const KEY = "ngampus-creator-session"

export function readCreatorSession(): CreatorSession | null {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem(KEY)
  if (!raw) return null
  try {
    const data = JSON.parse(raw) as CreatorSession
    if (!data.email || !data.name) return null
    return data
  } catch {
    return null
  }
}

export function writeCreatorSession(session: CreatorSession) {
  sessionStorage.setItem(KEY, JSON.stringify(session))
  window.dispatchEvent(new Event(KEY))
}

export function clearCreatorSession() {
  sessionStorage.removeItem(KEY)
  window.dispatchEvent(new Event(KEY))
}

export function subscribeCreatorSession(onChange: () => void) {
  window.addEventListener(KEY, onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener(KEY, onChange)
    window.removeEventListener("storage", onChange)
  }
}

export function creatorSessionSnapshot() {
  try {
    return sessionStorage.getItem(KEY)
  } catch {
    return null
  }
}
