"use client"
import { usePathname, useRouter } from "next/navigation"
import { loginHref } from "@/features/auth/components/require-auth"
import { useAuthStore } from "@/lib/stores/auth"
import type { OrderDraft } from "../types"
import { apiGateway } from "../services/api-gateway"
import { previewGateway } from "../services/preview-gateway"

/**
 * Checkout requires an account: guests go to /masuk?next=<current page>.
 * Marketplace and paraphrase orders are created on the API (priced on the
 * server); document checks still use the preview gateway until their API lands.
 */
export function useCheckoutPayment() {
  const router = useRouter()
  const pathname = usePathname()
  return async (draft: OrderDraft) => {
    if (useAuthStore.getState().status !== "authenticated") {
      router.push(loginHref(pathname))
      return
    }
    const order =
      draft.details.kind === "marketplace" && draft.details.offerId
        ? await apiGateway.createMarketplaceOrder(draft)
        : draft.details.kind === "paraphrase" && draft.details.sourceFileId
          ? await apiGateway.createParaphraseOrder(draft)
          : await previewGateway.createOrder(draft)
    router.push(`/pembayaran/${order.id}`)
  }
}
