"use client"
import { notify } from "@/lib/toast"

import { FileText, Loader2, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { loginHref } from "@/features/auth/components/require-auth"
import { ordersApi } from "@/lib/api/endpoints/orders"
import { orderTokens } from "@/lib/orders/order-tokens"

const CODE = /^[A-Z]{3}-[0-9A-Z]{8}$/
const inputStyle =
  "h-12 w-full rounded-xl border border-line bg-white px-4 text-base tracking-[-0.02em] outline-none placeholder:text-subtle focus-visible:border-primary md:text-sm"

/**
 * Shown when an order cannot be opened from this browser. WhatsApp sometimes
 * links only part of a long URL, so the token (or even the code) is lost; the
 * buyer reopens the order with its code and WhatsApp number instead.
 */
export function OrderUnlock({
  code: initialCode,
  onUnlocked,
}: {
  code: string
  /** Same code as the page: reload it in place. */
  onUnlocked: () => void
}) {
  const router = useRouter()
  const [code, setCode] = useState(initialCode.toUpperCase())
  const [whatsapp, setWhatsapp] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const invoice = code.trim().toUpperCase()
    if (!CODE.test(invoice)) {
      setError(
        "Nomor pesanan belum lengkap. Salin dari pesan WhatsApp, contoh: MKT-7K2M9QXA."
      )
      return
    }
    if (!whatsapp.trim()) {
      setError("Isi nomor WhatsApp yang dipakai saat memesan.")
      return
    }
    setBusy(true)
    setError("")
    const res = await ordersApi.lookup(invoice, whatsapp)
    setBusy(false)
    if (!res.success) {
      notify.error(res.error)
      setError(res.error.message)
      return
    }
    orderTokens.save(res.data.code, res.data.accessToken)
    notify.success("Pesanan ditemukan.")
    if (res.data.code === initialCode.toUpperCase()) onUnlocked()
    else router.replace(`/pembayaran/${res.data.code}`)
  }

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-6 px-5 py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <FileText className="size-10 text-primary" aria-hidden />
        <h1 className="text-2xl font-semibold">Buka pesanan</h1>
        <p className="text-sm leading-6 text-subtle">
          Tautan ini belum bisa membuka pesananmu, misalnya karena tautan dari
          WhatsApp terpotong. Masukkan nomor pesanan dan nomor WhatsApp yang
          dipakai saat memesan.
        </p>
      </div>
      <form
        onSubmit={submit}
        noValidate
        className="flex flex-col gap-4 rounded-3xl border border-line p-5 shadow-sm"
      >
        <label className="flex flex-col gap-2 text-sm font-medium">
          No. Pesanan
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Contoh: MKT-7K2M9QXA"
            autoCapitalize="characters"
            autoComplete="off"
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
            autoFocus
            className={inputStyle}
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <Button type="submit" size="pill" disabled={busy}>
          {busy ? (
            <Loader2 className="animate-spin" aria-hidden />
          ) : (
            <Search aria-hidden />
          )}
          Buka pesanan
        </Button>
      </form>
      <div className="flex flex-col items-center gap-2 text-sm">
        <Link
          href={loginHref(`/pembayaran/${initialCode}`)}
          className="text-primary hover:underline"
        >
          Masuk ke akun yang dipakai memesan
        </Link>
        <Link href="/marketplace" className="text-subtle hover:underline">
          Kembali ke Marketplace
        </Link>
      </div>
    </section>
  )
}
