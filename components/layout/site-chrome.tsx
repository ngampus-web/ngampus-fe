"use client"

import { usePathname } from "next/navigation"

import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"

const bareRoutes = new Set(["/daftar", "/masuk", "/lupa-password"])

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (bareRoutes.has(pathname) || pathname.startsWith("/creator")) {
    return <main className="flex-1">{children}</main>
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
