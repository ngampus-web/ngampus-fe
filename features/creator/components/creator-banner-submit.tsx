"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCreatorSession } from "../hooks/use-creator-session"

import { Button } from "@/components/ui/button"
import { readCreatorSession } from "@/features/creator/services/demo-session"

function submitHref() {
  return readCreatorSession()
    ? "/creator/submit?from=beranda"
    : "/creator/daftar"
}

export function CreatorBannerSubmit() {
  const router = useRouter()
  const session = useCreatorSession()
  const href = session ? "/creator/submit?from=beranda" : "/creator/daftar"

  return (
    <Button asChild size="pill" variant="white">
      <Link
        href={href}
        onClick={(event) => {
          event.preventDefault()
          router.push(submitHref())
        }}
      >
        Submit Konten
      </Link>
    </Button>
  )
}
