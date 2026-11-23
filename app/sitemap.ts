import type { MetadataRoute } from "next"
import { getBlogPosts } from "@/features/blog/api"
import { getMarketplaceProducts } from "@/features/marketplace/api"
import { plagiarismServices } from "@/features/plagiarism/data/plagiarism"
import { absoluteUrl } from "@/lib/seo"

export const revalidate = 3600

const STATIC_ROUTES: {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  priority: number
}[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/cek-plagiarisme", changeFrequency: "weekly", priority: 0.95 },
  ...plagiarismServices.map((service) => ({
    path: `/cek-plagiarisme/${service.slug}`,
    changeFrequency: "weekly" as const,
    priority: service.slug === "parafrase-manual" ? 0.9 : 0.95,
  })),
  { path: "/marketplace", changeFrequency: "daily", priority: 0.95 },
  { path: "/file-tools", changeFrequency: "weekly", priority: 0.85 },
  { path: "/blog", changeFrequency: "daily", priority: 0.85 },
  { path: "/creator", changeFrequency: "weekly", priority: 0.7 },
  { path: "/syarat-ketentuan", changeFrequency: "monthly", priority: 0.3 },
  { path: "/kebijakan-privasi", changeFrequency: "monthly", priority: 0.3 },
]

async function fetchAllBlogPosts() {
  const posts: { slug: string; publishedAt: string }[] = []
  try {
    const first = await getBlogPosts({ page: 1, perPage: 50 })
    posts.push(...first.posts)
    const totalPages = Math.min(first.meta.totalPages, 20)
    for (let page = 2; page <= totalPages; page += 1) {
      const next = await getBlogPosts({ page, perPage: 50 })
      posts.push(...next.posts)
    }
  } catch {
    // Keep static and product URLs valid even if the blog API is unavailable.
  }
  return posts
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, blogPosts] = await Promise.all([
    getMarketplaceProducts(),
    fetchAllBlogPosts(),
  ])
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteUrl(`/marketplace/${product.slug}`),
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }))

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency: "weekly",
    priority: 0.75,
  }))

  return [...staticEntries, ...productEntries, ...blogEntries]
}
