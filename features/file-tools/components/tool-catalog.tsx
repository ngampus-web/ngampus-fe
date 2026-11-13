import {
  ArrowRight,
  Combine,
  FileImage,
  FileLock2,
  FileText,
  FileType2,
  Image,
  Images,
  ScanLine,
  Shrink,
  Signature,
} from "lucide-react"
import Link from "next/link"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import {
  fileTools,
  specialToolTitles,
  type CatalogToolId,
} from "@/features/file-tools/data/file-tools"

const titles = { ...specialToolTitles, ...fileTools }

const tools = [
  {
    id: "protect",
    icon: FileLock2,
    description: "Lindungi dokumen dengan kata sandi sebelum dibagikan.",
  },
  {
    id: "sign",
    icon: Signature,
    description:
      "Tambahkan tanda tangan, inisial, atau stempel di halaman pilihan.",
  },
  {
    id: "scanner",
    icon: ScanLine,
    description:
      "Foto dokumen atau pilih gambar, lalu susun halamannya jadi PDF.",
  },
  {
    id: "merge",
    icon: Combine,
    description: "Satukan beberapa PDF sesuai urutan halaman yang kamu pilih.",
  },
  {
    id: "kompres",
    icon: Shrink,
    description: "Kecilkan ukuran PDF supaya lebih mudah dikirim.",
  },
  {
    id: "word",
    icon: FileType2,
    description:
      "Ubah dokumen Word (.docx), termasuk tabel dan gambar, menjadi PDF.",
  },
  {
    id: "jpg",
    icon: Image,
    description: "Gabungkan foto JPG atau JPEG menjadi satu PDF.",
  },
  {
    id: "png",
    icon: FileImage,
    description: "Jadikan gambar PNG sebagai halaman dalam satu PDF.",
  },
  {
    id: "gambar",
    icon: Images,
    description: "Ubah gambar WebP, GIF, BMP, SVG, JPG, atau PNG menjadi PDF.",
  },
  {
    id: "teks",
    icon: FileText,
    description: "Simpan isi TXT, Markdown, CSV, atau JSON sebagai PDF.",
  },
] as const satisfies readonly {
  id: CatalogToolId
  icon: typeof FileText
  description: string
}[]

export function ToolCatalog() {
  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "File Tools" }]}
      />
      <section className="mx-auto w-full max-w-[1200px] px-5 py-12 md:px-10 lg:py-16">
        <h1 className="max-w-[680px] text-4xl leading-tight font-semibold tracking-tight text-black sm:text-5xl">
          Kelola dan konversi PDF
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-black/70">
          Pindai dokumen, gabungkan PDF, atau ubah file tugas ke PDF. Semua file
          diproses langsung di browser.
        </p>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon
            const href = `/file-tools?tool=${tool.id}`
            const entry = titles[tool.id]
            const title = typeof entry === "string" ? entry : entry.title
            return (
              <Link
                key={href}
                href={href}
                className="group flex min-h-52 flex-col items-start rounded-2xl border border-line bg-white p-5 transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none sm:p-6"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-white">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <h2 className="mt-4 text-lg font-semibold tracking-tight">
                  {title}
                </h2>
                <p className="mt-1 mb-4 text-sm leading-relaxed text-black/70">
                  {tool.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium group-hover:text-orange-600">
                  Buka alat
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
