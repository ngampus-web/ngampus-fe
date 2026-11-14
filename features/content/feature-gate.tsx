import Link from "next/link"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import type { FeatureKey } from "@/lib/features"
import { getFeatures } from "./global"

function ServiceUnavailable({ name }: { name: string }) {
  return (
    <section className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-4 px-5 py-24 text-center md:px-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        {name} belum tersedia
      </h1>
      <p className="text-subtle">
        Layanan ini sedang kami nonaktifkan sementara. Silakan kembali lagi
        nanti, atau hubungi kami lewat WhatsApp jika butuh bantuan.
      </p>
      <Button asChild size="pill">
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </section>
  )
}

/**
 * Shows `children` while any of the given services is on, and a notice page
 * once an admin has switched them all off. The API refuses orders on its own,
 * so this only keeps people from reaching a service that cannot be used.
 */
export async function FeatureGate({
  feature,
  name,
  children,
}: {
  feature: FeatureKey | FeatureKey[]
  /** Service name shown in the notice. */
  name: string
  children: ReactNode
}) {
  const flags = await getFeatures()
  const keys = Array.isArray(feature) ? feature : [feature]
  return keys.some((key) => flags[key]) ? (
    children
  ) : (
    <ServiceUnavailable name={name} />
  )
}
