import type { Metadata } from "next"

import { AuthShell } from "@/components/layout/auth-shell"
import { WithdrawForm } from "@/features/creator/components/withdraw-form"
import { NOINDEX_ROBOTS } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Penarikan Saldo",
  description: "Tarik saldo reward Ngampus Creator.",
  robots: NOINDEX_ROBOTS,
}

export default function CreatorWithdrawPage() {
  return (
    <AuthShell backHref="/creator/dashboard" backLabel="Kembali ke Dashboard">
      <WithdrawForm />
    </AuthShell>
  )
}
