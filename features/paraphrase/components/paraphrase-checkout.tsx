"use client"
import { notify } from "@/lib/toast"
import { RequestError, UserFacingError } from "@/lib/errors"

import { useId, useRef, useState, type ReactNode } from "react"
import { FileText, Upload, Clock3, MessageCircle } from "lucide-react"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OrderDraft } from "@/features/payment/types"
import { filesApi } from "@/lib/api/endpoints/files"
import {
  localPhone,
  useProfileAutofill,
} from "@/features/auth/hooks/use-profile-autofill"
import type { FilePurpose } from "@/types/api"
import { formatFileSize, rupiah } from "@/features/payment/services/order-rules"
import { paraphraseServices, turnaroundOptions } from "../options"
import type { ParaphraseDetails, ParaphraseKind, Turnaround } from "../types"
import { countDocxWords } from "../services/docx-word-count"
import { detectReportScore } from "../services/report-score"
import { validateFile, validateParaphrase } from "../services/validation"

import {
  calculateParaphrasePrice,
  paraphraseRates,
  type ParaphraseRates,
} from "../services/pricing"
import { PriceBreakdown } from "./price-breakdown"

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

/** Uploads once per picked file; a retry after an error reuses the ids. */
/** Uploads of one checkout; guests share one upload token across files. */
type UploadSession = { files: WeakMap<File, string>; token?: string }

