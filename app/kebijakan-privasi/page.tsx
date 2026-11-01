import { LegalPage } from "@/features/legal/components/legal-page"
import { privacySections } from "@/features/legal/data/legal"
import { getPageContent, pageMetadata } from "@/features/content/api"

export const generateMetadata = () => pageMetadata("privacy")

export default async function PrivacyPage() {
  const content = await getPageContent("privacy")
  return (
    <LegalPage
      title={content.title}
      description={content.description}
      contentHtml={content.contentHtml}
      effectiveDate={content.effectiveDate}
      sections={privacySections}
    />
  )
}
