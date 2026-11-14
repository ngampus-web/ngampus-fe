import { HOME_PAGE_TITLE } from "@/lib/site-metadata"
import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { Cta } from "@/features/home/components/cta"
import { Faq } from "@/features/home/components/faq"
import { Hero } from "@/features/home/components/hero"
import { FeaturedProducts } from "@/features/home/components/featured-products"
import { Testimonials } from "@/features/home/components/testimonials"
import { ToolCategories } from "@/features/home/components/tool-categories"
import { WhyNgampus } from "@/features/home/components/why-ngampus"
import { getHomeContent } from "@/features/home/content"
import { getPageContent, pageMetadata } from "@/features/content/api"
import { getFeatures } from "@/features/content/global"

export async function generateMetadata() {
  const metadata = await pageMetadata("home")
  return {
    ...metadata,
    title: { absolute: HOME_PAGE_TITLE },
    openGraph: { ...metadata.openGraph, title: HOME_PAGE_TITLE },
  }
}

export default async function Home() {
  const [content, page, features] = await Promise.all([
    getHomeContent(),
    getPageContent("home"),
    getFeatures(),
  ])
  return (
    <>
      <AnnouncementBar announcement={content.announcement} />
      <Hero content={page.hero} />
      {page.visible.tools && (
        <ToolCategories content={page.toolCategories} features={features} />
      )}
      {page.visible.benefits && <WhyNgampus content={page.whyNgampus} />}
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
