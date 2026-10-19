import type { Metadata } from "next"
import { CreatorLanding } from "@/features/creator/components/creator-landing"

export const metadata: Metadata = {
  title: "Ngampus Creator",
  description:
    "Syarat social media, fee, dan cara submit untuk campaign UGC Ngampus.",
}

export default function CreatorPage() {
  return <CreatorLanding />
}
