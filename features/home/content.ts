import {
  type ContentFaq,
  type ContentTestimonial,
  contentApi,
} from "@/lib/api/endpoints/content"

import { faq, similarityFaq, testimonials } from "./data/home"
import { GLOBAL_DEFAULTS } from "@/features/content/global"

// Static copies used when the content API is down or empty.
const fallbackTestimonials: ContentTestimonial[] = testimonials.items.map(
  (t, i) => ({
    id: `static-${i}`,
    name: t.name,
    institution: t.campus,
    quote: t.quote,
    rating: 5,
  })
)
const fallbackFaqs: ContentFaq[] = faq.items.map((f, i) => ({
  id: `static-${i}`,
  ...f,
}))
const legacyAnnouncementText =
  /^Gabung Saluran WhatsApp untuk update layanan, promo, dan info terbaru dari ngampus\.(?:co\.)?id!$/

/** Everything the home page shows from the CMS, fetched in parallel. */
export async function getHomeContent() {
  const [settings, items, faqs] = await Promise.all([
    contentApi.settings(GLOBAL_DEFAULTS),
    contentApi.testimonials(fallbackTestimonials),
    contentApi.faqs(fallbackFaqs),
  ])
  const announcement = settings.announcement ?? GLOBAL_DEFAULTS.announcement
  return {
    announcement: legacyAnnouncementText.test(announcement.text)
      ? { ...announcement, text: GLOBAL_DEFAULTS.announcement.text }
      : announcement,
    testimonials: items,
    faqs: faqs.map((item) =>
      item.question.trim() === similarityFaq.question
        ? { ...item, answer: similarityFaq.answer }
        : item
    ),
  }
}
