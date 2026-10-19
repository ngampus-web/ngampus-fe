import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import { SectionHeading } from "@/components/shared/section-heading"
import {
  blogCategories,
  blogPosts,
  formatPostMeta,
  postsPerPage,
  type BlogCategory,
} from "@/features/blog/data/blog"
import {
  blogHref,
  isBlogCategory,
  postsInCategory,
} from "@/features/blog/services/posts"
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
  const categoryParam = firstParam(params.kategori)
  const category: BlogCategory =
    categoryParam && isBlogCategory(categoryParam) ? categoryParam : "semua"
  const requestedPage = Number(firstParam(params.halaman))
  const posts = postsInCategory(category)
  const pageCount = Math.max(1, Math.ceil(posts.length / postsPerPage))
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.min(Math.floor(requestedPage), pageCount)
      : 1
  const visible = posts.slice((page - 1) * postsPerPage, page * postsPerPage)

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
            {blogCategories.map((item) => {
              const selected = item.id === category
              const count = blogPosts.filter(
                (post) => post.category === item.id
              ).length
              return (
                <Link
                  key={item.id}
                  href={blogHref(item.id)}
                  aria-current={selected ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 items-center rounded-full px-4 text-sm font-medium tracking-[-0.02em]",
                    selected
                      ? "bg-primary text-white"
                      : "border border-line bg-white text-black"
                  )}
                >
                  {item.id === "semua"
                    ? item.label
                    : `${item.label} (${count})`}
                </Link>
              )
            })}
          </div>
          <p className="text-sm tracking-[-0.02em] text-subtle">
            Halaman {page} · {posts.length} artikel
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
                {post.thumbnail ? (
                  <Image
                    src={post.thumbnail}
                    alt=""
                    width={5760}
                    height={3240}
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 400px"
                    className="aspect-video h-auto w-full rounded-2xl"
                  />
                ) : (
                  <div
                    className="h-48 w-full rounded-2xl bg-surface"
                    aria-hidden
                  />
                )}
                <div className="flex flex-col gap-1 px-1">
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-black">
                    {post.title}
                  </h3>
                  <p className="text-sm font-normal tracking-[-0.02em] text-black/50">
                    {formatPostMeta(post.date)}
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
