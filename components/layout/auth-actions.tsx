"use client"

import { History, LogOut, ShieldCheck, UserRound } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
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
    await logout()
    router.replace("/")
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
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-[42px] rounded-3xl border border-line bg-transparent px-4 text-base font-medium">
            <UserRound className="mr-2 size-4" aria-hidden />
            {firstName(user.name)}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="right-0 left-auto">
            <ul className="flex w-[220px] flex-col gap-1 p-2">
              {accountLinks.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={href}
                      className="flex-row items-center gap-2 rounded-xl p-3 text-sm"
                    >
                      <Icon className="size-4" aria-hidden />
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 rounded-xl p-3 text-left text-sm text-destructive hover:bg-muted"
                >
                  <LogOut className="size-4" aria-hidden />
                  Keluar
                </button>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
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
