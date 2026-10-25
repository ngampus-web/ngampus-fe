import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { Cta } from "@/features/home/components/cta"
import { Faq } from "@/features/home/components/faq"
import { Hero } from "@/features/home/components/hero"
import { Testimonials } from "@/features/home/components/testimonials"
import { ToolCategories } from "@/features/home/components/tool-categories"
import { WhyNgampus } from "@/features/home/components/why-ngampus"
import { getHomeContent } from "@/features/home/content"

export default async function Home() {
  const content = await getHomeContent()
  return (
    <>
      <AnnouncementBar announcement={content.announcement} />
      <Hero />
      <ToolCategories />
      <WhyNgampus />
      <Testimonials items={content.testimonials} logos={content.logos} />
      <Faq items={content.faqs} />
      <Cta />
    </>
  )
}
