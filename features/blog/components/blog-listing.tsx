import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import { SectionHeading } from "@/components/shared/section-heading"
import {
  formatPostMeta,
  getBlogCategories,
  getBlogPosts,
} from "@/features/blog/api"
import { BlogCover } from "@/features/blog/components/blog-cover"
import { blogHref } from "@/features/blog/services/posts"
import { cn } from "@/lib/utils"

type BlogPageProps = {
  searchParams: Promise<{
    kategori?: string | string[]
    halaman?: string | string[]
  }>
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export async function BlogListing({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const categories = await getBlogCategories()
  const categoryParam = firstParam(params.kategori)
  const category =
    categoryParam && categories.some((c) => c.slug === categoryParam)
      ? categoryParam
      : "semua"
  const requestedPage = Number(firstParam(params.halaman))
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.floor(requestedPage)
      : 1
  const { posts: visible, meta } = await getBlogPosts({
    category: category === "semua" ? undefined : category,
    page,
  }).catch(() => ({
    posts: [],
    meta: { page, perPage: 3, total: 0, totalPages: 0 },
  }))
  const pageCount = Math.max(1, meta.totalPages)
  const chips = [
    { slug: "semua", name: "Semua", postCount: null as number | null },
    ...categories,
  ]

  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "Blog & Berita" }]}
      />
      <section className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 px-5 py-16 md:px-10 lg:gap-16 lg:py-20">
        <SectionHeading
          title="Blog & Berita Terbaru"
          description="Jawaban singkat soal Ngampus. Masih bingung? Chat admin kami."
          align="center"
          className="max-w-[720px]"
        />
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-2">
            {chips.map((item) => {
              const selected = item.slug === category
              return (
                <Link
                  key={item.slug}
                  href={blogHref(item.slug)}
                  aria-current={selected ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 items-center rounded-full px-4 text-sm font-medium tracking-[-0.02em]",
                    selected
                      ? "bg-primary text-white"
                      : "border border-line bg-white text-black"
                  )}
                >
                  {item.postCount === null
                    ? item.name
                    : `${item.name} (${item.postCount})`}
                </Link>
              )
            })}
          </div>
          <p className="text-sm tracking-[-0.02em] text-subtle">
            Halaman {page} · {meta.total} artikel
          </p>
        </div>
        {visible.length === 0 ? (
          <p className="py-8 text-center text-sm tracking-[-0.02em] text-subtle">
            Belum ada artikel di kategori ini.
          </p>
        ) : (
          <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex flex-col gap-4"
              >
                <BlogCover
                  src={post.coverUrl}
                  alt=""
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 400px"
                />
                <div className="flex flex-col gap-1 px-1">
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-black">
                    {post.title}
                  </h3>
                  <p className="text-sm font-normal tracking-[-0.02em] text-black/50">
                    {formatPostMeta(post.publishedAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
        <nav
          aria-label="Halaman blog"
          className="flex flex-col items-center gap-4"
        >
          <p className="text-sm tracking-[-0.02em] text-subtle">
            Halaman {page} dari {pageCount}
          </p>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={blogHref(category, page - 1)}
                aria-label="Halaman sebelumnya"
                className="inline-flex size-11 items-center justify-center rounded-[12px] border border-line bg-white text-black"
              >
                <ArrowLeft className="size-4" />
              </Link>
            ) : null}
            {Array.from({ length: pageCount }, (_, index) => {
              const number = index + 1
              const current = number === page
              return (
                <Link
                  key={number}
                  href={blogHref(category, number)}
                  aria-label={`Halaman ${number}`}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "inline-flex size-11 items-center justify-center rounded-[12px] text-sm font-medium",
                    current
                      ? "bg-primary text-white"
                      : "border border-line bg-white text-black"
                  )}
                >
                  {number}
                </Link>
              )
            })}
            {page < pageCount ? (
              <Link
                href={blogHref(category, page + 1)}
                aria-label="Halaman berikutnya"
                className="inline-flex size-11 items-center justify-center rounded-[12px] border border-line bg-white text-black"
              >
                <ArrowRight className="size-4" />
              </Link>
            ) : null}
          </div>
        </nav>
      </section>
    </>
  )
}
