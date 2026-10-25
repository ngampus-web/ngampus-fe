import Image from "next/image"

import { trustedBy } from "@/features/home/data/home"
import type { ContentLogo } from "@/lib/api/endpoints/content"

export function TrustedBy({ logos: items }: { logos: ContentLogo[] }) {
  const shown = items.filter((l) => l.logoUrl)
  if (!shown.length) return null
  // The marquee shifts by -50%, so each half must be wider than the widest viewport.
  const logos = Array.from({ length: 6 }, () => shown).flat()

  return (
    <section className="flex flex-col items-center gap-6 overflow-hidden py-4">
      <p className="px-5 text-center tracking-[-0.02em] text-black">
        {trustedBy.title}
      </p>
      <div className="relative w-full mask-x-from-90% mask-x-to-100%">
        <ul className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
          {logos.map((logo, i) => (
            <li
              key={`${logo.id}-${i}`}
              aria-hidden={i >= shown.length}
              className="pr-10"
            >
              <Image
                src={logo.logoUrl!}
                alt={logo.name}
                width={160}
                height={48}
                unoptimized={/^https?:\/\//.test(logo.logoUrl!)}
                className="h-12 w-auto object-contain grayscale"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
