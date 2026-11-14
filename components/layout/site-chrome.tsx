"use client"

import { usePathname } from "next/navigation"

import { Navbar } from "@/components/layout/navbar"
import { AuthProvider } from "@/components/layout/auth-provider"
import type { FeatureFlags } from "@/lib/features"

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
  features,
}: {
  children: React.ReactNode
  footer: React.ReactNode
  features: FeatureFlags
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
      <Navbar features={features} />
      <main className="flex-1">{children}</main>
      {footer}
    </AuthProvider>
  )
}
