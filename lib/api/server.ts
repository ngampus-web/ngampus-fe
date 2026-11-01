/**
 * Server-side fetch for public API data (server components).
 * Uses Next's data cache with time-based revalidation.
 */

import { config } from "@/lib/config"
import type { PaginationMeta } from "@/types/api"

type Query = Record<string, string | number | undefined>

export class ApiNotFoundError extends Error {}

/**
 * Cache tag per public endpoint. The backend calls `/api/revalidate` with
 * these tags after an admin change (ngampus-be `RevalidateSite`), so changes
 * show at once; the timed revalidate below is only the fallback.
 */
const TAGS: [prefix: string, tag: string, fallbackSeconds: number][] = [
  // Banners and blog posts also go live on a schedule, without an admin write.
  ["/content/banners", "banners", 60],
  ["/blog/", "blog", 60],
  ["/content/testimonials", "testimonials", 300],
  ["/content/faqs", "faqs", 300],
  ["/content/partner-logos", "partner-logos", 300],
  ["/content/creator-examples", "creator-examples", 300],
  ["/content/settings", "site-settings", 300],
  ["/marketplace/", "catalog", 300],
  ["/services/document", "document-config", 300],
]

export const SITE_TAGS = TAGS.map(([, tag]) => tag)

function cacheFor(path: string) {
  const hit = TAGS.find(([prefix]) => path.startsWith(prefix))
  return hit
    ? { tags: [hit[1]], revalidate: hit[2] }
    : { tags: [] as string[], revalidate: 60 }
}

export async function serverGet<T>(
  path: string,
  { query, revalidate }: { query?: Query; revalidate?: number } = {}
): Promise<{ data: T; meta?: PaginationMeta }> {
  const cache = cacheFor(path)
  const url = new URL(`${config.apiUrl}${path}`)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "")
      url.searchParams.set(key, String(value))
  }
  const res = await fetch(url, {
    next: { revalidate: revalidate ?? cache.revalidate, tags: cache.tags },
  })
  if (res.status === 404) throw new ApiNotFoundError(path)
  if (!res.ok) throw new Error(`API ${res.status} for ${path}`)
  return res.json()
}
