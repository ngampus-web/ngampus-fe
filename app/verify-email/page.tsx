import type { Metadata } from "next"
import { Suspense } from "react"

import { VerifyEmail } from "@/features/auth/components/verify-email"
import { AuthShell } from "@/components/layout/auth-shell"
import { NOINDEX_ROBOTS } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Verifikasi Email",
  description: "Verifikasi email akun Ngampus.co.id.",
  robots: NOINDEX_ROBOTS,
}

export default function VerifyEmailPage() {
  return (
    <AuthShell>
      <Suspense>
        <VerifyEmail />
      </Suspense>
    </AuthShell>
  )
}
