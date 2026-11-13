"use client"
import { notify } from "@/lib/toast"

import {
  ArrowDown,
  ArrowUp,
  Download,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react"
import { useId, useRef, useState } from "react"

import { UploadPanel } from "./upload-panel"
import { Button } from "@/components/ui/button"
import { fileTools, type ToolId } from "@/features/file-tools/data/file-tools"
import { canConvert } from "@/features/file-tools/lib/convert"
import {
  addFiles,
  downloadPdf,
  extOf,
  formatBytes,
  outputName,
} from "@/features/file-tools/lib/files"

interface Result {
  bytes: Uint8Array
  name: string
  before: number
}

function acceptsFile(id: ToolId, file: File) {
  if (id === "convert") return canConvert(file)
  return fileTools[id].accept.split(",").includes(`.${extOf(file.name)}`)
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

export function FileTools({ toolId }: { toolId: ToolId }) {
  const fileInput = useRef<HTMLInputElement>(null)
  const fileLabelId = useId()
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  const tool = fileTools[toolId]

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
        await runTool(toolId, files, (done, total) =>
          setProgress(`Memproses ${done} dari ${total}…`)
        )
      )
      notify.success("File berhasil diproses. Hasilnya siap diunduh.")
    } catch (err) {
      setError(notify.error(err, "File tidak bisa diproses. Coba lagi."))
    } finally {
      setBusy(false)
      setProgress(null)
    }
  }

  const fileLabel =
    files.length === 0
      ? tool.accept
          .split(",")
          .filter((value) => value.startsWith("."))
          .join(", ")
      : files.length === 1
        ? files[0].name
        : `${files.length} file dipilih`

  return (
    <>
      {toolId === "word" && (
        <p className="text-sm text-subtle">
          PDF mengikuti tampilan dokumen Word. Teks di PDF hasil konversi tidak
          dapat diseleksi.
        </p>
      )}
      <UploadPanel
        hint={fileLabel}
        hintId={fileLabelId}
        busy={busy}
        onPick={() => fileInput.current?.click()}
      />
      <input
        key={toolId}
        ref={fileInput}
        type="file"
        accept={tool.accept}
        multiple={tool.multiple}
        hidden
        disabled={busy}
        onChange={(event) => {
          const picked = addFiles(files, [...(event.target.files ?? [])], {
            multiple: tool.multiple,
            accepts: (file) => acceptsFile(toolId, file),
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
              {tool.multiple && (
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

      {toolId === "kompres" && files.length > 0 && (
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
          size="pill-lg"
          className="w-full sm:w-auto sm:self-end sm:px-8"
          disabled={busy}
          onClick={process}
        >
          {busy && <Loader2 className="animate-spin" aria-hidden />}
          {busy ? progress : toolId === "merge" ? "Gabungkan PDF" : tool.title}
        </Button>
      )}

      {result && (
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="truncate text-base font-semibold tracking-[-0.02em]">
              {result.name}
            </span>
            <span className="text-sm tracking-[-0.02em] text-subtle">
              {toolId === "kompres"
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
            size="pill-lg"
            className="px-8"
            onClick={() => {
              try {
                downloadPdf(result.bytes, result.name)
                notify.success("Unduhan dimulai.")
              } catch (error) {
                setError(
                  notify.error(
                    error,
                    "Unduhan belum dapat dimulai. Silakan coba lagi."
                  )
                )
              }
            }}
          >
            <Download aria-hidden /> Unduh PDF
          </Button>
        </div>
      )}
    </>
  )
}
