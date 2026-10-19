import type { PaymentOrder } from "../../payment/types"
import { normalizePhone } from "../../payment/services/order-rules"
export type OrderCategory = "plagiarism" | "marketplace"
export function filterOrders(
  orders: PaymentOrder[],
  query: string,
  category: OrderCategory
) {
  const value = query.trim()
  if (!value) return []
  let phone = ""
  try {
    phone = normalizePhone(value)
  } catch {
    /* The query can also be an order ID. */
  }
  return orders
    .filter(
      (order) =>
        (category === "marketplace"
          ? order.details.kind === "marketplace"
          : order.details.kind !== "marketplace") &&
        (order.id.toLowerCase() === value.toLowerCase() ||
          (phone !== "" && order.phone === phone))
    )
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}
