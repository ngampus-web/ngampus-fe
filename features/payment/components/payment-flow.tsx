"use client"

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  FileText,
  LoaderCircle,
  QrCode,
  ShoppingBag,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { usePaymentOrder } from "../hooks/use-payment-order"
import { QrisPanel } from "./qris-panel"
import {
  effectiveStatus,
  formatFileSize,
  orderBackHref,
  rupiah,
  statusLabels,
} from "../services/order-rules"
import { apiGateway } from "../services/api-gateway"
import { previewGateway, simulateStatus } from "../services/preview-gateway"
import { turnaroundOptions } from "@/features/paraphrase/options"
import { AI_CHECK_ACCEPT } from "@/features/plagiarism/services/document-file"
import { PriceBreakdown } from "@/features/paraphrase/components/price-breakdown"
import { calculateParaphrasePrice } from "@/features/paraphrase/services/pricing"
import type { PaymentStatus } from "../types"

const wib = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso))

export function PaymentFlow({
  orderId,
  gateway = false,
}: {
  orderId: string
  gateway?: boolean
}) {
  const {
    order,
    error: loadError,
    setOrder,
    refresh,
  } = usePaymentOrder(orderId, { pollMs: gateway ? 5_000 : 15_000 })
  const router = useRouter()
  // Leave the QR page once the order is no longer awaiting payment.
  const leaveQr =
    gateway && order?.mode === "live" && order.status !== "pending"
  useEffect(() => {
    if (leaveQr) router.replace(`/pembayaran/${orderId}`)
  }, [leaveQr, router, orderId])
  const [now, setNow] = useState(() => Date.now())
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)
  const [resent, setResent] = useState(false)
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (order === undefined && loadError)
    return (
      <div
        role="alert"
        className="mx-auto max-w-3xl px-5 py-24 text-center text-subtle"
      >
        {loadError}
      </div>
    )
  if (order === undefined)
    return (
      <div
        role="status"
        className="mx-auto max-w-3xl px-5 py-24 text-center text-subtle"
      >
        Memuat pesanan…
      </div>
    )
  if (!order)
    return (
      <section className="mx-auto flex max-w-lg flex-col items-center gap-5 px-5 py-24 text-center">
        <FileText className="size-10 text-primary" />
        <h1 className="text-2xl font-semibold">Pesanan tidak ditemukan</h1>
        <p className="text-sm leading-6 text-subtle">
          Tautan tidak valid, pesanan milik akun lain, atau sesi pratinjau sudah
          berakhir.
        </p>
        <Button asChild size="pill">
          <Link href="/marketplace">Kembali ke Marketplace</Link>
        </Button>
        <Link className="text-sm text-primary" href="/cek-plagiarisme">
          Pilih layanan dokumen
        </Link>
      </section>
    )

  const live = order.mode === "live"
  const details = order.details
  const isMarket = details.kind === "marketplace"
  const status = effectiveStatus(order, now)
  const terminal = ["expired", "cancelled", "failed"].includes(status)
  const deliveredVia =
    (details.kind === "marketplace" &&
      details.delivery?.channels
        .map((c) => (c === "whatsapp" ? "WhatsApp" : "Email"))
        .join(" & ")) ||
    "WhatsApp/Email"
  // A failed live document check keeps its payment; the file can be replaced.
  const docFailed = live && details.kind === "document" && status === "failed"
  const statusLabel = docFailed ? "Dokumen Gagal Diproses" : statusLabels[status]
  const activeStep =
    status === "completed" ? 2 : status === "processing" || docFailed ? 1 : 0
  const seconds = Math.max(
    0,
    Math.ceil((Date.parse(order.expiresAt) - now) / 1000)
  )
  const remaining = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
  const created = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(order.createdAt))
  const canDownload =
    live &&
    (details.kind === "paraphrase" || details.kind === "document") &&
    !!details.hasResult
  const canResubmit =
    docFailed && details.kind === "document" && (details.retriesLeft ?? 0) > 0
  async function resendDelivery() {
    setBusy(true)
    setError("")
    setResent(false)
    try {
      await apiGateway.resendDelivery(orderId)
      setResent(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengirim ulang.")
    } finally {
      setBusy(false)
    }
  }
  async function resubmit(file: File) {
    setBusy(true)
    setError("")
    try {
      setOrder(await apiGateway.resubmit(orderId, file))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Dokumen gagal diunggah.")
    } finally {
      setBusy(false)
    }
  }
  async function downloadResult() {
    setBusy(true)
    setError("")
    try {
      // Presigned with an attachment name: the browser downloads it.
      window.location.assign(await apiGateway.resultUrl(orderId))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hasil belum dapat diunduh.")
    } finally {
      setBusy(false)
    }
  }
  async function openPayment() {
    if (live) {
      router.push(`/pembayaran/${orderId}/qris`)
      return
    }
    setBusy(true)
    setError("")
    try {
      const { checkoutUrl } = await previewGateway.startPayment(orderId)
      router.push(checkoutUrl)
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Pembayaran belum dapat dibuka."
      )
    } finally {
      setBusy(false)
    }
  }
  async function cancelLive() {
    setBusy(true)
    setError("")
    try {
      setOrder(await apiGateway.cancel(orderId))
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Pesanan tidak dapat dibatalkan."
      )
    } finally {
      setBusy(false)
    }
  }
  function transition(next: PaymentStatus) {
    if (live) {
      if (next === "cancelled") void cancelLive()
      return
    }
    setError("")
    try {
      simulateStatus(orderId, next)
      if (gateway) router.replace(`/pembayaran/${orderId}`)
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Status tidak dapat diperbarui."
      )
    }
  }
  async function copyId() {
    try {
      await navigator.clipboard.writeText(orderId)
      setCopied(true)
    } catch {
      setError(
        "Tidak dapat menyalin otomatis. Pilih dan salin ID pesanan secara manual."
      )
    }
  }

  return (
    <section className="mx-auto w-full max-w-[1060px] px-5 py-10 md:px-10 lg:py-14">
      <Link
        href={gateway ? `/pembayaran/${orderId}` : orderBackHref(order)}
        className="mb-6 inline-flex items-center gap-2 text-sm text-subtle hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        {gateway ? "Kembali ke konfirmasi" : "Kembali ke layanan"}
      </Link>
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold tracking-widest text-primary uppercase">
          {isMarket ? "Marketplace" : details.title}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {gateway && status === "pending"
            ? "Pembayaran QRIS"
            : status === "completed"
              ? "Pesanan selesai"
              : status === "processing"
                ? "Pesanan sedang diproses"
                : terminal
                  ? statusLabel
                  : "Konfirmasi pesanan"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-subtle">
          {status === "pending"
            ? "Periksa rincian pesananmu sebelum melanjutkan pembayaran."
            : "Pantau status dan rincian pesananmu di sini."}
        </p>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
          <header className="border-b border-line bg-surface p-5 md:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="min-w-0 flex-1 text-lg font-semibold break-words">
                {isMarket ? details.title : details.fileName}
              </h2>
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status === "completed" ? "bg-emerald-50 text-emerald-700" : terminal ? "bg-red-50 text-red-700" : "bg-orange-50 text-orange-700"}`}
              >
                {statusLabel}
              </span>
            </div>
            <div className="mt-3 flex items-start gap-2 text-xs text-subtle">
              <span className="min-w-0 break-all">{order.id}</span>
              <button
                type="button"
                aria-label="Salin ID pesanan"
                onClick={copyId}
                className="shrink-0 rounded p-1 hover:bg-white"
              >
                <Copy className="size-3.5" />
              </button>
            </div>
            <p className="mt-1 text-xs text-subtle">
              {created} WIB{" "}
              {copied && (
                <span role="status" className="ml-2 text-emerald-700">
                  ID disalin
                </span>
              )}
            </p>
          </header>
          <div className="border-b border-line px-4 py-6 md:px-7">
            <ol aria-label="Tahapan pesanan" className="flex">
              {["Menunggu Pembayaran", "Proses", "Selesai"].map((label, i) => (
                <li
                  key={label}
                  aria-current={i === activeStep ? "step" : undefined}
                  className="relative flex flex-1 flex-col items-center gap-3 text-center"
                >
                  {i < 2 && (
                    <div
                      className={`absolute top-4 left-1/2 h-0.5 w-full ${i < activeStep ? "bg-primary" : "bg-line"}`}
                    />
                  )}
                  <span
                    className={`relative flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold ${i <= activeStep && !terminal ? "border-primary bg-primary text-white" : "border-line bg-white text-subtle"}`}
                  >
                    {i < activeStep || status === "completed" ? (
                      <Check className="size-4" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className={`max-w-24 text-xs leading-5 ${i === activeStep ? "font-semibold text-black" : "text-subtle"}`}
                  >
                    {label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-6 p-5 md:p-7">
            <dl className="grid grid-cols-1 gap-5 text-sm sm:grid-cols-2">
              {(isMarket
                ? [
                    details.customerEmail
                      ? ["Email pembeli", details.customerEmail]
                      : ["Nama pembeli", details.customerName],
                    ["Paket", details.plan],
                    ["Durasi", details.duration],
                    ["Garansi", details.warranty ?? "Sesuai ketentuan produk"],
                    ...(details.accountType
                      ? [["Tipe akun", details.accountType]]
                      : []),
                  ]
                : [
                    ["Nama file", details.fileName],
                    ["Ukuran file", formatFileSize(details.fileSize)],
                    ["Layanan", details.title],
                    ...(details.kind === "paraphrase"
                      ? [
                          ["Nama", details.customerName],
                          [
                            "Jumlah kata",
                            `${details.wordCount.toLocaleString("id-ID")} kata`,
                          ],
                          [
                            "Bahasa",
                            details.language === "id" ? "Indonesia" : "Inggris",
                          ],
                          ["Bidang", details.field || "Tidak ada"],
                          ["Catatan", details.notes || "Tidak ada"],
                          [
                            "Estimasi pengerjaan",
                            turnaroundOptions
                              .filter((t) => t.id === details.turnaround)
                              .map((t) => `${t.label} · ${t.duration}`)
                              .join(""),
                          ],
                          ...details.reports.flatMap((r) => [
                            [
                              `Laporan ${r.type === "ai" ? "AI" : "Turnitin"}`,
                              `${r.file.name} · ${formatFileSize(r.file.size)}`,
                            ],
                            [
                              `Skor ${r.type === "ai" ? "AI" : "Turnitin"}`,
                              `${r.initialScore}% → ${r.targetScore}%`,
                            ],
                          ]),
                        ]
                      : []),
                  ]
              )
                .concat([["WhatsApp", `+${order.phone}`]])
                .map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="mb-1.5 text-xs font-medium tracking-wide text-subtle uppercase">
                      {label}
                    </dt>
                    <dd className="leading-6 break-words">{value}</dd>
                  </div>
                ))}
            </dl>
            {details.kind === "document" && details.filters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {details.filters.map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-800"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}
            {status === "pending" && !gateway && (
              <div className="flex gap-3 rounded-xl bg-surface p-4 text-sm leading-6">
                <Clock3 className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">
                    Selesaikan pembayaran dalam{" "}
                    <span className="tabular-nums">{remaining}</span>
                  </p>
                  <p className="text-subtle">
                    Pesanan diproses setelah pembayaran terverifikasi.
                  </p>
                </div>
              </div>
            )}
            {status === "pending" && gateway && live && (
              <QrisPanel
                code={orderId}
                remaining={remaining}
                onChanged={() => void refresh()}
              />
            )}
            {status === "pending" && gateway && !live && (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line bg-surface p-6 text-center">
                <div className="rounded-2xl border border-line bg-white p-7">
                  <QrCode className="size-24 text-subtle/40" strokeWidth={1} />
                </div>
                <p className="font-semibold">Area QRIS dari payment gateway</p>
                <p className="max-w-sm text-sm leading-6 text-subtle">
                  QR pembayaran asli akan tersedia setelah gateway terhubung.
                  Ikon ini tidak dapat digunakan untuk membayar.
                </p>
                <span className="text-sm text-subtle">
                  Waktu tersisa{" "}
                  <strong className="text-black tabular-nums">
                    {remaining}
                  </strong>
                </span>
              </div>
            )}
            {status === "processing" && (
              <div role="status" className="rounded-2xl bg-orange-50 p-5">
                <LoaderCircle className="mb-3 size-7 animate-spin text-primary" />
                <h3 className="font-semibold">
                  {isMarket ? "Sedang diproses" : "Dokumenmu sedang diproses"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-subtle">
                  {isMarket
                    ? "Akun sedang disiapkan admin (biasanya 1–30 menit, maksimal 3 jam). Detail akun akan dikirim melalui WhatsApp & email."
                    : details.slug === "parafrase-manual"
                      ? "Tim sedang meninjau dan mengerjakan parafrase dokumenmu."
                      : "Hasil pengecekan akan tersedia di halaman ini setelah proses selesai."}
                </p>
              </div>
            )}
            {status === "processing" && details.kind === "paraphrase" && (
              <div
                role="status"
                className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm leading-6"
              >
                Kalau sudah selesai, hasilnya akan langsung dikirim ke WhatsApp
                kamu!
                {live && details.schedule ? (
                  <dl className="mt-3 space-y-1 text-xs text-subtle">
                    {[
                      ["Estimasi selesai", details.schedule.deadlineAt],
                      ["Dibayar", details.schedule.paidAt],
                      ["Tim mulai", details.schedule.startedAt],
                    ].map(([label, at]) => (
                      <div key={label} className="flex justify-between gap-4">
                        <dt>{label}</dt>
                        <dd className="text-right font-medium text-black">
                          {at ? `${wib(at)} WIB` : "Menunggu"}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-2 text-xs text-subtle">
                    Estimasi dihitung setelah pembayaran terverifikasi dan
                    dokumen lengkap. Ini simulasi; belum ada pengiriman
                    WhatsApp.
                  </p>
                )}
              </div>
            )}
            {status === "completed" && (
              <div role="status" className="rounded-2xl bg-emerald-50 p-5">
                <CheckCircle2 className="mb-3 size-8 text-emerald-600" />
                <h3 className="font-semibold">
                  {isMarket
                    ? `Sudah dikirimkan melalui ${deliveredVia}`
                    : "Hasil dokumen siap"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-emerald-900">
                  {isMarket
                    ? details.kind === "marketplace" && details.delivery
                      ? `Detail akun sudah dikirim ke ${deliveredVia} pada ${wib(details.delivery.sentAt)} WIB. Demi keamanan, detail akun tidak ditampilkan di halaman ini.`
                      : "Silakan login dan nikmati layananmu."
                    : live &&
                        details.kind === "document" &&
                        details.score != null
                      ? `Skor ${details.slug === "cek-ai" ? "AI" : "similarity"}: ${details.score}%. Unduh laporan lengkapnya di bawah.`
                      : "Kamu dapat mengunduh hasil setelah laporan tersedia dari layanan pemrosesan."}
                </p>
                {live && details.kind === "marketplace" && details.delivery && (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button
                      variant="outline"
                      size="pill"
                      disabled={busy}
                      onClick={() => void resendDelivery()}
                    >
                      {busy ? "Mengirim…" : "Kirim ulang"}
                    </Button>
                    {resent && (
                      <span role="status" className="text-xs text-emerald-800">
                        Detail akun dikirim ulang ke {deliveredVia}.
                      </span>
                    )}
                  </div>
                )}
                {!live && (
                  <p className="mt-3 text-xs leading-5 text-emerald-800">
                    Ini tampilan status selesai untuk pratinjau.{" "}
                    {isMarket
                      ? "Belum ada akun yang dikirimkan."
                      : "Belum ada dokumen yang diproses atau laporan asli."}
                  </p>
                )}
              </div>
            )}
            {docFailed && details.kind === "document" && (
              <div role="status" className="rounded-2xl bg-red-50 p-5">
                <XCircle className="mb-3 size-7 text-red-600" />
                <h3 className="font-semibold">Dokumen belum bisa diproses</h3>
                {details.failReason && (
                  <p className="mt-2 text-sm leading-6">
                    Alasan: {details.failReason}
                  </p>
                )}
                <p className="mt-2 text-sm leading-6 text-subtle">
                  {canResubmit
                    ? `Pembayaran kamu tetap aman. Unggah ulang dokumen tanpa biaya tambahan (sisa ${details.retriesLeft}x).`
                    : `Batas unggah ulang sudah habis. Hubungi CS Ngampus dengan nomor pesanan ${order.id} agar kami bantu cek manual.`}
                </p>
                {canResubmit && (
                  <label className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
                    {busy ? "Mengunggah…" : "Unggah ulang dokumen"}
                    <input
                      type="file"
                      className="sr-only"
                      disabled={busy}
                      accept={
                        details.slug === "cek-ai"
                          ? AI_CHECK_ACCEPT
                          : ".pdf,application/pdf"
                      }
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        event.target.value = ""
                        if (file) void resubmit(file)
                      }}
                    />
                  </label>
                )}
              </div>
            )}
            {terminal && !docFailed && (
              <div role="status" className="rounded-2xl bg-red-50 p-5">
                <XCircle className="mb-3 size-7 text-red-600" />
                <h3 className="font-semibold">{statusLabels[status]}</h3>
                <p className="mt-2 text-sm leading-6 text-subtle">
                  {status === "expired"
                    ? "Batas waktu pembayaran telah habis."
                    : status === "cancelled"
                      ? "Pesanan ini tidak dilanjutkan."
                      : "Pembayaran tidak berhasil diselesaikan."}{" "}
                  Kembali ke layanan untuk membuat pesanan baru.
                </p>
              </div>
            )}
            {status === "completed" && !isMarket && (
              <>
                <Button
                  disabled={!canDownload || busy}
                  onClick={() => void downloadResult()}
                  className="h-12 w-full rounded-full"
                >
                  {details.slug === "turnitin"
                    ? "Unduh Laporan Plagiasi"
                    : details.slug === "cek-ai"
                      ? "Unduh Laporan AI"
                      : "Unduh Hasil Parafrase"}
                </Button>
                {!canDownload && (
                  <p className="-mt-3 text-center text-xs text-subtle">
                    {live && details.kind === "document"
                      ? "Laporan sudah tidak tersimpan. Hubungi CS Ngampus jika masih membutuhkannya."
                      : "Unduhan aktif saat backend menyediakan hasil asli."}
                  </p>
                )}
                {canDownload &&
                  details.kind === "document" &&
                  details.resultExpiresAt && (
                    <p className="-mt-3 text-center text-xs text-subtle">
                      Unduh sebelum {wib(details.resultExpiresAt)} WIB. Setelah
                      itu laporan dihapus otomatis.
                    </p>
                  )}
                {details.slug !== "parafrase-manual" && (
                  <Link
                    href="/cek-plagiarisme/parafrase-manual"
                    className="flex items-center justify-between gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm font-semibold text-orange-900"
                  >
                    Butuh Parafrase Manual?
                    <ArrowRight className="size-5 shrink-0" />
                  </Link>
                )}
              </>
            )}
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        </article>
        <aside className="flex flex-col gap-5 rounded-3xl border border-line bg-white p-6 lg:sticky lg:top-6">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-orange-50 p-2.5 text-primary">
              {isMarket ? (
                <ShoppingBag className="size-5" />
              ) : (
                <FileText className="size-5" />
              )}
            </span>
            <h2 className="font-semibold">Ringkasan pembayaran</h2>
          </div>
          {details.kind === "paraphrase" && (
            <PriceBreakdown price={calculateParaphrasePrice(details)} />
          )}
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-subtle">Metode</dt>
              <dd>QRIS</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-subtle">Harga layanan</dt>
              <dd>{rupiah(order.amount)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-line pt-4">
              <dt className="font-semibold">Total bayar</dt>
              <dd className="text-xl font-semibold text-primary">
                {rupiah(order.amount)}
              </dd>
            </div>
          </dl>
          <p className="text-xs leading-5 text-subtle">
            {live
              ? "Total dihitung oleh server dari paket yang kamu pilih."
              : "Total pratinjau. Biaya gateway, jika ada, akan dihitung dan ditampilkan oleh backend sebelum pembayaran."}
          </p>
          {status === "pending" && !gateway && (
            <>
              <Button
                disabled={busy}
                onClick={openPayment}
                className="h-12 rounded-full"
              >
                <QrCode className="size-4" />
                {busy ? "Membuka…" : "Pembayaran QRIS"}
              </Button>
              <Button
                variant="outline"
                size="pill"
                onClick={() => transition("cancelled")}
              >
                Batalkan pesanan
              </Button>
            </>
          )}
          {terminal && !canResubmit && (
            <Button asChild size="pill">
              <Link href={orderBackHref(order)}>Buat pesanan baru</Link>
            </Button>
          )}
          {!live &&
            ((status === "pending" && gateway) || status === "processing") && (
              <div className="flex flex-col gap-3 border-t border-dashed border-line pt-4">
                <p className="text-xs font-semibold text-subtle">
                  KONTROL PRATINJAU
                </p>
                <Button
                  size="pill"
                  onClick={() =>
                    transition(
                      status === "pending" ? "processing" : "completed"
                    )
                  }
                >
                  {status === "pending"
                    ? "Simulasikan pembayaran berhasil"
                    : "Simulasikan pesanan selesai"}
                </Button>
                {status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      size="pill"
                      onClick={() => transition("failed")}
                    >
                      Simulasikan gagal
                    </Button>
                    <button
                      type="button"
                      className="text-xs text-subtle underline"
                      onClick={() => transition("expired")}
                    >
                      Simulasikan kedaluwarsa
                    </button>
                  </>
                )}
                <p className="text-xs leading-5 text-subtle">
                  Pada transaksi nyata, status diperbarui oleh server setelah
                  verifikasi.
                </p>
              </div>
            )}
        </aside>
      </div>
    </section>
  )
}
