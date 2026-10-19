import type { Metadata } from "next"
import { BlogListing } from "@/features/blog/components/blog-listing"

export const metadata: Metadata = {
  title: "Blog & Berita",
  description: "Jawaban singkat soal Ngampus. Masih bingung? Chat admin kami.",
}

export default function BlogPage(props: {
  searchParams: Promise<{
    kategori?: string | string[]
    halaman?: string | string[]
  }>
}) {
  return <BlogListing {...props} />
}
