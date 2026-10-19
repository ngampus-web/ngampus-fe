import { Star } from "lucide-react"

import { TrustedBy } from "@/features/home/components/trusted-by"
import { testimonials } from "@/features/home/data/home"

export function Testimonials() {
  return (
    <section className="bg-surface">
      <TrustedBy />
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-5 py-16 md:px-10 lg:gap-12 lg:py-25">
        <h2 className="max-w-[640px] text-[32px] leading-[1.2] font-semibold tracking-[-0.02em] text-black md:text-[40px]">
          {testimonials.title}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.items.map((item) => (
            <article
              key={item.name}
              className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-5"
            >
              <div className="flex gap-1" aria-label="5 dari 5">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className="size-4 fill-amber-400 text-amber-400"
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
                  {item.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold tracking-[-0.02em] text-black">
                    {item.name}
                  </span>
                  <span className="block text-xs tracking-[-0.02em] text-subtle">
                    {item.campus}
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
