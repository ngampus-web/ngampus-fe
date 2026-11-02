"use client"

import { Dialog } from "radix-ui"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Link from "next/link"
import { useRef, useState, type RefObject } from "react"
import type { PopupPoster } from "./rules"

export function PosterDialog({
  posters,
  onClose,
  restoreFocus,
}: {
  posters: PopupPoster[]
  onClose: () => void
  restoreFocus: RefObject<HTMLElement | null>
}) {
  const [active, setActive] = useState(0)
  const [failed, setFailed] = useState<string[]>([])
  const swiped = useRef(false)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const available = posters.filter((poster) => !failed.includes(poster.id))
  const index = active % Math.max(available.length, 1)
  const poster = available[index]
  const move = (step: number) =>
    setActive((index + step + available.length) % available.length)

  return (
    <Dialog.Root open={!!poster} onOpenChange={(value) => !value && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/65" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 z-[81] max-h-[94dvh] w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto focus:outline-none"
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            if (restoreFocus.current?.isConnected) restoreFocus.current.focus()
          }}
          onKeyDown={(event) => {
            if (available.length < 2) return
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault()
              move(event.key === "ArrowLeft" ? -1 : 1)
            }
          }}
        >
          <Dialog.Title className="sr-only">Promo Ngampus</Dialog.Title>
          {poster && (
            <div
              className="relative mx-auto w-fit"
              onTouchStart={(event) => {
                swiped.current = false
                const point = event.touches[0]
                touch.current = { x: point.clientX, y: point.clientY }
              }}
              onTouchEnd={(event) => {
                const start = touch.current
                touch.current = null
                if (!start || available.length < 2) return
                const dx = event.changedTouches[0].clientX - start.x
                const dy = event.changedTouches[0].clientY - start.y
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
                  swiped.current = true
                  move(dx < 0 ? 1 : -1)
                }
              }}
            >
              <Dialog.Close
                aria-label="Tutup promo"
                className="absolute top-2 right-2 z-10 flex size-10 items-center justify-center rounded-full bg-white text-black shadow-md focus-visible:outline-2 focus-visible:outline-primary"
              >
                <X className="size-5" aria-hidden />
              </Dialog.Close>
              <Link
                href={poster.linkUrl}
                onClick={(event) => {
                  if (swiped.current) {
                    event.preventDefault()
                    swiped.current = false
                  } else onClose()
                }}
                className="block rounded-xl focus-visible:outline-2 focus-visible:outline-primary"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- public poster keeps its natural aspect ratio */}
                <img
                  key={poster.id}
                  src={poster.imageUrl}
                  alt={poster.title}
                  className="block h-auto max-h-[75dvh] w-auto max-w-[min(32rem,calc(100vw-2rem))] rounded-xl object-contain"
                  onError={() => {
                    if (available.length === 1) onClose()
                    else {
                      setFailed((ids) => [...ids, poster.id])
                      setActive(0)
                    }
                  }}
                />
              </Link>
            </div>
          )}
          {available.length > 1 && (
            <div
              className="mt-2 flex w-0 min-w-full items-center justify-center gap-2 overflow-x-auto text-white"
              aria-label="Navigasi promo"
            >
              <button
                type="button"
                aria-label="Promo sebelumnya"
                onClick={() => move(-1)}
                className="flex size-10 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-primary"
              >
                <ChevronLeft aria-hidden />
              </button>
              {available.map((slide, slideIndex) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Tampilkan promo ${slideIndex + 1}: ${slide.title}`}
                  aria-current={index === slideIndex ? "true" : undefined}
                  onClick={() => setActive(slideIndex)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span
                    className={`size-2 rounded-full ${index === slideIndex ? "bg-white" : "bg-white/40"}`}
                  />
                </button>
              ))}
              <button
                type="button"
                aria-label="Promo berikutnya"
                onClick={() => move(1)}
                className="flex size-10 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-primary"
              >
                <ChevronRight aria-hidden />
              </button>
              <span className="sr-only" aria-live="polite">
                Promo {index + 1} dari {available.length}
              </span>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
