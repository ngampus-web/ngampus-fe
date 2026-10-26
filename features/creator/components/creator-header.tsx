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
      <div className="mx-auto flex h-17 w-full max-w-[1120px] items-center justify-between gap-4 px-5 md:px-10">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-sm font-medium tracking-[-0.02em] text-subtle">
            Creator
          </span>
        </div>
        {status === "idle" || status === "loading" ? (
          <div className="h-10 w-[169px]" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <Link
              href={user.isCreator ? "/creator/dashboard" : "/creator/daftar"}
              className="flex items-center gap-2 text-sm font-medium tracking-[-0.02em]"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound className="size-4" aria-hidden />
              </span>
              {user.name}
            </Link>
            <Button
              type="button"
              variant="outline"
              size="pill"
              onClick={async () => {
                await logout()
                router.replace("/creator")
              }}
            >
              Keluar
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="pill">
              <Link href="/creator/masuk">Masuk</Link>
            </Button>
            <Button asChild size="pill">
              <Link href="/creator/daftar">Daftar</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
