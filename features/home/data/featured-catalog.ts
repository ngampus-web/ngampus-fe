import type { ProductSummary } from "@/features/marketplace/api"

// Catalog seed prices for offline display; live stock and metrics are not shown.
export const featuredCatalogProducts: ProductSummary[] = [
  {
    slug: "chatgpt",
    name: "ChatGPT",
    shortDescription: "Asisten nulis, riset, dan brainstorm.",
    logoUrl: "/images/app-chatgpt.png",
    category: {
      slug: "ai-productivity",
      name: "AI & Productivity",
    },
    badge: null,
    rating: 0,
    soldCount: 0,
    startingPrice: 20000,
    startingOfficialPrice: 75000,
    isInStock: false,
    hasPreorder: false,
  },
  {
    slug: "canva",
    name: "Canva",
    shortDescription: "Desain presentasi, poster, dan feed.",
    logoUrl: "/images/app-canva.png",
    category: {
      slug: "design-creative",
      name: "Design & Creative",
    },
    badge: null,
    rating: 0,
    soldCount: 0,
    startingPrice: 7000,
    startingOfficialPrice: 39000,
    isInStock: false,
    hasPreorder: false,
  },
  {
    slug: "claude",
    name: "Claude AI",
    shortDescription: "Asisten menulis, analisis dokumen, dan coding.",
    logoUrl: "/images/app-claude.png",
    category: {
      slug: "ai-productivity",
      name: "AI & Productivity",
    },
    badge: null,
    rating: 0,
    soldCount: 0,
    startingPrice: 150000,
    startingOfficialPrice: 299000,
    isInStock: false,
    hasPreorder: false,
  },
]
