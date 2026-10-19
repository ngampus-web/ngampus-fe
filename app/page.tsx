import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { Cta } from "@/features/home/components/cta"
import { Faq } from "@/features/home/components/faq"
import { Hero } from "@/features/home/components/hero"
import { Testimonials } from "@/features/home/components/testimonials"
import { ToolCategories } from "@/features/home/components/tool-categories"
import { WhyNgampus } from "@/features/home/components/why-ngampus"

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Hero />
      <ToolCategories />
      <WhyNgampus />
      <Testimonials />
      <Faq />
      <Cta />
    </>
  )
}
