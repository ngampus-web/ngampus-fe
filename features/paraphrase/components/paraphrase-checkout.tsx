"use client"

import { useId, useRef, useState, type ReactNode } from "react"
import { FileText, Upload, Clock3, MessageCircle } from "lucide-react"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { Button } from "@/components/ui/button"
import type { OrderDraft } from "@/features/payment/types"
import { formatFileSize, rupiah } from "@/features/payment/services/order-rules"
import { paraphraseServices, turnaroundOptions } from "../options"
import type { ParaphraseDetails, ParaphraseKind, Turnaround } from "../types"
import { countDocxWords } from "../services/docx-word-count"
import { validateFile, validateParaphrase } from "../services/validation"

import { calculateParaphrasePrice } from "../services/pricing"
import { PriceBreakdown } from "./price-breakdown"

const inputStyle =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:bg-surface"
function Section({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-3xl border border-line bg-white p-5 md:p-7">
      <h2 className="mb-6 flex items-center gap-3 text-lg font-semibold tracking-tight">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-white">
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}
function FilePicker({
  label,
  extension,
  file,
  onSelect,
}: {
  label: string
  extension: "docx" | "pdf"
  file: File | null
  onSelect: (file: File | null) => void
}) {
  const id = useId()
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-surface p-5 text-center focus-within:ring-2 focus-within:ring-primary hover:border-primary"
      >
        <Upload className="size-5 text-primary" aria-hidden />
        <span className="text-sm font-semibold">{label}</span>
        <span className="max-w-full text-xs leading-5 break-all text-subtle">
          {file
            ? `${file.name} · ${formatFileSize(file.size)}`
            : `${extension.toUpperCase()} · Maksimal 25 MB`}
        </span>
        <span className="text-xs text-primary">
          {file ? "Ganti file" : "Pilih file"}
        </span>
        <input
          id={id}
          type="file"
          className="sr-only"
          accept={
            extension === "docx"
              ? ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              : ".pdf,application/pdf"
          }
          onChange={(e) => {
            const next = e.target.files?.[0]
            if (next) onSelect(next)
            e.target.value = ""
          }}
        />
      </label>
      {file && (
        <button
          type="button"
          className="mt-2 text-xs text-subtle underline"
          onClick={() => onSelect(null)}
        >
          Hapus {label.toLowerCase()}
        </button>
      )}
    </div>
  )
}
export function ParaphraseCheckout({
  onCheckout,
}: {
  onCheckout: (draft: OrderDraft) => Promise<void>
}) {
  const id = useId()
  const [service, setService] = useState<ParaphraseKind>("turnitin")
  const [document, setDocument] = useState<File | null>(null)
  const [wordCount, setWordCount] = useState<number | null>(null)
  const [counting, setCounting] = useState(false)
  const [reports, setReports] = useState<
    Record<"turnitin" | "ai", File | null>
  >({ turnitin: null, ai: null })
  const [scores, setScores] = useState({ turnitin: "", ai: "" })
  const [targets, setTargets] = useState({ turnitin: "10", ai: "10" })
  const [notes, setNotes] = useState("")
  const [language, setLanguage] = useState<"id" | "en">("id")
  const [field, setField] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [turnaround, setTurnaround] = useState<Turnaround>("relaxed")
  const [error, setError] = useState("")
  const [docError, setDocError] = useState("")
  const [busy, setBusy] = useState(false)
  const request = useRef(0)
  const inFlight = useRef(false)
  const reportTypes: ("turnitin" | "ai")[] =
    service === "combined" ? ["turnitin", "ai"] : [service]
  const selectedService = paraphraseServices.find((s) => s.id === service)!
  const selectedTime = turnaroundOptions.find((t) => t.id === turnaround)!
  let price = null
  try {
    price = calculateParaphrasePrice({
      wordCount: wordCount ?? 0,
      service,
      turnaround,
      reports: reportTypes.map((type) => ({
        type,
        initialScore: scores[type].trim() ? Number(scores[type]) : NaN,
        targetScore: targets[type].trim() ? Number(targets[type]) : NaN,
      })),
    })
  } catch {
    /* Incomplete/invalid input has no payable quote. */
  }
  async function selectDocument(next: File | null) {
    const current = ++request.current
    setError("")
    setDocError("")
    setDocument(null)
    setWordCount(null)
    setCounting(false)
    if (!next) return
    try {
      validateFile(next, "docx")
      setDocument(next)
      setCounting(true)
      const count = await countDocxWords(next)
      if (current === request.current) setWordCount(count)
    } catch (e) {
      if (current === request.current)
        setDocError(e instanceof Error ? e.message : "DOCX tidak dapat dibaca.")
    } finally {
      if (current === request.current) setCounting(false)
    }
  }
  function selectReport(type: "turnitin" | "ai", next: File | null) {
    setError("")
    try {
      if (next) validateFile(next, "pdf")
      setReports((prev) => ({ ...prev, [type]: next }))
      setScores((prev) => ({ ...prev, [type]: "" }))
    } catch (e) {
      setError(e instanceof Error ? e.message : "PDF tidak valid.")
    }
  }
  async function submit() {
    if (inFlight.current) return
    setError("")
    if (!document || !wordCount || counting || docError) {
      setError("Pilih DOCX dan tunggu jumlah kata selesai dihitung.")
      return
    }
    if (reportTypes.some((type) => !reports[type])) {
      setError("Lengkapi laporan PDF untuk layanan yang dipilih.")
      return
    }
    const details: ParaphraseDetails = {
      kind: "paraphrase",
      slug: "parafrase-manual",
      title: selectedService.label,
      fileName: document.name,
      fileSize: document.size,
      wordCount,
      service,
      reports: reportTypes.map((type) => ({
        type,
        file: { name: reports[type]!.name, size: reports[type]!.size },
        initialScore: Number(scores[type]),
        targetScore: Number(targets[type]),
      })),
      notes: notes.trim(),
      language,
      field: field.trim(),
      customerName: name.trim(),
      turnaround,
    }
    try {
      validateParaphrase(details)
      inFlight.current = true
      setBusy(true)
      await onCheckout({
        phone,
        amount: calculateParaphrasePrice(details).total,
        details,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Pesanan belum dapat dibuat.")
    } finally {
      inFlight.current = false
      setBusy(false)
    }
  }
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Plagiarisme", href: "/cek-plagiarisme" },
          { label: "Parafrase Manual" },
        ]}
      />
      <article className="mx-auto w-full max-w-[1160px] px-5 py-10 md:px-10 lg:py-14">
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 text-xs font-semibold tracking-widest text-primary uppercase">
            Dikerjakan oleh tim Ngampus
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Parafrase Manual
          </h1>
          <p className="mt-3 text-sm leading-6 text-subtle">
            Ceritakan kebutuhanmu. Kami bantu merapikan tulisan dengan tetap
            menjaga makna dan konteksnya.
          </p>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <form
            id={id}
            className="flex min-w-0 flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault()
              void submit()
            }}
          >
            <fieldset disabled={busy} className="contents">
              <Section number={1} title="Mau Parafrase Apa?">
                <div className="grid gap-3 sm:grid-cols-3">
                  {paraphraseServices.map((option) => (
                    <label
                      key={option.id}
                      className={`cursor-pointer rounded-2xl border p-4 ${service === option.id ? "border-primary bg-orange-50" : "border-line"}`}
                    >
                      <input
                        className="mb-3 accent-primary"
                        type="radio"
                        name={`${id}-service`}
                        value={option.id}
                        checked={service === option.id}
                        onChange={() => {
                          setService(option.id)
                          setError("")
                        }}
                      />
                      <span className="block text-sm font-semibold">
                        {option.label}
                      </span>
                      <span className="mt-2 block text-xs leading-5 text-subtle">
                        {option.description}
                      </span>
                    </label>
                  ))}
                </div>
              </Section>
              <Section number={2} title="Upload File">
                <p className="mb-4 text-sm leading-6 text-subtle">
                  Pilih dokumen asli dalam format DOCX dan laporan hasil
                  pengecekan dalam format PDF.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FilePicker
                    label="Dokumen asli"
                    extension="docx"
                    file={document}
                    onSelect={(next) => {
                      void selectDocument(next)
                    }}
                  />
                  {reportTypes.map((type) => (
                    <FilePicker
                      key={type}
                      label={`Laporan ${type === "ai" ? "AI" : "Turnitin"}`}
                      extension="pdf"
                      file={reports[type]}
                      onSelect={(next) => selectReport(type, next)}
                    />
                  ))}
                </div>
                <div
                  role="status"
                  className="mt-4 flex items-center gap-3 rounded-xl bg-surface px-4 py-3 text-sm"
                >
                  <FileText className="size-4 text-primary" />
                  <span>
                    {counting
                      ? "Menghitung kata…"
                      : wordCount
                        ? `${wordCount.toLocaleString("id-ID")} kata`
                        : "Jumlah kata akan muncul setelah DOCX dipilih."}
                  </span>
                </div>
                {docError && (
                  <p role="alert" className="mt-3 text-sm text-red-600">
                    {docError}
                  </p>
                )}
              </Section>
              <Section number={3} title="Kebutuhan Parafrase">
                <p className="mb-5 text-sm leading-6 text-subtle">
                  Isi skor awal sesuai laporan PDF, lalu tentukan target yang
                  kamu butuhkan. Target minimal 10% dan harus di bawah skor
                  awal.
                </p>
                <div className="space-y-5">
                  {reportTypes.map((type) => (
                    <fieldset key={type}>
                      <legend className="mb-3 text-sm font-semibold">
                        {type === "ai" ? "AI" : "Turnitin"}
                      </legend>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2 text-sm">
                          <span>
                            Skor awal {type === "ai" ? "AI" : "Turnitin"} (%)
                          </span>
                          <input
                            className={inputStyle}
                            type="number"
                            required
                            min="10.01"
                            max="100"
                            step="0.01"
                            placeholder="Contoh: 45"
                            value={scores[type]}
                            onChange={(e) =>
                              setScores((prev) => ({
                                ...prev,
                                [type]: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="space-y-2 text-sm">
                          <span>
                            Target {type === "ai" ? "AI" : "Turnitin"} (%)
                          </span>
                          <input
                            className={inputStyle}
                            type="number"
                            required
                            min="10"
                            max="99.99"
                            step="0.01"
                            value={targets[type]}
                            onChange={(e) =>
                              setTargets((prev) => ({
                                ...prev,
                                [type]: e.target.value,
                              }))
                            }
                          />
                        </label>
                      </div>
                    </fieldset>
                  ))}
                </div>
                <label className="mt-6 block space-y-2 text-sm">
                  <span>
                    Apakah ada note untuk Ngampus?{" "}
                    <span className="text-subtle">(opsional)</span>
                  </span>
                  <textarea
                    className={inputStyle}
                    rows={4}
                    maxLength={2000}
                    placeholder="Contoh: pertahankan istilah teknis dan fokus pada Bab 2."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </label>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span>Bahasa dokumen</span>
                    <select
                      className={inputStyle}
                      value={language}
                      onChange={(e) =>
                        setLanguage(e.target.value as "id" | "en")
                      }
                    >
                      <option value="id">Indonesia</option>
                      <option value="en">Inggris</option>
                    </select>
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>
                      Bidang <span className="text-subtle">(opsional)</span>
                    </span>
                    <input
                      className={inputStyle}
                      maxLength={150}
                      placeholder="Contoh: Ekonomi, Kedokteran"
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                    />
                  </label>
                </div>
              </Section>
              <Section number={4} title="Kontak WhatsApp">
                <p className="mb-4 text-sm leading-6 text-subtle">
                  Hasil parafrase akan dikirimkan melalui WhatsApp kamu.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span>Nama lengkap</span>
                    <input
                      className={inputStyle}
                      required
                      maxLength={100}
                      autoComplete="name"
                      placeholder="Nama lengkap"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>Nomor WhatsApp</span>
                    <input
                      className={inputStyle}
                      required
                      type="tel"
                      autoComplete="tel"
                      placeholder="08xxxxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </label>
                </div>
              </Section>
              <Section number={5} title="Estimasi Pengerjaan">
                <div className="grid gap-3 sm:grid-cols-3">
                  {turnaroundOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`cursor-pointer rounded-2xl border p-4 ${turnaround === option.id ? "border-primary bg-orange-50" : "border-line"}`}
                    >
                      <input
                        className="mb-3 accent-primary"
                        type="radio"
                        name={`${id}-time`}
                        checked={turnaround === option.id}
                        onChange={() => setTurnaround(option.id)}
                      />
                      <span className="block text-sm font-semibold">
                        {option.label}
                      </span>
                      <span className="mt-2 block text-sm text-subtle">
                        {option.duration} · ×
                        {option.multiplier.toLocaleString("id-ID")}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-5 text-subtle">
                  Estimasi dihitung setelah pembayaran terverifikasi dan dokumen
                  lengkap.
                </p>
              </Section>
            </fieldset>
          </form>
          <aside className="flex min-w-0 flex-col gap-5 rounded-3xl border border-line bg-white p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">Ringkasan pesanan</h2>
            <div className="rounded-xl bg-surface p-4">
              <p className="text-sm font-semibold">{selectedService.label}</p>
              <p className="mt-2 text-xs break-all text-subtle">
                {document?.name ?? "Belum ada dokumen"}
              </p>
              {wordCount && (
                <p className="mt-1 text-xs text-subtle">
                  {wordCount.toLocaleString("id-ID")} kata
                </p>
              )}
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Clock3 className="size-4 shrink-0 text-primary" />
              <p>
                {selectedTime.label}
                <span className="mt-1 block text-subtle">
                  {selectedTime.duration}
                </span>
              </p>
            </div>
            {price && <PriceBreakdown price={price} />}
            <div
              aria-live="polite"
              className="flex justify-between gap-3 border-t border-line pt-5"
            >
              <span className="text-sm font-semibold">Total pratinjau</span>
              <strong className="text-xl text-primary">
                {price ? rupiah(price.total) : "—"}
              </strong>
            </div>
            {!price && (
              <p className="text-xs leading-5 text-subtle">
                Pilih DOCX dan isi skor serta target yang valid untuk melihat
                harga.
              </p>
            )}
            {error && (
              <p role="alert" className="text-sm leading-6 text-red-600">
                {error}
              </p>
            )}
            <Button
              type="submit"
              form={id}
              disabled={busy || counting || !price}
              className="h-12 w-full rounded-full"
            >
              {busy
                ? "Membuat pesanan…"
                : counting
                  ? "Menghitung kata…"
                  : "Bayar Sekarang"}
            </Button>
            <div className="flex gap-3 rounded-xl bg-orange-50 p-4 text-xs leading-5 text-orange-900">
              <MessageCircle className="mt-0.5 size-4 shrink-0" />
              <p>
                Kalau sudah selesai, hasilnya akan langsung dikirim ke WhatsApp
                kamu!
              </p>
            </div>
          </aside>
        </div>
      </article>
    </>
  )
}
