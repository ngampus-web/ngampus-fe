"use client"
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react"

import { apiGateway, isOrderCode } from "../services/api-gateway"
import { parseOrder } from "../services/order-rules"
import { readOrderSnapshot, subscribeOrders } from "../services/preview-gateway"
import type { PaymentOrder } from "../types"

const POLL_MS = 15_000
const serverSnapshot = () => undefined

/** Preview orders from sessionStorage (document services until their API lands). */
function usePreviewOrder(id: string, enabled: boolean) {
  const raw = useSyncExternalStore(
    subscribeOrders,
    () => (enabled ? readOrderSnapshot(id) : null),
    serverSnapshot
  )
  return useMemo(() => {
    if (raw === undefined) return undefined
    const order = parseOrder(raw)
    return order?.id === id ? order : null
  }, [raw, id])
}

/** API orders, polled every 15s while pending or processing. */
function useLiveOrder(code: string, enabled: boolean, pollMs: number) {
  const [order, setOrder] = useState<PaymentOrder | null | undefined>(undefined)
  const [error, setError] = useState("")

  const refresh = useCallback(async () => {
    try {
      setOrder(await apiGateway.getOrder(code))
      setError("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat pesanan.")
    }
  }, [code])

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    void apiGateway
      .getOrder(code)
      .then((o) => !cancelled && setOrder(o))
      .catch(
        (e) =>
          !cancelled &&
          setError(e instanceof Error ? e.message : "Gagal memuat pesanan.")
      )
    return () => {
      cancelled = true
    }
  }, [code, enabled])

  const active = order?.status === "pending" || order?.status === "processing"
  useEffect(() => {
    if (!enabled || !active) return
    const timer = setInterval(() => void refresh(), pollMs)
    return () => clearInterval(timer)
  }, [enabled, active, refresh, pollMs])

  return { order, error, refresh, setOrder }
}

/** `pollMs`: 15s on the status page, 5s while the QR is shown. */
export function usePaymentOrder(id: string, { pollMs = POLL_MS } = {}) {
  const live = isOrderCode(id)
  const preview = usePreviewOrder(id, !live)
  const api = useLiveOrder(id, live, pollMs)
  return live
    ? api
    : { order: preview, error: "", refresh: async () => {}, setOrder: () => {} }
}
