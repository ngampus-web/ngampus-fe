import type { Metadata } from "next"

import { bannersToSlides } from "@/components/shared/promo-slides"
import { fallbackPlagiarismSlides } from "@/features/plagiarism/data/plagiarism"
import { PlagiarismServices } from "@/features/plagiarism/components/plagiarism-services"
import { contentApi } from "@/lib/api/endpoints/content"

export const metadata: Metadata = {
  title: "Plagiarisme Checker",
  description:
    "Cek similarity Turnitin, deteksi tulisan AI, atau parafrase manual.",
}

export default async function PlagiarismPage() {
  const banners = await contentApi.banners("plagiarism", [])
  const slides = bannersToSlides(banners)
  return (
    <PlagiarismServices
      slides={slides.length ? slides : fallbackPlagiarismSlides}
    />
  )
}
