import { draftMode } from "next/headers"
import { NextResponse } from "next/server"
import { serverGet } from "@/lib/api/server"
import { popupPosters } from "@/features/promo-popup/rules"

export async function GET() {
  let posters: ReturnType<typeof popupPosters> = []
  if (!(await draftMode()).isEnabled) {
    try {
      posters = popupPosters(
        (
          await serverGet<unknown>("/content/banners", {
            query: { placement: "popup" },
          })
        ).data
      )
    } catch {}
  }
  return NextResponse.json(
    { data: posters },
    {
      headers: { "Cache-Control": "private, no-store" },
    }
  )
}
