import { Star } from "lucide-react"

import { TrustedBy } from "@/features/home/components/trusted-by"
import { testimonials } from "@/features/home/data/home"
import { initials } from "@/lib/api/fallback"
import type {
  ContentLogo,
  ContentTestimonial,
} from "@/lib/api/endpoints/content"

export function Testimonials({
  items,
  logos,
}: {
  items: ContentTestimonial[]
  logos: ContentLogo[]
}) {
  return (
    <section className="bg-surface">
      <TrustedBy logos={logos} />
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-5 py-16 md:px-10 lg:gap-12 lg:py-25">
        <h2 className="max-w-[640px] text-[32px] leading-[1.2] font-semibold tracking-[-0.02em] text-black md:text-[40px]">
          {testimonials.title}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-5"
            >
              <div className="flex gap-1" aria-label={`${item.rating} dari 5`}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={
                      index < item.rating
                        ? "size-4 fill-amber-400 text-amber-400"
                        : "size-4 text-line-strong"
                    }
                    aria-hidden
                  />
                ))}
              </div>
              <p className="text-sm leading-6 tracking-[-0.02em] text-black/70">
                {item.quote}
              </p>
              <div className="mt-auto flex items-center gap-3">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white"
                  aria-hidden
                >
                  {initials(item.name)}
                </span>
                <span>
                  <span className="block text-sm font-semibold tracking-[-0.02em] text-black">
                    {item.name}
                  </span>
                  <span className="block text-xs tracking-[-0.02em] text-subtle">
                    {item.institution}
                  </span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
