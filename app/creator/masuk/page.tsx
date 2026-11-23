import type { Metadata } from "next"
import { Suspense } from "react"

import { AuthShell } from "@/components/layout/auth-shell"
import { CreatorLoginForm } from "@/features/creator/components/creator-auth"
import { NOINDEX_ROBOTS } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Masuk Creator",
  description: "Masuk ke dashboard Ngampus Creator.",
  robots: NOINDEX_ROBOTS,
}

export default function CreatorLoginPage() {
  return (
    <AuthShell backHref="/creator" backLabel="Kembali ke Ngampus Creator">
      <Suspense>
        <CreatorLoginForm />
      </Suspense>
    </AuthShell>
  )
}
