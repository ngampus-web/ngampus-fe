import { PromoCarousel } from "@/components/shared/promo-carousel"

const slides = [
  {
    image: "/images/plagiarism/banner-paraphrase-481e56460a.png",
    href: "/cek-plagiarisme/parafrase-manual",
    label: "Parafrase",
    alt: "Jasa parafrase bergaransi dan cepat, mulai dari Rp25.000 per file",
  },
  {
    image: "/images/plagiarism/banner-turnitin-770cddf96c.png",
    href: "/cek-plagiarisme/turnitin",
    label: "Turnitin",
    alt: "Cek persentase plagiarisme murah, mulai dari Rp7.000 per file",
  },
  {
    image: "/images/plagiarism/banner-ai-fc01e12299.png",
    href: "/cek-plagiarisme/cek-ai",
    label: "Cek AI",
    alt: "Cek persentase AI 24 jam non-stop, mulai dari Rp4.000 per file",
  },
]

export function PromoBanner() {
  return <PromoCarousel slides={slides} />
}
