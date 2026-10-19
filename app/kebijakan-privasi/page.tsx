import type { Metadata } from "next"

import { LegalPage } from "@/features/legal/components/legal-page"
import { privacyIntro, privacySections } from "@/features/legal/data/legal"

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: privacyIntro,
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Kebijakan Privasi"
      description={privacyIntro}
      sections={privacySections}
    />
  )
}
