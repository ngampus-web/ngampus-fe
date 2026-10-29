"use client"

import {
  ArrowUpRight,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  ShoppingBag,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import { Button } from "@/components/ui/button"
import { formatFileSize, rupiah } from "@/features/payment/services/order-rules"
import { ordersApi } from "@/lib/api/endpoints/orders"
import type { OrderSummary } from "@/types/api"

import {
  filterLabel,
  formatOrderDate,
  type HistoryCounts,
  historyStatus,
  type OrderSection,
  readCounts,
  sections,
  serviceLabels,
  type StatusTone,
} from "../services/order-history"

const PER_PAGE = 10

const sectionIcons = { document: FileText, marketplace: ShoppingBag }

const toneClass: Record<StatusTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  progress: "border-orange-200 bg-orange-50 text-orange-700",
  waiting: "border-amber-200 bg-amber-50 text-amber-700",
  muted: "border-line bg-surface text-subtle",
}

interface HistoryState {
  /** Request this state answers; differs from the current one while loading. */
  key: string
  items: OrderSummary[]
  counts: HistoryCounts
  hasMore: boolean
  error?: string
}

const initial: HistoryState = {
  key: "",
  items: [],
  counts: { total: 0, completed: 0, processing: 0, unpaid: 0 },
  hasMore: false,
}

