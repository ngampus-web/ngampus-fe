"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { creatorEntryHref } from "@/features/creator/services/creator-rules"
import { useAuthStore } from "@/lib/stores/auth"

export function CreatorBannerSubmit({
  label = "Submit Konten",
}: {
  label?: string
}) {
  const user = useAuthStore((s) => s.user)

  return (
    <Button asChild size="pill" variant="white">
      <Link href={creatorEntryHref(user)}>{label}</Link>
    </Button>
  )
}
