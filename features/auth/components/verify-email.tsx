"use client"
import { notify } from "@/lib/toast"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { authApi } from "@/lib/api"
import { useAuthStore } from "@/lib/stores/auth"
import { VerificationReminder } from "./verification-reminder"

export function VerifyEmail() {
  const token = useSearchParams().get("token") ?? ""
  const [state, setState] = useState<"loading" | "ok" | "error">(
    token ? "loading" : "error"
  )
  const [message, setMessage] = useState("Link verifikasi tidak valid.")
  const sent = useRef(false)
  const setUser = useAuthStore((s) => s.setUser)
  const status = useAuthStore((s) => s.status)

  useEffect(() => {
    if (!token || sent.current) return
    sent.current = true
    void authApi.verifyEmail(token).then(async (res) => {
      if (res.success) {
        setState("ok")
        notify.success("Email berhasil diverifikasi.")
        if (useAuthStore.getState().status === "authenticated") {
          const me = await authApi.getMe()
          if (me.success) setUser(me.data)
        }
      } else {
        notify.error(res.error)
        setMessage(res.error.message)
        setState("error")
      }
    })
  }, [token, setUser])

  return (
    <div className="flex flex-col gap-6 text-center">
      <h1 className="text-2xl font-semibold tracking-[-0.02em]">
        {state === "loading"
          ? "Memverifikasi email..."
          : state === "ok"
            ? "Email terverifikasi"
            : "Verifikasi gagal"}
      </h1>
      {state !== "loading" && (
        <p className="text-base tracking-[-0.02em]">
          {state === "ok"
            ? "Terima kasih, email kamu sudah terverifikasi."
            : message}
        </p>
      )}
      {state === "error" && <VerificationReminder compact />}
      {state === "error" && status === "guest" && (
        <p className="text-sm leading-6 text-subtle">
          <Link
            href="/masuk?next=%2Friwayat-pesanan"
            className="text-primary hover:underline"
          >
            Masuk ke akun
          </Link>{" "}
          untuk meminta tautan verifikasi baru di halaman riwayat pesanan.
        </p>
      )}
      <Button asChild className="h-[52px] w-full rounded-3xl text-base">
        <Link href="/">Kembali ke beranda</Link>
      </Button>
    </div>
  )
}
