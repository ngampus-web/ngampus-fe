"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { firstUsablePoster } from "./load-poster"
import {
  isPopupRoute,
  markPopupShown,
  popupPosters,
  popupStorage,
  popupWasShown,
  type PopupPoster,
} from "./rules"
import { PosterDialog } from "./poster-dialog"

export function PromoPopup() {
  const pathname = usePathname()
  return isPopupRoute(pathname) ? <PopupController key={pathname} /> : null
}

function PopupController() {
  const [posters, setPosters] = useState<PopupPoster[]>([])
  const [open, setOpen] = useState(false)
  const restoreFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (popupWasShown(popupStorage())) return
    const controller = new AbortController()
    void (async () => {
      try {
        const response = await fetch("/api/promo-popup", {
          signal: controller.signal,
        })
        if (!response.ok) return
        const usable = await firstUsablePoster(
          popupPosters((await response.json()).data),
          controller.signal
        )
        if (
          controller.signal.aborted ||
          !usable.length ||
          popupWasShown(popupStorage())
        )
          return
        restoreFocus.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null
        setPosters(usable)
        setOpen(true)
      } catch {}
    })()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (open) markPopupShown(popupStorage())
  }, [open])

  if (!open) return null
  return (
    <PosterDialog
      posters={posters}
      onClose={() => setOpen(false)}
      restoreFocus={restoreFocus}
    />
  )
}
