import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Checkout } from "./checkout"
import { getMarketplaceProduct, toCheckout } from "@/features/marketplace/api"

type MarketplaceProductProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: MarketplaceProductProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getMarketplaceProduct(slug)
  if (!product) return { title: "Produk tidak ditemukan" }
  return {
    title: product.name,
    description: product.shortDescription,
  }
}

export default async function MarketplaceProductPage({
  params,
}: MarketplaceProductProps) {
  const { slug } = await params
  const product = await getMarketplaceProduct(slug)
  if (!product) notFound()

  return <Checkout product={toCheckout(product)} />
}
