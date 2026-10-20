"use client"

import { Loader2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

import { useAuthStore } from "@/lib/stores/auth"

export function loginHref(next: string) {
  return `/masuk?next=${encodeURIComponent(next)}`
}

/** Redirects guests to /masuk?next=<current path>. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((s) => s.status)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === "guest") router.replace(loginHref(pathname))
  }, [status, router, pathname])

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-subtle">
        <Loader2 className="size-6 animate-spin" aria-label="Memuat" />
      </div>
    )
  }
  return children
}

/** Only allow internal paths as post-login destinations. */
export function safeNext(next: string | null): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/"
}
