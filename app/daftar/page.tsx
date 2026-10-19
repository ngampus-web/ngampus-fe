import type { Metadata } from "next"

import { RegisterForm } from "@/features/auth/components/auth-forms"
import { AuthShell } from "@/components/layout/auth-shell"

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun Ngampus.id.",
}

export default function RegisterPage() {
  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  )
}
