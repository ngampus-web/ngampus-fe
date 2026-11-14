import type { Metadata } from "next"

import { AuthShell } from "@/components/layout/auth-shell"
import { FeatureGate } from "@/features/content/feature-gate"
import { CreatorRegisterForm } from "@/features/creator/components/creator-auth"

export const metadata: Metadata = {
  title: "Daftar Creator",
  description: "Buat akun Ngampus Creator.",
}

export default async function CreatorRegisterPage() {
  return (
    <FeatureGate feature="creator" name="Pendaftaran Creator">
      <AuthShell backHref="/creator" backLabel="Kembali ke Ngampus Creator">
        <CreatorRegisterForm />
      </AuthShell>
    </FeatureGate>
  )
}
