import { upgradeCreatorGuide } from "./creator-content"
import type { Metadata } from "next"
import { serverGet } from "@/lib/api/server"
import { normalizeNgampusBrand } from "@/lib/normalize-ngampus-brand"
import {
  buildOpenGraph,
  buildTwitterCard,
  CORE_SEO_KEYWORDS,
  MARKETPLACE_SEO_KEYWORDS,
  PLAGIARISM_SEO_KEYWORDS,
} from "@/lib/seo"
import { PAGE_DEFAULTS } from "./defaults"
import { readContentDraft } from "./preview"

export type ContentPage = Exclude<keyof typeof PAGE_DEFAULTS, "footer">
type WithImages<T> = T extends object
  ? { [K in keyof T]: WithImages<T[K]> } & { imageUrl?: string | null }
  : T
export type PageContent<K extends ContentPage> = WithImages<
  (typeof PAGE_DEFAULTS)[K]
> & { contentHtml?: string }

const PAGE_CANONICAL_PATH: Record<ContentPage, string> = {
  home: "/",
  plagiarism: "/cek-plagiarisme",
  marketplace: "/marketplace",
  creator: "/creator",
  terms: "/syarat-ketentuan",
  privacy: "/kebijakan-privasi",
}

const PAGE_SEO_KEYWORDS: Partial<Record<ContentPage, string[]>> = {
  home: CORE_SEO_KEYWORDS,
  plagiarism: PLAGIARISM_SEO_KEYWORDS,
  marketplace: MARKETPLACE_SEO_KEYWORDS,
}

const LEGACY_GENERIC_TITLES: Partial<Record<ContentPage, string[]>> = {
  plagiarism: ["Plagiarisme Checker"],
  marketplace: ["Marketplace"],
}

const LEGACY_GENERIC_DESCRIPTIONS: Partial<Record<ContentPage, string[]>> = {
  home: [
    "Platform kuliah all-in-one: cek plagiasi, deteksi AI, akses AI premium, dan file tools untuk mahasiswa Indonesia.",
  ],
  plagiarism: [
    "Cek similarity Turnitin, deteksi tulisan AI, atau parafrase manual.",
  ],
  marketplace: [
    "Beli akses ChatGPT, Claude, Gemini, Canva, CapCut, dan Spotify.",
  ],
}

export async function getPageContent<K extends ContentPage>(
  page: K
): Promise<PageContent<K>> {
  const draft = await readContentDraft()
  if (draft?.page === page) {
    return normalizeNgampusBrand(draft.value as PageContent<K>)
  }
  try {
    const content = (await serverGet<PageContent<K>>(`/content/pages/${page}`))
      .data
    return page === "creator"
      ? (upgradeCreatorGuide(
          content as PageContent<"creator">
        ) as unknown as PageContent<K>)
      : content
  } catch {
    return PAGE_DEFAULTS[page] as PageContent<K>
  }
}

export async function pageMetadata(page: ContentPage): Promise<Metadata> {
  const { seo } = await getPageContent(page)
  const fallbackSeo = PAGE_DEFAULTS[page].seo
  const title =
    !seo.title || LEGACY_GENERIC_TITLES[page]?.includes(seo.title.trim())
      ? fallbackSeo.title
      : seo.title
  const description =
    !seo.description ||
    LEGACY_GENERIC_DESCRIPTIONS[page]?.includes(seo.description.trim())
      ? fallbackSeo.description
      : seo.description
  const canonical = PAGE_CANONICAL_PATH[page]
  const keywords = PAGE_SEO_KEYWORDS[page]
  return {
    ...((await readContentDraft())
      ? { robots: { index: false, follow: false } }
      : {}),
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical },
    openGraph: buildOpenGraph({
      title,
      description,
      path: canonical,
      image: seo.imageUrl,
    }),
    twitter: buildTwitterCard({
      title,
      description,
      image: seo.imageUrl,
    }),
  }
}
