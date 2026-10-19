import Image from "next/image"
import Link from "next/link"
import {
  Combine,
  FileOutput,
  MenuIcon,
  Shrink,
  type LucideIcon,
} from "lucide-react"

import { Logo } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { mainNav, type NavLink } from "@/config/navigation"

const navItemClass =
  "h-auto rounded-md bg-transparent px-0 py-1 text-base font-normal whitespace-nowrap text-black hover:bg-transparent hover:text-primary focus:bg-transparent data-open:bg-transparent data-open:hover:bg-transparent data-open:focus:bg-transparent"

const toolIcons: Record<NonNullable<NavLink["tool"]>, LucideIcon> = {
  merge: Combine,
  kompres: Shrink,
  convert: FileOutput,
}

function ToolIcon({ tool }: { tool: NonNullable<NavLink["tool"]> }) {
  const Icon = toolIcons[tool]
  return (
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white"
      aria-hidden
    >
      <Icon className="size-4" strokeWidth={1.75} />
    </span>
  )
}

function ArrowDown() {
  return (
    <Image
      src="/icons/arrow-down.svg"
      alt=""
      width={24}
      height={24}
      aria-hidden
      className="ml-2 transition-transform duration-300 group-data-open/navigation-menu-trigger:rotate-180"
    />
  )
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="mx-auto flex h-17 max-w-[1280px] items-center justify-between px-5 md:px-10">
        <Logo />

        <div className="hidden items-center gap-6 xl:flex">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-6">
              {mainNav.map((item) =>
                item.type === "link" ? (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuLink asChild className={navItemClass}>
                      <Link href={item.href}>{item.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuTrigger
                      className={navItemClass}
                      icon={<ArrowDown />}
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[420px] grid-cols-2 gap-1 p-2">
                        {item.items.map((link) => (
                          <li key={link.label}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={link.href}
                                className="items-start gap-3 rounded-xl p-3"
                              >
                                {link.tool && <ToolIcon tool={link.tool} />}
                                <span className="flex flex-col gap-1">
                                  <span className="text-sm font-medium text-black">
                                    {link.label}
                                  </span>
                                  <span className="text-xs leading-snug text-muted-foreground">
                                    {link.description}
                                  </span>
                                </span>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>

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
          <Accordion type="multiple">
            {mainNav.map((item) =>
              item.type === "link" ? (
                <SheetClose asChild key={item.label}>
                  <Link
                    href={item.href}
                    className="block border-b py-4 text-base text-black"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ) : (
                <AccordionItem
                  key={item.label}
                  value={item.label}
                  className="border-b"
                >
                  <AccordionTrigger className="py-4 text-base font-normal text-black hover:no-underline">
                    {item.label}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-1 pb-4">
                    {item.items.map((link) => (
                      <SheetClose asChild key={link.label}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-black no-underline! hover:bg-muted"
                        >
                          {link.tool && <ToolIcon tool={link.tool} />}
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              )
            )}
          </Accordion>
        </nav>
        <div className="flex flex-col gap-3 border-t p-5">
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
        </div>
      </SheetContent>
    </Sheet>
  )
}
