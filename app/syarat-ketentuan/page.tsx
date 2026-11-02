import { LegalPage } from "@/features/legal/components/legal-page"
import { termsSections } from "@/features/legal/data/legal"
import { getPageContent, pageMetadata } from "@/features/content/api"

export const generateMetadata = () => pageMetadata("terms")

export default async function TermsPage() {
  const content = await getPageContent("terms")
  return (
    <LegalPage
      title={content.title}
      description={content.description}
      contentHtml={content.contentHtml}
      effectiveDate={content.effectiveDate}
      sections={termsSections}
    />
  )
}
