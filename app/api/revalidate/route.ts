import { timingSafeEqual } from "node:crypto"

import { revalidateTag } from "next/cache"
import type { NextRequest } from "next/server"

import { SITE_TAGS } from "@/lib/api/server"

/** Same value as ngampus-be `REVALIDATE_SECRET`. */
const SECRET = process.env.REVALIDATE_SECRET ?? ""

function authorized(header: string | null) {
  if (SECRET.length < 16 || !header) return false
  const a = Buffer.from(header)
  const b = Buffer.from(SECRET)
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Called by the backend after an admin change; drops the cached data at once. */
export async function POST(request: NextRequest) {
  if (!authorized(request.headers.get("x-revalidate-secret")))
    return Response.json({ revalidated: false }, { status: 401 })
  const body = (await request.json().catch(() => null)) as {
    tags?: unknown
  } | null
  const tags = Array.isArray(body?.tags)
    ? body.tags.filter(
        (t): t is string => typeof t === "string" && SITE_TAGS.includes(t)
      )
    : []
  // expire: 0 → the next visitor gets fresh data, not one more stale render.
  for (const tag of tags) revalidateTag(tag, { expire: 0 })
  return Response.json({ revalidated: tags })
}
