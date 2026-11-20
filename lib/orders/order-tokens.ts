/**
 * Access tokens of orders opened in this browser (guest checkout): saved after
 * checkout or from a `?t=` link, sent back as `X-Order-Token`.
 */

const KEY = "ngampus.orderTokens"
const MAX = 50

type Entry = { code: string; token: string; at: number }

// Fallback when storage is blocked (private mode, disabled site data).
let memory: Entry[] = []

function read(): Entry[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as Entry[]) : []
  } catch {
    return memory
  }
}

function write(entries: Entry[]) {
  memory = entries
  try {
    localStorage.setItem(KEY, JSON.stringify(entries))
  } catch {
    // memory only
  }
}

/**
 * Tokens are base64url. Links opened from WhatsApp can carry invisible or
 * formatting characters (zero-width spaces, line breaks); one of those in the
 * `X-Order-Token` header makes the browser reject the request before it is
 * sent, so the order never loads. Keep only the token alphabet.
 */
export function cleanToken(raw: string | null | undefined): string | undefined {
  const token = raw?.replace(/[^A-Za-z0-9_-]/g, "")
  return token || undefined
}

export const orderTokens = {
  get(code: string): string | undefined {
    // Also repairs tokens saved before cleaning existed.
    return cleanToken(read().find((e) => e.code === code.toUpperCase())?.token)
  },

  save(code: string, raw: string) {
    const token = cleanToken(raw)
    if (!token) return
    const upper = code.toUpperCase()
    const rest = read().filter((e) => e.code !== upper)
    write([{ code: upper, token, at: Date.now() }, ...rest].slice(0, MAX))
  },
}

/** Header for order endpoints; empty when this browser has no token. */
export function orderTokenHeaders(code: string): HeadersInit | undefined {
  const token = orderTokens.get(code)
  return token ? { "X-Order-Token": token } : undefined
}
