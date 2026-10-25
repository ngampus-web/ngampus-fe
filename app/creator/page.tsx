import type { Metadata } from "next"
import { CreatorLanding } from "@/features/creator/components/creator-landing"
import { contentApi } from "@/lib/api/endpoints/content"

export const metadata: Metadata = {
  title: "Ngampus Creator",
  description:
    "Syarat social media, fee, dan cara submit untuk campaign UGC Ngampus.",
}

export default async function CreatorPage() {
  return <CreatorLanding examples={await contentApi.creatorExamples()} />
}
