import type { Metadata } from "next"

import { CreatorDashboard } from "@/features/creator/components/creator-dashboard"
import { NOINDEX_ROBOTS } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Dashboard Creator",
  description: "Dashboard Ngampus Creator.",
  robots: NOINDEX_ROBOTS,
}

export default function CreatorDashboardPage() {
  return <CreatorDashboard />
}
