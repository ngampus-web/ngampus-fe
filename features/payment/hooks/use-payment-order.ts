"use client"
import { useMemo, useSyncExternalStore } from "react"
import { readOrderSnapshot, subscribeOrders } from "../services/preview-gateway"
import { parseOrder } from "../services/order-rules"
const serverSnapshot = () => undefined
export function usePaymentOrder(id: string) {
  const raw = useSyncExternalStore(
    subscribeOrders,
    () => readOrderSnapshot(id),
    serverSnapshot
  )
  return useMemo(() => {
    if (raw === undefined) return undefined
    const order = parseOrder(raw)
    return order?.id === id ? order : null
  }, [raw, id])
}
