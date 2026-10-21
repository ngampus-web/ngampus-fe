import type { Metadata } from "next"

import {
  getMarketplaceCategories,
  getMarketplaceProducts,
} from "@/features/marketplace/api"
import { MarketplaceCatalog } from "@/features/marketplace/components/marketplace-catalog"

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Beli akses ChatGPT, Claude, Gemini, Canva, CapCut, dan Spotify.",
}

export default async function MarketplacePage() {
  const [categories, products] = await Promise.all([
    getMarketplaceCategories(),
    getMarketplaceProducts(),
  ])
  return (
    <MarketplaceCatalog initialProducts={products} categories={categories} />
  )
}
