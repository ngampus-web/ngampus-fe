import { Package } from "lucide-react"
import Image from "next/image"

import { cn } from "@/lib/utils"

/** Product logo from the CDN, or a neutral icon when none is uploaded. */
export function ProductLogo({
  src,
  className,
}: {
  src: string | null
  className?: string
}) {
  if (!src) {
    return (
      <span
        aria-hidden
        className={cn(
          "flex size-14 shrink-0 items-center justify-center rounded-xl bg-surface text-subtle",
          className
        )}
      >
        <Package className="size-6" />
      </span>
    )
  }
  return (
    <Image
      src={src}
      alt=""
      width={56}
      height={56}
      unoptimized={/^https?:\/\//.test(src)}
      className={cn("size-14 shrink-0 rounded-xl object-cover", className)}
    />
  )
}
