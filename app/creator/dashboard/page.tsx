import type { Metadata } from "next"

import { CreatorDashboard } from "@/features/creator/components/creator-dashboard"

export const metadata: Metadata = {
  title: "Dashboard Creator",
  description: "Dashboard Ngampus Creator.",
}

export default function CreatorDashboardPage() {
  return <CreatorDashboard />
}
