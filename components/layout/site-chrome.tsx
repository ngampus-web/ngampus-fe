"use client"

import { usePathname } from "next/navigation"

import { Navbar } from "@/components/layout/navbar"
import { AuthProvider } from "@/components/layout/auth-provider"

const bareRoutes = new Set([
  "/daftar",
  "/masuk",
  "/lupa-password",
  "/reset-password",
  "/verify-email",
])

export function SiteChrome({
  children,
  footer,
}: {
  children: React.ReactNode
  footer: React.ReactNode
}) {
  const pathname = usePathname()

  if (bareRoutes.has(pathname) || pathname.startsWith("/creator")) {
    return (
      <AuthProvider>
        <main className="flex-1">{children}</main>
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      {footer}
    </AuthProvider>
  )
}
