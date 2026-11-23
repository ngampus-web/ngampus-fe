import type { Metadata } from "next"
import { JsonLd } from "@/components/shared/json-ld"
import { BlogListing } from "@/features/blog/components/blog-listing"
import {
  BLOG_SEO_KEYWORDS,
  breadcrumbJsonLd,
  buildOpenGraph,
  buildTwitterCard,
} from "@/lib/seo"

const BLOG_TITLE = "Blog & Tips Kuliah — Turnitin, AI & Skripsi"
const BLOG_DESCRIPTION =
  "Tips kuliah, panduan cek plagiarisme Turnitin, pemanfaatan AI untuk tugas, dan tutorial akademik terbaru dari Tim Ngampus.co.id."

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  keywords: BLOG_SEO_KEYWORDS,
  alternates: { canonical: "/blog" },
  openGraph: buildOpenGraph({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    path: "/blog",
  }),
  twitter: buildTwitterCard({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
  }),
}

export default function BlogPage(props: {
  searchParams: Promise<{
    kategori?: string | string[]
    halaman?: string | string[]
  }>
}) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", path: "/" },
          { name: "Blog & Berita", path: "/blog" },
        ])}
      />
      <BlogListing {...props} />
    </>
  )
}
