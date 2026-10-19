import { blogPosts, blogCategories, type BlogCategory } from "../data/blog"

export function getPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}

export function isBlogCategory(value: string): value is BlogCategory {
  return blogCategories.some((item) => item.id === value)
}

export function postsInCategory(category: BlogCategory) {
  if (category === "semua") return blogPosts
  return blogPosts.filter((post) => post.category === category)
}

export function blogHref(category: BlogCategory, page = 1) {
  const params = new URLSearchParams()
  if (category !== "semua") params.set("kategori", category)
  if (page > 1) params.set("halaman", String(page))
  const query = params.toString()
  return query ? `/blog?${query}` : "/blog"
}
