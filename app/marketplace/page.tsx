import type { Metadata } from "next"

import { MarketplaceCatalog } from "@/features/marketplace/components/marketplace-catalog"

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Beli akses ChatGPT, Claude, Gemini, Canva, CapCut, dan Spotify.",
}

export default function MarketplacePage() {
  return <MarketplaceCatalog />
}
