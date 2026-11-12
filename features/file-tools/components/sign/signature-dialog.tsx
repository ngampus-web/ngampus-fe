"use client"
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react"
import { trimSignature } from "@/features/file-tools/lib/image"
export type MarkKind =
  "Tanda tangan" | "Inisial" | "Stempel" | "Nama" | "Tanggal" | "Teks"
export type MarkAsset = { src: string; ratio: number; kind: MarkKind }
export function SignatureDialog({
  kind,
  onClose,
  onApply,
}: {
  kind: MarkKind
  onClose: () => void
  onApply: (asset: MarkAsset) => void
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    canvas = useRef<HTMLCanvasElement>(null),
    drawing = useRef(false)
  const [mode, setMode] = useState(kind === "Stempel" ? "upload" : "type"),
    [name, setName] = useState(""),
    [initials, setInitials] = useState(""),
    [color, setColor] = useState("#242424"),
    [upload, setUpload] = useState(""),
    [error, setError] = useState("")
  useEffect(() => {
    dialog.current?.showModal()
  }, [])
  const text =
    kind === "Inisial"
      ? initials
      : kind === "Tanggal"
        ? new Date().toLocaleDateString("id-ID")
        : name
  function apply() {
    try {
      if (mode === "upload") {
        if (!upload) throw Error("Pilih gambar terlebih dahulu.")
        const image = new Image()
        image.onload = () =>
          onApply({ src: upload, ratio: image.width / image.height, kind })
        image.src = upload
        return
      }
      const c =
        mode === "draw" ? canvas.current! : document.createElement("canvas")
      if (mode === "type") {
        if (!text.trim()) throw Error("Isi teks terlebih dahulu.")
        c.width = 1600
        c.height = 240
        const ctx = c.getContext("2d")!
        ctx.fillStyle = color
        ctx.font =
          kind === "Tanda tangan" || kind === "Inisial"
            ? "italic 90px cursive"
            : "64px Arial"
        ctx.fillText(text.trim(), 20, 150, 1560)
      }
      const cropped = trimSignature(c)
      onApply({
        src: cropped.toDataURL("image/png"),
        ratio: cropped.width / cropped.height,
        kind,
      })
      cropped.width = 0
      c.width = mode === "draw" ? 600 : 0
    } catch (e) {
      setError(e instanceof Error ? e.message : "Tanda tangan belum siap.")
    }
  }
  return (
    <dialog
      ref={dialog}
      onCancel={onClose}
      className="m-auto w-[min(900px,94vw)] rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-black/40"
    >
      <div className="flex items-center justify-between border-b border-line p-6">
        <h2 className="text-2xl font-semibold">Atur {kind.toLowerCase()}</h2>
        <button
          aria-label="Tutup dialog"
          onClick={onClose}
          className="rounded-lg px-3 py-2 text-xl"
        >
          ×
        </button>
      </div>
      <div className="space-y-6 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <label className="space-y-2 text-sm font-medium">
            {kind === "Teks" ? "Teks" : "Nama lengkap"}
            <input
              autoFocus
              maxLength={120}
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setInitials(
                  e.target.value
                    .trim()
                    .split(/\s+/)
                    .map((s) => s[0])
                    .join("")
                    .slice(0, 6)
                )
              }}
              placeholder="Nama kamu"
              className="mt-2 w-full rounded-lg border border-neutral-300 p-3"
            />
          </label>
          <label className="text-sm font-medium">
            Inisial
            <input
              maxLength={8}
              value={initials}
              onChange={(e) => setInitials(e.target.value)}
              placeholder="Inisial"
              className="mt-2 w-full rounded-lg border border-neutral-300 p-3"
            />
          </label>
        </div>
        <div className="flex gap-2 border-b border-line pb-3">
          {[
            ["type", "Ketik"],
            ["draw", "Gambar"],
            ["upload", "Unggah gambar"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => {
                setMode(value)
                setError("")
              }}
              aria-pressed={mode === value}
              className={`rounded-lg px-4 py-2 ${mode === value ? "bg-primary text-white" : "bg-neutral-100"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex min-h-48 items-center justify-center rounded-xl bg-neutral-50 p-4">
          {mode === "type" ? (
            <p
              style={{
                color,
                fontFamily:
                  kind === "Tanda tangan" || kind === "Inisial"
                    ? "cursive"
                    : "inherit",
                fontStyle: kind === "Tanda tangan" ? "italic" : "normal",
              }}
              className="text-4xl break-all"
            >
              {text || "Pratinjau " + kind.toLowerCase()}
            </p>
          ) : mode === "upload" ? (
            <label className="text-center">
              {upload && (
                <img
                  src={upload}
                  alt="Gambar yang diunggah"
                  className="mx-auto mb-4 max-h-32 max-w-full"
                />
              )}
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={async (e) => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  if (f.size > 5 * 1024 * 1024) {
                    setError("Maksimal 5 MB.")
                    return
                  }
                  try {
                    const { imageCanvas } =
                      await import("@/features/file-tools/lib/image")
                    const c = await imageCanvas(f)
                    setUpload(c.toDataURL("image/png"))
                    c.width = 0
                    setError("")
                  } catch {
                    setError("Gambar tidak dapat dibaca.")
                  }
                }}
              />
            </label>
          ) : (
            <div className="w-full">
              <canvas
                ref={canvas}
                width={600}
                height={200}
                aria-label="Gambar tanda tangan"
                className="w-full touch-none rounded border border-dashed border-neutral-300"
                onPointerDown={(e) => {
                  drawing.current = true
                  e.currentTarget.setPointerCapture(e.pointerId)
                  const c = e.currentTarget,
                    r = c.getBoundingClientRect(),
                    ctx = c.getContext("2d")!
                  ctx.beginPath()
                  ctx.moveTo(
                    ((e.clientX - r.left) * 600) / r.width,
                    ((e.clientY - r.top) * 200) / r.height
                  )
                  ctx.strokeStyle = color
                  ctx.lineWidth = 3
                  ctx.lineCap = "round"
                }}
                onPointerMove={(e) => {
                  if (!drawing.current) return
                  const c = e.currentTarget,
                    r = c.getBoundingClientRect(),
                    ctx = c.getContext("2d")!
                  ctx.lineTo(
                    ((e.clientX - r.left) * 600) / r.width,
                    ((e.clientY - r.top) * 200) / r.height
                  )
                  ctx.stroke()
                }}
                onPointerUp={() => (drawing.current = false)}
                onPointerCancel={() => (drawing.current = false)}
              />
              <button
                onClick={() =>
                  canvas.current?.getContext("2d")?.clearRect(0, 0, 600, 200)
                }
                className="mt-2 text-sm underline"
              >
                Bersihkan
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm">
          Warna
          {[
            ["#242424", "Hitam"],
            ["#dc2626", "Merah"],
            ["#2563eb", "Biru"],
            ["#16a34a", "Hijau"],
          ].map(([value, label]) => (
            <button
              key={value}
              aria-label={label}
              aria-pressed={color === value}
              onClick={() => setColor(value)}
              style={{ backgroundColor: value }}
              className={`h-6 w-6 rounded-full ${color === value ? "ring-2 ring-neutral-400 ring-offset-2" : ""}`}
            />
          ))}
        </div>
        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}
      </div>
      <div className="flex justify-end gap-3 border-t border-line p-5">
        <button
          onClick={onClose}
          className="rounded-xl border border-line px-5 py-3"
        >
          Batal
        </button>
        <button
          onClick={apply}
          className="rounded-xl bg-primary px-8 py-3 font-semibold text-white"
        >
          Terapkan
        </button>
      </div>
    </dialog>
  )
}
