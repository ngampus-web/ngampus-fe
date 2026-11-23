import type { Metadata } from "next"
import { Suspense } from "react"

import { LoginForm } from "@/features/auth/components/auth-forms"
import { AuthShell } from "@/components/layout/auth-shell"
import { NOINDEX_ROBOTS } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun Ngampus.co.id.",
  robots: NOINDEX_ROBOTS,
}

export default function LoginPage() {
  return (
    <AuthShell>
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  )
}
