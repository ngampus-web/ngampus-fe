"use client"

import {
  ArrowDown,
  ArrowUp,
  Combine,
  Download,
  FileOutput,
  FileText,
  Loader2,
  MousePointerClick,
  Shrink,
  Trash2,
  Upload,
  type LucideIcon,
} from "lucide-react"
import { useId, useState } from "react"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import { SectionHeading } from "@/components/shared/section-heading"
import { Button } from "@/components/ui/button"
import {
  fileToolFromParam,
  fileTools,
  fileToolsHowTo,
  fileToolsUpload,
} from "@/features/file-tools/data/file-tools"
import { canConvert } from "@/features/file-tools/lib/convert"
import {
  addFiles,
  downloadPdf,
  extOf,
  formatBytes,
  outputName,
} from "@/features/file-tools/lib/files"
import { cn } from "@/lib/utils"

type ToolId = (typeof fileTools)[number]["id"]

interface Result {
  bytes: Uint8Array
  name: string
  before: number
}

const accepts: Record<ToolId, (file: File) => boolean> = {
  merge: (file) => extOf(file.name) === "pdf",
  kompres: (file) => extOf(file.name) === "pdf",
  convert: canConvert,
}

const actionLabels: Record<ToolId, string> = {
  merge: "Gabungkan PDF",
  kompres: "Kompres PDF",
  convert: "Convert ke PDF",
}

/** Engines load on demand so the page itself stays light. */
async function runTool(
  id: ToolId,
  files: File[],
  onProgress: (done: number, total: number) => void
): Promise<Result> {
  const before = files.reduce((sum, f) => sum + f.size, 0)
  if (id === "merge") {
    const { mergePdfs } = await import("@/features/file-tools/lib/merge")
    const bytes = await mergePdfs(files, onProgress)
    return { bytes, before, name: outputName(files[0].name, "gabung") }
  }
  if (id === "kompres") {
    const { compressPdf } = await import("@/features/file-tools/lib/compress")
    const bytes = await compressPdf(files[0], onProgress)
    return { bytes, before, name: outputName(files[0].name, "kompres") }
  }
  const { convertToPdf } = await import("@/features/file-tools/lib/convert")
  const bytes = await convertToPdf(files, onProgress)
  return { bytes, before, name: outputName(files[0].name, "convert") }
}

const toolIcons: Record<(typeof fileTools)[number]["icon"], LucideIcon> = {
  merge: Combine,
  kompres: Shrink,
  convert: FileOutput,
}

const stepIcons = {
  choose: MousePointerClick,
  upload: Upload,
  download: Download,
}

export function FileTools({
  initialTool,
}: {
  initialTool?: string | string[]
}) {
  const toolKey = Array.isArray(initialTool) ? initialTool[0] : initialTool
  return <FileToolsPanel key={toolKey ?? "merge"} initialTool={toolKey} />
}

