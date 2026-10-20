"use client"
import { usePathname, useRouter } from "next/navigation"
import { loginHref } from "@/features/auth/components/require-auth"
import { useAuthStore } from "@/lib/stores/auth"
import type { OrderDraft } from "../types"
import { previewGateway } from "../services/preview-gateway"

/** Checkout requires an account: guests go to /masuk?next=<current page>. */
export function useCheckoutPayment() {
  const router = useRouter()
  const pathname = usePathname()
  return async (draft: OrderDraft) => {
    if (useAuthStore.getState().status !== "authenticated") {
      router.push(loginHref(pathname))
      return
    }
    const order = await previewGateway.createOrder(draft)
    router.push(`/pembayaran/${order.id}`)
  }
}
