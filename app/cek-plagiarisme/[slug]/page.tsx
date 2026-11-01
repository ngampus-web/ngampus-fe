import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Checkout } from "./checkout"
import {
  getPlagiarismService,
  plagiarismServices,
} from "@/features/plagiarism/data/plagiarism"
import {
  getAiCheckPricing,
  getParaphraseRates,
} from "@/features/plagiarism/services/document-services"

export function generateStaticParams() {
  return plagiarismServices.map((service) => ({ slug: service.slug }))
}

type PlagiarismServicePageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PlagiarismServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getPlagiarismService(slug)
  if (!service) return { title: "Layanan tidak ditemukan" }
  return {
    title: service.title,
    description: service.description,
  }
}

export default async function PlagiarismServicePage({
  params,
}: PlagiarismServicePageProps) {
  const { slug } = await params
  const service = getPlagiarismService(slug)
  if (!service) notFound()

  const aiPricing =
    service.slug === "cek-ai" ? await getAiCheckPricing() : undefined
  const paraphraseRates =
    service.slug === "parafrase-manual" ? await getParaphraseRates() : undefined
  return (
    <Checkout
      service={service}
      aiPricing={aiPricing}
      paraphraseRates={paraphraseRates}
    />
  )
}