/** The signed-in user's orders from `GET /orders`, one section at a time. */
export function OrderHistory() {
  const [section, setSection] = useState<OrderSection>("document")
  const [query, setQuery] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [state, setState] = useState<HistoryState>(initial)
  const [reloadKey, setReloadKey] = useState(0)
  const requestKey = `${section}|${search}|${page}|${reloadKey}`
  const loading = state.key !== requestKey

  // Debounce typing into the API search.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(query.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    let cancelled = false
    ordersApi
      .list({ kind: section, q: search || undefined, page, perPage: PER_PAGE })
      .then((res) => {
        if (cancelled) return
        setState((s) =>
          res.success
            ? {
                key: requestKey,
                items: page === 1 ? res.data : [...s.items, ...res.data],
                counts: readCounts(res.meta),
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
  }, [section, search, page, requestKey])

  function selectSection(next: OrderSection) {
    if (next === section) return
    setSection(next)
    setPage(1)
  }

  function reload() {
    setPage(1)
    setReloadKey((k) => k + 1)
  }

  const sectionLabel = sections.find((s) => s.id === section)!.label
  // A new section, search or reload replaces the list; "load more" appends.
  const firstLoad = loading && page === 1
  const failed = !loading && !!state.error

  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "Riwayat Pesanan" }]}
      />
      <section className="mx-auto flex w-full max-w-[960px] flex-col gap-6 px-5 py-12 md:px-10 lg:py-16">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-black">
            Order History
          </h1>
          <Button
            type="button"
            variant="outline"
            size="pill"
            onClick={reload}
            disabled={loading}
          >
            <RefreshCw aria-hidden className={loading ? "animate-spin" : ""} />
            Muat ulang
          </Button>
        </div>

        <div
          role="tablist"
          aria-label="Jenis pesanan"
          className="flex flex-wrap gap-3"
        >
          {sections.map((item) => {
            const Icon = sectionIcons[item.id]
            const active = section === item.id
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectSection(item.id)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${active ? "border-primary bg-primary text-white" : "border-line bg-white text-subtle hover:border-primary hover:text-primary"}`}
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {(
              [
                [`${state.counts.total} Total`, "bg-slate-400"],
                [`${state.counts.completed} Selesai`, "bg-emerald-500"],
                [`${state.counts.processing} Diproses`, "bg-orange-400"],
                [`${state.counts.unpaid} Tidak Dibayar`, "bg-red-500"],
              ] as const
            ).map(([label, color]) => (
              <span
                key={label}
                className="flex items-center gap-2 rounded-full border border-line px-3 py-2"
              >
                <span className={`size-2 rounded-full ${color}`} aria-hidden />
                {label}
              </span>
            ))}
          </div>
          <label className="relative block md:w-80">
            <span className="sr-only">Cari pesanan</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-subtle"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                section === "marketplace"
                  ? "Cari kode order atau produk"
                  : "Cari kode order atau nama file"
              }
              className="h-12 w-full rounded-xl border border-transparent bg-surface pr-4 pl-11 text-base tracking-[-0.02em] outline-none placeholder:text-subtle focus-visible:border-primary md:text-sm"
            />
          </label>
        </div>

        <div aria-live="polite" aria-busy={loading}>
          {firstLoad ? (
            <HistorySkeleton />
          ) : failed && state.items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line p-8 text-center">
              <p className="font-medium">Riwayat pesanan gagal dimuat.</p>
              <p className="mt-2 text-sm leading-6 text-subtle">
                {state.error}
              </p>
              <Button
                type="button"
                className="mt-4 rounded-xl"
                onClick={reload}
              >
                Coba lagi
              </Button>
            </div>
          ) : state.items.length === 0 ? (
            <EmptyHistory section={section} searching={!!search} />
          ) : (
            <>
              <p className="sr-only">
                {state.counts.total} pesanan {sectionLabel}
              </p>
              <ul className="flex flex-col gap-4">
                {state.items.map((order) => (
                  <OrderCard key={order.code} order={order} />
                ))}
              </ul>
              {failed && (
                <p className="mt-4 text-center text-sm text-red-600">
                  {state.error}
                </p>
              )}
              {state.hasMore && (
                <div className="mt-6 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="pill"
                    disabled={loading}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    {loading && (
                      <Loader2 className="animate-spin" aria-hidden />
                    )}
                    Muat lebih banyak
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}

export function OrderCard({ order }: { order: OrderSummary }) {
  const status = historyStatus[order.status]
  const isDocument = order.kind !== "marketplace"
  return (
    <li className="min-w-0 rounded-3xl border border-line p-5 shadow-sm transition-colors hover:border-primary/50 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-subtle">
            {serviceLabels[order.kind]}
          </p>
          <Link
            href={`/pembayaran/${order.code}`}
            className="mt-2 flex items-start gap-2 font-semibold hover:text-primary"
          >
            <span className="min-w-0 break-words">{order.title}</span>
            <ArrowUpRight className="mt-0.5 size-4 shrink-0" aria-hidden />
          </Link>
        </div>
        <span
          className={`rounded-xl border px-3 py-1.5 text-xs font-medium ${toneClass[status.tone]}`}
        >
          {status.label}
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 break-all text-subtle">
        {order.code} · {formatOrderDate(order.createdAt)} WIB ·{" "}
        <span className="font-medium text-black tabular-nums">
          {rupiah(order.total)}
        </span>
      </p>
      {isDocument && order.fileName && (
        <p className="mt-4 text-sm break-all text-subtle">
          {order.fileName}
          {order.fileSizeBytes != null &&
            ` · ${formatFileSize(order.fileSizeBytes)}`}
        </p>
      )}
      {order.kind === "turnitin" && !!order.filters?.length && (
        <div className="mt-3 flex flex-wrap gap-2">
          {order.filters.map((filter) => (
            <span
              key={filter}
              className="rounded-full bg-surface px-3 py-1 text-xs text-subtle"
            >
              {filterLabel(filter)}
            </span>
          ))}
        </div>
      )}
    </li>
  )
}

function EmptyHistory({
  section,
  searching,
}: {
  section: OrderSection
  searching: boolean
}) {
  if (searching)
    return (
      <div className="rounded-3xl border border-dashed border-line p-8 text-center">
        <p className="font-medium">Tidak ada pesanan yang cocok.</p>
        <p className="mt-2 text-sm leading-6 text-subtle">
          Periksa lagi kode order,{" "}
          {section === "marketplace" ? "nama produk" : "nama file"}, atau pilih
          jenis pesanan lainnya.
        </p>
      </div>
    )
  return (
    <div className="rounded-3xl border border-dashed border-line p-8 text-center">
      <p className="font-medium">Belum ada pesanan.</p>
      <p className="mt-2 text-sm leading-6 text-subtle">
        Pesanan yang kamu buat akan muncul di sini.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-xl">
          <Link href="/marketplace">Lihat Marketplace</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/cek-plagiarisme">Cek Plagiarisme</Link>
        </Button>
      </div>
    </div>
  )
}

function HistorySkeleton() {
  return (
    <ul className="flex flex-col gap-4" aria-label="Memuat riwayat pesanan">
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="animate-pulse rounded-3xl border border-line p-5 md:p-6"
        >
          <div className="h-3 w-24 rounded bg-surface" />
          <div className="mt-3 h-5 w-2/3 rounded bg-surface" />
          <div className="mt-4 h-3 w-1/2 rounded bg-surface" />
        </li>
      ))}
    </ul>
  )
}
