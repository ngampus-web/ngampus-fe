import { BadgeCheck, Clock, Timer } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import { Button } from "@/components/ui/button"
import { PromoBanner } from "./promo-banner"
import {
  formatStartPrice,
  plagiarismBenefits,
  plagiarismFlowSteps,
  plagiarismHub,
  plagiarismServices,
} from "@/features/plagiarism/data/plagiarism"

export function PlagiarismServices() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Plagiarisme Checker" },
        ]}
      />
      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-5 py-12 md:px-10 lg:py-16">
        <h1 className="sr-only">{plagiarismHub.title.join(" ")}</h1>
        <PromoBanner />
        <div className="grid items-start gap-4 md:grid-cols-3">
          {plagiarismServices.map((service) => (
            <article
              key={service.slug}
              className="flex flex-col justify-between gap-6 rounded-2xl border border-line bg-white p-6"
            >
              <div className="flex flex-col gap-3">
                {service.slug === "turnitin" && (
                  <Image
                    src="/images/mascot-cek-plagiasi.png"
                    alt=""
                    width={667}
                    height={955}
                    sizes="180px"
                    className="mx-auto h-44 w-auto object-contain"
                  />
                )}
                {service.slug === "cek-ai" && (
                  <Image
                    src="/images/mascot-cek-ai-v2.png"
                    alt=""
                    width={646}
                    height={947}
                    sizes="180px"
                    className="mx-auto h-44 w-auto object-contain"
                  />
                )}
                {service.slug === "parafrase-manual" && (
                  <Image
                    src="/images/mascot-parafrase.png"
                    alt=""
                    width={672}
                    height={920}
                    sizes="180px"
                    className="mx-auto h-44 w-auto object-contain"
                  />
                )}
                <h2 className="text-[22px] leading-7 font-semibold tracking-[-0.02em]">
                  {service.title}
                </h2>
                <p className="text-sm leading-6 tracking-[-0.02em] text-subtle">
                  {service.description}
                </p>
              </div>
              <div className="flex flex-col items-start gap-4">
                <p className="text-base font-semibold tracking-[-0.02em]">
                  {formatStartPrice(service.price)}
                </p>
                <Button asChild size="pill">
                  <Link href={`/cek-plagiarisme/${service.slug}`}>
                    Klik di sini
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-5 pb-16 md:px-10 lg:pb-20">
        <h2 className="text-[32px] leading-[1.2] font-medium tracking-[-0.02em]">
          Mau Check Plagiarisme? Nih caranya
        </h2>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plagiarismFlowSteps.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
                {index + 1}
              </span>
              <h3 className="text-base font-semibold tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="text-sm leading-6 tracking-[-0.02em] text-black/70">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>
      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-5 pb-16 md:px-10 lg:pb-20">
        <h2 className="text-[32px] leading-[1.2] font-medium tracking-[-0.02em]">
          Kenapa Sih Harus Cek Plagiarisme di Ngampus?
        </h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {plagiarismBenefits.map((item) => {
            const Icon =
              item.title === "Cepat & Nggak Ribet"
                ? Timer
                : item.title === "Akses 24 Jam"
                  ? Clock
                  : BadgeCheck
            return (
              <li
                key={item.title}
                className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-white">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="text-base font-semibold tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="text-sm leading-6 tracking-[-0.02em] text-black/70">
                  {item.body}
                </p>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
