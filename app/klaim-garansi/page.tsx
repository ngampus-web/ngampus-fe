import type { Metadata } from "next"
import { Suspense } from "react"

import { RequireAuth } from "@/features/auth/components/require-auth"
import { WarrantyClaims } from "@/features/warranty/components/warranty-claims"

export const metadata: Metadata = {
  title: "Pusat Klaim Garansi",
  description:
    "Ajukan klaim garansi marketplace dan lihat status klaim yang sedang diproses.",
}

export default function WarrantyClaimsPage() {
  return (
    <RequireAuth>
      <Suspense>
        <WarrantyClaims />
      </Suspense>
    </RequireAuth>
  )
}
