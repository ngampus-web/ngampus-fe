import type { Metadata } from "next"

import {
  getMarketplaceCategories,
  getMarketplaceProducts,
} from "@/features/marketplace/api"
import { bannersToSlides } from "@/components/shared/promo-slides"
import { MarketplaceCatalog } from "@/features/marketplace/components/marketplace-catalog"
import { fallbackMarketplaceSlides } from "@/features/marketplace/data/marketplace"
import { contentApi } from "@/lib/api/endpoints/content"

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Beli akses ChatGPT, Claude, Gemini, Canva, CapCut, dan Spotify.",
}

export default async function MarketplacePage() {
  const [categories, products, banners] = await Promise.all([
    getMarketplaceCategories(),
    getMarketplaceProducts(),
    contentApi.banners("marketplace", []),
  ])
  const slides = bannersToSlides(banners)
  return (
    <MarketplaceCatalog
      initialProducts={products}
      categories={categories}
      promoSlides={slides.length ? slides : fallbackMarketplaceSlides}
    />
  )
}
