"use client"

import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { creatorEntryHref } from "@/features/creator/services/creator-rules"
import { useAuthStore } from "@/lib/stores/auth"
import type { CreatorBannerDestination } from "@/features/content/defaults/creator"

export function CreatorBannerSubmit({
  label = "Submit Konten",
  imageUrl,
  destination = "automatic",
}: {
  label?: string
  imageUrl?: string | null
  destination?: CreatorBannerDestination
}) {
  const user = useAuthStore((s) => s.user)
  const href =
    destination === "login"
      ? "/creator/masuk"
      : destination === "register"
        ? "/creator/daftar"
        : creatorEntryHref(user)

  if (imageUrl) {
    const action =
      destination === "login"
        ? "Masuk ke Ngampus Creator"
        : href.startsWith("/creator/submit")
          ? "Submit konten Ngampus Creator"
          : "Daftar atau masuk ke Ngampus Creator"
    return (
      <Link
        href={href}
        className="block overflow-hidden rounded-2xl bg-plum-700 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-primary md:rounded-3xl"
      >
        <Image
          src={imageUrl}
          alt={action}
          width={5400}
          height={1440}
          sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 80px), 1020px"
          loading="eager"
          unoptimized
          className="h-auto w-full"
        />
      </Link>
    )
  }

  return (
    <Button asChild size="pill" variant="white">
      <Link href={href}>{label}</Link>
    </Button>
  )
}
