"use client"

import { RefreshCw, FileText, ShoppingBag, ArrowUpRight } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  listPreviewOrders,
  subscribeOrders,
} from "@/features/payment/services/preview-gateway"
import {
  effectiveStatus,
  formatFileSize,
  rupiah,
  statusLabels,
} from "@/features/payment/services/order-rules"
import type { PaymentOrder } from "@/features/payment/types"
import { filterOrders, type OrderCategory } from "../services/filter-orders"

const categories = [
  { id: "plagiarism", label: "Plagiarisme Checker", icon: FileText },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
] as const

export function OrderHistory() {
  const [query, setQuery] = useState("")
  const [submitted, setSubmitted] = useState<string | null>(null)
  const [category, setCategory] = useState<OrderCategory>("plagiarism")
  const [orders, setOrders] = useState<PaymentOrder[]>([])
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const unsubscribe = subscribeOrders(() => setOrders(listPreviewOrders()))
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => {
      unsubscribe()
      clearInterval(timer)
    }
  }, [])
  function reload() {
    setOrders(listPreviewOrders())
    setNow(Date.now())
  }
  const results = filterOrders(orders, submitted ?? "", category)
  const completed = results.filter(
    (order) => effectiveStatus(order, now) === "completed"
  ).length
  const processing = results.filter(
    (order) => effectiveStatus(order, now) === "processing"
  ).length
  const unpaid = results.length - completed - processing
  const categoryLabel = categories.find((item) => item.id === category)!.label
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
          <Button type="button" variant="outline" size="pill" onClick={reload}>
            <RefreshCw aria-hidden />
            Muat ulang
          </Button>
        </div>
        <form
          className="flex flex-col gap-4 rounded-3xl border border-line p-5 md:p-6"
          onSubmit={(event) => {
            event.preventDefault()
            const value = query.trim()
            if (!value) return
            setSubmitted(value)
            reload()
          }}
        >
          <label
            htmlFor="order-query"
            className="text-sm tracking-[-0.02em] text-subtle"
          >
            Masukkan nomor WhatsApp atau kode order.
          </label>
          <div className="flex gap-3">
            <input
              id="order-query"
              type="text"
              name="order"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nomor WhatsApp atau kode order"
              autoComplete="tel"
              required
              className="h-12 min-w-0 flex-1 rounded-xl border border-transparent bg-surface px-4 text-sm tracking-[-0.02em] outline-none placeholder:text-subtle focus-visible:border-primary"
            />
            <Button type="submit" className="h-12 rounded-xl px-6">
              Cari
            </Button>
          </div>
        </form>
        <div
          role="group"
          aria-label="Filter kategori pesanan"
          className="flex flex-wrap gap-3"
        >
          {categories.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={category === item.id}
                onClick={() => setCategory(item.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${category === item.id ? "border-primary bg-primary text-white" : "border-line bg-white text-subtle hover:border-primary hover:text-primary"}`}
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </button>
            )
          })}
        </div>
        <div aria-live="polite" aria-atomic="true">
          <p className="text-sm leading-6 text-subtle">
            {submitted
              ? `Menampilkan ${results.length} pesanan ${categoryLabel} untuk “${submitted}”.`
              : "Cari pesananmu, lalu pilih kategori untuk melihat riwayatnya."}
          </p>
        </div>
        {submitted && (
          <>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              {[
                [`${results.length} Total`, "bg-slate-400"],
                [`${completed} Selesai`, "bg-emerald-500"],
                [`${processing} Diproses`, "bg-orange-400"],
                [`${unpaid} Tidak Dibayar`, "bg-red-500"],
              ].map(([label, color]) => (
                <span
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-line px-3 py-2"
                >
                  <span className={`size-2 rounded-full ${color}`} />
                  {label}
                </span>
              ))}
            </div>
            {results.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-line p-8 text-center">
                <p className="font-medium">
                  Belum ada pesanan {categoryLabel} yang cocok.
                </p>
                <p className="mt-2 text-sm leading-6 text-subtle">
                  Periksa nomor WhatsApp atau kode order, atau pilih kategori
                  lainnya.
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-4">
                {results.map((order) => {
                  const d = order.details
                  const status = effectiveStatus(order, now)
                  return (
                    <li
                      key={order.id}
                      className="min-w-0 rounded-3xl border border-line p-5 shadow-sm md:p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-subtle">
                            {d.title}
                          </p>
                          <Link
                            href={`/pembayaran/${order.id}`}
                            className="mt-2 flex items-start gap-2 font-semibold hover:text-primary"
                          >
                            <span className="min-w-0 break-words">
                              {d.kind === "marketplace"
                                ? `${d.title} · ${d.plan}`
                                : d.fileName}
                            </span>
                            <ArrowUpRight className="mt-0.5 size-4 shrink-0" />
                          </Link>
                        </div>
                        <span
                          className={`rounded-xl border border-line px-3 py-1.5 text-xs font-medium ${status === "completed" ? "text-emerald-700" : status === "processing" ? "text-orange-700" : "text-subtle"}`}
                        >
                          {statusLabels[status]}
                        </span>
                      </div>
                      <p className="mt-3 text-xs leading-5 break-all text-subtle">
                        {order.id} ·{" "}
                        {new Intl.DateTimeFormat("id-ID", {
                          dateStyle: "medium",
                          timeZone: "Asia/Jakarta",
                        }).format(new Date(order.createdAt))}{" "}
                        · {rupiah(order.amount)}
                      </p>
                      <p className="mt-4 text-sm text-subtle">
                        {d.kind === "marketplace"
                          ? `Durasi ${d.duration}`
                          : `${d.fileName} · ${formatFileSize(d.fileSize)}`}
                      </p>
                      {d.kind === "document" && d.filters.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {d.filters.map((filter) => (
                            <span
                              key={filter}
                              className="rounded-full bg-surface px-3 py-1 text-xs text-subtle"
                            >
                              {filter}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </>
        )}
      </section>
    </>
  )
}
