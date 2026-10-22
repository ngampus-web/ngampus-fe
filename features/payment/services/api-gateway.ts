import { ordersApi } from "@/lib/api/endpoints/orders"
import type { OrderDetail } from "@/types/api"

import { validateMarketplaceEmail } from "./order-rules"
import type { OrderDraft, PaymentOrder } from "../types"

/** API order codes, e.g. `MKT-7K2M9QXA` (preview ids start with `NGP-`). */
export const isOrderCode = (id: string) => /^[A-Z]{3}-[0-9A-Z]{8}$/.test(id)

/** API order → the shape the payment pages already render. */
function fromApi(o: OrderDetail): PaymentOrder {
  const d = o.details.kind === "marketplace" ? o.details : null
  return {
    id: o.code,
    mode: "live",
    phone: o.whatsapp,
    amount: o.total,
    status: o.status === "refunded" ? "completed" : o.status,
    createdAt: o.createdAt,
    expiresAt: o.expiresAt,
    updatedAt: o.completedAt ?? o.paidAt ?? o.createdAt,
    details: {
      kind: "marketplace",
      slug: d?.productSlug ?? "",
      title: d?.productName ?? o.title,
      plan: d?.planName ?? "",
      duration: d?.durationLabel ?? "",
      warranty: d?.warrantyLabel,
      accountType: d?.accountType ?? undefined,
      customerName: o.customerName,
      customerEmail: o.customerEmail ?? undefined,
    },
  }
}

const fail = (message: string): never => {
  throw new Error(message)
}

export const apiGateway = {
  /** Server prices the order from `offerId`; the draft amount is ignored. */
  async createMarketplaceOrder(draft: OrderDraft): Promise<PaymentOrder> {
    const d = draft.details
    if (d.kind !== "marketplace" || !d.offerId)
      return fail("Pilih paket terlebih dahulu.")
    const customerEmail = validateMarketplaceEmail(d.customerEmail)
    const res = await ordersApi.createMarketplace({
      offerId: d.offerId,
      customerName: d.customerName,
      customerEmail,
      whatsapp: draft.phone,
    })
    if (!res.success) return fail(res.error.message)
    return fromApi(res.data)
  },

  /** null when missing or owned by someone else. */
  async getOrder(code: string): Promise<PaymentOrder | null> {
    const res = await ordersApi.get(code)
    if (res.success) return fromApi(res.data)
    if (res.error.status === 404) return null
    return fail(res.error.message)
  },

  async cancel(code: string): Promise<PaymentOrder> {
    const res = await ordersApi.cancel(code)
    if (!res.success) return fail(res.error.message)
    return fromApi(res.data)
  },
}
