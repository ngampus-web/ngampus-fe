export const fileTools = [
  {
    id: "merge",
    title: "Merge PDF",
    description: "Gabung beberapa PDF jadi satu.",
    accept: ".pdf,application/pdf",
    multiple: true,
    icon: "merge" as const,
  },
  {
    id: "kompres",
    title: "Kompres PDF",
    description: "Kecilkan ukuran, kualitas tetap.",
    accept: ".pdf,application/pdf",
    multiple: false,
    icon: "kompres" as const,
  },
  {
    id: "convert",
    title: "Convert ke PDF",
    description: "Konversi file DOCX, PPT, dll ke PDF",
    accept: ".doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,application/pdf",
    multiple: false,
    icon: "convert" as const,
  },
]

export const fileToolsUpload = {
  title: "Upload Dokumen",
  description: "PDF, DOCX, atau PPT.",
}

export const fileToolsHowTo = {
  title: "Cara pakai",
  description: "Tiga langkah. Gak perlu nunggu operator.",
  steps: [
    {
      title: "Pilih layanan",
      description: "Merge, kompres, atau convert ke PDF.",
      icon: "choose" as const,
    },
    {
      title: "Upload dokumen",
      description: "Kirim PDF, DOCX, atau PPT.",
      icon: "upload" as const,
    },
    {
      title: "Unduh hasilnya",
      description: "File baru siap dipakai, langsung.",
      icon: "download" as const,
    },
  ],
}

export function fileToolFromParam(value: string | string[] | undefined) {
  const id = Array.isArray(value) ? value[0] : value
  return fileTools.find((tool) => tool.id === id)?.id ?? fileTools[0].id
}
