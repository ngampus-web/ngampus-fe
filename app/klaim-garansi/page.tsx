import type { Metadata } from "next"
import { Suspense } from "react"

import { WarrantyClaims } from "@/features/warranty/components/warranty-claims"
import { RequireAuth } from "@/features/auth/components/require-auth"

export const metadata: Metadata = {
  title: "Pusat Klaim Garansi",
  description:
    "Ajukan klaim garansi marketplace dan lihat status klaim yang sedang diproses.",
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
