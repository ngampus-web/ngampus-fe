"use client"

import { BadgeCheck, Layers, Timer } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import {
  PromoCarousel,
  type PromoSlide,
} from "@/components/shared/promo-carousel"
import { Button } from "@/components/ui/button"
import {
  type CategoryItem,
  type ProductSummary,
  searchMarketplaceProducts,
} from "@/features/marketplace/api"
import {
  marketplaceBenefits,
  marketplaceOrderSteps,
  marketplaceWarrantyBanner,
} from "@/features/marketplace/data/marketplace"
import { cn } from "@/lib/utils"

import { ProductCard } from "./product-card"

/** Search and category filtering run on the API; first page comes from the server. */
export function MarketplaceCatalog({
  initialProducts,
  categories,
  promoSlides,
}: {
  initialProducts: ProductSummary[]
  categories: CategoryItem[]
  promoSlides: PromoSlide[]
}) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("semua")
  const [apps, setApps] = useState(initialProducts)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    let cancelled = false
    const timer = setTimeout(async () => {
      setLoading(true)
      setError("")
      try {
        const next = await searchMarketplaceProducts({
          category: category === "semua" ? undefined : category,
          q: query.trim() || undefined,
        })
        if (!cancelled) setApps(next)
      } catch {
        if (!cancelled) setError("Gagal memuat produk. Coba lagi.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [category, query])

  const chips = [{ slug: "semua", name: "Semua" }, ...categories]

  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "Marketplace" }]}
      />
      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 px-5 py-12 md:px-10 lg:py-16">
        <h1 className="sr-only">Marketplace: akun premium, harga mahasiswa</h1>
        <PromoCarousel slides={promoSlides} label="Promo marketplace Ngampus" />
        <label className="sr-only" htmlFor="marketplace-search">
          Cari aplikasi
        </label>
        <input
          id="marketplace-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari ChatGPT, Canva, CapCut..."
          className="h-12 w-full rounded-full border border-line bg-white px-5 text-sm tracking-[-0.02em] outline-none placeholder:text-subtle focus-visible:border-primary"
        />
        <div className="flex flex-wrap gap-2">
          {chips.map((item) => {
            const selected = item.slug === category
            return (
              <button
                key={item.slug}
                type="button"
                aria-pressed={selected}
                onClick={() => setCategory(item.slug)}
                className={cn(
                  "h-9 rounded-full px-4 text-sm tracking-[-0.02em]",
                  selected
                    ? "bg-primary text-white"
                    : "border border-line bg-white text-black"
                )}
              >
                {item.name}
              </button>
            )
          })}
        </div>
        {error ? (
          <p
            role="alert"
            className="py-16 text-center text-sm tracking-[-0.02em] text-subtle"
          >
            {error}
          </p>
        ) : apps.length === 0 && !loading ? (
          <p className="py-16 text-center text-sm tracking-[-0.02em] text-subtle">
            Tidak ada aplikasi untuk pencarian ini.
          </p>
        ) : (
          <div
            aria-busy={loading}
            className={cn(
              "grid gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3",
              loading && "opacity-60"
            )}
          >
            {apps.map((app) => (
              <ProductCard key={app.slug} app={app} />
            ))}
          </div>
        )}
      </section>
      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-5 pb-16 md:px-10 lg:pb-20">
        <h2 className="text-[32px] leading-[1.2] font-medium tracking-[-0.02em]">
          Mau Beli Akun? Gini Caranya di Ngampus
        </h2>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {marketplaceOrderSteps.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
                {index + 1}
              </span>
              <h3 className="text-base font-semibold tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="text-sm leading-6 tracking-[-0.02em] text-black/70">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>
      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-5 pb-16 md:px-10 lg:pb-20">
        <h2 className="text-[32px] leading-[1.2] font-medium tracking-[-0.02em]">
          Keunggulan Marketplace Account di Ngampus
        </h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {marketplaceBenefits.map((item) => {
            const Icon =
              item.title === "Akun Lengkap, Harga Ramah"
                ? Layers
                : item.title === "Proses Mudah & Nggak Ribet"
                  ? Timer
                  : BadgeCheck
            return (
              <li
                key={item.title}
                className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-white">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="text-base font-semibold tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="text-sm leading-6 tracking-[-0.02em] text-black/70">
                  {item.body}
                </p>
              </li>
            )
          })}
        </ul>
      </section>
      <section className="mx-auto w-full max-w-[1120px] px-5 pb-16 md:px-10 lg:pb-20">
        <div className="relative flex min-h-[220px] items-center overflow-hidden rounded-[24px] bg-plum-700 px-6 py-8 md:px-12 lg:min-h-[260px]">
          <div className="relative z-10 flex max-w-[520px] flex-col items-start gap-4">
            <h2 className="text-[32px] leading-[1.15] font-medium tracking-[-0.02em] text-white md:text-[40px]">
              {marketplaceWarrantyBanner.title[0]}
              <br />
              {marketplaceWarrantyBanner.title[1]}
            </h2>
            <p className="text-sm leading-6 tracking-[-0.02em] text-white/80 md:text-base">
              {marketplaceWarrantyBanner.description}
            </p>
            <Button asChild variant="white" size="pill">
              <Link href={marketplaceWarrantyBanner.href}>
                {marketplaceWarrantyBanner.cta}
              </Link>
            </Button>
          </div>
          <Image
            src="/images/mascot-happy.png"
            alt=""
            width={593}
            height={880}
            sizes="240px"
            className="pointer-events-none absolute -right-2 -bottom-6 hidden h-[280px] w-auto object-contain md:block"
          />
        </div>
      </section>
    </>
  )
}
