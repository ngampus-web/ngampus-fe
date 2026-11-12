import type { Metadata } from "next"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import { ProtectTool } from "@/features/file-tools/components/protect/protect-tool"
import { Scanner } from "@/features/file-tools/components/scanner/scanner"
import { SignTool } from "@/features/file-tools/components/sign/sign-tool"
import { FileTools } from "@/features/file-tools/components/file-tools"

import { ToolCatalog } from "@/features/file-tools/components/tool-catalog"
import {
  fileToolFromParam,
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
      <>
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "File Tools", href: "/file-tools" },
            { label: specialToolTitles[id] },
          ]}
        />
        <section className="mx-auto w-full max-w-[1200px] px-5 py-12 md:px-10 lg:py-16">
          <h1 className="mb-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            {specialToolTitles[id]}
          </h1>
          <Tool key={id} />
        </section>
      </>
    )
  }
  const toolId = fileToolFromParam(id)
  return toolId ? <FileTools key={toolId} toolId={toolId} /> : <ToolCatalog />
}
