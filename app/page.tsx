import { HOME_PAGE_DESCRIPTION, HOME_PAGE_TITLE } from "@/lib/site-metadata"
import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { JsonLd } from "@/components/shared/json-ld"
import { Cta } from "@/features/home/components/cta"
import { Faq } from "@/features/home/components/faq"
import { Hero } from "@/features/home/components/hero"
import { FeaturedProducts } from "@/features/home/components/featured-products"
import { FeaturedServices } from "@/features/home/components/featured-services"
import { Testimonials } from "@/features/home/components/testimonials"
import { ToolCategories } from "@/features/home/components/tool-categories"
import { WhyNgampus } from "@/features/home/components/why-ngampus"
import { getHomeContent } from "@/features/home/content"
import { getPageContent, pageMetadata } from "@/features/content/api"
import { getFeatures, getGlobalContent } from "@/features/content/global"
import {
  buildOpenGraph,
  buildTwitterCard,
  faqJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo"

export async function generateMetadata() {
  const metadata = await pageMetadata("home")
  const description =
    typeof metadata.description === "string"
      ? metadata.description
      : HOME_PAGE_DESCRIPTION
  return {
    ...metadata,
    title: { absolute: HOME_PAGE_TITLE },
    openGraph: buildOpenGraph({
      title: HOME_PAGE_TITLE,
      description,
      path: "/",
    }),
    twitter: buildTwitterCard({
      title: HOME_PAGE_TITLE,
      description,
    }),
  }
}

export default async function Home() {
  const [content, page, features, global] = await Promise.all([
    getHomeContent(),
    getPageContent("home"),
    getFeatures(),
    getGlobalContent(),
  ])
  return (
    <>
      <JsonLd data={organizationJsonLd(global.contacts)} />
      <JsonLd data={websiteJsonLd()} />
      {page.visible.faq && content.faqs.length > 0 && (
        <JsonLd data={faqJsonLd(content.faqs)} />
      )}
      <AnnouncementBar announcement={content.announcement} />
      <Hero content={page.hero} />
      {page.visible.tools && (
        <ToolCategories content={page.toolCategories} features={features} />
      )}
      {page.visible.benefits && <WhyNgampus content={page.whyNgampus} />}
      {(features.turnitin || features.ai_check) && (
        <FeaturedServices features={features} />
      )}
      {features.marketplace && <FeaturedProducts />}
      {page.visible.testimonials && content.testimonials.length > 0 && (
        <Testimonials
          items={content.testimonials}
          title={page.headings.testimonials}
        />
      )}
      {page.visible.faq && (
        <Faq
          items={content.faqs}
          title={page.headings.faq}
          description={page.headings.faqDescription}
        />
      )}
      {page.visible.cta && <Cta content={page.cta} />}
    </>
  )
}
