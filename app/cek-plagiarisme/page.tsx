import { bannersToSlides } from "@/components/shared/promo-slides"
import { fallbackPlagiarismSlides } from "@/features/plagiarism/data/plagiarism"
import { PlagiarismServices } from "@/features/plagiarism/components/plagiarism-services"
import { startPrices } from "@/features/plagiarism/services/document-config"
import { getDocumentConfig } from "@/features/plagiarism/services/document-services"
import { contentApi } from "@/lib/api/endpoints/content"
import { getPageContent, pageMetadata } from "@/features/content/api"
import { getFeatures } from "@/features/content/global"

export const generateMetadata = () => pageMetadata("plagiarism")

export default async function PlagiarismPage() {
  const [banners, config, content, features] = await Promise.all([
    contentApi.banners("plagiarism", null),
    getDocumentConfig(),
    getPageContent("plagiarism"),
    getFeatures(),
  ])
  const prices = startPrices(config)
  const slides =
    banners === null
      ? fallbackPlagiarismSlides(prices)
      : bannersToSlides(banners)
  return (
    <PlagiarismServices
      slides={slides}
      content={content}
      startPrices={prices}
      features={features}
    />
  )
}
