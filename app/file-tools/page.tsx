import type { Metadata } from "next"

import { JsonLd } from "@/components/shared/json-ld"
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
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildAlternates,
  buildOpenGraph,
  buildTwitterCard,
  FILE_TOOLS_SEO_KEYWORDS,
} from "@/lib/seo"

const FILE_TOOLS_TITLE =
  "File Tools PDF Gratis — Gabung, Kompres, Scan & Konversi PDF"
const FILE_TOOLS_DESCRIPTION =
  "Tools PDF online gratis untuk mahasiswa: pindai dokumen, gabung dan kompres PDF, tanda tangan, proteksi password, serta konversi Word, gambar, dan teks ke PDF."

export const metadata: Metadata = {
  title: FILE_TOOLS_TITLE,
  description: FILE_TOOLS_DESCRIPTION,
  keywords: FILE_TOOLS_SEO_KEYWORDS,
  alternates: buildAlternates("/file-tools"),
  openGraph: buildOpenGraph({
    title: FILE_TOOLS_TITLE,
    description: FILE_TOOLS_DESCRIPTION,
    path: "/file-tools",
  }),
  twitter: buildTwitterCard({
    title: FILE_TOOLS_TITLE,
    description: FILE_TOOLS_DESCRIPTION,
  }),
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
  if (toolId) {
    return (
      <ToolPage title={fileTools[toolId].title}>
        <FileTools key={toolId} toolId={toolId} />
      </ToolPage>
    )
  }
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", path: "/" },
          { name: "File Tools PDF Gratis", path: "/file-tools" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Ngampus File Tools PDF",
          url: absoluteUrl("/file-tools"),
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: 0, priceCurrency: "IDR" },
          description: FILE_TOOLS_DESCRIPTION,
        }}
      />
      <ToolCatalog />
    </>
  )
}
