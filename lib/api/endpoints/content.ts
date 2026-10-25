/**
 * Landing content — docs/API-CONTRACT.md §4. Public, cached 60 s on the server;
 * every getter falls back to the static content bundled in the FE.
 */

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

export interface ContentLogo {
  id: string
  name: string
  logoUrl: string | null
}

export interface CreatorExample {
  id: string
  platform: "tiktok" | "instagram" | "x_threads"
  url: string
  caption: string | null
}

export interface SiteSettings {
  announcement: { text: string; url: string | null; active: boolean }
}

const get = async <T>(path: string, query?: Record<string, string>) =>
  (await serverGet<T>(path, { query })).data

export const contentApi = {
  banners: (placement: BannerPlacement, fallback: ContentBanner[]) =>
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
  partnerLogos: (fallback: ContentLogo[]) =>
    withFallback(() => get<ContentLogo[]>("/content/partner-logos"), fallback),
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
