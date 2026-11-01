import { cookies, draftMode } from "next/headers"
import { NextResponse } from "next/server"
import { PREVIEW_COOKIE } from "@/features/content/preview"

export async function POST(request: Request) {
  ;(await draftMode()).disable()
  ;(await cookies()).delete(PREVIEW_COOKIE)
  return NextResponse.redirect(new URL("/", request.url), 303)
}
