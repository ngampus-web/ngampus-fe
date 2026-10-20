import Image from "next/image"

/** Cover image from the CDN (remote URLs skip the optimizer). */
export function BlogCover({
  src,
  alt,
  sizes,
  preload,
}: {
  src: string | null
  alt: string
  sizes: string
  preload?: boolean
}) {
  if (!src)
    return (
      <div className="aspect-video w-full rounded-2xl bg-surface" aria-hidden />
    )
  return (
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={900}
      sizes={sizes}
      preload={preload}
      unoptimized={/^https?:\/\//.test(src)}
      className="aspect-video h-auto w-full rounded-2xl object-cover"
    />
  )
}
