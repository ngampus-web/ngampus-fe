"use client"

import { BadgeCheck, Layers, Timer, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import { PromoCarousel } from "@/components/shared/promo-carousel"
import { Button } from "@/components/ui/button"
import {
  marketplaceApps,
  marketplaceCategories,
  marketplaceBenefits,
  marketplaceOrderSteps,
  marketplaceWarrantyBanner,
  type MarketplaceCategory,
} from "@/features/marketplace/data/marketplace"
import { cn } from "@/lib/utils"

const promoSlides = [
  {
    image: "/images/marketplace/banner-premium.png",
    href: "#marketplace-search",
    label: "Akun Premium",
    alt: "Dapatkan akun premium, harga mahasiswa. Mulai dari Rp10.000",
  },
  {
    image: "/images/marketplace/banner-gpt-go.png",
    href: "/marketplace/chatgpt",
    label: "GPT Go",
    alt: "Dapatkan akun GPT Go, harga terjangkau! Mulai dari Rp20.000",
  },
]

export function MarketplaceCatalog() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<MarketplaceCategory>("semua")

  const apps = useMemo(() => {
    const term = query.trim().toLowerCase()
    return marketplaceApps.filter((app) => {
      const matchesCategory = category === "semua" || app.category === category
      const matchesQuery =
        term.length === 0 ||
        app.name.toLowerCase().includes(term) ||
        app.description.toLowerCase().includes(term)
      return matchesCategory && matchesQuery
    })
  }, [category, query])

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
          {marketplaceCategories.map((item) => {
            const selected = item.id === category
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setCategory(item.id)}
                className={cn(
                  "h-9 rounded-full px-4 text-sm tracking-[-0.02em]",
                  selected
                    ? "bg-primary text-white"
                    : "border border-line bg-white text-black"
                )}
              >
                {item.label}
              </button>
            )
          })}
        </div>
        {apps.length === 0 ? (
          <p className="py-16 text-center text-sm tracking-[-0.02em] text-subtle">
            Tidak ada aplikasi untuk pencarian ini.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <article
                key={app.name}
                className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={app.logo}
                    alt=""
                    width={56}
                    height={56}
                    className={cn(
                      "size-14 rounded-xl object-cover",
                      app.logoBordered && "border border-line"
                    )}
                  />
                  <div className="flex min-w-0 flex-col gap-1">
                    <h2 className="text-base font-semibold tracking-[-0.02em]">
                      {app.name}
                    </h2>
                    <p className="flex items-center gap-1.5 text-sm tracking-[-0.02em] text-subtle">
                      <Star
                        className="size-4 fill-primary text-primary"
                        aria-hidden
                      />
                      <span className="text-black">5.0</span>
                      <span>· Telah Terjual 599</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm tracking-[-0.02em] text-subtle line-through">
                    {app.comparePrice}
                  </p>
                  <p className="text-2xl font-semibold tracking-[-0.02em]">
                    {app.price}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Stok Tersedia", "Garansi"].map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-line px-3 py-2 text-sm tracking-[-0.02em]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
                <Button asChild className="h-11 w-full rounded-3xl text-sm">
                  <Link href={`/marketplace/${app.slug}`}>{app.cta}</Link>
                </Button>
              </article>
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
