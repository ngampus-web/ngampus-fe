"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { authApi } from "@/lib/api"

export function VerifyEmail() {
  const token = useSearchParams().get("token") ?? ""
  const [state, setState] = useState<"loading" | "ok" | "error">(
    token ? "loading" : "error"
  )
  const [message, setMessage] = useState("Link verifikasi tidak valid.")
  const sent = useRef(false)

  useEffect(() => {
    if (!token || sent.current) return
    sent.current = true
    void authApi.verifyEmail(token).then((res) => {
      if (res.success) setState("ok")
      else {
        setMessage(res.error.message)
        setState("error")
      }
    })
  }, [token])

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
      <Button asChild className="h-[52px] w-full rounded-3xl text-base">
        <Link href="/">Kembali ke beranda</Link>
      </Button>
    </div>
  )
}
