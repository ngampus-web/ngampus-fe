import type { ReactNode } from "react"

import { FeatureGate } from "@/features/content/feature-gate"

export default function MarketplaceLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <FeatureGate feature="marketplace" name="Marketplace">
      {children}
    </FeatureGate>
  )
}
