import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Checkout } from "./checkout"
import { JsonLd } from "@/components/shared/json-ld"
import { FeatureGate } from "@/features/content/feature-gate"
import { PLAGIARISM_SLUG_FEATURE } from "@/lib/features"
import {
  getPlagiarismService,
  plagiarismServices,
} from "@/features/plagiarism/data/plagiarism"
import { startPrices } from "@/features/plagiarism/services/document-config"
import { getDocumentConfig } from "@/features/plagiarism/services/document-services"
import {
  breadcrumbJsonLd,
  buildOpenGraph,
  buildTwitterCard,
  serviceJsonLd,
} from "@/lib/seo"

export function generateStaticParams() {
  return plagiarismServices.map((service) => ({ slug: service.slug }))
}

type PlagiarismServicePageProps = {
  params: Promise<{ slug: string }>
}

const SERVICE_SEO: Record<
  string,
  {
    title: (priceText: string) => string
    description: (priceText: string) => string
    keywords: string[]
    image: string
  }
> = {
  turnitin: {
    title: (priceText) =>
      `Cek Turnitin Murah Mulai ${priceText}/File (No Repository)`,
    description: (priceText) =>
      `Cek plagiasi dan similarity Turnitin V2 murah mulai ${priceText}/file, proses cepat, aman no repository, lengkap dengan laporan & Digital Receipt 24 jam di Ngampus.co.id.`,
    keywords: [
      "turnitin murah",
      "cek turnitin murah",
      "cek plagiasi turnitin",
      "turnitin no repository",
      "cek similarity skripsi",
      "cek plagiarisme murah",
    ],
    image: "/images/plagiarism/banner-turnitin-770cddf96c.png",
  },
  "cek-ai": {
    title: (priceText) =>
      `Cek AI Murah Mulai ${priceText}/File — Deteksi Tulisan AI Turnitin`,
    description: (priceText) =>
      `Cek persentase deteksi AI (ChatGPT & AI Detector Turnitin) murah mulai ${priceText}/file, cepat, akurat, dan privasi dokumen terjaga 24 jam di Ngampus.co.id.`,
    keywords: [
      "cek ai murah",
      "deteksi ai turnitin",
      "cek tulisan ai",
      "cek persentase ai",
      "ai detector turnitin murah",
    ],
    image: "/images/plagiarism/banner-ai-fc01e12299.png",
  },
  "parafrase-manual": {
    title: (priceText) =>
      `Jasa Parafrase Manual Murah Mulai ${priceText} — Turunin Turnitin & AI`,
    description: (priceText) =>
      `Jasa parafrase manual mulai ${priceText} untuk menurunkan skor plagiasi Turnitin dan deteksi AI pada tugas, makalah, dan skripsi secara rapi dan natural di Ngampus.co.id.`,
    keywords: [
      "jasa parafrase manual",
      "jasa parafrase murah",
      "turunin turnitin murah",
      "jasa parafrase skripsi",
      "turunkan skor ai",
    ],
    image: "/images/plagiarism/banner-paraphrase-481e56460a.png",
  },
}

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`

export async function generateMetadata({
  params,
}: PlagiarismServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getPlagiarismService(slug)
  if (!service) return { title: "Layanan tidak ditemukan" }
  const prices = startPrices(await getDocumentConfig())
  const priceText = formatRupiah(prices[slug] ?? service.price)
  const seo = SERVICE_SEO[slug]
  const title = seo ? seo.title(priceText) : service.title
  const description = seo ? seo.description(priceText) : service.description
  const path = `/cek-plagiarisme/${slug}`
  return {
    title,
    description,
    ...(seo ? { keywords: seo.keywords } : {}),
    alternates: { canonical: path },
    openGraph: buildOpenGraph({
      title,
      description,
      path,
      image: seo?.image,
    }),
    twitter: buildTwitterCard({
      title,
      description,
      image: seo?.image,
    }),
  }
}

export default async function PlagiarismServicePage({
  params,
}: PlagiarismServicePageProps) {
  const { slug } = await params
  const service = getPlagiarismService(slug)
  if (!service) notFound()
  const config = await getDocumentConfig()
  const price = startPrices(config)[slug] ?? service.price
  const seo = SERVICE_SEO[slug]
  const path = `/cek-plagiarisme/${slug}`

  return (
    <FeatureGate feature={PLAGIARISM_SLUG_FEATURE[slug]} name={service.title}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", path: "/" },
          { name: "Cek Plagiarisme", path: "/cek-plagiarisme" },
          { name: service.title, path },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          name: service.title,
          description: seo
            ? seo.description(formatRupiah(price))
            : service.description,
          path,
          price,
          image: seo?.image,
        })}
      />
      <Checkout service={service} config={config} />
    </FeatureGate>
  )
}
