"use client"

import { Loader2, Plus } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import { Button } from "@/components/ui/button"
import { warrantyClaimsPage } from "@/features/warranty/data/warranty-claims"
import { warrantyApi } from "@/lib/api/endpoints/warranty"
import { cn } from "@/lib/utils"
import type { ClaimSummary } from "@/types/api"

import {
  categoryLabel,
  type ClaimFilter,
  claimFilters,
  claimStatus,
  formatClaimTime,
  toneClass,
} from "../services/claims"
import { ClaimDetailModal } from "./claim-detail-modal"
import { ClaimForm } from "./claim-form"

const PER_PAGE = 10

interface ListState {
  /** Request this state answers; differs from the current one while loading. */
  key: string
  items: ClaimSummary[]
  hasMore: boolean
  error?: string
}

/** Pusat Klaim Garansi: the signed-in user's claims from the API. */
export function WarrantyClaims() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // `?klaim=CLM-…` (link in the WhatsApp message) opens that claim.
  const selected = searchParams.get("klaim")
  const [filter, setFilter] = useState<ClaimFilter>("semua")
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)
  const [state, setState] = useState<ListState>({
    key: "",
    items: [],
    hasMore: false,
  })
  const [formOpen, setFormOpen] = useState(false)
  const requestKey = `${filter}|${page}|${reloadKey}`
  const loading = state.key !== requestKey

  useEffect(() => {
    let cancelled = false
    warrantyApi
      .list({
        status: filter === "semua" ? undefined : filter,
        page,
        perPage: PER_PAGE,
      })
      .then((res) => {
        if (cancelled) return
        setState((s) =>
          res.success
            ? {
                key: requestKey,
                items: page === 1 ? res.data : [...s.items, ...res.data],
                hasMore: page < (res.meta?.totalPages ?? 1),
              }
            : {
                ...s,
                key: requestKey,
                items: page === 1 ? [] : s.items,
                error: res.error.message,
              }
        )
      })
    return () => {
      cancelled = true
    }
  }, [filter, page, requestKey])

  function openClaim(code: string | null) {
    const next = new URLSearchParams(searchParams.toString())
    if (code) next.set("klaim", code)
    else next.delete("klaim")
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  function selectFilter(next: ClaimFilter) {
    setFilter(next)
    setPage(1)
  }

  const firstLoad = loading && page === 1
  const failed = !loading && !!state.error

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
          <Button type="button" size="pill" onClick={() => setFormOpen(true)}>
            <Plus aria-hidden />
            {warrantyClaimsPage.cta}
          </Button>
        </div>

        <div
          role="tablist"
          aria-label="Status klaim"
          className="flex flex-wrap gap-2"
        >
          {claimFilters.map((item) => {
            const active = item.id === filter
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectFilter(item.id)}
                className={cn(
                  "h-9 cursor-pointer rounded-full px-4 text-sm tracking-[-0.02em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  active
                    ? "bg-primary text-white"
                    : "border border-line bg-white text-black hover:border-primary"
                )}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        <div
          className="overflow-x-auto rounded-2xl border border-line"
          aria-busy={loading}
        >
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
              {firstLoad ? (
                [0, 1, 2].map((i) => (
                  <tr key={i} className="border-t border-line">
                    <td colSpan={7} className="px-4 py-4">
                      <div className="h-4 w-full animate-pulse rounded bg-surface" />
                    </td>
                  </tr>
                ))
              ) : failed && state.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center">
                    <p className="text-subtle">{state.error}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="pill"
                      className="mt-3"
                      onClick={() => {
                        setPage(1)
                        setReloadKey((k) => k + 1)
                      }}
                    >
                      Coba lagi
                    </Button>
                  </td>
                </tr>
              ) : state.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-subtle"
                  >
                    {filter === "semua"
                      ? "Belum ada klaim. Ajukan klaim kalau akun marketplace-mu bermasalah selama masa garansi."
                      : "Belum ada klaim di kategori ini."}
                  </td>
                </tr>
              ) : (
                state.items.map((claim) => {
                  const status = claimStatus(claim.status)
                  return (
                    <tr key={claim.code} className="border-t border-line">
                      <td className="px-4 py-4 font-medium">{claim.code}</td>
                      <td className="px-4 py-4">{claim.orderCode}</td>
                      <td className="px-4 py-4">{claim.productName}</td>
                      <td className="px-4 py-4">
                        {categoryLabel(claim.category)}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-4 font-medium whitespace-nowrap",
                          toneClass[status.tone]
                        )}
                      >
                        {status.label}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {formatClaimTime(claim.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => openClaim(claim.code)}
                          className="inline-flex h-9 cursor-pointer items-center rounded-full border border-line px-3 text-sm whitespace-nowrap hover:border-primary hover:text-primary"
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        {state.hasMore && !firstLoad && (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="pill"
              disabled={loading}
              onClick={() => setPage((p) => p + 1)}
            >
              {loading && <Loader2 className="animate-spin" aria-hidden />}
              Muat lebih banyak
            </Button>
          </div>
        )}
      </section>

      {formOpen && (
        <ClaimForm
          onClose={() => setFormOpen(false)}
          onCreated={(code) => {
            setFormOpen(false)
            setFilter("semua")
            setPage(1)
            setReloadKey((k) => k + 1)
            openClaim(code)
          }}
        />
      )}
      {selected && (
        <ClaimDetailModal code={selected} onClose={() => openClaim(null)} />
      )}
    </>
  )
}
