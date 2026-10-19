import type { Metadata } from "next"

import { FileTools } from "@/features/file-tools/components/file-tools"

export const metadata: Metadata = {
  title: "File Tools",
  description: "Gabung, kompres, dan convert file PDF.",
}

type FileToolsPageProps = {
  searchParams: Promise<{ tool?: string | string[] }>
}

export default async function FileToolsPage({
  searchParams,
}: FileToolsPageProps) {
  const { tool } = await searchParams
  return <FileTools initialTool={tool} />
}
