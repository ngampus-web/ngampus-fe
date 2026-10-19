"use client"

import { Check, Plus, Upload, X } from "lucide-react"
import { useId, useState, type FormEvent } from "react"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  warrantyClaimCategories,
  warrantyClaimFilters,
  warrantyClaimForm,
  warrantyClaimStatusLabel,
  warrantyClaimsPage,
} from "@/features/warranty/data/warranty-claims"
import {
  warrantyClaimOrders,
  warrantyClaims,
} from "@/features/warranty/data/demo-claims"
import {
  type WarrantyClaim,
  type WarrantyClaimStatus,
} from "@/features/warranty/types"
import { cn } from "@/lib/utils"

const statusClass: Record<WarrantyClaimStatus, string> = {
  "dalam-proses": "text-amber-700",
  selesai: "text-emerald-700",
  ditolak: "text-red-600",
}

const cornerStatus: Record<WarrantyClaimStatus, string> = {
  "dalam-proses": "Menunggu Review",
  selesai: "Proses Selesai",
  ditolak: "Ditolak",
}

function localStamp() {
  const date = new Date()
  const pad = (value: number) => String(value).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function formatClaimTime(value: string) {
  const [date, time = ""] = value.split(" ")
  const [year, month, day] = date.split("-")
  const [hour = "00", minute = "00"] = time.split(":")
  if (!year || !month || !day) return value
  return `${day}/${month}/${year.slice(-2)} · ${hour}:${minute}`
}

export function WarrantyClaims() {
  const formId = useId()
  const [filter, setFilter] =
    useState<(typeof warrantyClaimFilters)[number]["id"]>("semua")
  const [claims, setClaims] = useState(warrantyClaims)
  const [open, setOpen] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [category, setCategory] = useState("")
  const [detail, setDetail] = useState("")
  const [fileName, setFileName] = useState("")
  const [note, setNote] = useState("")
  const [selected, setSelected] = useState<WarrantyClaim | null>(null)

  const visible = claims.filter(
    (claim) => filter === "semua" || claim.status === filter
  )

  function closeForm() {
    setOpen(false)
  }

  function submitClaim(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const order = warrantyClaimOrders.find((item) => item.id === orderId)
    if (!order || !category || !detail.trim()) return
    const next: WarrantyClaim = {
      id: `CLM-2026-${String(claims.length + 100).padStart(3, "0")}`,
      orderId: order.id,
      product: order.product,
      reason: category,
      status: "dalam-proses",
      submittedAt: localStamp(),
    }
    setClaims((current) => [next, ...current])
    setFilter("semua")
    setOrderId("")
    setCategory("")
    setDetail("")
    setFileName("")
    setNote("")
    setOpen(false)
    setSelected(next)
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: "Klaim Garansi" },
        ]}
      />
      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-5 py-12 md:px-10 lg:py-16">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="flex max-w-[640px] flex-col gap-2">
            <h1 className="text-[28px] leading-tight font-medium tracking-[-0.02em] md:text-[36px]">
              {warrantyClaimsPage.title}
            </h1>
            <p className="text-sm leading-6 tracking-[-0.02em] text-subtle md:text-base">
              {warrantyClaimsPage.description}
            </p>
          </div>
          <Button type="button" size="pill" onClick={() => setOpen(true)}>
            <Plus aria-hidden />
            {warrantyClaimsPage.cta}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {warrantyClaimFilters.map((item) => {
            const selected = item.id === filter
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(item.id)}
                className={cn(
                  "h-9 rounded-full px-4 text-sm tracking-[-0.02em]",
                  selected
                    ? "bg-primary text-white"
                    : "border border-line bg-white text-black"
                )}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        {note && (
          <p className="text-sm tracking-[-0.02em] text-subtle">{note}</p>
        )}

        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[860px] text-left text-sm tracking-[-0.02em]">
            <thead className="bg-surface text-subtle">
              <tr>
                {[
                  "ID Klaim",
                  "Pesanan",
                  "Produk",
                  "Alasan Klaim",
                  "Status Klaim",
                  "Diajukan Pada",
                  "Aksi",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 font-medium whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-subtle"
                  >
                    Belum ada klaim di kategori ini.
                  </td>
                </tr>
              ) : (
                visible.map((claim) => (
                  <tr key={claim.id} className="border-t border-line">
                    <td className="px-4 py-4 font-medium">{claim.id}</td>
                    <td className="px-4 py-4">{claim.orderId}</td>
                    <td className="px-4 py-4">{claim.product}</td>
                    <td className="px-4 py-4">{claim.reason}</td>
                    <td
                      className={cn(
                        "px-4 py-4 font-medium whitespace-nowrap",
                        statusClass[claim.status]
                      )}
                    >
                      {warrantyClaimStatusLabel[claim.status]}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {claim.submittedAt}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => setSelected(claim)}
                        className="inline-flex h-9 items-center rounded-full border border-line px-3 text-sm whitespace-nowrap"
                      >
                        Lihat Investigasi
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={closeForm}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${formId}-title`}
            className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-2xl bg-white p-5 md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2
                  id={`${formId}-title`}
                  className="text-xl font-semibold tracking-[-0.02em]"
                >
                  {warrantyClaimForm.title}
                </h2>
                <p className="text-sm leading-6 tracking-[-0.02em] text-subtle">
                  {warrantyClaimForm.description}
                </p>
              </div>
              <button
                type="button"
                aria-label="Tutup"
                onClick={closeForm}
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={submitClaim}>
              <label className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
                {warrantyClaimForm.orderLabel}
                <select
                  required
                  value={orderId}
                  onChange={(event) => setOrderId(event.target.value)}
                  className="h-12 rounded-xl border border-line bg-white px-3 text-sm font-normal tracking-[-0.02em] outline-none focus-visible:border-primary"
                >
                  <option value="">{warrantyClaimForm.orderPlaceholder}</option>
                  {warrantyClaimOrders.map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.id} · {order.product}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
                {warrantyClaimForm.categoryLabel}
                <select
                  required
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-12 rounded-xl border border-line bg-white px-3 text-sm font-normal tracking-[-0.02em] outline-none focus-visible:border-primary"
                >
                  <option value="">
                    {warrantyClaimForm.categoryPlaceholder}
                  </option>
                  {warrantyClaimCategories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
                {warrantyClaimForm.detailLabel}
                <textarea
                  required
                  value={detail}
                  onChange={(event) => setDetail(event.target.value)}
                  placeholder={warrantyClaimForm.detailPlaceholder}
                  rows={4}
                  className="rounded-xl border border-line px-3 py-3 text-sm font-normal tracking-[-0.02em] outline-none placeholder:text-subtle focus-visible:border-primary"
                />
              </label>
              <div className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
                <p>{warrantyClaimForm.proofLabel}</p>
                <p>{warrantyClaimForm.proofTitle}</p>
                <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-line px-4 py-6 text-center font-normal">
                  <Upload className="size-5 text-subtle" aria-hidden />
                  <span className="text-sm text-subtle">
                    {fileName || warrantyClaimForm.proofHint}
                  </span>
                  <span className="inline-flex h-9 items-center gap-1 rounded-full bg-surface px-3 text-sm">
                    <Plus className="size-3.5" aria-hidden />
                    {warrantyClaimForm.proofButton}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) =>
                      setFileName(event.target.files?.[0]?.name ?? "")
                    }
                  />
                </label>
              </div>
              <div className="flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="text-sm tracking-[-0.02em] text-subtle"
                >
                  {warrantyClaimForm.cancel}
                </button>
                <Button type="submit" size="pill">
                  {warrantyClaimForm.submit}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selected && (
        <ClaimDetail claim={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}

function ClaimDetail({
  claim,
  onClose,
}: {
  claim: WarrantyClaim
  onClose: () => void
}) {
  const titleId = useId()
  const when = formatClaimTime(claim.submittedAt)
  const outcome =
    claim.status === "ditolak"
      ? "Klaim Ditolak (Laporan tidak valid)"
      : "Klaim Diterima (Admin akan segera menghubungi)"
  const steps = [
    { title: "Klaim Berhasil Diajukan", time: when, state: "done" as const },
    { title: "Klaim Dicek Sistem", time: when, state: "done" as const },
    {
      title: outcome,
      time: claim.status === "dalam-proses" ? "" : when,
      state:
        claim.status === "ditolak"
          ? ("failed" as const)
          : claim.status === "selesai"
            ? ("done" as const)
            : ("pending" as const),
    },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-[520px] rounded-2xl bg-white p-5 md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2
              id={titleId}
              className="text-xl font-semibold tracking-[-0.02em]"
            >
              Detail Klaim Garansi
            </h2>
            <p className="text-sm tracking-[-0.02em] text-subtle">
              Pesanan #{claim.orderId}
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <div className="rounded-xl bg-surface p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs font-medium tracking-[-0.02em] text-subtle">
              Status
            </p>
            <p
              className={cn(
                "text-sm font-medium tracking-[-0.02em]",
                statusClass[claim.status]
              )}
            >
              {cornerStatus[claim.status]}
            </p>
          </div>
          <ol className="flex flex-col gap-4">
            {steps.map((step) => (
              <li key={step.title} className="flex gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                    step.state === "done" && "bg-emerald-600 text-white",
                    step.state === "failed" && "bg-red-600 text-white",
                    step.state === "pending" && "border border-line bg-white"
                  )}
                  aria-hidden
                >
                  {step.state === "done" && (
                    <Check className="size-3" strokeWidth={3} />
                  )}
                  {step.state === "failed" && (
                    <X className="size-3" strokeWidth={3} />
                  )}
                </span>
                <span className="flex flex-col">
                  <span
                    className={cn(
                      "text-sm font-medium tracking-[-0.02em]",
                      step.state === "pending" && "text-subtle"
                    )}
                  >
                    {step.title}
                  </span>
                  {step.time && (
                    <span className="text-xs tracking-[-0.02em] text-subtle">
                      {step.time}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-sm tracking-[-0.02em] text-subtle">
            Diajukan pada: {when}
          </p>
          <Button type="button" variant="outline" size="pill" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  )
}
