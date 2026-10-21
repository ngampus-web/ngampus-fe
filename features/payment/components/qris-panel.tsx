"use client"

import { ExternalLink, LoaderCircle, RefreshCw } from "lucide-react"
import QRCode from "qrcode"
import { useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import type { PaymentSession } from "@/types/api"

import { apiGateway } from "../services/api-gateway"
import { rupiah } from "../services/order-rules"

/** Creates/loads the QRIS session for a live order and renders its QR. */
export function QrisPanel({
  code,
  remaining,
  onChanged,
}: {
  code: string
  remaining: string
  /** Called after a dev simulation so the page refreshes immediately. */
  onChanged: () => void
}) {
  const [session, setSession] = useState<PaymentSession | null>(null)
  const [qr, setQr] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [simulating, setSimulating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const s = await apiGateway.startPayment(code)
      setSession(s)
      setQr(
        s.qrString
          ? await QRCode.toDataURL(s.qrString, { margin: 1, width: 280 })
          : ""
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : "QRIS belum dapat dibuat.")
    } finally {
      setLoading(false)
    }
  }, [code])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- start loading the session on mount
    void load()
  }, [load])

  async function simulate(result: "paid" | "failed") {
    setSimulating(true)
    try {
      await apiGateway.simulate(code, result)
      onChanged()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Simulasi gagal.")
    } finally {
      setSimulating(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface p-6 text-center">
      {loading ? (
        <div
          role="status"
          className="flex size-[248px] items-center justify-center rounded-2xl bg-white"
        >
          <LoaderCircle
            className="size-8 animate-spin text-primary"
            aria-label="Menyiapkan QRIS"
          />
        </div>
      ) : error ? (
        <div role="alert" className="flex flex-col items-center gap-3 py-6">
          <p className="max-w-sm text-sm leading-6 text-subtle">{error}</p>
          <Button variant="outline" size="pill" onClick={() => void load()}>
            <RefreshCw className="size-4" /> Coba lagi
          </Button>
        </div>
      ) : (
        <>
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element -- generated data URL
            <img
              src={qr}
              alt={`QRIS pembayaran ${code}`}
              width={248}
              height={248}
              className="rounded-2xl border border-line bg-white p-3"
            />
          ) : null}
          <div className="flex flex-col gap-1">
            <p className="text-2xl font-semibold text-primary">
              {rupiah(session?.amount ?? 0)}
            </p>
            <p className="text-sm text-subtle">
              Scan dengan aplikasi bank atau e-wallet yang mendukung QRIS
            </p>
          </div>
          <span className="text-sm text-subtle">
            Waktu tersisa{" "}
            <strong className="text-black tabular-nums">{remaining}</strong>
          </span>
          <p className="text-xs text-subtle">
            Halaman ini otomatis berpindah setelah pembayaran terverifikasi.
          </p>
          {session?.paymentUrl && (
            <a
              href={session.paymentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary underline"
            >
              Buka halaman pembayaran <ExternalLink className="size-3.5" />
            </a>
          )}
          {session?.reference?.startsWith("LOCAL-") && (
            <div className="flex w-full flex-col gap-2 border-t border-dashed border-line pt-4">
              <p className="text-xs font-semibold text-subtle">
                MODE PENGEMBANGAN (QR ini tidak bisa dibayar)
              </p>
              <Button
                size="pill"
                disabled={simulating}
                onClick={() => void simulate("paid")}
              >
                Simulasikan pembayaran berhasil
              </Button>
              <Button
                variant="outline"
                size="pill"
                disabled={simulating}
                onClick={() => void simulate("failed")}
              >
                Simulasikan pembayaran gagal
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
