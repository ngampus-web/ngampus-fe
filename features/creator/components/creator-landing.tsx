import Image from "next/image"

import { CreatorBannerSubmit } from "@/features/creator/components/creator-banner-submit"
import { CreatorHeader } from "@/features/creator/components/creator-header"
import {
  campaignContentRules,
  campaignFeeNote,
  campaignFees,
  campaignPlatforms,
  campaignSections,
  creatorJoinSteps,
} from "@/features/creator/data/campaign"

function PlatformIcon({
  icon,
}: {
  icon: (typeof campaignPlatforms)[number]["icon"]
}) {
  if (icon === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden
      >
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (icon === "tiktok") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        fill="currentColor"
        aria-hidden
      >
        <path d="M14.2 3c.4 2.4 1.8 4.1 4.1 4.4v2.8a7 7 0 0 1-4.1-1.3v6.4a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v2.9a2.8 2.8 0 1 0 1.9 2.7V3z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.835L0 1.154h7.594l5.243 6.932 6.064-6.933Zm-1.29 19.49h2.039L6.487 3.24H4.3l13.31 17.403Z" />
    </svg>
  )
}

export function CreatorLanding() {
  return (
    <div className="flex min-h-svh flex-col bg-white">
      <CreatorHeader />
      <article className="mx-auto flex w-full max-w-[1100px] flex-col gap-4 px-5 py-10 md:px-10 lg:py-14">
        <div className="relative flex min-h-[220px] items-center overflow-hidden rounded-[24px] bg-plum-700 px-6 py-8 text-white md:px-10 lg:min-h-[260px]">
          <div className="relative z-10 flex max-w-[520px] flex-col gap-4">
            <h1 className="text-[32px] leading-[1.15] font-medium tracking-[-0.02em] md:text-[44px]">
              Ngampus Creator
            </h1>
            <p className="text-sm leading-6 tracking-[-0.02em] text-white/80 md:text-base">
              Daftar atau masuk untuk membuka dashboard creator, lalu submit
              konten kampanye kamu.
            </p>
            <div className="flex flex-wrap gap-2">
              <CreatorBannerSubmit />
            </div>
          </div>
          <Image
            src="/images/mascot-creator.png"
            alt=""
            width={655}
            height={961}
            sizes="220px"
            className="pointer-events-none absolute right-4 bottom-0 hidden h-[240px] w-auto object-contain md:block"
          />
        </div>
        <section className="flex flex-col gap-6 py-4">
          <h2 className="text-[32px] leading-[1.2] font-medium tracking-[-0.02em]">
            Gimana Cara Ikutan Jadi Ngampus Creator?
          </h2>
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {creatorJoinSteps.map((step, index) => (
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
        <section className="flex flex-col gap-4 rounded-2xl border border-line p-5 md:p-6">
          <h2 className="text-base font-semibold tracking-[-0.02em]">
            Syarat Social Media
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {campaignPlatforms.map((platform) => (
              <div
                key={platform.name}
                className="flex flex-col gap-4 rounded-[12px] border border-line p-4"
              >
                <span className="flex size-12 items-center justify-center rounded-[12px] bg-primary text-white">
                  <PlatformIcon icon={platform.icon} />
                </span>
                <h3 className="text-base font-semibold tracking-[-0.02em]">
                  {platform.name}
                </h3>
                <ul className="list-disc space-y-1 pl-5 text-sm leading-6 tracking-[-0.02em]">
                  {platform.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-line p-5 md:p-6">
          <h2 className="text-base font-semibold tracking-[-0.02em]">
            Fee & Bonus
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {campaignFees.map((fee) => (
              <div
                key={fee.name}
                className="flex flex-col gap-2 rounded-[12px] border border-line p-4"
              >
                <h3 className="text-sm font-semibold tracking-[-0.02em]">
                  {fee.name}
                </h3>
                <p className="text-sm leading-6 tracking-[-0.02em]">
                  {fee.text}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm leading-6 tracking-[-0.02em] text-subtle">
            {campaignFeeNote}
          </p>
          <h3 className="text-sm font-semibold tracking-[-0.02em]">
            Ketentuan Konten
          </h3>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-6 tracking-[-0.02em]">
            {campaignContentRules.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {campaignSections.map((section) => (
          <section
            key={section.title}
            className="flex flex-col gap-3 rounded-2xl border border-line p-5 md:p-6"
          >
            <h2 className="text-base font-semibold tracking-[-0.02em]">
              {section.title}
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-sm leading-6 tracking-[-0.02em]">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </article>
    </div>
  )
}
