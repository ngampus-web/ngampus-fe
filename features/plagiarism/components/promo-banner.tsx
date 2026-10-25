import {
  PromoCarousel,
  type PromoSlide,
} from "@/components/shared/promo-carousel"

export function PromoBanner({ slides }: { slides: PromoSlide[] }) {
  return <PromoCarousel slides={slides} />
}
