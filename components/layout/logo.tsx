import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Ngampus.id beranda" className="shrink-0">
      <Image
        src="/images/logo-brand.png"
        alt="ngampus.id"
        width={1305}
        height={225}
        priority
        className={cn("h-10 w-auto object-contain", className)}
      />
    </Link>
  )
}
