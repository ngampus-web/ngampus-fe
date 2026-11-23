import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import { JsonLd } from "@/components/shared/json-ld"
import { formatPostMeta, getBlogPost } from "@/features/blog/api"
import { ArticleBody } from "@/features/blog/components/article-body"
import { BlogCover } from "@/features/blog/components/blog-cover"
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildAlternates,
  buildOpenGraph,
  buildTwitterCard,
} from "@/lib/seo"

type BlogDetailProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: "Artikel tidak ditemukan" }
  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt
  const path = `/blog/${post.slug}`
  return {
    title,
    description,
    alternates: buildAlternates(path),
    openGraph: buildOpenGraph({
      type: "article",
      title,
      description,
      path,
      publishedTime: post.publishedAt,
      image: post.coverUrl,
    }),
    twitter: buildTwitterCard({
      title,
      description,
      image: post.coverUrl,
    }),
  }
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()
  const path = `/blog/${post.slug}`

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", path: "/" },
          { name: "Blog & Berita", path: "/blog" },
          { name: post.title, path },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          title: post.seoTitle || post.title,
          description: post.seoDescription || post.excerpt,
          path,
          image: post.coverUrl,
          publishedAt: post.publishedAt,
          categoryName: post.category.name,
          readingMinutes: post.readingMinutes,
        })}
      />
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Blog & Berita", href: "/blog" },
          { label: post.title },
        ]}
      />
      <article className="mx-auto flex w-full max-w-[760px] flex-col gap-8 px-5 py-16 md:px-10">
        <header className="flex flex-col gap-3">
          <p className="text-sm tracking-[-0.02em] text-subtle">
            {formatPostMeta(post.publishedAt)} · {post.readingMinutes} MENIT
            BACA
          </p>
          <h1 className="text-[32px] leading-[1.2] font-medium tracking-[-0.02em] md:text-title">
            {post.title}
          </h1>
        </header>
        <BlogCover
          src={post.coverUrl}
          alt={post.title}
          sizes="(max-width: 767px) 100vw, 680px"
          preload
        />
        <ArticleBody html={post.contentHtml} />
        <Link
          href="/blog"
          className="w-fit text-base tracking-[-0.02em] text-primary hover:underline"
        >
          Kembali ke Blog & Berita
        </Link>
      </article>
    </>
  )
}
