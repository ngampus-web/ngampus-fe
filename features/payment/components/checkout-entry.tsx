"use client"
import { useRouter } from "next/navigation"
import type { OrderDraft } from "../types"
import { previewGateway } from "../services/preview-gateway"

export function useCheckoutPayment() {
  const router = useRouter()
  return async (draft: OrderDraft) => {
    const order = await previewGateway.createOrder(draft)
    router.push(`/pembayaran/${order.id}`)
  }
}
