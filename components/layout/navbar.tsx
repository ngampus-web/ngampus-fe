import Link from "next/link"
import { MenuIcon } from "lucide-react"

import {
  AuthActions,
  MobileAuthActions,
} from "@/components/layout/auth-actions"
import { Logo } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { mainNav } from "@/config/navigation"

const navItemClass =
  "h-auto rounded-md bg-transparent px-0 py-1 text-base font-normal whitespace-nowrap text-black hover:bg-transparent hover:text-primary focus:bg-transparent"

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="mx-auto flex h-17 max-w-[1280px] items-center justify-between px-5 md:px-10">
        <Logo />

        <div className="hidden items-center gap-6 xl:flex">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-6">
              {mainNav.map(({ label, href }) => (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink asChild className={navItemClass}>
                    <Link href={href}>{label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <AuthActions />
        </div>

        <MobileNav />
      </div>
    </header>
  )
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          className="xl:hidden"
          aria-label="Buka menu"
        >
          <MenuIcon className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-sm">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Logo />
        </SheetHeader>
        <nav className="flex flex-1 flex-col overflow-y-auto px-5 py-2">
          {mainNav.map(({ label, href }) => (
            <SheetClose asChild key={href}>
              <Link
                href={href}
                className="block border-b py-4 text-base text-black"
              >
                {label}
              </Link>
            </SheetClose>
          ))}
        </nav>
        <div className="flex flex-col gap-3 border-t p-5">
          <MobileAuthActions />
        </div>
      </SheetContent>
    </Sheet>
  )
}
