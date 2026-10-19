import Link from "next/link"

import { Button } from "@/components/ui/button"
import { whatsappChannelUrl } from "@/config/navigation"

export function AnnouncementBar() {
  return (
    <div className="bg-plum-700 text-white">
      <div className="mx-auto flex min-h-17 max-w-[1280px] flex-col items-start justify-between gap-3 px-5 py-3 sm:flex-row sm:items-center md:px-10">
        <p className="text-sm tracking-[-0.02em] sm:text-base">
          Gabung Saluran WhatsApp untuk update layanan, promo, dan info terbaru
          dari ngampus.id!
        </p>
        <Link
          href={whatsappChannelUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-sm font-medium tracking-[-0.02em] underline underline-offset-4 lg:hidden"
        >
          Klik disini
        </Link>
        <Button
          asChild
          variant="white"
          size="pill"
          className="hidden shrink-0 lg:inline-flex"
        >
          <Link href={whatsappChannelUrl} target="_blank" rel="noreferrer">
            Gabung Sekarang
          </Link>
        </Button>
      </div>
    </div>
  )
}
