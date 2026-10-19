"use client"

import { useCreatorSession } from "../hooks/use-creator-session"

import { creatorDemoName } from "../data/demo-dashboard"

import { UserRound } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Logo } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import { clearCreatorSession } from "@/features/creator/services/demo-session"

export function CreatorHeader() {
  const router = useRouter()
  const session = useCreatorSession()

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex h-17 w-full max-w-[1120px] items-center justify-between gap-4 px-5 md:px-10">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-sm font-medium tracking-[-0.02em] text-subtle">
            Creator
          </span>
        </div>
        {session === undefined ? (
          <div className="h-10 w-[169px]" />
        ) : session ? (
          <div className="flex items-center gap-3">
            <Link
              href="/creator/dashboard"
              className="flex items-center gap-2 text-sm font-medium tracking-[-0.02em]"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound className="size-4" aria-hidden />
              </span>
              {creatorDemoName(session.name)}
            </Link>
            <Button
              type="button"
              variant="outline"
              size="pill"
              onClick={() => {
                clearCreatorSession()
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
