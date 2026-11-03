"use client"
import { notify } from "@/lib/toast"
import { RequestError, UserFacingError } from "@/lib/errors"

import { FileText, Info, Phone, TicketPercent } from "lucide-react"
import { useId, useRef, useState } from "react"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  aiCheckNoticeTitle,
  plagiarismCheckout,
  plagiarismFilters,
  turnitinNoticeTitle,
  type PlagiarismService,
} from "@/features/plagiarism/data/plagiarism"
import {
  aiCheckNoticeBody,
  documentConfig,
  turnitinNoticeBody,
  type DocumentConfig,
} from "@/features/plagiarism/services/document-config"

import { countPdfWords } from "@/features/plagiarism/services/pdf-word-count"
import {
  AI_CHECK_ACCEPT,
  analyzeDocument,
  documentMime,
  isAiCheckFile,
  quoteAiCheck,
  type AiCheckPricing,
} from "@/features/plagiarism/services/document-file"
import { filesApi } from "@/lib/api/endpoints/files"
import {
  localPhone,
  useProfileAutofill,
} from "@/features/auth/hooks/use-profile-autofill"

import type { OrderDraft } from "@/features/payment/types"

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(bytes / 1024, 0.1).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function rupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`
}

const num = (value: number) => value.toLocaleString("id-ID")

/** Problem with the local count against Cek AI limits, if any. */
function aiLimitError(
  p: AiCheckPricing,
  words: number | null,
  chars: number | null
) {
  if (words !== null && words < p.minWords)
    return `Dokumen minimal ${num(p.minWords)} kata.`
  if (chars !== null && chars > p.maxChars)
    return `Dokumen melebihi batas ${num(p.maxChars)} karakter.`
  return null
}

export function PlagiarismCheckout({
  service,
  config = documentConfig,
  onCheckout,
}: {
  service: PlagiarismService
  config?: DocumentConfig
  onCheckout: (draft: OrderDraft) => Promise<void>
}) {
  const aiPricing = config.aiCheck
  const turnitin = config.turnitin
  const uploadId = useId()
  const formId = useId()
  const inFlight = useRef(false)
  const [busy, setBusy] = useState(false)
  const [payError, setPayError] = useState("")
  const [promoNote, setPromoNote] = useState("")
  const isAi = service.slug === "cek-ai"
  const maxWords = service.slug === "turnitin" ? turnitin.maxWords : Infinity
  // Uploaded once per picked file, so a retried checkout reuses it; guests
  // keep the upload token that proves the file.
  const uploaded = useRef(new WeakMap<File, string>())
  const uploadToken = useRef<string | undefined>(undefined)
  const showPayError = (message: string) =>
    setPayError(notify.error(new UserFacingError(message)))
  async function checkout() {
    if (inFlight.current) return
    setPayError("")
    if (!file) {
      showPayError(
        isAi
          ? "Pilih dokumen terlebih dahulu."
          : "Pilih dokumen PDF terlebih dahulu."
      )
      return
    }
    if (wordCount === undefined) {
      setPayError(
        notify.error(new UserFacingError("Tunggu pemeriksaan dokumen selesai."))
      )
      return
    }
    if (wordCount && wordCount > maxWords) {
      showPayError(
        `Dokumen melebihi batas ${maxWords.toLocaleString("id-ID")} kata.`
      )
      return
    }
    const limit = isAi ? aiLimitError(aiPricing, wordCount, charCount) : null
    if (limit) {
      setPayError(notify.error(new UserFacingError(limit)))
      return
    }
    const slug = service.slug
    if (slug !== "turnitin" && slug !== "cek-ai" && slug !== "parafrase-manual")
      return
    if (
      service.filters &&
      checked["exclude-matches"] &&
      (!Number.isFinite(Number(excludeAmount)) ||
        Number(excludeAmount) <= 0 ||
        !Number.isInteger(Number(excludeAmount)) ||
        Number(excludeAmount) > 60000)
    ) {
      showPayError(
        "Isi batas Exclude Small Matches berupa jumlah kata (1–60.000)."
      )
      return
    }
    inFlight.current = true
    setBusy(true)
    try {
      let fileId: string | undefined
      {
        fileId = uploaded.current.get(file)
        if (!fileId) {
          const res = await filesApi.upload(
            file,
            "doc_check_source",
            documentMime(file),
            uploadToken.current
          )
          if (!res.success) throw new RequestError(res.error)
          fileId = res.data.id
          uploadToken.current = res.data.uploadToken ?? uploadToken.current
          uploaded.current.set(file, fileId)
        }
      }
      await onCheckout({
        phone,
        amount: price ?? aiPricing.startingPrice,
        promoCode: promo.trim() || undefined,
        uploadToken: uploadToken.current,
        details: {
          kind: "document",
          excludeQuotes: !!checked["sumber-kutipan"],
          excludeBibliography: !!checked["daftar-pustaka"],
          excludeSmallMatches: !!checked["exclude-matches"],
          excludeMatchesWords: checked["exclude-matches"]
            ? Number(excludeAmount)
            : undefined,
          slug,
          title: service.title,
          fileName: file.name,
          fileSize: file.size,
          fileId,
          filters: service.filters
            ? plagiarismFilters
                .filter((f) => checked[f.id])
                .map((f) =>
                  f.id === "exclude-matches"
                    ? `${f.title}: ${excludeAmount} kata`
                    : f.title
                )
            : [],
        },
      })
    } catch (error) {
      setPayError(
        notify.error(
          error,
          "Pesanan tidak dapat dibuat. Periksa kembali data pesanan."
        )
      )
    } finally {
      inFlight.current = false
      setBusy(false)
    }
  }
  const [phone, setPhone] = useState("")
  useProfileAutofill((user) => setPhone((v) => v || localPhone(user.phone)))
  const [promo, setPromo] = useState("")
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      plagiarismFilters.map((filter) => [filter.id, filter.defaultChecked])
    )
  )
  const [file, setFile] = useState<File | null>(null)
  const [wordCount, setWordCount] = useState<number | null | undefined>(null)
  const [charCount, setCharCount] = useState<number | null>(null)
  const wordRequest = useRef(0)
  const [excludeAmount, setExcludeAmount] = useState("8")
  // Cek AI has no price until the document is counted and within limits.
  const limitError =
    isAi && wordCount ? aiLimitError(aiPricing, wordCount, charCount) : null
  const quote =
    isAi && wordCount && !limitError ? quoteAiCheck(aiPricing, wordCount) : null
  const price = isAi ? (quote?.total ?? null) : turnitin.startingPrice
  const notice =
    service.slug === "turnitin"
      ? { title: turnitinNoticeTitle, body: turnitinNoticeBody(turnitin) }
      : service.slug === "cek-ai"
        ? { title: aiCheckNoticeTitle, body: aiCheckNoticeBody(aiPricing) }
        : null

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Plagiarisme Checker", href: "/cek-plagiarisme" },
          { label: service.title },
        ]}
      />
      <section className="mx-auto grid w-full max-w-[1100px] items-start gap-6 px-5 py-12 md:px-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.85fr)] lg:py-16">
        <div className="flex flex-col gap-2 lg:col-span-2">
          <h1 className="text-[28px] leading-tight font-medium tracking-[-0.02em] md:text-[36px]">
            {service.title}
          </h1>
          <p className="max-w-[640px] text-sm leading-6 tracking-[-0.02em] text-subtle md:text-base">
            {service.description}
          </p>
        </div>
        <form
          className="flex flex-col gap-6 rounded-2xl border border-line p-5 md:p-6"
          id={formId}
          onSubmit={(event) => {
            event.preventDefault()
            void checkout()
          }}
        >
          {notice && (
            <div className="flex gap-3 rounded-xl bg-sky-50 px-4 py-3 text-sky-800">
              <Info className="mt-0.5 size-5 shrink-0" aria-hidden />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold tracking-[-0.02em]">
                  {notice.title}
                </p>
                <p className="text-sm leading-6 tracking-[-0.02em]">
                  {notice.body}
                </p>
              </div>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
              No. WhatsApp
              <span className="relative">
                <Phone
                  className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-subtle"
                  aria-hidden
                />
                <input
                  type="tel"
                  required
                  name="phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Nomor WhatsApp"
                  autoComplete="tel"
                  className="h-12 w-full rounded-full border border-line bg-white pr-4 pl-11 text-sm tracking-[-0.02em] outline-none placeholder:text-subtle focus-visible:border-primary"
                />
              </span>
            </label>
            <div className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
              <label htmlFor="promo">Kode Promo</label>
              <span className="relative">
                <TicketPercent
                  className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-subtle"
                  aria-hidden
                />
                <input
                  id="promo"
                  type="text"
                  name="promo"
                  value={promo}
                  onChange={(event) => setPromo(event.target.value)}
                  placeholder="Kode promo"
                  className="h-12 w-full rounded-full border border-line bg-white pr-28 pl-11 text-sm tracking-[-0.02em] outline-none placeholder:text-subtle focus-visible:border-primary"
                />
                <Button
                  type="button"
                  onClick={() =>
                    setPromoNote(
                      notify.info("Kode promo dicek saat pesanan dibuat.")
                    )
                  }
                  size="pill"
                  className="absolute top-1/2 right-1.5 h-9 -translate-y-1/2 px-3.5 text-sm"
                >
                  Gunakan
                </Button>
              </span>
            </div>
          </div>

          {promoNote && (
            <p role="status" className="text-xs text-subtle">
              {promoNote}
            </p>
          )}

          {service.filters && (
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 text-sm font-medium tracking-[-0.02em]">
                Filter
              </legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {plagiarismFilters.map((filter) => {
                  const isChecked = checked[filter.id]
                  return (
                    <label
                      key={filter.id}
                      className="flex cursor-pointer gap-2.5 rounded-xl border border-line p-3"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setChecked((current) => ({
                            ...current,
                            [filter.id]: !current[filter.id],
                          }))
                        }
                        className="mt-0.5 size-4 shrink-0 accent-primary"
                      />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold tracking-[-0.02em]">
                          {filter.title}
                        </span>
                        <span className="text-xs leading-4 tracking-[-0.02em] text-subtle">
                          {filter.description}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
              {checked["exclude-matches"] && (
                <div className="flex flex-col gap-3 rounded-xl border border-line p-4">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold tracking-[-0.02em]">
                      Kecualikan Sumber yang Kurang Dari
                    </p>
                    <p className="text-xs leading-4 tracking-[-0.02em] text-subtle">
                      Abaikan kecocokan di bawah batas minimum
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <input
                      type="number"
                      min={1}
                      max={60000}
                      step={1}
                      inputMode="numeric"
                      value={excludeAmount}
                      onChange={(event) => setExcludeAmount(event.target.value)}
                      aria-label="Batas minimum"
                      className="h-12 w-20 rounded-xl border border-line text-center text-base tracking-[-0.02em] outline-none focus-visible:border-primary"
                    />
                    <span className="text-sm">Kata</span>
                  </div>
                </div>
              )}
            </fieldset>
          )}

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium tracking-[-0.02em]">
              Upload Dokumen
            </p>
            <label
              htmlFor={uploadId}
              className="flex min-h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl bg-surface px-6 py-8 text-center"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-white">
                <FileText className="size-5" aria-hidden />
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-base font-semibold tracking-[-0.02em]">
                  {plagiarismCheckout.uploadTitle}
                </span>
                <span className="text-sm tracking-[-0.02em] text-subtle">
                  {file ? (
                    <>
                      {file.name}
                      <span className="mt-1 block">
                        {formatSize(file.size)}
                        {" · "}
                        {wordCount === undefined
                          ? "Menghitung kata..."
                          : wordCount === null
                            ? isAi
                              ? "Jumlah kata dihitung saat pembayaran"
                              : "Jumlah kata tidak terbaca"
                            : `${wordCount.toLocaleString("id-ID")} kata`}
                      </span>
                    </>
                  ) : isAi ? (
                    "PDF, DOCX, DOC, TXT"
                  ) : (
                    plagiarismCheckout.uploadDescription
                  )}
                </span>
              </span>
            </label>
            <input
              id={uploadId}
              type="file"
              accept={isAi ? AI_CHECK_ACCEPT : ".pdf,application/pdf"}
              className="sr-only"
              onChange={(event) => {
                const next = event.target.files?.[0] ?? null
                const request = wordRequest.current + 1
                wordRequest.current = request
                setPayError("")
                const maxMb = isAi ? aiPricing.maxSizeMb : turnitin.maxSizeMb
                if (
                  next &&
                  (!(isAi
                    ? isAiCheckFile(next)
                    : next.name.toLowerCase().endsWith(".pdf")) ||
                    next.size === 0 ||
                    next.size > maxMb * 1024 * 1024)
                ) {
                  setFile(null)
                  setWordCount(null)
                  setPayError(
                    isAi
                      ? `Gunakan file PDF, DOCX, DOC, atau TXT yang tidak kosong dengan ukuran maksimal ${aiPricing.maxSizeMb} MB.`
                      : `Gunakan PDF yang tidak kosong dengan ukuran maksimal ${turnitin.maxSizeMb} MB.`
                  )
                  event.target.value = ""
                  return
                }
                setFile(next)
                setCharCount(null)
                if (!next) {
                  setWordCount(null)
                  return
                }
                setWordCount(undefined)
                ;(isAi
                  ? analyzeDocument(next)
                  : countPdfWords(next).then((words) => ({
                      words,
                      chars: null,
                    }))
                )
                  .then((stats) => {
                    if (wordRequest.current !== request) return
                    setWordCount(stats?.words ?? null)
                    setCharCount(stats?.chars ?? null)
                    if (isAi && stats)
                      setPayError(
                        aiLimitError(aiPricing, stats.words, stats.chars) ?? ""
                      )
                  })
                  .catch((error: unknown) => {
                    if (wordRequest.current === request) {
                      setWordCount(null)
                      setPayError(
                        notify.error(
                          error,
                          "Dokumen tidak dapat dibaca. Coba gunakan file lain."
                        )
                      )
                    }
                  })
              }}
            />
          </div>
        </form>

        <aside className="flex flex-col gap-6 rounded-2xl border border-line p-5 md:p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">
              {plagiarismCheckout.summaryTitle}
            </h2>
            <p className="text-sm tracking-[-0.02em] text-subtle">
              {service.summary}
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
            <FileText className="size-5 shrink-0" aria-hidden />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-[-0.02em]">
                {file?.name ?? plagiarismCheckout.emptyFile}
              </span>
              <span className="block text-xs tracking-[-0.02em] text-subtle">
                {file ? formatSize(file.size) : "—"}
              </span>
            </span>
          </div>
          {isAi ? (
            <AiCheckSummary
              pricing={aiPricing}
              words={wordCount}
              chars={charCount}
              hasFile={!!file}
              quote={quote}
            />
          ) : (
            <dl className="flex flex-col gap-3 text-sm tracking-[-0.02em]">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd>{rupiah(turnitin.startingPrice)}</dd>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <dt>Total Pembayaran</dt>
                <dd>{rupiah(turnitin.startingPrice)}</dd>
              </div>
            </dl>
          )}
          <Button
            type="submit"
            form={formId}
            disabled={busy || wordCount === undefined || !!limitError}
            size="pill-lg"
            className="w-full"
          >
            {busy ? "Menyiapkan pesanan…" : plagiarismCheckout.payLabel}
          </Button>
          {payError && (
            <p role="alert" className="text-sm text-red-600">
              {payError}
            </p>
          )}
        </aside>
      </section>
    </>
  )
}

function AiCheckSummary({
  pricing,
  words,
  chars,
  hasFile,
  quote,
}: {
  pricing: AiCheckPricing
  words: number | null | undefined
  chars: number | null
  hasFile: boolean
  quote: ReturnType<typeof quoteAiCheck> | null
}) {
  const counting = hasFile && words === undefined
  const overChars = chars !== null && chars > pricing.maxChars
  const dash = counting ? "Menghitung…" : "–"
  return (
    <div className="flex flex-col gap-4">
      <dl className="flex flex-col gap-3 text-sm tracking-[-0.02em]">
        <div className="flex items-center justify-between">
          <dt>Jumlah kata</dt>
          <dd>{words ? num(words) : dash}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Karakter</dt>
          <dd className={overChars ? "font-medium text-red-600" : undefined}>
            {chars !== null ? `${num(chars)} / ${num(pricing.maxChars)}` : dash}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Cek AI (s.d. {num(pricing.baseWords)} kata)</dt>
          <dd>{quote ? rupiah(quote.base) : "–"}</dd>
        </div>
        {quote && quote.extra > 0 && (
          <div className="flex items-center justify-between">
            <dt>Tambahan {num(quote.extraWords)} kata</dt>
            <dd>{rupiah(quote.extra)}</dd>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-line pt-3 font-semibold">
          <dt>Total Pembayaran</dt>
          <dd>{quote ? rupiah(quote.total) : "–"}</dd>
        </div>
      </dl>
      <p className="flex gap-2 text-xs leading-5 tracking-[-0.02em] text-subtle">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        {hasFile && !counting && words === null
          ? "Jumlah kata file DOC dihitung setelah dokumen diunggah; total final mengikuti hitungan tersebut."
          : `Harga mengikuti jumlah kata: ${rupiah(pricing.startingPrice)} s.d. ${num(pricing.baseWords)} kata, +${rupiah(pricing.stepPrice)} per ${num(pricing.stepWords)} kata berikutnya. Minimal ${num(pricing.minWords)} kata, maksimal ${num(pricing.maxChars)} karakter.`}
      </p>
    </div>
  )
}
