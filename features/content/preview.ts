import { cache } from "react"
import { cookies, draftMode } from "next/headers"
import { config } from "@/lib/config"

export const PREVIEW_COOKIE = "ngampus-content-preview"
export interface ContentDraft {
  page: string
  value: unknown
  expiresAt: string
}

export async function fetchContentDraft(
  token: string
): Promise<ContentDraft | null> {
  if (!/^[a-f0-9]{64}$/.test(token)) return null
  try {
    const response = await fetch(`${config.apiUrl}/content/preview/${token}`, {
      cache: "no-store",
    })
    if (!response.ok) return null
    return (await response.json()).data
  } catch {
    return null
  }
}

export const readContentDraft = cache(async () => {
  if (!(await draftMode()).isEnabled) return null
  const token = (await cookies()).get(PREVIEW_COOKIE)?.value
  return token ? fetchContentDraft(token) : null
})
