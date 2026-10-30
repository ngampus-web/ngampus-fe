import type { Metadata } from "next"
import { Suspense } from "react"

import { LoginForm } from "@/features/auth/components/auth-forms"
import { AuthShell } from "@/components/layout/auth-shell"

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun Ngampus.co.id.",
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
