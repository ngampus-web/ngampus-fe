import type { Metadata } from "next"

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.ngampus.co.id"
).replace(/\/+$/, "")

export const SITE_NAME = "Ngampus.co.id"
export const SITE_BRAND = "Ngampus"
export const DEFAULT_OG_IMAGE =
  "/images/plagiarism/banner-turnitin-770cddf96c.png"
export const SITE_LOGO_IMAGE = "/images/logo-brand.png"

export const CORE_SEO_KEYWORDS = [
  "turnitin murah",
  "cek turnitin murah",
  "cek plagiarisme turnitin",
  "turnitin no repository",
  "cek similarity turnitin",
  "cek ai murah",
  "deteksi ai turnitin",
  "jasa parafrase manual",
  "akun ai murah",
  "akun chatgpt murah",
  "akun claude murah",
  "akun gemini murah",
  "akun perplexity murah",
  "akun canva pro murah",
  "akun premium mahasiswa",
  "tools pdf gratis mahasiswa",
  "tools kuliah",
  "ngampus",
]

export const PLAGIARISM_SEO_KEYWORDS = [
  "turnitin murah",
  "cek turnitin murah",
  "cek plagiasi turnitin",
  "turnitin no repository",
  "cek similarity skripsi",
  "cek ai murah",
  "deteksi ai turnitin",
  "cek tulisan ai",
  "jasa parafrase manual",
  "turunin turnitin murah",
]

export const MARKETPLACE_SEO_KEYWORDS = [
  "akun ai murah",
  "beli akun ai murah",
  "akun chatgpt plus murah",
  "akun claude ai murah",
  "akun gemini ai murah",
  "akun perplexity pro murah",
  "akun canva pro murah",
  "akun capcut pro murah",
  "akun spotify premium murah",
  "akun premium mahasiswa bergaransi",
]

export const FILE_TOOLS_SEO_KEYWORDS = [
  "tools pdf gratis",
  "file tools mahasiswa",
  "gabung pdf online gratis",
  "kompres pdf gratis",
  "scan dokumen pdf",
  "word ke pdf gratis",
  "gambar ke pdf",
  "tanda tangan pdf online",
]

export const BLOG_SEO_KEYWORDS = [
  "tips mahasiswa",
  "cara cek turnitin",
  "cara menurunkan plagiarisme",
  "tips skripsi",
  "ai untuk tugas kuliah",
  "blog ngampus",
]

export const NOINDEX_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
}

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

export function buildOpenGraph(params: {
  title: string
  description: string
  path?: string
  image?: string | null
  type?: "website" | "article"
  publishedTime?: string
}): NonNullable<Metadata["openGraph"]> {
  const imageUrl = absoluteUrl(params.image || DEFAULT_OG_IMAGE)
  const base: NonNullable<Metadata["openGraph"]> = {
    type: params.type ?? "website",
    locale: "id_ID",
    siteName: SITE_NAME,
    url: absoluteUrl(params.path ?? "/"),
    title: params.title,
    description: params.description,
    images: [{ url: imageUrl, alt: params.title }],
  }
  if (params.type === "article" && params.publishedTime) {
    return { ...base, type: "article", publishedTime: params.publishedTime }
  }
  return base
}

export function buildTwitterCard(params: {
  title: string
  description: string
  image?: string | null
}): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    title: params.title,
    description: params.description,
    images: [absoluteUrl(params.image || DEFAULT_OG_IMAGE)],
  }
}

export function organizationJsonLd(contact?: {
  email?: string | null
  whatsapp?: string | null
  instagram?: string | null
  tiktok?: string | null
}) {
  const sameAs = [contact?.instagram, contact?.tiktok].filter(
    (url): url is string => Boolean(url && /^https?:\/\//i.test(url))
  )
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: SITE_BRAND,
    url: SITE_URL,
    logo: absoluteUrl(SITE_LOGO_IMAGE),
    email: contact?.email || "support@ngampus.co.id",
    ...(sameAs.length > 0 ? { sameAs } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: contact?.email || "support@ngampus.co.id",
      ...(contact?.whatsapp ? { telephone: contact.whatsapp } : {}),
      availableLanguage: ["Indonesian"],
      areaServed: "ID",
    },
  }
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: SITE_BRAND,
    url: SITE_URL,
    inLanguage: "id-ID",
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

export function serviceJsonLd(params: {
  name: string
  description: string
  path: string
  price: number
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: params.name,
    description: params.description,
    url: absoluteUrl(params.path),
    ...(params.image ? { image: absoluteUrl(params.image) } : {}),
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "Indonesia",
    },
    offers: {
      "@type": "Offer",
      price: params.price,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(params.path),
    },
  }
}

export function productJsonLd(params: {
  name: string
  description: string
  path: string
  image?: string | null
  lowPrice: number
  highPrice: number
  offerCount: number
  inStock: boolean
  rating?: number
  soldCount?: number
  category?: string
}) {
  const highPrice = Math.max(params.lowPrice, params.highPrice)
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Akun ${params.name} Murah`,
    description: params.description,
    url: absoluteUrl(params.path),
    ...(params.image ? { image: absoluteUrl(params.image) } : {}),
    ...(params.category ? { category: params.category } : {}),
    brand: {
      "@type": "Brand",
      name: params.name,
    },
    offers:
      params.offerCount > 1
        ? {
            "@type": "AggregateOffer",
            lowPrice: params.lowPrice,
            highPrice,
            offerCount: params.offerCount,
            priceCurrency: "IDR",
            availability: params.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: absoluteUrl(params.path),
          }
        : {
            "@type": "Offer",
            price: params.lowPrice,
            priceCurrency: "IDR",
            availability: params.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: absoluteUrl(params.path),
          },
    ...(params.rating &&
    params.rating > 0 &&
    params.soldCount &&
    params.soldCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(params.rating.toFixed(1)),
            reviewCount: params.soldCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  }
}

export function articleJsonLd(params: {
  title: string
  description: string
  path: string
  image?: string | null
  publishedAt: string
  categoryName?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: params.title,
    description: params.description,
    url: absoluteUrl(params.path),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(params.path),
    },
    image: [absoluteUrl(params.image || DEFAULT_OG_IMAGE)],
    datePublished: params.publishedAt,
    dateModified: params.publishedAt,
    inLanguage: "id-ID",
    ...(params.categoryName ? { articleSection: params.categoryName } : {}),
    author: {
      "@type": "Organization",
      name: "Tim Ngampus",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(SITE_LOGO_IMAGE),
      },
    },
  }
}
