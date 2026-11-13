"use client"
import { Camera, ScanLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UploadPanel } from "../upload-panel"
import { useEffect, useRef, useState } from "react"
import {
  imageCanvas,
  canvasBytes,
  freeCanvas,
} from "@/features/file-tools/lib/image"
import { downloadPdf } from "@/features/file-tools/lib/files"
import { CameraCapture } from "./camera-capture"
type Scan = { id: string; file: File; url: string; rotation: number }
export function Scanner() {
  const [pages, setPages] = useState<Scan[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [grayscale, setGrayscale] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [complete, setComplete] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const gallery = useRef<HTMLInputElement>(null)
  const urls = useRef(new Set<string>())
  useEffect(() => {
    const current = urls.current
    return () => current.forEach((url) => URL.revokeObjectURL(url))
  }, [])
  function add(files: FileList | File[] | null) {
    if (!files || busy) return
    const incoming = Array.from(files)
    if (
      pages.length + incoming.length > 20 ||
      incoming.some(
        (f) =>
          !["image/jpeg", "image/png", "image/webp"].includes(f.type) ||
          f.size > 20 * 1024 * 1024
      )
    ) {
      setError(
        "Pilih JPG, PNG, atau WebP, maksimal 20 MB per gambar dan 20 halaman."
      )
      return
    }
    setError("")
    setComplete(false)
    setPages((prev) => [
      ...prev,
      ...incoming.map((file) => {
        const url = URL.createObjectURL(file)
        urls.current.add(url)
        return { id: crypto.randomUUID(), file, url, rotation: 0 }
      }),
    ])
  }
  function move(index: number, step: number) {
    setComplete(false)
    setPages((prev) => {
      const next = [...prev]
      ;[next[index], next[index + step]] = [next[index + step], next[index]]
      return next
    })
  }
  async function download() {
    setBusy(true)
    setError("")
    setProgress(0)
    setComplete(false)
    try {
      const { PDFDocument } = await import("pdf-lib")
      const pdf = await PDFDocument.create()
      for (const scan of pages) {
        const canvas = await imageCanvas(scan.file, scan.rotation, grayscale)
        let image
        try {
          image = await pdf.embedJpg(await canvasBytes(canvas))
        } finally {
          freeCanvas(canvas)
        }
        const page = pdf.addPage([595.28, 841.89])
        const ratio = Math.min(555.28 / image.width, 801.89 / image.height)
        page.drawImage(image, {
          x: (595.28 - image.width * ratio) / 2,
          y: (841.89 - image.height * ratio) / 2,
          width: image.width * ratio,
          height: image.height * ratio,
        })
        setProgress((value) => value + 1)
      }
      downloadPdf(
        await pdf.save({ useObjectStreams: true }),
        "scan-dokumen.pdf"
      )
      setComplete(true)
    } catch {
      setError(
        "Gambar tidak dapat diproses. Coba gunakan gambar lain atau kurangi jumlah halaman."
      )
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="space-y-5">
      <fieldset disabled={busy} className="space-y-5 disabled:opacity-60">
        <input
          ref={gallery}
          aria-label="Pilih gambar dokumen"
          className="sr-only"
          tabIndex={-1}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => {
            add(e.target.files)
            e.target.value = ""
          }}
        />
        <UploadPanel
          icon={ScanLine}
          hint="JPG, PNG, WebP · Maks. 20 MB per gambar · 20 halaman"
          onPick={() => gallery.current?.click()}
          busy={busy}
          onDragOver={(event) => {
            event.preventDefault()
            if (!busy) setDragging(true)
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node))
              setDragging(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            add(event.dataTransfer.files)
          }}
          className={dragging ? "border-primary bg-primary/10" : undefined}
        >
          <Button
            type="button"
            variant="outline"
            size="pill"
            className="border-line"
            disabled={busy || pages.length >= 20}
            onClick={() => setCameraOpen(true)}
          >
            <Camera aria-hidden />
            Ambil foto
          </Button>
        </UploadPanel>
        {pages.length > 0 && (
          <section aria-label="Halaman dokumen">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">
                Halaman dokumen{" "}
                <span className="ml-1 rounded-full bg-neutral-100 px-2 py-1 text-xs text-black/65">
                  {pages.length}/20
                </span>
              </h2>
              <span className="text-xs text-black/65">
                Urutan mengikuti PDF
              </span>
            </div>
            <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {pages.map((p, i) => (
                <li
                  key={p.id}
                  className="overflow-hidden rounded-xl border border-line bg-white"
                >
                  <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-neutral-100 p-5">
                    <span className="absolute top-2 left-2 z-10 grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-semibold shadow-sm">
                      {i + 1}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.url}
                      alt={`Halaman ${i + 1}`}
                      className="h-full w-full object-contain"
                      style={{
                        transform: `rotate(${p.rotation}deg)`,
                        filter: grayscale
                          ? "grayscale(1) contrast(1.15)"
                          : undefined,
                      }}
                    />
                  </div>
                  <div className="p-2">
                    <p
                      title={p.file.name}
                      className="truncate px-1 text-xs text-black/65"
                    >
                      {p.file.name}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={() => move(i, -1)}
                        className="rounded p-2 hover:bg-neutral-100 disabled:opacity-25"
                        aria-label={`Naikkan halaman ${i + 1}`}
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        disabled={i === pages.length - 1}
                        onClick={() => move(i, 1)}
                        className="rounded p-2 hover:bg-neutral-100 disabled:opacity-25"
                        aria-label={`Turunkan halaman ${i + 1}`}
                      >
                        →
                      </button>
                      <button
                        type="button"
                        aria-label={`Putar halaman ${i + 1}`}
                        title="Putar 90°"
                        className="rounded p-2 hover:bg-neutral-100"
                        onClick={() => {
                          setComplete(false)
                          setPages((prev) =>
                            prev.map((s) =>
                              s.id === p.id
                                ? { ...s, rotation: (s.rotation + 90) % 360 }
                                : s
                            )
                          )
                        }}
                      >
                        ↻
                      </button>
                      <button
                        type="button"
                        aria-label={`Hapus halaman ${i + 1}`}
                        title="Hapus halaman"
                        className="rounded p-2 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setComplete(false)
                          URL.revokeObjectURL(p.url)
                          urls.current.delete(p.url)
                          setPages((prev) => prev.filter((s) => s.id !== p.id))
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}
        <div className="rounded-2xl border border-line bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Tampilan hasil</h2>
            <span className="text-xs text-black/65">Ukuran A4</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                value: false,
                title: "Warna asli",
                description: "Pertahankan warna foto",
              },
              {
                value: true,
                title: "Hitam putih",
                description: "Kontras teks lebih jelas",
              },
            ].map((option) => (
              <label
                key={option.title}
                className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 ${grayscale === option.value ? "border-primary bg-primary/10" : "border-neutral-200"}`}
              >
                <input
                  type="radio"
                  name="scan-color"
                  className="mt-1 accent-primary"
                  checked={grayscale === option.value}
                  onChange={() => {
                    setGrayscale(option.value)
                    setComplete(false)
                  }}
                />
                <span>
                  <span className="block text-sm font-medium">
                    {option.title}
                  </span>
                  <span className="mt-1 block text-xs text-black/65">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </fieldset>
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <Button
        type="button"
        size="pill-lg"
        disabled={busy || !pages.length}
        onClick={download}
        className="w-full"
      >
        {busy
          ? `Memproses ${progress}/${pages.length} halaman…`
          : pages.length
            ? `Buat & unduh PDF · ${pages.length} halaman`
            : "Tambahkan foto untuk membuat PDF"}
      </Button>
      <p role="status" className="text-center text-xs text-black/65">
        {complete
          ? "PDF berhasil dibuat. Unduhan sudah dimulai."
          : "Diproses di perangkatmu. Foto tidak diunggah ke server."}
      </p>
      {cameraOpen && (
        <CameraCapture
          onClose={() => setCameraOpen(false)}
          onCapture={(file) => {
            add([file])
            setCameraOpen(false)
          }}
        />
      )}
    </div>
  )
}
