import {
  type ContentFaq,
  type ContentLogo,
  type ContentTestimonial,
  contentApi,
  type SiteSettings,
} from "@/lib/api/endpoints/content"

import { faq, testimonials, trustedBy } from "./data/home"
import { whatsappChannelUrl } from "@/config/navigation"

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
const fallbackLogos: ContentLogo[] = trustedBy.logos.map((l) => ({
  id: `static-${l.id}`,
  name: l.name,
  logoUrl: l.src,
}))
const fallbackSettings: SiteSettings = {
  announcement: {
    text: "Gabung Saluran WhatsApp untuk update layanan, promo, dan info terbaru dari ngampus.co.id!",
    url: whatsappChannelUrl,
    active: true,
  },
}

/** Everything the home page shows from the CMS, fetched in parallel. */
export async function getHomeContent() {
  const [settings, items, faqs, logos] = await Promise.all([
    contentApi.settings(fallbackSettings),
    contentApi.testimonials(fallbackTestimonials),
    contentApi.faqs(fallbackFaqs),
    contentApi.partnerLogos(fallbackLogos),
  ])
  return {
    announcement: settings.announcement,
    testimonials: items,
    faqs,
    logos,
  }
}
