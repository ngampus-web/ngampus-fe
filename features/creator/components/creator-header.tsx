"use client"

import { UserRound } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Logo } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/stores/auth"

export function CreatorHeader() {
  const router = useRouter()
  const status = useAuthStore((s) => s.status)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex h-17 w-full max-w-[1120px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-5 md:px-10">
        <div className="flex shrink-0 items-center gap-3">
          <Logo className="h-auto w-36 sm:h-10 sm:w-auto" />
          <span className="hidden text-sm font-medium tracking-[-0.02em] text-subtle sm:inline">
            Creator
          </span>
        </div>
        {status === "idle" || status === "loading" ? (
          <div className="h-9 w-32 shrink sm:h-10 sm:w-[169px]" />
        ) : user ? (
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link
              href={user.isCreator ? "/creator/dashboard" : "/creator/daftar"}
              className="flex min-w-0 items-center gap-2 text-sm font-medium tracking-[-0.02em]"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:size-9">
                <UserRound className="size-4" aria-hidden />
              </span>
              <span className="truncate">{user.name}</span>
            </Link>
            <Button
              type="button"
              variant="outline"
              size="pill"
              className="shrink-0 max-sm:h-9 max-sm:px-3 max-sm:text-sm"
              onClick={async () => {
                await logout()
                router.replace("/creator")
              }}
            >
              Keluar
            </Button>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="pill"
              className="max-sm:h-9 max-sm:px-3 max-sm:text-sm"
            >
              <Link href="/creator/masuk">Masuk</Link>
            </Button>
            <Button
              asChild
              size="pill"
              className="max-sm:h-9 max-sm:px-3 max-sm:text-sm"
            >
              <Link href="/creator/daftar">Daftar</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
