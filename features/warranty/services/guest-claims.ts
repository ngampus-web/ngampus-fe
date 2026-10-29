import { ordersApi } from "@/lib/api/endpoints/orders"
import { warrantyApi } from "@/lib/api/endpoints/warranty"
import { orderTokens } from "@/lib/orders/order-tokens"
import type { ClaimSummary, EligibleOrder } from "@/types/api"

/**
 * Guests have no account list: the claim center works from the orders and
 * claims opened in this browser (their access tokens are stored locally).
 */

const stored = (prefix: string) =>
  orderTokens.codes().filter((code) => code.startsWith(prefix))

/** Delivered marketplace orders from this browser whose warranty still runs. */
export async function guestEligibleOrders(): Promise<EligibleOrder[]> {
  const results = await Promise.all(stored("MKT-").map((c) => ordersApi.get(c)))
  const now = Date.now()
  return results.flatMap((res) => {
    if (!res.success || res.data.status !== "completed") return []
    const d = res.data.details
    if (
      d.kind !== "marketplace" ||
      !d.delivery ||
      !d.warrantyExpiresAt ||
      Date.parse(d.warrantyExpiresAt) <= now
    )
      return []
    return [
      {
        code: res.data.code,
        productName: d.productName,
        planName: d.planName,
        warrantyExpiresAt: d.warrantyExpiresAt,
      },
    ]
  })
}

/** Claims submitted or opened in this browser, newest first. */
export async function guestClaims(): Promise<ClaimSummary[]> {
  const results = await Promise.all(
    stored("CLM-").map((c) => warrantyApi.get(c))
  )
  return results.flatMap((res) => (res.success ? [res.data] : []))
}
