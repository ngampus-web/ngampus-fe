import type { Metadata } from "next"

import { bannersToSlides } from "@/components/shared/promo-slides"
import { fallbackPlagiarismSlides } from "@/features/plagiarism/data/plagiarism"
import { PlagiarismServices } from "@/features/plagiarism/components/plagiarism-services"
import { startPrices } from "@/features/plagiarism/services/document-config"
import { getDocumentConfig } from "@/features/plagiarism/services/document-services"
import { contentApi } from "@/lib/api/endpoints/content"

export const metadata: Metadata = {
  title: "Plagiarisme Checker",
  description:
    "Cek similarity Turnitin, deteksi tulisan AI, atau parafrase manual.",
}

export default async function PlagiarismPage() {
  const [banners, config] = await Promise.all([
    contentApi.banners("plagiarism", []),
    getDocumentConfig(),
  ])
  const slides = bannersToSlides(banners)
  const prices = startPrices(config)
  return (
    <PlagiarismServices
      slides={slides.length ? slides : fallbackPlagiarismSlides(prices)}
      startPrices={prices}
    />
  )
}
