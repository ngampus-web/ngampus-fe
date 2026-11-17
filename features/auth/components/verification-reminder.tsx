"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { authApi } from "@/lib/api"
import { useAuthStore } from "@/lib/stores/auth"
import { notify } from "@/lib/toast"

export function VerificationReminder({
  compact = false,
}: {
  compact?: boolean
}) {
  const user = useAuthStore((s) => s.user)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState("")

  if (!user || user.emailVerified) return null

  async function resend() {
    setPending(true)
    setMessage("")
    try {
      const result = await authApi.resendVerification()
      if (result.success) {
        setMessage(
          "Permintaan diterima. Cek inbox atau folder spam untuk tautan verifikasi."
        )
      } else {
        setMessage(result.error.message)
        notify.error(result.error)
      }
    } catch {
      setMessage("Email verifikasi belum dapat dikirim. Silakan coba lagi.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div
      className={
        compact
          ? "rounded-2xl border border-orange-200 bg-orange-50 p-5"
          : "space-y-4"
      }
    >
      <div className="space-y-2">
        <p className="font-semibold">Verifikasi email kamu</p>
        <p className="text-sm leading-6 text-subtle">
          Cek email{" "}
          <strong className="break-all text-black">{user.email}</strong> untuk
          tautan verifikasi. Setelah diverifikasi, pesanan guest dengan email
          yang sama dapat muncul di riwayat akunmu.
        </p>
        <p className="text-sm leading-6 text-subtle">
          Tautan berlaku 24 jam. Periksa juga folder spam.
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        className="mt-4 rounded-xl"
        onClick={() => void resend()}
        disabled={pending}
      >
        {pending ? "Mengirim…" : "Kirim ulang email verifikasi"}
      </Button>
      {message && (
        <p role="status" className="mt-3 text-sm leading-6">
          {message}
        </p>
      )}
    </div>
  )
}
