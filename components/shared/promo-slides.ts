export type PromoSlide = {
  /** Local `/images/…` path or a CDN URL from the banner API. */
  image: string
  href: string
  label: string
  alt: string
}

/** Banner API rows → carousel slides; banners without an image are skipped. */
export function bannersToSlides(
  banners: { title: string; imageUrl: string | null; linkUrl: string | null }[]
): PromoSlide[] {
  return banners
    .filter((b) => b.imageUrl)
    .map((b) => ({
      image: b.imageUrl!,
      href: b.linkUrl ?? "#",
      label: b.title,
      alt: b.title,
    }))
}
