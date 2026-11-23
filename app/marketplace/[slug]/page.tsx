import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Checkout } from "./checkout"
import { JsonLd } from "@/components/shared/json-ld"
import {
  getMarketplaceProduct,
  productLogo,
  toCheckout,
} from "@/features/marketplace/api"
import {
  breadcrumbJsonLd,
  buildAlternates,
  buildOpenGraph,
  buildTwitterCard,
  productJsonLd,
} from "@/lib/seo"

type MarketplaceProductProps = {
  params: Promise<{ slug: string }>
}

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`

export async function generateMetadata({
  params,
}: MarketplaceProductProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getMarketplaceProduct(slug)
  if (!product) return { title: "Produk tidak ditemukan" }
  const priceText = formatRupiah(product.startingPrice)
  const title = `Beli Akun ${product.name} Murah Mulai ${priceText}`
  const description = `${product.shortDescription} Harga mahasiswa mulai ${priceText}, proses cepat dan bergaransi di Ngampus.co.id.`
  const path = `/marketplace/${product.slug}`
  const image = productLogo(product) || "/images/marketplace/banner-premium.png"
  const nameLower = product.name.toLowerCase()
  return {
    title,
    description,
    keywords: [
      `akun ${nameLower} murah`,
      `beli akun ${nameLower}`,
      `${nameLower} premium murah`,
      `akun ${product.category.name.toLowerCase()} murah`,
      "akun ai murah",
      "akun premium mahasiswa",
    ],
    alternates: buildAlternates(path),
    openGraph: buildOpenGraph({
      title,
      description,
      path,
      image,
    }),
    twitter: buildTwitterCard({
      title,
      description,
      image,
    }),
  }
}

export default async function MarketplaceProductPage({
  params,
}: MarketplaceProductProps) {
  const { slug } = await params
  const product = await getMarketplaceProduct(slug)
  if (!product) notFound()
  const path = `/marketplace/${product.slug}`
  const offerPrices = product.offers.map((offer) => offer.price)
  const lowPrice = offerPrices.length
    ? Math.min(...offerPrices)
    : product.startingPrice
  const highPrice = offerPrices.length
    ? Math.max(...offerPrices)
    : product.startingPrice

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", path: "/" },
          { name: "Marketplace", path: "/marketplace" },
          { name: product.name, path },
        ])}
      />
      <JsonLd
        data={productJsonLd({
          name: product.name,
          description: product.shortDescription,
          path,
          image: productLogo(product),
          lowPrice,
          highPrice,
          offerCount: Math.max(1, product.offers.length),
          inStock: product.isInStock,
          rating: product.rating,
          soldCount: product.soldCount,
          category: product.category.name,
        })}
      />
      <Checkout product={toCheckout(product)} />
    </>
  )
}
