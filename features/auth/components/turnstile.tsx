"use client"

import Script from "next/script"
import { useEffect, useRef } from "react"

import { config } from "@/lib/config"

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string
          callback: (token: string) => void
          "expired-callback": () => void
        }
      ) => string
      reset: (id?: string) => void
      remove: (id: string) => void
    }
  }
}

/** Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset (local dev). */
export function Turnstile({
  onToken,
  resetKey = 0,
}: {
  onToken: (token: string | undefined) => void
  resetKey?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const siteKey = config.turnstileSiteKey

  useEffect(() => {
    if (!siteKey) return
    let cancelled = false
    const mount = () => {
      if (cancelled || !ref.current || !window.turnstile || widgetId.current)
        return
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: (token) => onToken(token),
        "expired-callback": () => onToken(undefined),
      })
    }
    const timer = window.setInterval(() => {
      mount()
      if (widgetId.current) window.clearInterval(timer)
    }, 200)
    return () => {
      cancelled = true
      window.clearInterval(timer)
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
      widgetId.current = null
    }
  }, [siteKey, onToken])

  useEffect(() => {
    if (resetKey && widgetId.current) {
      window.turnstile?.reset(widgetId.current)
      onToken(undefined)
    }
  }, [resetKey, onToken])

  if (!siteKey) return null
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <div ref={ref} className="flex justify-center" />
    </>
  )
}
