import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import { blogPosts, formatPostMeta } from "@/features/blog/data/blog"
import { getPost } from "@/features/blog/services/posts"

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

type BlogDetailProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: "Artikel tidak ditemukan" }
  return { title: post.title, description: post.excerpt }
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <>
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
            {formatPostMeta(post.date)}
          </p>
          <h1 className="text-[32px] leading-[1.2] font-medium tracking-[-0.02em] md:text-title">
            {post.title}
          </h1>
        </header>
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            width={5760}
            height={3240}
            sizes="(max-width: 767px) 100vw, 680px"
            preload
            className="aspect-video h-auto w-full rounded-2xl"
          />
        ) : (
          <div className="h-56 rounded-2xl bg-surface" aria-hidden />
        )}
        <div className="flex flex-col gap-5 text-base leading-7 tracking-[-0.02em] text-black">
          {post.content
            ? post.content.map((block, index) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={index}
                      className="mt-5 text-2xl leading-snug font-medium"
                    >
                      {block.text}
                    </h2>
                  )
                }
                if (block.type === "paragraph") {
                  return <p key={index}>{block.text}</p>
                }
                if (
                  block.type === "ordered-list" ||
                  block.type === "unordered-list"
                ) {
                  const List = block.type === "ordered-list" ? "ol" : "ul"
                  return (
                    <List
                      key={index}
                      className={`${block.type === "ordered-list" ? "list-decimal" : "list-disc"} space-y-3 pl-6`}
                    >
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </List>
                  )
                }
              })
            : post.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
        </div>
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
