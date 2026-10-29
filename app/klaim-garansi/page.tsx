import type { Metadata } from "next"
import { Suspense } from "react"

import { WarrantyClaims } from "@/features/warranty/components/warranty-claims"

export const metadata: Metadata = {
  title: "Pusat Klaim Garansi",
  description:
    "Ajukan klaim garansi marketplace dan lihat status klaim yang sedang diproses.",
}

export default function WarrantyClaimsPage() {
  return (
    // Login is optional: guests claim with their order's access token.
    <Suspense>
      <WarrantyClaims />
    </Suspense>
  )
}
