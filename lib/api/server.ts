/**
 * Server-side fetch for public API data (server components).
 * Uses Next's data cache with time-based revalidation.
 */

import { config } from "@/lib/config"
import type { PaginationMeta } from "@/types/api"

type Query = Record<string, string | number | undefined>

export class ApiNotFoundError extends Error {}

export async function serverGet<T>(
  path: string,
  { query, revalidate = 60 }: { query?: Query; revalidate?: number } = {}
): Promise<{ data: T; meta?: PaginationMeta }> {
  const url = new URL(`${config.apiUrl}${path}`)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "")
      url.searchParams.set(key, String(value))
  }
  const res = await fetch(url, { next: { revalidate } })
  if (res.status === 404) throw new ApiNotFoundError(path)
  if (!res.ok) throw new Error(`API ${res.status} for ${path}`)
  return res.json()
}
