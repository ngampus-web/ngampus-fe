import Link from "next/link"

import { SectionHeading } from "@/components/shared/section-heading"

import { ProductCard } from "@/features/marketplace/components/product-card"
import { featuredCatalogProducts } from "@/features/home/data/featured-catalog"

export function FeaturedProducts() {
  return (
    <section
      aria-label="Produk marketplace"
      className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-5 py-16 md:px-10 lg:p-20"
    >
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          title="Pilihan Akun untuk Kuliahmu"
          description="Temukan akun digital untuk belajar, berkarya, dan lebih produktif."
        />
        <Link
          href="/marketplace"
          className="shrink-0 font-medium text-primary underline-offset-4 hover:underline"
        >
          Lihat Semua Produk →
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredCatalogProducts.map((product) => (
          <ProductCard key={product.slug} app={product} catalogFallback />
        ))}
      </div>
    </section>
  )
}
