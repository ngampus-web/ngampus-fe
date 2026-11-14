import type { ReactNode } from "react"

import { FeatureGate } from "@/features/content/feature-gate"
import { PLAGIARISM_FEATURES } from "@/lib/features"

// Whole area is down only when all three services are off; a single service
// page is gated on its own in [slug]/page.tsx.
export default function PlagiarismLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <FeatureGate feature={PLAGIARISM_FEATURES} name="Cek Plagiarisme">
      {children}
    </FeatureGate>
  )
}
