"use client"
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react"
export function CameraCapture({
  onClose,
  onCapture,
}: {
  onClose: () => void
  onCapture: (file: File) => void
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    video = useRef<HTMLVideoElement>(null),
    stream = useRef<MediaStream | null>(null)
  const [facing, setFacing] = useState<"environment" | "user">("environment"),
    [ready, setReady] = useState(false),
    [error, setError] = useState(""),
    [shot, setShot] = useState<{ file: File; url: string } | null>(null),
    [capturing, setCapturing] = useState(false)
  useEffect(() => {
    dialog.current?.showModal()
  }, [])
  useEffect(() => {
    if (!shot) return
    return () => URL.revokeObjectURL(shot.url)
  }, [shot])
  useEffect(() => {
    let cancelled = false
    const stop = () => {
      stream.current?.getTracks().forEach((track) => track.stop())
      stream.current = null
    }
    async function start() {
      if (shot) return
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(
          "Kamera memerlukan koneksi HTTPS dan browser yang mendukung akses kamera."
        )
        return
      }
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1920 },
            height: { ideal: 1440 },
          },
          audio: false,
        })
        if (cancelled) {
          media.getTracks().forEach((t) => t.stop())
          return
        }
        stream.current = media
        const v = video.current
        if (!v) {
          stop()
          return
        }
        v.srcObject = media
        await v.play()
        if (!cancelled) setReady(true)
      } catch (e) {
        if (cancelled) return
        stop()
        const name = e instanceof DOMException ? e.name : ""
        setError(
          name === "NotAllowedError"
            ? "Izin kamera belum diberikan. Izinkan akses kamera di pengaturan browser, lalu coba lagi."
            : name === "NotFoundError"
              ? "Kamera tidak ditemukan pada perangkat ini."
              : "Kamera tidak dapat dibuka. Tutup aplikasi lain yang memakai kamera, lalu coba lagi."
        )
      }
    }
    const hidden = () => {
      if (document.hidden) {
        cancelled = true
        stop()
        setReady(false)
        setError(
          "Kamera dihentikan saat halaman tidak aktif. Tutup dan buka kembali kamera untuk melanjutkan."
        )
      }
    }
    void start()
    if (!shot) document.addEventListener("visibilitychange", hidden)
    return () => {
      cancelled = true
      stop()
      document.removeEventListener("visibilitychange", hidden)
    }
  }, [facing, shot])
  async function capture() {
    const v = video.current
    if (!v || !v.videoWidth || !ready || capturing) return
    setCapturing(true)
    setError("")
    const c = document.createElement("canvas")
    const scale = Math.min(1, 2400 / Math.max(v.videoWidth, v.videoHeight))
    c.width = Math.round(v.videoWidth * scale)
    c.height = Math.round(v.videoHeight * scale)
    try {
      const ctx = c.getContext("2d")
      if (!ctx) throw Error()
      ctx.drawImage(v, 0, 0, c.width, c.height)
      const blob = await new Promise<Blob>((resolve, reject) =>
        c.toBlob((b) => (b ? resolve(b) : reject(Error())), "image/jpeg", 0.94)
      )
      const file = new File([blob], `foto-dokumen-${Date.now()}.jpg`, {
        type: "image/jpeg",
      })
      setReady(false)
      setShot({ file, url: URL.createObjectURL(blob) })
    } catch {
      setError("Foto gagal diambil. Coba lagi.")
    } finally {
      c.width = 0
      c.height = 0
      setCapturing(false)
    }
  }
  return (
    <dialog
      ref={dialog}
      onCancel={onClose}
      className="m-auto w-[min(760px,96vw)] overflow-hidden rounded-2xl bg-white p-0 shadow-xl backdrop:bg-black/60"
    >
      <div className="flex items-center justify-between border-b border-line p-4">
        <h2 className="font-semibold">
          {shot ? "Periksa foto dokumen" : "Ambil foto dokumen"}
        </h2>
        <button
          type="button"
          aria-label="Tutup kamera"
          onClick={onClose}
          className="rounded-lg px-3 py-2 text-xl"
        >
          ×
        </button>
      </div>
      <div className="relative flex min-h-64 items-center justify-center bg-neutral-950">
        {shot ? (
          <img
            src={shot.url}
            alt="Foto dokumen yang baru diambil"
            className="max-h-[60vh] w-full object-contain"
          />
        ) : (
          <>
            <video
              ref={video}
              autoPlay
              playsInline
              muted
              aria-label="Preview kamera"
              className="max-h-[60vh] w-full object-contain"
            />
            {!ready && (
              <p className="absolute p-6 text-center text-sm text-white">
                {error ? "Kamera belum tersedia" : "Membuka kamera…"}
              </p>
            )}
          </>
        )}
      </div>
      {error && (
        <p role="alert" className="p-4 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="p-4">
        <p className="mb-4 text-center text-sm text-black/65">
          {shot
            ? "Pastikan seluruh isi dokumen terlihat jelas."
            : "Posisikan dokumen di tempat terang dan pastikan seluruh tepinya terlihat."}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {shot ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setError("")
                  setShot(null)
                }}
                className="rounded-xl border border-line px-5 py-3"
              >
                Foto ulang
              </button>
              <button
                type="button"
                onClick={() => onCapture(shot.file)}
                className="rounded-xl bg-primary px-5 py-3 font-semibold text-white"
              >
                Gunakan foto
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled={capturing}
                onClick={() => {
                  setReady(false)
                  setError("")
                  setFacing((f) =>
                    f === "environment" ? "user" : "environment"
                  )
                }}
                className="rounded-xl border border-line px-5 py-3"
              >
                Ganti kamera
              </button>
              <button
                type="button"
                disabled={!ready || capturing}
                onClick={capture}
                className="rounded-xl bg-primary px-8 py-3 font-semibold text-white disabled:opacity-40"
              >
                {capturing ? "Mengambil foto…" : "Jepret foto"}
              </button>
            </>
          )}
        </div>
      </div>
    </dialog>
  )
}
