import { Flame } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { SectionHeading } from "@/components/shared/section-heading"
import { Button } from "@/components/ui/button"
import { getPageContent } from "@/features/content/api"
import {
  formatStartPrice,
  plagiarismServices,
} from "@/features/plagiarism/data/plagiarism"
import { startPrices } from "@/features/plagiarism/services/document-config"
import { getDocumentConfig } from "@/features/plagiarism/services/document-services"
import { PLAGIARISM_SLUG_FEATURE, type FeatureFlags } from "@/lib/features"

const serviceMascots = {
  turnitin: {
    src: "/images/mascot-cek-plagiasi.png",
    width: 667,
    height: 955,
  },
  "cek-ai": {
    src: "/images/mascot-cek-ai-v2.png",
    width: 646,
    height: 947,
  },
}

export async function FeaturedServices({
  features,
}: {
  features: FeatureFlags
}) {
  const [content, config] = await Promise.all([
    getPageContent("plagiarism"),
    getDocumentConfig(),
  ])
  const prices = startPrices(config)
  const services = plagiarismServices
    .map((service, index) => ({ ...service, ...content.services[index] }))
    .filter(
      (service) =>
        service.slug in serviceMascots &&
        features[PLAGIARISM_SLUG_FEATURE[service.slug]]
    )

  return (
    <section
      aria-label="Layanan Turnitin dan Cek AI"
      className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-5 py-16 md:px-10 lg:p-20"
    >
      <SectionHeading
        title="Yuk, cek tugasmu di Ngampus"
        description="Pastikan tugas, makalah, dan skripsimu aman dari plagiasi serta deteksi AI sebelum dikumpulkan."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service) => {
          const mascot =
            serviceMascots[service.slug as keyof typeof serviceMascots]
          return (
            <article
              key={service.slug}
              className="flex flex-col gap-6 rounded-2xl border border-line bg-white p-6 lg:flex-row-reverse lg:items-center"
            >
              <Image
                src={mascot.src}
                alt=""
                width={mascot.width}
                height={mascot.height}
                sizes="160px"
                className="mx-auto h-44 w-auto shrink-0 object-contain lg:h-48"
              />
              <div className="flex min-w-0 flex-1 flex-col items-start gap-5">
                <div className="flex flex-col items-start gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[-0.02em] text-primary">
                    <Flame className="size-3.5" aria-hidden />
                    Best Seller
                  </span>
                  <h3 className="text-[22px] leading-7 font-semibold tracking-[-0.02em]">
                    {service.title}
                  </h3>
                  <p className="leading-6 tracking-[-0.02em] text-black/70">
                    {service.description}
                  </p>
                </div>
                <p className="font-semibold tracking-[-0.02em]">
                  {formatStartPrice(prices[service.slug] ?? service.price)}
                </p>
                <Button asChild size="pill">
                  <Link href={`/cek-plagiarisme/${service.slug}`}>
                    {service.slug === "turnitin" ? "Cek Plagiasi" : "Cek AI"}
                  </Link>
                </Button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
