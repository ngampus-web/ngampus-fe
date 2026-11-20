"use client"
import { notify } from "@/lib/toast"

import {
  ChevronDown,
  History,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SheetClose } from "@/components/ui/sheet"
import { useAuthStore } from "@/lib/stores/auth"

const accountLinks = [
  { href: "/riwayat-pesanan", label: "Riwayat Pesanan", icon: History },
  { href: "/klaim-garansi", label: "Klaim Garansi", icon: ShieldCheck },
]

function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()
  return async () => {
    try {
      await logout()
      notify.success("Kamu sudah keluar.")
      router.replace("/")
    } catch (error) {
      notify.error(error)
    }
  }
}

function firstName(name: string) {
  return name.split(" ")[0]
}

/** Desktop: Daftar/Masuk buttons for guests, account menu for users. */
export function AuthActions() {
  const user = useAuthStore((s) => s.user)
  const status = useAuthStore((s) => s.status)
  const onLogout = useLogout()
  const [open, setOpen] = useState(false)

  if (status === "idle" || status === "loading") {
    return <div className="h-[42px] w-[180px]" aria-hidden />
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Button
          asChild
          variant="outline"
          className="h-[42px] rounded-3xl px-5 text-lg font-medium tracking-[-0.02em]"
        >
          <Link href="/daftar">Daftar</Link>
        </Button>
        <Button
          asChild
          className="h-[42px] rounded-3xl px-5 text-lg font-medium tracking-[-0.02em]"
        >
          <Link href="/masuk">Masuk</Link>
        </Button>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="group h-[42px] gap-2 rounded-3xl border-line bg-transparent px-4 text-base font-medium data-open:bg-muted/50"
        >
          <UserRound className="size-4" aria-hidden />
          {firstName(user.name)}
          <ChevronDown
            className="size-3 transition-transform group-data-open:rotate-180"
            aria-hidden
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-[228px] p-2"
        aria-label="Menu akun"
      >
        <ul className="flex flex-col gap-1">
          {accountLinks.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                onNavigate={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl p-3 text-sm hover:bg-muted focus-visible:bg-muted"
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                void onLogout()
              }}
              className="flex w-full items-center gap-2 rounded-xl p-3 text-left text-sm text-destructive hover:bg-muted focus-visible:bg-muted"
            >
              <LogOut className="size-4" aria-hidden />
              Keluar
            </button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}

/** Mobile sheet footer. */
export function MobileAuthActions() {
  const user = useAuthStore((s) => s.user)
  const onLogout = useLogout()

  if (!user) {
    return (
      <>
        <SheetClose asChild>
          <Button
            asChild
            variant="outline"
            className="h-12 w-full rounded-3xl text-lg font-medium"
          >
            <Link href="/daftar">Daftar</Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button
            asChild
            className="h-12 w-full rounded-3xl text-lg font-medium"
          >
            <Link href="/masuk">Masuk</Link>
          </Button>
        </SheetClose>
      </>
    )
  }

  return (
    <>
      <p className="text-sm text-subtle">
        Masuk sebagai{" "}
        <span className="font-medium text-black">{user.name}</span>
      </p>
      {accountLinks.map(({ href, label }) => (
        <SheetClose asChild key={href}>
          <Button
            asChild
            variant="outline"
            className="h-12 w-full rounded-3xl text-base font-medium"
          >
            <Link href={href}>{label}</Link>
          </Button>
        </SheetClose>
      ))}
      <SheetClose asChild>
        <Button
          variant="ghost"
          className="h-12 w-full rounded-3xl text-base text-destructive"
          onClick={onLogout}
        >
          Keluar
        </Button>
      </SheetClose>
    </>
  )
}
