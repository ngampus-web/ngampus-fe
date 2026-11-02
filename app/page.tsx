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

export const generateMetadata = () => pageMetadata("home")

export default async function Home() {
  const [content, page] = await Promise.all([
    getHomeContent(),
    getPageContent("home"),
  ])
  return (
    <>
      <AnnouncementBar announcement={content.announcement} />
      <Hero content={page.hero} />
      {page.visible.tools && <ToolCategories content={page.toolCategories} />}
      {page.visible.benefits && <WhyNgampus content={page.whyNgampus} />}
      <FeaturedProducts />
      {((page.visible.testimonials && content.testimonials.length > 0) ||
        (page.visible.logos && content.logos.length > 0)) && (
        <Testimonials
          items={page.visible.testimonials ? content.testimonials : []}
          logos={page.visible.logos ? content.logos : []}
          title={page.headings.testimonials}
          logosTitle={page.headings.logos}
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
