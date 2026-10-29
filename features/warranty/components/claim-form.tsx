"use client"

import { ImagePlus, Loader2, Plus, X } from "lucide-react"
import Link from "next/link"
import { type FormEvent, useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { warrantyClaimForm } from "@/features/warranty/data/warranty-claims"
import { filesApi } from "@/lib/api/endpoints/files"
import { warrantyApi } from "@/lib/api/endpoints/warranty"
import { useAuthStore } from "@/lib/stores/auth"
import { guestEligibleOrders } from "../services/guest-claims"
import { cn } from "@/lib/utils"
import type { ClaimCategory, EligibleOrder } from "@/types/api"

import {
  claimCategories,
  EVIDENCE_MAX_FILES,
  EVIDENCE_TYPES,
  evidenceError,
} from "../services/claims"
import { ClaimModal } from "./claim-modal"

const MIN_DESCRIPTION = 20

interface Evidence {
  key: string
  name: string
  preview: string
  status: "uploading" | "done" | "error"
  fileId?: string
  error?: string
}

type Eligible =
  | { status: "loading" }
  | { status: "ready"; orders: EligibleOrder[] }
  | { status: "error"; message: string }

const fieldClass =
  "rounded-xl border border-line bg-white px-3 text-base font-normal tracking-[-0.02em] outline-none placeholder:text-subtle focus-visible:border-primary aria-invalid:border-red-500 md:text-sm"

/** Ajukan Klaim Garansi: eligible order, category, story, 1–3 screenshots. */
export function ClaimForm({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: (code: string) => void
}) {
  const ids = useId()
  const [eligible, setEligible] = useState<Eligible>({ status: "loading" })
  const [orderCode, setOrderCode] = useState("")
  const [category, setCategory] = useState<ClaimCategory | "">("")
  const [description, setDescription] = useState("")
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [fileError, setFileError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Guest screenshots share one upload token per form.
  const uploadToken = useRef<string | undefined>(undefined)
  const signedIn = useAuthStore((s) => s.status === "authenticated")

  useEffect(() => {
    let cancelled = false
    const load = signedIn
      ? warrantyApi.eligibleOrders()
      : guestEligibleOrders().then((orders) => ({
          success: true as const,
          data: orders,
        }))
    void load.then((res) => {
      if (cancelled) return
      setEligible(
        res.success
          ? { status: "ready", orders: res.data }
          : { status: "error", message: res.error.message }
      )
    })
    return () => {
      cancelled = true
    }
  }, [signedIn])

  // Release preview object URLs when the form closes.
  useEffect(
    () => () => evidence.forEach((e) => URL.revokeObjectURL(e.preview)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  async function addFiles(list: FileList | null) {
    setFileError(null)
    const picked = Array.from(list ?? [])
    const room = EVIDENCE_MAX_FILES - evidence.length
    if (picked.length > room)
      setFileError(`Maksimal ${EVIDENCE_MAX_FILES} screenshot.`)
    for (const file of picked.slice(0, Math.max(room, 0))) {
      const problem = evidenceError(file)
      if (problem) {
        setFileError(problem)
        continue
      }
      const key = `${file.name}-${file.size}-${Math.random()}`
      setEvidence((current) => [
        ...current,
        {
          key,
          name: file.name,
          preview: URL.createObjectURL(file),
          status: "uploading",
        },
      ])
      const res = await filesApi.upload(
        file,
        "claim_evidence",
        file.type,
        uploadToken.current
      )
      if (res.success) uploadToken.current ??= res.data.uploadToken
      setEvidence((current) =>
        current.map((e) =>
          e.key !== key
            ? e
            : res.success
              ? { ...e, status: "done", fileId: res.data.id }
              : { ...e, status: "error", error: res.error.message }
        )
      )
    }
  }

  function removeEvidence(key: string) {
    setEvidence((current) => {
      const gone = current.find((e) => e.key === key)
      if (gone) URL.revokeObjectURL(gone.preview)
      return current.filter((e) => e.key !== key)
    })
  }

  const uploading = evidence.some((e) => e.status === "uploading")
  const ready = evidence.filter((e) => e.status === "done")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    const next: Record<string, string> = {}
    if (!orderCode) next.orderCode = "Pilih pesanan yang ingin diklaim."
    if (!category) next.category = "Pilih kategori kendala."
    if (description.trim().length < MIN_DESCRIPTION)
      next.description = `Ceritakan kendalamu minimal ${MIN_DESCRIPTION} karakter.`
    if (!ready.length) next.evidence = "Lampirkan minimal 1 screenshot bukti."
    setErrors(next)
    if (Object.keys(next).length || uploading || !category) return

    setSubmitting(true)
    const res = await warrantyApi.create(
      {
        orderCode,
        category,
        description: description.trim(),
        evidenceFileIds: ready.map((e) => e.fileId!),
      },
      uploadToken.current
    )
    setSubmitting(false)
    if (res.success) {
      onCreated(res.data.code)
      return
    }
    const fields = res.error.details?.fieldErrors as
      Record<string, string[]> | undefined
    if (fields) {
      setErrors(
        Object.fromEntries(
          Object.entries(fields).map(([k, v]) => [
            k === "evidenceFileIds" ? "evidence" : k,
            v[0],
          ])
        )
      )
    }
    setFormError(res.error.message)
  }

  const orders = eligible.status === "ready" ? eligible.orders : []

  return (
    <ClaimModal
      title={warrantyClaimForm.title}
      description={warrantyClaimForm.description}
      onClose={onClose}
      locked={submitting}
    >
      {eligible.status === "ready" && orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line px-4 py-8 text-center">
          <p className="font-medium">Belum ada pesanan yang bisa diklaim.</p>
          <p className="text-sm leading-6 text-subtle">
            Klaim hanya untuk akun marketplace yang sudah dikirim dan masih
            dalam masa garansi, serta belum punya klaim yang sedang diproses.
          </p>
          <Button asChild variant="outline" size="pill">
            <Link href="/riwayat-pesanan">Lihat riwayat pesanan</Link>
          </Button>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={submit} noValidate>
          <Field
            id={`${ids}-order`}
            label={warrantyClaimForm.orderLabel}
            error={
              errors.orderCode ??
              (eligible.status === "error" ? eligible.message : undefined)
            }
          >
            <select
              id={`${ids}-order`}
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              disabled={eligible.status !== "ready"}
              aria-invalid={!!errors.orderCode}
              className={cn(fieldClass, "h-12")}
            >
              <option value="">
                {eligible.status === "loading"
                  ? "Memuat pesanan…"
                  : warrantyClaimForm.orderPlaceholder}
              </option>
              {orders.map((order) => (
                <option key={order.code} value={order.code}>
                  {order.code} · {order.productName} · {order.planName}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id={`${ids}-category`}
            label={warrantyClaimForm.categoryLabel}
            error={errors.category}
          >
            <select
              id={`${ids}-category`}
              value={category}
              onChange={(e) => setCategory(e.target.value as ClaimCategory)}
              aria-invalid={!!errors.category}
              className={cn(fieldClass, "h-12")}
            >
              <option value="">{warrantyClaimForm.categoryPlaceholder}</option>
              {claimCategories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id={`${ids}-description`}
            label={warrantyClaimForm.detailLabel}
            error={errors.description}
            hint={`${description.trim().length}/${MIN_DESCRIPTION} karakter minimal`}
          >
            <textarea
              id={`${ids}-description`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={warrantyClaimForm.detailPlaceholder}
              rows={4}
              maxLength={2000}
              aria-invalid={!!errors.description}
              className={cn(fieldClass, "py-3")}
            />
          </Field>

          <div className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
            <p>{warrantyClaimForm.proofTitle}</p>
            {evidence.length > 0 && (
              <ul className="grid grid-cols-3 gap-2">
                {evidence.map((e) => (
                  <li
                    key={e.key}
                    className={cn(
                      "relative overflow-hidden rounded-lg border",
                      e.status === "error" ? "border-red-400" : "border-line"
                    )}
                  >
                    {/* Local blob preview. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={e.preview}
                      alt={e.name}
                      className={cn(
                        "aspect-square w-full object-cover",
                        e.status !== "done" && "opacity-50"
                      )}
                    />
                    {e.status === "uploading" && (
                      <Loader2
                        className="absolute inset-0 m-auto size-5 animate-spin text-primary"
                        aria-label="Mengunggah"
                      />
                    )}
                    {e.status === "error" && (
                      <span className="absolute inset-x-0 bottom-0 bg-red-600 px-1 py-0.5 text-[11px] font-normal text-white">
                        Gagal
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label={`Hapus ${e.name}`}
                      onClick={() => removeEvidence(e.key)}
                      className="absolute top-1 right-1 flex size-6 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow"
                    >
                      <X className="size-3.5" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {evidence.length < EVIDENCE_MAX_FILES && (
              <label
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-6 text-center font-normal hover:border-primary",
                  errors.evidence ? "border-red-500" : "border-line"
                )}
              >
                <ImagePlus className="size-5 text-subtle" aria-hidden />
                <span className="text-sm text-subtle">
                  {warrantyClaimForm.proofHint} (JPG/PNG/WEBP, maks. 5 MB,{" "}
                  {EVIDENCE_MAX_FILES - evidence.length} lagi)
                </span>
                <span className="inline-flex h-9 items-center gap-1 rounded-full bg-surface px-3 text-sm">
                  <Plus className="size-3.5" aria-hidden />
                  {warrantyClaimForm.proofButton}
                </span>
                <input
                  type="file"
                  accept={EVIDENCE_TYPES.join(",")}
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    void addFiles(e.target.files)
                    e.target.value = ""
                  }}
                />
              </label>
            )}
            {(fileError ?? errors.evidence) && (
              <p className="text-xs font-normal text-red-600">
                {fileError ?? errors.evidence}
              </p>
            )}
            {evidence
              .filter((e) => e.error)
              .map((e) => (
                <p key={e.key} className="text-xs font-normal text-red-600">
                  {e.name}: {e.error}
                </p>
              ))}
          </div>

          {formError && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {formError}
            </p>
          )}

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="cursor-pointer text-sm tracking-[-0.02em] text-subtle hover:text-black"
            >
              {warrantyClaimForm.cancel}
            </button>
            <Button
              type="submit"
              size="pill"
              disabled={submitting || uploading}
            >
              {(submitting || uploading) && (
                <Loader2 className="animate-spin" aria-hidden />
              )}
              {uploading ? "Mengunggah…" : warrantyClaimForm.submit}
            </Button>
          </div>
        </form>
      )}
    </ClaimModal>
  )
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? (
        <p className="text-xs font-normal text-red-600">{error}</p>
      ) : (
        hint && <p className="text-xs font-normal text-subtle">{hint}</p>
      )}
    </div>
  )
}
