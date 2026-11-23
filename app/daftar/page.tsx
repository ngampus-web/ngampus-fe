import type { Metadata } from "next"
import { Suspense } from "react"

import { RegisterForm } from "@/features/auth/components/auth-forms"
import { AuthShell } from "@/components/layout/auth-shell"
import { NOINDEX_ROBOTS } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun Ngampus.co.id.",
  robots: NOINDEX_ROBOTS,
}

export default function RegisterPage() {
  return (
    <AuthShell>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  )
}
