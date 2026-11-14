import type { ReactNode } from "react"

import { FeatureGate } from "@/features/content/feature-gate"

export default function FileToolsLayout({ children }: { children: ReactNode }) {
  return (
    <FeatureGate feature="file_tools" name="File Tools">
      {children}
    </FeatureGate>
  )
}
