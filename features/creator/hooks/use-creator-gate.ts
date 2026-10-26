"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

import { useAuthStore } from "@/lib/stores/auth"

/**
 * Creator-only pages: guests go to the creator login, signed-in users without
 * a creator profile go to the join form. Returns true once access is allowed.
 */
export function useCreatorGate() {
  const status = useAuthStore((s) => s.status)
  const isCreator = useAuthStore((s) => s.user?.isCreator ?? false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === "guest")
      router.replace(`/creator/masuk?next=${encodeURIComponent(pathname)}`)
    else if (status === "authenticated" && !isCreator)
      router.replace("/creator/daftar")
  }, [status, isCreator, router, pathname])

  return status === "authenticated" && isCreator
}
