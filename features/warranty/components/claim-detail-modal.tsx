"use client"

import { Check, Loader2, X } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { warrantyApi } from "@/lib/api/endpoints/warranty"
import { cn } from "@/lib/utils"
import type { ClaimDetail } from "@/types/api"

import {
  categoryLabel,
  claimStatus,
  claimSteps,
  cornerStatus,
  formatClaimTime,
  toneClass,
} from "../services/claims"
import { ClaimModal } from "./claim-modal"

type Loaded =
  { code: string; claim: ClaimDetail } | { code: string; error: string }

/** Detail Klaim Garansi: timeline, complaint, admin message, screenshots. */
export function ClaimDetailModal({
  code,
  onClose,
}: {
  code: string
  onClose: () => void
}) {
  const [loaded, setLoaded] = useState<Loaded | null>(null)

  useEffect(() => {
    let cancelled = false
    warrantyApi.get(code).then((res) => {
      if (cancelled) return
      setLoaded(
        res.success
          ? { code, claim: res.data }
          : {
              code,
              error:
                res.error.status === 404
                  ? "Klaim tidak ditemukan."
                  : res.error.message,
            }
      )
    })
    return () => {
      cancelled = true
    }
  }, [code])

  const current = loaded?.code === code ? loaded : null
  const claim = current && "claim" in current ? current.claim : null

  return (
    <ClaimModal
      title="Detail Klaim Garansi"
      description={
        claim
          ? `Pesanan #${claim.orderCode} · ${claim.productName}${claim.planName ? ` · ${claim.planName}` : ""}`
          : code
      }
      onClose={onClose}
    >
      {!current ? (
        <div className="flex justify-center py-10 text-subtle">
          <Loader2 className="size-6 animate-spin" aria-label="Memuat" />
        </div>
      ) : !claim ? (
        <p className="py-6 text-center text-sm text-subtle">
          {"error" in current ? current.error : ""}
        </p>
      ) : (
        <ClaimBody claim={claim} />
      )}
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm tracking-[-0.02em] text-subtle">
          {claim && `Diajukan pada: ${formatClaimTime(claim.createdAt)}`}
        </p>
        <Button type="button" variant="outline" size="pill" onClick={onClose}>
          Tutup
        </Button>
      </div>
    </ClaimModal>
  )
}

function ClaimBody({ claim }: { claim: ClaimDetail }) {
  const steps = claimSteps(claim.status, claim.timeline)
  const tone = claimStatus(claim.status).tone
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl bg-surface p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-xs font-medium tracking-[-0.02em] text-subtle">
            {claim.code}
          </p>
          <p
            className={cn(
              "text-sm font-medium tracking-[-0.02em]",
              toneClass[tone]
            )}
          >
            {cornerStatus(claim.status)}
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
              <span className="flex min-w-0 flex-col">
                <span
                  className={cn(
                    "text-sm font-medium tracking-[-0.02em]",
                    step.state === "pending" && "text-subtle"
                  )}
                >
                  {step.title}
                </span>
                {step.at && (
                  <span className="text-xs tracking-[-0.02em] text-subtle">
                    {formatClaimTime(step.at)}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {claim.customerMessage && (
        <div
          className={cn(
            "rounded-xl border p-4",
            claim.status === "rejected"
              ? "border-red-200 bg-red-50"
              : "border-line"
          )}
        >
          <p className="text-xs font-medium text-subtle">Pesan dari admin</p>
          <p className="mt-1 text-sm leading-6 whitespace-pre-line">
            {claim.customerMessage}
          </p>
        </div>
      )}

      <div>
        <p className="text-sm font-medium">Laporan keluhan</p>
        <p className="mt-1 text-xs text-subtle">
          {categoryLabel(claim.category)}
        </p>
        <p className="mt-2 text-sm leading-6 whitespace-pre-line text-subtle">
          {claim.description}
        </p>
      </div>

      {claim.evidence.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {claim.evidence.map((e) =>
            e.url ? (
              <a
                key={e.id}
                href={e.url}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-lg border border-line"
              >
                {/* Short-lived signed URL: next/image cannot cache it. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={e.url}
                  alt={`Bukti ${e.fileName}`}
                  className="aspect-square w-full object-cover"
                />
              </a>
            ) : null
          )}
        </div>
      )}
    </div>
  )
}
