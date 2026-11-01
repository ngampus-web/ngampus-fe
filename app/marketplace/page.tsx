import {
  getMarketplaceCategories,
  getMarketplaceProducts,
} from "@/features/marketplace/api"
import { bannersToSlides } from "@/components/shared/promo-slides"
import { MarketplaceCatalog } from "@/features/marketplace/components/marketplace-catalog"
import { fallbackMarketplaceSlides } from "@/features/marketplace/data/marketplace"
import { contentApi } from "@/lib/api/endpoints/content"
import { getPageContent, pageMetadata } from "@/features/content/api"

export const generateMetadata = () => pageMetadata("marketplace")

export default async function MarketplacePage() {
  const [categories, products, banners, content] = await Promise.all([
    getMarketplaceCategories(),
    getMarketplaceProducts(),
    contentApi.banners("marketplace", null),
    getPageContent("marketplace"),
  ])
  const slides =
    banners === null ? fallbackMarketplaceSlides : bannersToSlides(banners)
  return (
    <MarketplaceCatalog
      initialProducts={products}
      categories={categories}
      promoSlides={slides}
      content={content}
    />
  )
}
