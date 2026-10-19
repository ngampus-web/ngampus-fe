import type { Metadata } from "next"

import { LegalPage } from "@/features/legal/components/legal-page"
import { termsIntro, termsSections } from "@/features/legal/data/legal"

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: termsIntro,
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Syarat & Ketentuan"
      description={termsIntro}
      sections={termsSections}
    />
  )
}
