import type { ParaphraseDetails } from "../paraphrase/types"

export type AccountDelivery = {
  credentials: string
  instructions: string | null
  sentAt: string
  channels: string[]
}

export type PaymentStatus =
  "pending" | "processing" | "completed" | "expired" | "cancelled" | "failed"
export type PaymentDetails =
  | ParaphraseDetails
  | {
      kind: "marketplace"
      slug: string
      /** Selected product offer (server prices the order from it). */
      offerId?: string
      title: string
      plan: string
      duration: string
      accountType?: string
      warranty?: string
      /** Filled by the server from the account; checkout only sends email and WhatsApp. */
      customerName?: string
      /** Optional for historical orders created before email checkout. */
      customerEmail?: string
      /** Account details sent by the admin (live orders, owner only). */
      delivery?: AccountDelivery | null
    }
  | {
      kind: "document"
      slug: "turnitin" | "cek-ai" | "parafrase-manual"
      title: string
      fileName: string
      fileSize: number
      filters: string[]
      /** Uploaded source (live Cek AI orders). */
      fileId?: string
      wordCount?: number | null
      /** Live orders: result and free re-upload after a failed check. */
      score?: number | null
      hasResult?: boolean
      failReason?: string | null
      retriesLeft?: number
      resultExpiresAt?: string | null
    }

export type OrderDraft = {
  phone: string
  amount: number
  details: PaymentDetails
  /** Checked again by the server when the order is created. */
  promoCode?: string
}

export type PaymentOrder = OrderDraft & {
  id: string
  /** `live`: order from the API (id = order code); `preview`: browser-only demo. */
  mode: "preview" | "live"
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
