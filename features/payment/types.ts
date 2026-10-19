import type { ParaphraseDetails } from "../paraphrase/types"

export type PaymentStatus =
  "pending" | "processing" | "completed" | "expired" | "cancelled" | "failed"
export type PaymentDetails =
  | ParaphraseDetails
  | {
      kind: "marketplace"
      slug: string
      title: string
      plan: string
      duration: string
      accountType?: string
      warranty?: string
      customerName: string
    }
  | {
      kind: "document"
      slug: "turnitin" | "cek-ai" | "parafrase-manual"
      title: string
      fileName: string
      fileSize: number
      filters: string[]
    }

export type OrderDraft = {
  phone: string
  amount: number
  details: PaymentDetails
}

export type PaymentOrder = OrderDraft & {
  id: string
  mode: "preview"
  createdAt: string
  expiresAt: string
  status: PaymentStatus
  updatedAt: string
}

/** Replace the preview implementation with a server API adapter when available. */
export interface PaymentGateway {
  createOrder(draft: OrderDraft): Promise<PaymentOrder>
  getOrder(id: string): Promise<PaymentOrder | null>
  startPayment(id: string): Promise<{ checkoutUrl: string }>
}
