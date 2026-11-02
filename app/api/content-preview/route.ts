import { cookies, draftMode } from "next/headers"
import { NextResponse } from "next/server"
import { fetchContentDraft, PREVIEW_COOKIE } from "@/features/content/preview"

const PATHS: Record<string, string> = {
  home: "/",
  plagiarism: "/cek-plagiarisme",
  marketplace: "/marketplace",
  creator: "/creator",
  terms: "/syarat-ketentuan",
  privacy: "/kebijakan-privasi",
  footer: "/",
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? ""
  const draft = await fetchContentDraft(token)
  if (!draft || !Object.hasOwn(PATHS, draft.page))
    return new Response("Preview kedaluwarsa. Buat preview baru dari admin.", {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    })
  ;(await draftMode()).enable()
  ;(await cookies()).set(PREVIEW_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 600,
    path: "/",
  })
  const response = NextResponse.redirect(
    new URL(PATHS[draft.page], request.url)
  )
  response.headers.set("Cache-Control", "private, no-store")
  response.headers.set("Referrer-Policy", "no-referrer")
  response.headers.set("X-Robots-Tag", "noindex, nofollow")
  return response
}
