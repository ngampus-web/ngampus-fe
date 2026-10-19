import type { Metadata } from "next"

import { ForgotPasswordForm } from "@/features/auth/components/auth-forms"
import { AuthShell } from "@/components/layout/auth-shell"

export const metadata: Metadata = {
  title: "Lupa Password",
  description: "Kirim link reset password Ngampus.id.",
}

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  )
}