function FileToolsPanel({ initialTool }: { initialTool?: string }) {
  const uploadId = useId()
  const toolKey = Array.isArray(initialTool) ? initialTool[0] : initialTool
  const [toolId, setToolId] = useState(() => fileToolFromParam(toolKey))
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  const tool = fileTools.find((item) => item.id === toolId) ?? fileTools[0]

  const change = (next: File[], problem: string | null = null) => {
    setFiles(next)
    setError(problem)
    setResult(null)
  }

  const move = (index: number, delta: number) => {
    const next = [...files]
    const [item] = next.splice(index, 1)
    next.splice(index + delta, 0, item)
    change(next)
  }

  async function process() {
    setBusy(true)
    setError(null)
    setResult(null)
    setProgress("Memproses…")
    try {
      setResult(
        await runTool(tool.id, files, (done, total) =>
          setProgress(`Memproses ${done} dari ${total}…`)
        )
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "File tidak bisa diproses. Coba lagi."
      )
    } finally {
      setBusy(false)
      setProgress(null)
    }
  }

  const fileLabel =
    files.length === 0
      ? fileToolsUpload.description
      : files.length === 1
        ? files[0].name
        : `${files.length} file dipilih`

  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "File Tools" }]}
      />
      <section className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-5 py-12 md:px-10 lg:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {fileTools.map((item) => {
            const Icon = toolIcons[item.icon]
            const selected = item.id === tool.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                disabled={busy}
                onClick={() => {
                  setToolId(item.id)
                  change([])
                }}
                className={cn(
                  "flex flex-col items-start gap-6 rounded-2xl border bg-white p-5 text-left",
                  selected ? "border-primary" : "border-line"
                )}
              >
                <span
                  className="flex size-10 items-center justify-center rounded-lg bg-primary text-white"
                  aria-hidden
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-base font-semibold tracking-[-0.02em]">
                    {item.title}
                  </span>
                  <span className="text-sm tracking-[-0.02em] text-subtle">
                    {item.description}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <label
          htmlFor={uploadId}
          className="flex min-h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl bg-surface px-6 py-10 text-center"
        >
          <span className="flex size-12 items-center justify-center rounded-xl bg-white">
            <FileText className="size-5" aria-hidden />
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-base font-semibold tracking-[-0.02em]">
              {fileToolsUpload.title}
            </span>
            <span className="text-sm tracking-[-0.02em] text-subtle">
              {fileLabel}
            </span>
          </span>
        </label>
        <input
          key={tool.id}
          id={uploadId}
          type="file"
          accept={tool.accept}
          multiple={tool.multiple}
          className="sr-only"
          disabled={busy}
          onChange={(event) => {
            const picked = addFiles(files, [...(event.target.files ?? [])], {
              multiple: tool.multiple,
              accepts: accepts[tool.id],
            })
            change(picked.files, picked.error)
            event.target.value = ""
          }}
        />

        {files.length > 0 && (
          <ul className="flex flex-col gap-2">
            {files.map((file, i) => (
              <li
                key={`${file.name}-${file.size}-${file.lastModified}`}
                className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3"
              >
                <FileText className="size-4 shrink-0 text-subtle" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-sm tracking-[-0.02em]">
                  {file.name}
                </span>
                <span className="shrink-0 text-sm text-subtle">
                  {formatBytes(file.size)}
                </span>
                {tool.id === "merge" && (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Naikkan ${file.name}`}
                      disabled={busy || i === 0}
                      onClick={() => move(i, -1)}
                    >
                      <ArrowUp aria-hidden />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Turunkan ${file.name}`}
                      disabled={busy || i === files.length - 1}
                      onClick={() => move(i, 1)}
                    >
                      <ArrowDown aria-hidden />
                    </Button>
                  </>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Hapus ${file.name}`}
                  disabled={busy}
                  onClick={() => change(files.filter((_, j) => j !== i))}
                >
                  <Trash2 aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        )}

        {tool.id === "kompres" && files.length > 0 && (
          <p className="text-sm tracking-[-0.02em] text-subtle">
            Halaman PDF diubah menjadi gambar agar ukurannya kecil, jadi teks
            hasil kompres tidak bisa diseleksi.
          </p>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        {files.length > 0 && !result && (
          <Button
            type="button"
            className="h-11 w-full rounded-3xl text-sm sm:w-auto sm:self-end sm:px-8"
            disabled={busy}
            onClick={process}
          >
            {busy && <Loader2 className="animate-spin" aria-hidden />}
            {busy ? progress : actionLabels[tool.id]}
          </Button>
        )}

        {result && (
          <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="truncate text-base font-semibold tracking-[-0.02em]">
                {result.name}
              </span>
              <span className="text-sm tracking-[-0.02em] text-subtle">
                {tool.id === "kompres"
                  ? `${formatBytes(result.before)} → ${formatBytes(result.bytes.byteLength)}${
                      result.bytes.byteLength < result.before
                        ? ` (${Math.round((1 - result.bytes.byteLength / result.before) * 100)}% lebih kecil)`
                        : " (PDF ini sudah optimal)"
                    }`
                  : formatBytes(result.bytes.byteLength)}
              </span>
            </div>
            <Button
              type="button"
              className="h-11 rounded-3xl px-8 text-sm"
              onClick={() => downloadPdf(result.bytes, result.name)}
            >
              <Download aria-hidden /> Unduh PDF
            </Button>
          </div>
        )}
      </section>

      <section className="bg-surface">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center gap-12 px-5 py-16 md:px-10 lg:py-20">
          <SectionHeading
            title={fileToolsHowTo.title}
            description={fileToolsHowTo.description}
            align="center"
            className="max-w-[640px]"
          />
          <div className="grid w-full gap-4 md:grid-cols-3">
            {fileToolsHowTo.steps.map((step) => {
              const Icon = stepIcons[step.icon]
              return (
                <article
                  key={step.title}
                  className="flex min-h-[280px] flex-col justify-between rounded-2xl border border-line bg-white p-6"
                >
                  <span
                    className="flex size-14 items-center justify-center rounded-xl bg-plum-900 text-white"
                    aria-hidden
                  >
                    <Icon className="size-6" strokeWidth={1.75} />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold tracking-[-0.02em]">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-6 tracking-[-0.02em]">
                      {step.description}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
