"use client"

import Image from "next/image"
import { useRef, useState } from "react"

export function WhatsAppShortcut({ phone }: { phone: string }) {
  const [showMessage, setShowMessage] = useState(true)
  const shortcut = useRef<HTMLAnchorElement>(null)
  const number = phone.replace(/\D/g, "")
  if (!number) return null

  const chatUrl = `https://wa.me/${number}`

  return (
    <div className="fixed right-5 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40 md:right-6 md:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]">
      {showMessage && (
        <div className="absolute right-full bottom-10 mr-1.5 w-max max-w-[calc(100vw-7.75rem)] md:bottom-12 md:mr-2">
          <a
            href={chatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-primary bg-plum-700 px-2.5 py-1.5 text-xs leading-snug font-semibold text-white shadow-md transition-colors hover:bg-plum-700/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Ada pertanyaan?
            <br />
            Hubungi aku di sini yuk!
          </a>
          <button
            type="button"
            aria-label="Tutup pesan WhatsApp"
            onClick={() => {
              setShowMessage(false)
              shortcut.current?.focus()
            }}
            className="absolute -top-2 -left-2 flex size-6 items-center justify-center rounded-full bg-primary text-base leading-none font-bold text-black shadow-sm hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      )}
      <a
        ref={shortcut}
        href={chatUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Ngampus"
        title="Chat WhatsApp Ngampus"
        className="block w-18 rounded-2xl transition-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-safe:hover:scale-105 md:w-22"
      >
        <Image
          src="/images/mascot-whatsapp.png"
          alt=""
          width={1150}
          height={1368}
          sizes="(min-width: 768px) 88px, 72px"
          className="h-auto w-full drop-shadow-md"
        />
      </a>
    </div>
  )
}
