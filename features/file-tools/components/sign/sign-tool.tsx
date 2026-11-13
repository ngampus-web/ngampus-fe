"use client"
/* eslint-disable @next/next/no-img-element */
import { Signature } from "lucide-react"
import { UploadPanel } from "../upload-panel"
import { Button } from "@/components/ui/button"
import { loadPdfjs, loadPdf } from "@/features/file-tools/lib/pdf"
import { useEffect, useRef, useState } from "react"
import type { PDFDocumentProxy } from "pdfjs-dist"
import { signaturePlacement } from "@/features/file-tools/lib/signature"
import { downloadPdf, outputName } from "@/features/file-tools/lib/files"
import {
  SignatureDialog,
  type MarkAsset,
  type MarkKind,
} from "./signature-dialog"
type Mark = MarkAsset & {
  id: string
  page: number
  x: number
  y: number
  width: number
}
function PdfCanvas({
  doc,
  page,
  thumbnail = false,
  onSize,
}: {
  doc: PDFDocumentProxy
  page: number
  thumbnail?: boolean
  onSize?: (ratio: number) => void
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    let cancelled = false
    let task:
      ReturnType<import("pdfjs-dist").PDFPageProxy["render"]> | undefined
    ;(async () => {
      try {
        const p = await doc.getPage(page)
        if (cancelled) return
        const base = p.getViewport({ scale: 1 })
        onSize?.(base.width / base.height)
        const viewport = p.getViewport({
          scale: (thumbnail ? 120 : 1400) / Math.max(base.width, base.height),
        })
        const c = ref.current
        if (!c) return
        c.width = viewport.width
        c.height = viewport.height
        task = p.render({
          canvas: c,
          canvasContext: c.getContext("2d")!,
          viewport,
        })
        await task.promise
      } catch (e) {
        if (!cancelled) console.error(e)
      }
    })()
    return () => {
      cancelled = true
      task?.cancel()
    }
  }, [doc, page, thumbnail, onSize])
  return <canvas ref={ref} className="block h-auto w-full" />
}
export function SignTool() {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null),
    [file, setFile] = useState<File | null>(null),
    [page, setPage] = useState(1),
    [marks, setMarks] = useState<Mark[]>([]),
    [selected, setSelected] = useState(""),
    [dialog, setDialog] = useState<MarkKind | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [result, setResult] = useState<Uint8Array | null>(null),
    [ratio, setRatio] = useState(1),
    [zoom, setZoom] = useState(100)
  const picker = useRef<HTMLInputElement>(null)
  const surface = useRef<HTMLDivElement>(null),
    operation = useRef(0),
    drag = useRef<{
      id: string
      clientX: number
      clientY: number
      x: number
      y: number
      width: number
      resize: boolean
    } | null>(null)
  useEffect(
    () => () => {
      void doc?.loadingTask.destroy()
    },
    [doc]
  )
  useEffect(
    () => () => {
      operation.current++
    },
    []
  )
  async function load(f?: File) {
    if (!f) return
    setError("")
    if (f.size > 20 * 1024 * 1024 || !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Pilih PDF maksimal 20 MB.")
      return
    }
    const token = ++operation.current
    setBusy(true)
    let loading: import("pdfjs-dist").PDFDocumentLoadingTask | undefined
    try {
      const [{ pdfjs, options }, data] = await Promise.all([
        loadPdfjs(),
        f.arrayBuffer(),
      ])
      if (token !== operation.current) return
      const task = pdfjs.getDocument({ data, ...options })
      loading = task
      task.onPassword = () => {
        void task.destroy()
      }
      const loaded = await task.promise
      if (loaded.numPages > 100) {
        throw Error("Maksimal 100 halaman.")
      }
      if (token !== operation.current) {
        await loaded.loadingTask.destroy()
        return
      }
      setDoc(loaded)
      setFile(f)
      setPage(1)
      setMarks([])
      setSelected("")
      setResult(null)
    } catch {
      if (loading && !loading.destroyed) await loading.destroy()
      if (token !== operation.current) return
      setError(
        "PDF tidak dapat dibaca. Pilih PDF tanpa password, maksimal 100 halaman."
      )
    } finally {
      if (token === operation.current) setBusy(false)
    }
  }
  function update(id: string, change: Partial<Mark>) {
    setMarks((old) => old.map((m) => (m.id === id ? { ...m, ...change } : m)))
    setResult(null)
  }
  function add(asset: MarkAsset) {
    const id = crypto.randomUUID()
    setMarks((old) => [
      ...old,
      {
        ...asset,
        id,
        page,
        x: 50,
        y: 60,
        width: Math.min(25, (80 * asset.ratio) / ratio),
      },
    ])
    setSelected(id)
    setDialog(null)
    setResult(null)
  }
  function remove() {
    setMarks((old) => old.filter((m) => m.id !== selected))
    setSelected("")
    setResult(null)
  }
  async function save() {
    if (!file || !marks.length) return
    setBusy(true)
    setError("")
    try {
      const pdf = await loadPdf(
        new Uint8Array(await file.arrayBuffer()),
        file.name
      )
      for (const m of marks) {
        const img = await pdf.embedPng(m.src)
        const target = pdf.getPage(m.page - 1)
        target.drawImage(
          img,
          signaturePlacement(target, m.ratio, m.width, m.x, m.y)
        )
      }
      const bytes = await pdf.save()
      setResult(bytes)
      downloadPdf(bytes, outputName(file.name, "signed"))
    } catch {
      setError("Gagal menyimpan PDF. Coba file tanpa password.")
    } finally {
      setBusy(false)
    }
  }
  const active = marks.find((m) => m.id === selected)
  return (
    <>
      {!doc ? (
        <>
          <UploadPanel
            icon={Signature}
            hint="PDF · Maks. 20 MB"
            label={busy ? "Membuka dokumen…" : "Pilih file"}
            busy={busy}
            onPick={() => picker.current?.click()}
          />
          <input
            ref={picker}
            hidden
            type="file"
            accept=".pdf,application/pdf"
            disabled={busy}
            onChange={(e) => {
              void load(e.currentTarget.files?.[0])
              e.currentTarget.value = ""
            }}
          />
        </>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="flex flex-wrap items-center gap-3 border-b border-line bg-white px-5 py-3">
            <button
              disabled={page === 1 || busy}
              onClick={() => setPage(page - 1)}
              className="rounded border border-line px-3 py-1 disabled:opacity-30"
              aria-label="Halaman sebelumnya"
            >
              ↑
            </button>
            <select
              aria-label="Halaman PDF"
              value={page}
              onChange={(e) => {
                setPage(+e.target.value)
                setSelected("")
              }}
              className="rounded border border-line p-1"
            >
              {Array.from({ length: doc.numPages }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <span className="text-sm text-black/65">/ {doc.numPages}</span>
            <button
              disabled={page === doc.numPages || busy}
              onClick={() => setPage(page + 1)}
              className="rounded border border-line px-3 py-1 disabled:opacity-30"
              aria-label="Halaman berikutnya"
            >
              ↓
            </button>
            <span className="min-w-0 flex-1 truncate text-sm">
              {file?.name}
            </span>
            <select
              aria-label="Zoom"
              value={zoom}
              onChange={(e) => setZoom(+e.target.value)}
              className="rounded border border-line p-2 text-sm"
            >
              {[75, 100, 125, 150].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
            <label className="cursor-pointer text-sm text-primary">
              Ganti PDF
              <input
                disabled={busy}
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={(e) => load(e.target.files?.[0])}
              />
            </label>
          </div>
          <div className="grid lg:grid-cols-[140px_minmax(0,1fr)_320px]">
            <nav
              aria-label="Daftar halaman"
              className="flex gap-4 overflow-auto border-r border-line p-4 lg:max-h-[calc(100vh-130px)] lg:flex-col"
            >
              {Array.from({ length: doc.numPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPage(i + 1)
                    setSelected("")
                  }}
                  className={`w-24 shrink-0 rounded p-1 ${page === i + 1 ? "bg-primary/10 ring-2 ring-primary" : "bg-white"}`}
                  aria-label={`Buka halaman ${i + 1}`}
                  aria-current={page === i + 1 ? "page" : undefined}
                >
                  <PdfCanvas doc={doc} page={i + 1} thumbnail />
                  <span className="mt-2 block text-xs">
                    {i + 1}
                    {marks.some((m) => m.page === i + 1) ? " •" : ""}
                  </span>
                </button>
              ))}
            </nav>
            <section
              aria-label="Editor dokumen"
              className="overflow-auto p-5 sm:p-8 lg:max-h-[calc(100vh-130px)]"
            >
              <div
                style={{ width: `${zoom}%` }}
                className="mx-auto max-w-none min-w-[240px]"
              >
                <div
                  ref={surface}
                  className="relative bg-white shadow-md"
                  onPointerDown={(e) => {
                    if (e.target === e.currentTarget) setSelected("")
                  }}
                >
                  <PdfCanvas doc={doc} page={page} onSize={setRatio} />
                  {marks
                    .filter((m) => m.page === page)
                    .map((m) => {
                      const w = Math.min(m.width, (80 * m.ratio) / ratio),
                        h = (w * ratio) / m.ratio
                      return (
                        <div
                          key={m.id}
                          role="button"
                          tabIndex={0}
                          aria-label={`${m.kind} di halaman ${page}`}
                          aria-pressed={selected === m.id}
                          style={{
                            left: `${((100 - w) * m.x) / 100}%`,
                            top: `${((100 - h) * m.y) / 100}%`,
                            width: `${w}%`,
                            aspectRatio: m.ratio,
                          }}
                          className={`absolute cursor-move touch-none ${selected === m.id ? "outline-2 outline-blue-500" : "hover:outline-1 hover:outline-blue-300"}`}
                          onKeyDown={(e) => {
                            if (e.key === "Delete" || e.key === "Backspace") {
                              e.preventDefault()
                              setMarks((old) =>
                                old.filter((a) => a.id !== m.id)
                              )
                              setResult(null)
                            } else if (e.key.startsWith("Arrow")) {
                              e.preventDefault()
                              update(m.id, {
                                x: Math.max(
                                  0,
                                  Math.min(
                                    100,
                                    m.x +
                                      (e.key === "ArrowRight"
                                        ? 1
                                        : e.key === "ArrowLeft"
                                          ? -1
                                          : 0)
                                  )
                                ),
                                y: Math.max(
                                  0,
                                  Math.min(
                                    100,
                                    m.y +
                                      (e.key === "ArrowDown"
                                        ? 1
                                        : e.key === "ArrowUp"
                                          ? -1
                                          : 0)
                                  )
                                ),
                              })
                            }
                          }}
                          onFocus={() => setSelected(m.id)}
                          onPointerDown={(e) => {
                            if (busy) return
                            e.stopPropagation()
                            setSelected(m.id)
                            e.currentTarget.setPointerCapture(e.pointerId)
                            drag.current = {
                              id: m.id,
                              clientX: e.clientX,
                              clientY: e.clientY,
                              x: m.x,
                              y: m.y,
                              width: w,
                              resize:
                                (e.target as HTMLElement).dataset.resize ===
                                "true",
                            }
                          }}
                          onPointerMove={(e) => {
                            const d = drag.current,
                              r = surface.current?.getBoundingClientRect()
                            if (!d || d.id !== m.id || !r) return
                            if (d.resize)
                              update(m.id, {
                                width: Math.max(
                                  5,
                                  Math.min(
                                    80,
                                    (80 * m.ratio) / ratio,
                                    d.width +
                                      ((e.clientX - d.clientX) / r.width) * 100
                                  )
                                ),
                              })
                            else
                              update(m.id, {
                                x: Math.max(
                                  0,
                                  Math.min(
                                    100,
                                    d.x +
                                      ((e.clientX - d.clientX) /
                                        (r.width * (1 - w / 100))) *
                                        100
                                  )
                                ),
                                y: Math.max(
                                  0,
                                  Math.min(
                                    100,
                                    d.y +
                                      ((e.clientY - d.clientY) /
                                        (r.height * (1 - h / 100))) *
                                        100
                                  )
                                ),
                              })
                          }}
                          onPointerUp={() => (drag.current = null)}
                          onPointerCancel={() => (drag.current = null)}
                        >
                          <img
                            draggable={false}
                            src={m.src}
                            alt={m.kind}
                            className="h-full w-full select-none"
                          />
                          {selected === m.id && (
                            <span
                              data-resize="true"
                              aria-label="Ubah ukuran"
                              className="absolute -right-2 -bottom-2 h-4 w-4 cursor-nwse-resize rounded-full border-2 border-blue-500 bg-white"
                            />
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            </section>
            <aside className="border-l border-line bg-white p-6">
              <h2 className="text-xl font-semibold">Pilihan tanda tangan</h2>
              <p className="mt-2 text-sm text-black/65">
                Tambahkan elemen, lalu geser ke posisi yang diinginkan.
              </p>
              <div className="mt-5 rounded-xl border border-primary bg-primary/10 p-4 text-primary">
                <span className="mr-2 text-2xl">✎</span>Tanda tangan sederhana
              </div>
              <div className="my-6 space-y-3">
                {(
                  [
                    "Tanda tangan",
                    "Inisial",
                    "Nama",
                    "Tanggal",
                    "Teks",
                    "Stempel",
                  ] as MarkKind[]
                ).map((kind, i) => (
                  <button
                    key={kind}
                    disabled={busy}
                    onClick={() => setDialog(kind)}
                    className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 p-3 text-left hover:border-primary hover:bg-primary/10"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded bg-blue-50 font-semibold text-blue-700">
                      {["✎", "AC", "Aa", "▦", "T", "▣"][i]}
                    </span>
                    {kind}
                    <span className="ml-auto text-black/65">+</span>
                  </button>
                ))}
              </div>
              {active && (
                <div className="mb-5 space-y-3 rounded-xl bg-neutral-50 p-3">
                  <p className="text-sm font-medium">{active.kind} dipilih</p>
                  <label className="block text-xs">
                    Ukuran
                    <input
                      aria-label="Ukuran elemen"
                      type="range"
                      min={5}
                      max={Math.min(80, (80 * active.ratio) / ratio)}
                      value={active.width}
                      onChange={(e) =>
                        update(active.id, { width: +e.target.value })
                      }
                      className="mt-2 block w-full"
                    />
                  </label>
                  <div className="flex gap-3 text-sm">
                    <button
                      onClick={() => {
                        const id = crypto.randomUUID()
                        setMarks((old) => [
                          ...old,
                          {
                            ...active,
                            id,
                            x: Math.min(100, active.x + 5),
                            y: Math.min(100, active.y + 5),
                          },
                        ])
                        setSelected(id)
                        setResult(null)
                      }}
                      className="text-primary"
                    >
                      Duplikat
                    </button>
                    <button onClick={remove} className="text-red-600">
                      Hapus
                    </button>
                  </div>
                </div>
              )}
              <Button
                type="button"
                size="pill-lg"
                disabled={busy || !marks.length}
                onClick={save}
                className="w-full"
              >
                {busy ? "Menyimpan…" : "Tanda tangani & unduh"}
              </Button>
              <p className="mt-3 text-xs text-black/65">
                {marks.length} elemen ditambahkan · Tanpa sertifikat digital
              </p>
              {result && (
                <button
                  onClick={() =>
                    downloadPdf(result, outputName(file!.name, "signed"))
                  }
                  className="mt-3 text-sm text-primary underline"
                >
                  Unduh hasil lagi
                </button>
              )}
            </aside>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="mx-auto max-w-xl p-5 text-red-700">
          {error}
        </p>
      )}
      {dialog && (
        <SignatureDialog
          kind={dialog}
          onClose={() => setDialog(null)}
          onApply={add}
        />
      )}
    </>
  )
}
