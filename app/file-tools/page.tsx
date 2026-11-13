import type { Metadata } from "next"

import { ToolPage } from "@/features/file-tools/components/tool-page"
import { ProtectTool } from "@/features/file-tools/components/protect/protect-tool"
import { Scanner } from "@/features/file-tools/components/scanner/scanner"
import { SignTool } from "@/features/file-tools/components/sign/sign-tool"
import { FileTools } from "@/features/file-tools/components/file-tools"

import { ToolCatalog } from "@/features/file-tools/components/tool-catalog"
import {
  fileToolFromParam,
  fileTools,
  specialToolTitles,
} from "@/features/file-tools/data/file-tools"

export const metadata: Metadata = {
  title: "File Tools",
  description:
    "Pindai dokumen, gabung dan kompres PDF, serta konversi Word, gambar, dan teks ke PDF.",
}

type FileToolsPageProps = {
  searchParams: Promise<{ tool?: string | string[] }>
}

const specialTools = { protect: ProtectTool, sign: SignTool, scanner: Scanner }

function isSpecialTool(
  id: string | undefined
): id is keyof typeof specialTools {
  return id !== undefined && Object.hasOwn(specialTools, id)
}

export default async function FileToolsPage({
  searchParams,
}: FileToolsPageProps) {
  const { tool } = await searchParams
  const id = Array.isArray(tool) ? tool[0] : tool
  if (isSpecialTool(id)) {
    const Tool = specialTools[id]
    return (
      <ToolPage title={specialToolTitles[id]}>
        <Tool key={id} />
      </ToolPage>
    )
  }
  const toolId = fileToolFromParam(id)
  return toolId ? (
    <ToolPage title={fileTools[toolId].title}>
      <FileTools key={toolId} toolId={toolId} />
    </ToolPage>
  ) : (
    <ToolCatalog />
  )
}
