import { ApiNotFoundError, serverGet } from "@/lib/api/server"
import type { PaginationMeta } from "@/types/api"

import { blogCategories } from "./data/blog"

// docs/API-CONTRACT.md §4
export interface BlogCategoryItem {
  slug: string
  name: string
  postCount: number
}

export interface BlogPostSummary {
  slug: string
  title: string
  excerpt: string
  category: { slug: string; name: string }
  coverUrl: string | null
  publishedAt: string
  readingMinutes: number
}

export interface BlogPostDetail extends BlogPostSummary {
  contentHtml: string
  seoTitle: string | null
  seoDescription: string | null
}

export const POSTS_PER_PAGE = 3

/** Falls back to the static chip list when the API is unreachable. */
export async function getBlogCategories(): Promise<BlogCategoryItem[]> {
  try {
    return (await serverGet<BlogCategoryItem[]>("/blog/categories")).data
  } catch {
    return blogCategories
      .filter((c) => c.id !== "semua")
      .map((c) => ({ slug: c.id, name: c.label, postCount: 0 }))
  }
}

export async function getBlogPosts(params: {
  category?: string
  page: number
}) {
  const res = await serverGet<BlogPostSummary[]>("/blog/posts", {
    query: {
      category: params.category,
      page: params.page,
      perPage: POSTS_PER_PAGE,
    },
  })
  return {
    posts: res.data,
    meta: res.meta as PaginationMeta,
  }
}

export async function getBlogPost(
  slug: string
): Promise<BlogPostDetail | null> {
  try {
    return (
      await serverGet<BlogPostDetail>(`/blog/posts/${encodeURIComponent(slug)}`)
    ).data
  } catch (err) {
    if (err instanceof ApiNotFoundError) return null
    throw err
  }
}

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
]

/** `18 OCT 2026 · TIM NGAMPUS` in WIB (same look as before). */
export function formatPostMeta(iso: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso))
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ""
  return `${Number(get("day"))} ${MONTHS[Number(get("month")) - 1]} ${get("year")} · TIM NGAMPUS`
}