async function uploadOnce(
  session: UploadSession,
  file: File,
  purpose: FilePurpose
) {
  const cached = session.files.get(file)
  if (cached) return cached
  const res = await filesApi.upload(
    file,
    purpose,
    file.type ||
      (purpose === "paraphrase_source" ? DOCX_MIME : "application/pdf"),
    session.token
  )
  if (!res.success) throw new RequestError(res.error)
  session.token = res.data.uploadToken ?? session.token
  session.files.set(file, res.data.id)
  return res.data.id
}

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
  maxFileMb,
  file,
  onSelect,
  status,
}: {
  label: string
  extension: "docx" | "pdf"
  maxFileMb: number
  file: File | null
  onSelect: (file: File | null) => void
  /** Shown under the file name, e.g. the score read from a report. */
  status?: ReactNode
}) {
  const id = useId()
  return (
    <div className="flex min-w-0 flex-col">
      <label
        htmlFor={id}
        className="flex min-h-40 flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-surface p-5 text-center focus-within:ring-2 focus-within:ring-primary hover:border-primary"
      >
        <Upload className="size-5 text-primary" aria-hidden />
        <span className="text-sm font-semibold">{label}</span>
        {/* One line, so the two cards keep the same layout whatever the name. */}
        <span
          className="block max-w-full truncate text-xs leading-5 text-subtle"
          title={file?.name}
        >
          {file
            ? `${file.name} · ${formatFileSize(file.size)}`
            : `${extension.toUpperCase()} · Maksimal ${maxFileMb} MB`}
        </span>
        {/* Always takes its row, so cards with and without a file line up. */}
        <div className="flex h-6 items-center">{file ? status : null}</div>
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
      {/* Kept (hidden) without a file so both cards end at the same line. */}
      <button
        type="button"
        className={`mt-2 text-xs text-subtle underline ${file ? "" : "invisible"}`}
        disabled={!file}
        aria-hidden={!file}
        tabIndex={file ? 0 : -1}
        onClick={() => onSelect(null)}
      >
        Hapus {label.toLowerCase()}
      </button>
    </div>
  )
}
export function ParaphraseCheckout({
  onCheckout,
  rates = paraphraseRates,
}: {
  onCheckout: (draft: OrderDraft) => Promise<void>
  rates?: ParaphraseRates
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
  const [detecting, setDetecting] = useState({ turnitin: false, ai: false })
  const [reportNotes, setReportNotes] = useState({ turnitin: "", ai: "" })
  /** Score read from each report PDF; null while unread or not found. */
  const [detected, setDetected] = useState<
    Record<"turnitin" | "ai", number | null>
  >({ turnitin: null, ai: null })
  const reportRequest = useRef({ turnitin: 0, ai: 0 })
  const [targets, setTargets] = useState({ turnitin: "10", ai: "10" })
  const [notes, setNotes] = useState("")
  const [language, setLanguage] = useState<"id" | "en">("id")
  const [field, setField] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  useProfileAutofill((user) => {
    setName((v) => v || user.name)
    setPhone((v) => v || localPhone(user.phone))
  })
  const [turnaround, setTurnaround] = useState<Turnaround>("relaxed")
  const [error, setError] = useState("")
  const [docError, setDocError] = useState("")
  const [busy, setBusy] = useState(false)
  const request = useRef(0)
  const inFlight = useRef(false)
  const uploaded = useRef<UploadSession>({ files: new WeakMap() })
  const reportTypes: ("turnitin" | "ai")[] =
    service === "combined" ? ["turnitin", "ai"] : [service]
  const selectedService = paraphraseServices.find((s) => s.id === service)!
  const selectedTime = turnaroundOptions.find((t) => t.id === turnaround)!
  let price = null
  try {
    price = calculateParaphrasePrice(
      {
        wordCount: wordCount ?? 0,
        service,
        turnaround,
        reports: reportTypes.map((type) => ({
          type,
          initialScore: scores[type].trim() ? Number(scores[type]) : NaN,
          targetScore: targets[type].trim() ? Number(targets[type]) : NaN,
        })),
      },
      rates
    )
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
      validateFile(next, "docx", rates.maxFileMb)
      setDocument(next)
      setCounting(true)
      const count = await countDocxWords(next)
      if (current === request.current) setWordCount(count)
    } catch (e) {
      if (current === request.current)
        setDocError(notify.error(e, "DOCX tidak dapat dibaca."))
    } finally {
      if (current === request.current) setCounting(false)
    }
  }
  async function selectReport(type: "turnitin" | "ai", next: File | null) {
    const current = ++reportRequest.current[type]
    setError("")
    setReportNotes((prev) => ({ ...prev, [type]: "" }))
    try {
      if (next) validateFile(next, "pdf", rates.maxFileMb)
    } catch (e) {
      setError(notify.error(e, "PDF tidak valid."))
      return
    }
    setReports((prev) => ({ ...prev, [type]: next }))
    setScores((prev) => ({ ...prev, [type]: "" }))
    setDetected((prev) => ({ ...prev, [type]: null }))
    if (!next) return
    setDetecting((prev) => ({ ...prev, [type]: true }))
    const found = await detectReportScore(next)
    if (current !== reportRequest.current[type]) return
    setDetecting((prev) => ({ ...prev, [type]: false }))
    const label = type === "ai" ? "AI" : "Turnitin"
    if (!found) {
      setReportNotes((prev) => ({
        ...prev,
        [type]: `Skor belum terbaca otomatis. Isi skor awal ${label} sesuai laporan.`,
      }))
      return
    }
    if (found.kind !== type) {
      setReports((prev) => ({ ...prev, [type]: null }))
      setError(
        notify.error(
          new UserFacingError(
            found.kind === "ai"
              ? `File ini terbaca sebagai laporan AI, bukan laporan ${label}. Pilih file yang sesuai.`
              : `File ini terbaca sebagai laporan Turnitin, bukan laporan ${label}. Pilih file yang sesuai.`
          )
        )
      )
      return
    }
    setScores((prev) => ({ ...prev, [type]: String(found.score) }))
    setDetected((prev) => ({ ...prev, [type]: found.score }))
    setReportNotes((prev) => ({
      ...prev,
      [type]:
        found.score <= rates.minTarget
          ? `Terbaca otomatis: ${found.score}%. Skor ini sudah di bawah batas minimal target ${rates.minTarget}%, jadi belum perlu parafrase.`
          : `Terbaca otomatis dari laporan: ${found.score}%. Ganti file laporan jika tidak sesuai.`,
    }))
  }
  async function submit() {
    if (inFlight.current) return
    setError("")
    if (!document || !wordCount || counting || docError) {
      setError(
        notify.error(
          new UserFacingError(
            "Pilih DOCX dan tunggu jumlah kata selesai dihitung."
          )
        )
      )
      return
    }
    if (reportTypes.some((type) => !reports[type])) {
      setError(
        notify.error(
          new UserFacingError(
            "Lengkapi laporan PDF untuk layanan yang dipilih."
          )
        )
      )
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
      rates,
    }
    try {
      validateParaphrase(details)
      inFlight.current = true
      setBusy(true)
      // Login is optional; guest uploads are proven by the upload token.
      details.sourceFileId = await uploadOnce(
        uploaded.current,
        document,
        "paraphrase_source"
      )
      for (const r of details.reports)
        r.fileId = await uploadOnce(
          uploaded.current,
          reports[r.type]!,
          "paraphrase_report"
        )
      await onCheckout({
        phone,
        amount: calculateParaphrasePrice(details, rates).total,
        details,
        uploadToken: uploaded.current.token,
      })
    } catch (e) {
      setError(notify.error(e, "Pesanan belum dapat dibuat."))
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
                    maxFileMb={rates.maxFileMb}
                    file={document}
                    onSelect={(next) => {
                      void selectDocument(next)
                    }}
                    status={
                      <span
                        className={
                          wordCount
                            ? "rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                            : "text-xs text-subtle"
                        }
                      >
                        {counting
                          ? "Menghitung kata…"
                          : wordCount
                            ? `${wordCount.toLocaleString("id-ID")} kata`
                            : "Jumlah kata tidak terbaca"}
                      </span>
                    }
                  />
                  {reportTypes.map((type) => (
                    <FilePicker
                      key={type}
                      label={`Laporan ${type === "ai" ? "AI" : "Turnitin"}`}
                      extension="pdf"
                      maxFileMb={rates.maxFileMb}
                      file={reports[type]}
                      onSelect={(next) => {
                        void selectReport(type, next)
                      }}
                      status={
                        <span
                          role="status"
                          data-testid={`detected-${type}`}
                          className={
                            detected[type] !== null
                              ? "rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                              : "text-xs text-subtle"
                          }
                        >
                          {detecting[type]
                            ? "Membaca skor…"
                            : detected[type] !== null
                              ? `Skor terdeteksi: ${detected[type]}%`
                              : "Skor tidak terbaca, isi manual"}
                        </span>
                      }
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
                  kamu butuhkan. Target minimal {rates.minTarget}% dan harus di
                  bawah skor awal.
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
                            className={`${inputStyle} read-only:cursor-default read-only:bg-surface read-only:text-subtle`}
                            type="number"
                            required
                            min="10.01"
                            max="100"
                            step="0.01"
                            placeholder="Contoh: 45"
                            value={scores[type]}
                            disabled={detecting[type]}
                            // A score read from the report is final: replace
                            // the PDF to change it. Only unread reports are typed.
                            readOnly={detected[type] !== null}
                            onChange={(e) => {
                              setScores((prev) => ({
                                ...prev,
                                [type]: e.target.value,
                              }))
                              setReportNotes((prev) => ({
                                ...prev,
                                [type]: "",
                              }))
                            }}
                          />
                          {(detecting[type] || reportNotes[type]) && (
                            <span
                              role="status"
                              className="block text-xs leading-5 text-subtle"
                            >
                              {detecting[type]
                                ? "Membaca skor dari laporan…"
                                : reportNotes[type]}
                            </span>
                          )}
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
                    <Select
                      value={language}
                      onValueChange={(v) => setLanguage(v as "id" | "en")}
                    >
                      <SelectTrigger className={inputStyle}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Indonesia</SelectItem>
                        <SelectItem value="en">Inggris</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>
                      Bidang <span className="text-subtle">(opsional)</span>
                    </span>
                    <input
                      className={inputStyle}
                      maxLength={120}
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
                        {option.duration}
                        {rates.multipliers[option.id] > 1 &&
                          ` · +${Math.round((rates.multipliers[option.id] - 1) * 100)}%`}
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
