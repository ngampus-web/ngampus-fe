"use client"

import { Loader2, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import { Button } from "@/components/ui/button"
import { loginHref } from "@/features/auth/components/require-auth"
import { ordersApi } from "@/lib/api/endpoints/orders"
import { orderTokens } from "@/lib/orders/order-tokens"
import type { OrderSummary } from "@/types/api"

import { OrderCard } from "./order-history"

const inputStyle =
  "h-12 w-full rounded-xl border border-line bg-white px-4 text-base tracking-[-0.02em] outline-none placeholder:text-subtle focus-visible:border-primary md:text-sm"

/** Guests: find one order by invoice + WhatsApp, and see orders opened in this browser. */
export function GuestOrderLookup() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [recent, setRecent] = useState<OrderSummary[] | null>(null)

  useEffect(() => {
    let cancelled = false
    const codes = orderTokens.codes().slice(0, 10)
    void Promise.all(codes.map((c) => ordersApi.get(c))).then((results) => {
      if (cancelled) return
      setRecent(results.flatMap((r) => (r.success ? [r.data] : [])))
    })
    return () => {
      cancelled = true
    }
  }, [])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const invoice = code.trim().toUpperCase()
    if (!/^[A-Z]{3}-[0-9A-Z]{8}$/.test(invoice)) {
      setError("Nomor invoice tidak valid. Contoh: MKT-7K2M9QXA.")
      return
    }
    setBusy(true)
    setError("")
    const res = await ordersApi.lookup(invoice, whatsapp)
    if (!res.success) {
      setBusy(false)
      setError(res.error.message)
      return
    }
    orderTokens.save(res.data.code, res.data.accessToken)
    router.push(`/pembayaran/${res.data.code}`)
  }

  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "Riwayat Pesanan" }]}
      />
      <section className="mx-auto flex w-full max-w-[960px] flex-col gap-6 px-5 py-12 md:px-10 lg:py-16">
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-black">
          Order History
        </h1>

        <form
          onSubmit={submit}
          noValidate
          className="flex flex-col gap-4 rounded-3xl border border-line p-5 shadow-sm md:p-6"
        >
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold">Cek Pesanan</h2>
            <p className="text-sm leading-6 text-subtle">
              Masukkan nomor invoice dan nomor WhatsApp yang kamu pakai saat
              memesan. Nomor invoice ada di pesan WhatsApp atau email pesananmu.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium">
              No. Invoice
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Contoh: MKT-7K2M9QXA"
                autoCapitalize="characters"
                className={inputStyle}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              No. WhatsApp
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Nomor WhatsApp"
                autoComplete="tel"
                className={inputStyle}
              />
            </label>
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={loginHref("/riwayat-pesanan")}
              className="text-sm text-primary hover:underline"
            >
              Masuk untuk melihat semua pesanan akunmu
            </Link>
            <Button type="submit" size="pill" disabled={busy}>
              {busy ? (
                <Loader2 className="animate-spin" aria-hidden />
              ) : (
                <Search aria-hidden />
              )}
              Cek Pesanan
            </Button>
          </div>
        </form>

        {recent === null ? null : recent.length > 0 ? (
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold">Pesanan di browser ini</h2>
            <ul className="flex flex-col gap-4">
              {recent.map((order) => (
                <OrderCard key={order.code} order={order} />
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </>
  )
}
