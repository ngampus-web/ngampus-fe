import { CONVERT_ACCEPT } from "@/features/file-tools/lib/convert"

const pdfAccept = ".pdf,application/pdf"

export const fileTools = {
  merge: { title: "Gabung PDF", accept: pdfAccept, multiple: true },
  kompres: { title: "Kompres PDF", accept: pdfAccept, multiple: false },
  convert: { title: "Konversi ke PDF", accept: CONVERT_ACCEPT, multiple: true },
  word: { title: "Word ke PDF", accept: ".docx", multiple: false },
  jpg: { title: "JPG ke PDF", accept: ".jpg,.jpeg", multiple: true },
  png: { title: "PNG ke PDF", accept: ".png", multiple: true },
  gambar: {
    title: "Gambar ke PDF",
    accept: ".webp,.gif,.bmp,.svg,.jpg,.jpeg,.png",
    multiple: true,
  },
  teks: {
    title: "Teks ke PDF",
    accept: ".txt,.md,.csv,.json,.log",
    multiple: true,
  },
} as const

export type ToolId = keyof typeof fileTools

export function fileToolFromParam(
  value: string | string[] | undefined
): ToolId | undefined {
  const id = Array.isArray(value) ? value[0] : value
  return id && Object.hasOwn(fileTools, id) ? (id as ToolId) : undefined
}

export const specialToolTitles = {
  protect: "Protect PDF",
  sign: "Sign PDF",
  scanner: "Scanner jadi PDF",
} as const

export type CatalogToolId = ToolId | keyof typeof specialToolTitles
