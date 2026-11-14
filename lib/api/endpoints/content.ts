/**
 * Landing content — docs/API-CONTRACT.md §4. Public, cached 60 s on the server;
 * every getter falls back to the static content bundled in the FE.
 */

import type { FeatureFlags } from "@/lib/features"
import { serverGet } from "../server"
import { withFallback } from "../fallback"

export type BannerPlacement = "home" | "marketplace" | "plagiarism"

export interface ContentBanner {
  id: string
  title: string
  imageUrl: string | null
  linkUrl: string | null
}

export interface ContentTestimonial {
  id: string
  name: string
  institution: string
  quote: string
  rating: number
}

export interface ContentFaq {
  id: string
  question: string
  answer: string
}

export interface CreatorExample {
  id: string
  platform: "tiktok" | "instagram" | "x_threads"
  url: string
  caption: string | null
}

export interface SiteSettings {
  announcement: { text: string; url: string | null; active: boolean }
  /** Which services an admin has switched on. */
  features: FeatureFlags
}

export interface GlobalContent extends SiteSettings {
  contacts: {
    whatsapp: string
    email: string
    instagram: string | null
    tiktok: string | null
    supportHours: string
  }
  footer: {
    address: string
    description: string
    menuTitle: string
    servicesTitle: string
    contactsTitle: string
    addressTitle: string
    links: { label: string; href: string }[]
  }
}

const get = async <T>(path: string, query?: Record<string, string>) =>
  (await serverGet<T>(path, { query })).data

export const contentApi = {
  banners: (placement: BannerPlacement, fallback: ContentBanner[] | null) =>
    withFallback(
      () => get<ContentBanner[]>("/content/banners", { placement }),
      fallback
    ),
  testimonials: (fallback: ContentTestimonial[]) =>
    withFallback(
      () => get<ContentTestimonial[]>("/content/testimonials"),
      fallback
    ),
  faqs: (fallback: ContentFaq[], placement = "home") =>
    withFallback(
      () => get<ContentFaq[]>("/content/faqs", { placement }),
      fallback
    ),
  /** No static examples exist: an empty result hides the section. */
  creatorExamples: () =>
    withFallback(
      () =>
        get<{ video: CreatorExample[]; post: CreatorExample[] }>(
          "/content/creator-examples"
        ),
      { video: [], post: [] }
    ),
  settings: (fallback: SiteSettings) =>
    withFallback(() => get<SiteSettings>("/content/settings"), fallback),
}
