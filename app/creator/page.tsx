import { FeatureGate } from "@/features/content/feature-gate"
import { CreatorLanding } from "@/features/creator/components/creator-landing"
import { contentApi } from "@/lib/api/endpoints/content"
import { getPageContent, pageMetadata } from "@/features/content/api"

export const generateMetadata = () => pageMetadata("creator")

export default async function CreatorPage() {
  const [examples, content] = await Promise.all([
    contentApi.creatorExamples(),
    getPageContent("creator"),
  ])
  return (
    <FeatureGate feature="creator" name="Ngampus Creator">
      <CreatorLanding examples={examples} content={content} />
    </FeatureGate>
  )
}
