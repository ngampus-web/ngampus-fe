import type { ReactNode } from "react"

import { FeatureGate } from "@/features/content/feature-gate"

export default function WarrantyLayout({ children }: { children: ReactNode }) {
  return (
    <FeatureGate feature="warranty" name="Klaim Garansi">
      {children}
    </FeatureGate>
  )
}
