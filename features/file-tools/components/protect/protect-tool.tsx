"use client"
import { FileLock2 } from "lucide-react"
import { UploadPanel } from "../upload-panel"
import { Button } from "@/components/ui/button"
import { loadPdfjs } from "@/features/file-tools/lib/pdf"
import { useEffect, useRef, useState } from "react"
import {
  downloadPdf,
  outputName,
  formatBytes,
} from "@/features/file-tools/lib/files"
export function ProtectTool() {
  const [file, setFile] = useState<File | null>(null),
    [password, setPassword] = useState(""),
    [repeat, setRepeat] = useState(""),
    [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [result, setResult] = useState<Uint8Array | null>(null),
    [pages, setPages] = useState(0)
  const canvas = useRef<HTMLCanvasElement>(null)
  const picker = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!file) return
    let stopped = false
    let loading: import("pdfjs-dist").PDFDocumentLoadingTask | undefined
    ;(async () => {
      try {
        const [{ pdfjs, options }, data] = await Promise.all([
          loadPdfjs(),
          file.arrayBuffer(),
        ])
        if (stopped) return
        loading = pdfjs.getDocument({ data, ...options })
        loading.onPassword = () => {
          if (stopped) return
          stopped = true
          setError("PDF sudah terkunci. Pilih PDF tanpa password.")
          setFile(null)
          void loading?.destroy()
        }
        const doc = await loading.promise
        if (stopped) return
        setPages(doc.numPages)
        const page = await doc.getPage(1),
          base = page.getViewport({ scale: 1 }),
          viewport = page.getViewport({ scale: 420 / base.width })
        const c = canvas.current
        if (!c || stopped) return
        c.width = viewport.width
        c.height = viewport.height
        await page.render({
          canvas: c,
          canvasContext: c.getContext("2d")!,
          viewport,
        }).promise
      } catch {
        if (!stopped) {
          setError("PDF tidak dapat dibaca. Pilih PDF tanpa password.")
          setFile(null)
        }
      }
    })()
    return () => {
      stopped = true
      if (loading && !loading.destroyed) void loading.destroy()
    }
  }, [file])
  function pick(f?: File) {
    if (!f) return
    setError("")
    if (f.size > 20 * 1024 * 1024 || !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Pilih PDF maksimal 20 MB.")
      return
    }
    setResult(null)
    setPages(0)
    setPassword("")
    setRepeat("")
    setShow(false)
    setFile(f)
  }
  async function save() {
    if (!file) return
    setError("")
    if (password !== repeat) {
      setError("Konfirmasi password belum sama.")
      return
    }
    setBusy(true)
    try {
      const { protectPdf } = await import("@/features/file-tools/lib/protect")
      const bytes = await protectPdf(file, password)
      setResult(bytes)
      downloadPdf(bytes, outputName(file.name, "protected"))
      setPassword("")
      setRepeat("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal melindungi PDF.")
    } finally {
      setBusy(false)
    }
  }
  return (
    <>
      <input
        ref={picker}
        hidden
        type="file"
        accept=".pdf,application/pdf"
        disabled={busy}
        onChange={(event) => {
          pick(event.currentTarget.files?.[0])
          event.currentTarget.value = ""
        }}
      />
      {!file ? (
        <>
          <UploadPanel
            icon={FileLock2}
            hint="PDF · Maks. 20 MB"
            onPick={() => picker.current?.click()}
          />
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
        </>
      ) : (
        <div className="grid overflow-hidden rounded-2xl border border-line bg-surface lg:grid-cols-[minmax(0,1fr)_390px]">
          <section className="flex flex-col items-center justify-start gap-5 p-6 sm:p-8">
            <div className="w-full max-w-xs rounded-2xl border border-line bg-white p-4">
              <canvas
                ref={canvas}
                className="h-auto w-full border border-line"
              />
              <p className="mt-4 truncate text-sm font-medium">{file.name}</p>
              <p className="mt-1 text-xs text-subtle">
                {pages} halaman · {formatBytes(file.size)}
              </p>
            </div>
            <Button
              type="button"
              size="pill"
              disabled={busy}
              onClick={() => picker.current?.click()}
            >
              Ganti PDF
            </Button>
          </section>
          <aside className="flex flex-col border-t border-line bg-white p-6 sm:p-8 lg:border-t-0 lg:border-l">
            <h2 className="border-b border-line pb-6 text-2xl font-semibold">
              Kata sandi PDF
            </h2>
            <p className="my-6 text-sm">
              Atur password untuk melindungi file PDF.
            </p>
            <fieldset disabled={busy} className="space-y-5">
              {(
                [
                  ["Password", password, setPassword],
                  ["Ulangi password", repeat, setRepeat],
                ] as const
              ).map(([label, value, set]) => (
                <label key={label} className="block text-sm font-medium">
                  {label}
                  <input
                    autoComplete="new-password"
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => {
                      set(e.target.value)
                      setResult(null)
                    }}
                    placeholder={label}
                    className="mt-2 w-full rounded-xl border border-neutral-300 p-3"
                  />
                </label>
              ))}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={show}
                  onChange={(e) => setShow(e.target.checked)}
                />
                Tampilkan password
              </label>
            </fieldset>
            <p className="mt-5 text-xs leading-5 text-black/65">
              Simpan password dengan baik. Password diperlukan setiap kali
              membuka PDF hasilnya.
            </p>
            {error && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {error}
              </p>
            )}
            <div className="mt-auto pt-10">
              <Button
                type="button"
                size="pill-lg"
                disabled={busy || !file || !pages || !password || !repeat}
                onClick={save}
                className="w-full"
              >
                {busy ? "Melindungi PDF…" : "Protect PDF"}
              </Button>
              {result && (
                <div
                  role="status"
                  className="mt-4 rounded-xl bg-primary/10 p-4 text-sm text-primary"
                >
                  PDF berhasil dilindungi.
                  <button
                    className="mt-2 block underline"
                    onClick={() =>
                      downloadPdf(result, outputName(file!.name, "protected"))
                    }
                  >
                    Unduh hasil lagi
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
