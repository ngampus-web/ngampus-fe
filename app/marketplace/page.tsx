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
import { breadcrumbJsonLd, howToJsonLd, itemListJsonLd } from "@/lib/seo"

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
      {products.length > 0 && (
        <JsonLd
          data={itemListJsonLd({
            name: "Katalog Akun AI & Aplikasi Premium Murah Mahasiswa",
            items: products.map((product) => ({
              name: `Akun ${product.name} Murah`,
              path: `/marketplace/${product.slug}`,
              description: product.shortDescription,
            })),
          })}
        />
      )}
      {content.steps.length > 0 && (
        <JsonLd
          data={howToJsonLd({
            name: content.stepsTitle,
            description:
              "Cara beli akun AI dan aplikasi premium murah bergaransi di Ngampus.co.id.",
            path: "/marketplace",
            steps: content.steps,
          })}
        />
      )}
      <MarketplaceCatalog
        initialProducts={products}
        categories={categories}
        promoSlides={slides}
        content={content}
      />
    </>
  )
}
