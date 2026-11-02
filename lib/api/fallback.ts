// Pure helper (no "@/" imports): loaded by scripts/verify-features.mjs.

/**
 * Use bundled content only on failure; successful empty responses are authoritative.
 */
export async function withFallback<T>(
  fetcher: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    const data = await fetcher()
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
