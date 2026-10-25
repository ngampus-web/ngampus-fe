// Pure helper (no "@/" imports): loaded by scripts/verify-features.mjs.

/**
 * Landing sections must never render empty: use the bundled static content
 * when the API fails, or when it answers with an empty list.
 */
export async function withFallback<T>(
  fetcher: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    const data = await fetcher()
    if (Array.isArray(data) && data.length === 0) return fallback
    return data
  } catch {
    return fallback
  }
}

/** "Nadia P." → "NP" for avatar circles. */
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("")
}
