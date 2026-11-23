import type { Metadata } from "next"
import { Suspense } from "react"

import { ResetPasswordForm } from "@/features/auth/components/auth-forms"
import { AuthShell } from "@/components/layout/auth-shell"
import { NOINDEX_ROBOTS } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Buat password baru untuk akun Ngampus.co.id.",
  robots: NOINDEX_ROBOTS,
}

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  )
}
