import type { Metadata } from "next"
import { serverGet } from "@/lib/api/server"
import { PAGE_DEFAULTS } from "./defaults"
import { readContentDraft } from "./preview"

export type ContentPage = Exclude<keyof typeof PAGE_DEFAULTS, "footer">
type WithImages<T> = T extends object
  ? { [K in keyof T]: WithImages<T[K]> } & { imageUrl?: string | null }
  : T
export type PageContent<K extends ContentPage> = WithImages<
  (typeof PAGE_DEFAULTS)[K]
> & { contentHtml?: string }

export async function getPageContent<K extends ContentPage>(
  page: K
): Promise<PageContent<K>> {
  const draft = await readContentDraft()
  if (draft?.page === page) return draft.value as PageContent<K>
  try {
    return (await serverGet<PageContent<K>>(`/content/pages/${page}`)).data
  } catch {
    return PAGE_DEFAULTS[page] as PageContent<K>
  }
}

export async function pageMetadata(page: ContentPage): Promise<Metadata> {
  const { seo } = await getPageContent(page)
  return {
    ...((await readContentDraft())
      ? { robots: { index: false, follow: false } }
      : {}),
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      ...(seo.imageUrl ? { images: [seo.imageUrl] } : {}),
    },
  }
}
