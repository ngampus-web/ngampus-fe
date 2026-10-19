"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export type PromoSlide = {
  image: string
  href: string
  label: string
  alt: string
}

export function PromoCarousel({
  slides,
  label = "Promo layanan Ngampus",
}: {
  slides: PromoSlide[]
  label?: string
}) {
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (hovered || focused) return
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const timer = window.setInterval(() => {
      if (!document.hidden && !reducedMotion.matches) {
        setActive((current) => (current + 1) % slides.length)
      }
    }, 3000)
    return () => window.clearInterval(timer)
  }, [hovered, focused, active, slides.length])

  return (
    <div
      role="region"
      aria-roledescription="karusel"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false)
      }}
    >
      <div className="overflow-hidden rounded-2xl bg-plum-700 md:rounded-3xl">
        <div
          className="flex transition-transform duration-700 ease-in-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.href}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} dari ${slides.length}: ${slide.label}`}
              aria-hidden={index !== active}
              inert={index !== active}
              className="w-full shrink-0"
            >
              <Link
                href={slide.href}
                tabIndex={index === active ? 0 : -1}
                className="block focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-primary"
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  width={5400}
                  height={1440}
                  sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 1120px) calc(100vw - 80px), 1040px"
                  loading="eager"
                  className="h-auto w-full"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.href}
            type="button"
            aria-label={`Tampilkan banner ${slide.label}`}
            aria-current={active === index ? "true" : undefined}
            onClick={() => setActive(index)}
            className="flex h-10 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-primary"
          >
            <span
              className={cn(
                "h-2.5 rounded-full transition-all motion-reduce:transition-none",
                active === index ? "w-7 bg-primary" : "w-2.5 bg-black/20"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
