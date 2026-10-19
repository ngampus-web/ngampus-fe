import type { Metadata } from "next"

import { PlagiarismServices } from "@/features/plagiarism/components/plagiarism-services"

export const metadata: Metadata = {
  title: "Plagiarisme Checker",
  description:
    "Cek similarity Turnitin, deteksi tulisan AI, atau parafrase manual.",
}

export default function PlagiarismPage() {
  return <PlagiarismServices />
}
