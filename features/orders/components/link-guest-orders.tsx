"use client"
import { notify } from "@/lib/toast"
import { UserFacingError } from "@/lib/errors"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ordersApi } from "@/lib/api/endpoints/orders"
import { orderTokens } from "@/lib/orders/order-tokens"
import { useAuthStore } from "@/lib/stores/auth"
import { loginHref } from "@/features/auth/components/require-auth"

export function LinkGuestOrders({
  code,
  ownership,
  onLinked,
}: {
  code: string
  ownership?: "guest" | "mine" | "other"
  onLinked: () => Promise<void>
}) {
  const { status, user } = useAuthStore()
  const [token, setToken] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const [saved, setSaved] = useState(false)

  function prepare() {
    const saved = orderTokens.get(code)
    setToken(saved ?? null)
    setMessage(
      saved
        ? ""
        : "Buka tautan pesanan atau cari dengan nomor invoice dan WhatsApp terlebih dahulu."
    )
  }

  async function link() {
    if (!token) return
    setBusy(true)
    try {
      const res = await ordersApi.link({ code, token })
      if (!res.success) {
        notify.error(res.error)
        setMessage(res.error.message)
        return
      }
      setToken(null)
      if (res.data.linked) {
        notify.success("Pesanan tersimpan ke akunmu.")
        setSaved(true)
        await onLinked()
      }
      if (!res.data.linked)
        notify.error(
          new UserFacingError(
            "Tautan pesanan tidak berlaku atau pesanan sudah terhubung ke akun lain."
          )
        )
      setMessage(
        res.data.linked
          ? "Pesanan tersimpan ke akun."
          : "Tautan pesanan tidak berlaku atau pesanan sudah terhubung ke akun lain."
      )
    } catch {
      notify.error(
        new UserFacingError("Gagal menautkan pesanan. Silakan coba lagi.")
      )
      setMessage("Gagal menautkan pesanan. Silakan coba lagi.")
    } finally {
      setBusy(false)
    }
  }

  if (status !== "authenticated" && status !== "guest") return null
  if (ownership === "mine" || saved)
    return (
      <p role="status" className="my-5 text-sm text-subtle">
        Pesanan ini sudah tersimpan ke akunmu.{" "}
        <Link href="/riwayat-pesanan" className="text-primary hover:underline">
          Lihat riwayat pesanan
        </Link>
      </p>
    )
  if (ownership !== "guest") return null
  const next = `/pembayaran/${encodeURIComponent(code)}`
  return (
    <div className="my-5 rounded-2xl border border-line p-5 text-sm">
      {status === "guest" ? (
        <Button asChild variant="outline">
          <Link href={loginHref(next)}>
            Login / daftar untuk menyimpan pesanan
          </Link>
        </Button>
      ) : token ? (
        <>
          <p>
            Tambahkan pesanan {code} ke akun {user?.email}?
          </p>
          <div className="mt-3 flex gap-3">
            <Button onClick={link} disabled={busy}>
              {busy ? "Menyimpan…" : "Ya, tambahkan ke akun"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setToken(null)}
              disabled={busy}
            >
              Batal
            </Button>
          </div>
        </>
      ) : (
        <Button variant="outline" onClick={prepare}>
          Simpan pesanan ke akun
        </Button>
      )}
      {message && (
        <p role="status" className="mt-3">
          {message}
        </p>
      )}
    </div>
  )
}
