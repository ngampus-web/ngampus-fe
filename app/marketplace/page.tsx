import {
  getMarketplaceCategories,
  getMarketplaceProducts,
} from "@/features/marketplace/api"
import { JsonLd } from "@/components/shared/json-ld"
import { bannersToSlides } from "@/components/shared/promo-slides"
import { MarketplaceCatalog } from "@/features/marketplace/components/marketplace-catalog"
import { fallbackMarketplaceSlides } from "@/features/marketplace/data/marketplace"
import { contentApi } from "@/lib/api/endpoints/content"
import { getPageContent, pageMetadata } from "@/features/content/api"
import { breadcrumbJsonLd } from "@/lib/seo"

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
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", path: "/" },
          { name: "Marketplace Akun AI & Premium", path: "/marketplace" },
        ])}
      />
      <MarketplaceCatalog
        initialProducts={products}
        categories={categories}
        promoSlides={slides}
        content={content}
      />
    </>
  )
}
