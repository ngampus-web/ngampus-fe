import type { Metadata } from "next"

import { AuthShell } from "@/components/layout/auth-shell"
import { CreatorRegisterForm } from "@/features/creator/components/creator-auth"

export const metadata: Metadata = {
  title: "Daftar Creator",
  description: "Buat akun Ngampus Creator.",
}

export default function CreatorRegisterPage() {
  return (
    <AuthShell backHref="/creator" backLabel="Kembali ke Ngampus Creator">
      <CreatorRegisterForm />
    </AuthShell>
  )
}
