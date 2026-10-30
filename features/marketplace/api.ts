import { apiClient } from "@/lib/api/client"
import { ApiNotFoundError, serverGet } from "@/lib/api/server"

import {
  marketplaceCategories,
  marketplaceLogoFallback,
} from "./data/marketplace"
import type { CheckoutSection, MarketplaceCheckout } from "./types"
import { warranty, warrantyTerms } from "./data/marketplace"

// docs/API-CONTRACT.md §5
export interface ProductSummary {
  slug: string
  name: string
  shortDescription: string
  logoUrl: string | null
  category: { slug: string; name: string }
  badge: string | null
  rating: number
  soldCount: number
  startingPrice: number
  startingOfficialPrice: number
  isInStock: boolean
  /** At least one active offer is a pre-order. */
  hasPreorder: boolean
}

export interface ProductDetail extends ProductSummary {
  previewOnly?: boolean
  descriptionParagraphs: string[]
  planDescriptions: string[]
  notes: string[]
  additionalWarranty: string[]
  offers: {
    id: string
    planName: string
    accountType: "private" | "sharing" | null
    durationLabel: string
    warrantyLabel: string
    price: number
    officialPrice: number
    isPreorder: boolean
  }[]
}

export interface CategoryItem {
  slug: string
  name: string
}

/** Logo from the CDN, or the bundled asset while logos are not in R2 yet. */
export function productLogo(p: Pick<ProductSummary, "slug" | "logoUrl">) {
  return (
    p.logoUrl ?? marketplaceLogoFallback[p.slug] ?? "/images/logo-brand.png"
  )
}

/** Server: categories with static fallback when the API is unreachable. */
export async function getMarketplaceCategories(): Promise<CategoryItem[]> {
  try {
    return (await serverGet<CategoryItem[]>("/marketplace/categories")).data
  } catch {
    return marketplaceCategories
      .filter((c) => c.id !== "semua")
      .map((c) => ({ slug: c.id, name: c.label }))
  }
}

/** Server: initial product list. */
export async function getMarketplaceProducts(): Promise<ProductSummary[]> {
  try {
    return (await serverGet<ProductSummary[]>("/marketplace/products")).data
  } catch {
    return []
  }
}

/** Browser: search and category filter run on the API. */
export async function searchMarketplaceProducts(params: {
  category?: string
  q?: string
}) {
  const query = new URLSearchParams()
  if (params.category) query.set("category", params.category)
  if (params.q) query.set("q", params.q)
  const res = await apiClient.get<ProductSummary[]>(
    `/marketplace/products${query.size ? `?${query}` : ""}`,
    { skipRefresh: true }
  )
  if (!res.success) throw new Error(res.error.message)
  return res.data
}

export async function getMarketplaceProduct(
  slug: string
): Promise<ProductDetail | null> {
  try {
    return (
      await serverGet<ProductDetail>(
        `/marketplace/products/${encodeURIComponent(slug)}`
      )
    ).data
  } catch (err) {
    if (err instanceof ApiNotFoundError) return null
    if (process.env.NODE_ENV === "development") {
      const { previewProducts } = await import("./data/preview-products")
      const preview = previewProducts.find((product) => product.slug === slug)
      if (preview) return preview
    }
    throw err
  }
}

const section = (title: string, items: string[]): CheckoutSection[] =>
  items.length ? [{ title, items: items.map((body) => ({ body })) }] : []

/** API detail → the shape the checkout UI already renders. */
export function toCheckout(p: ProductDetail): MarketplaceCheckout {
  return {
    slug: p.slug,
    previewOnly: p.previewOnly,
    name: p.name,
    logo: productLogo(p),
    rating: p.rating,
    soldCount: p.soldCount,
    isInStock: p.isInStock,
    monthly: p.startingPrice,
    compare: Math.max(p.startingOfficialPrice, p.startingPrice),
    packages: [...new Set(p.offers.map((o) => o.planName))],
    offers: p.offers.map((o) => ({
      id: o.id,
      plan: o.planName,
      duration: o.durationLabel,
      warranty: o.warrantyLabel,
      price: o.price,
      official: o.officialPrice,
      preorder: o.isPreorder,
    })),
    sections: [
      ...section("Deskripsi", p.descriptionParagraphs),
      ...section("Penjelasan Plan", p.planDescriptions).map((planSection) => ({
        ...planSection,
        items: planSection.items.map((item) => {
          if (p.slug !== "canva") return item
          const match = item.body.match(
            /^(Member|Designer|Head\s*\/\s*Owner)\b\s*/i
          )
          return match
            ? { title: match[1], body: item.body.slice(match[0].length) }
            : item
        }),
      })),
      ...section("Catatan Penting", p.notes),
      {
        ...warranty,
        items: [
          ...warranty.items,
          ...(p.hasPreorder
            ? [
                {
                  body: "Khusus paket pre-order, pesanan diproses dalam 1–3 hari. Jika pesanan belum dipenuhi setelah 3 hari, dana akan dikembalikan sepenuhnya.",
                },
              ]
            : []),
          ...p.additionalWarranty.map((body) => ({ body })),
        ],
      },
      warrantyTerms,
    ],
  }
}
