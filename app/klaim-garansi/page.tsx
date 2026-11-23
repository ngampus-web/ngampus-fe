import type { Metadata } from "next"
import { Suspense } from "react"

import { WarrantyClaims } from "@/features/warranty/components/warranty-claims"
import { RequireAuth } from "@/features/auth/components/require-auth"
import { NOINDEX_ROBOTS } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Pusat Klaim Garansi",
  description:
    "Ajukan klaim garansi marketplace dan lihat status klaim yang sedang diproses.",
  robots: NOINDEX_ROBOTS,
}

export default function WarrantyClaimsPage() {
  return (
    <Suspense>
      <RequireAuth>
        <WarrantyClaims />
      </RequireAuth>
    </Suspense>
  )
}
