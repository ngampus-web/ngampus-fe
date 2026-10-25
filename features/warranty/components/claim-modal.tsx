"use client"

import { X } from "lucide-react"
import { useEffect, useId, useRef } from "react"

/** Centered dialog (bottom sheet on mobile); Esc and backdrop close it unless `locked`. */
export function ClaimModal({
  title,
  description,
  onClose,
  locked = false,
  children,
}: {
  title: string
  description?: React.ReactNode
  onClose: () => void
  /** Ignore close requests (e.g. while submitting). */
  locked?: boolean
  children: React.ReactNode
}) {
  const titleId = useId()
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    panel.current?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !locked) onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [locked, onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={() => !locked && onClose()}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-2xl bg-white p-5 outline-none md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <h2
              id={titleId}
              className="text-xl font-semibold tracking-[-0.02em]"
            >
              {title}
            </h2>
            {description && (
              <div className="text-sm leading-6 tracking-[-0.02em] text-subtle">
                {description}
              </div>
            )}
          </div>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            disabled={locked}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
