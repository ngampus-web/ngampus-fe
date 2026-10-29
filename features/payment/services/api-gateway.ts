import { type CreatedOrder, ordersApi } from "@/lib/api/endpoints/orders"
import { orderTokens } from "@/lib/orders/order-tokens"
import type { OrderDetail, PaymentSession } from "@/types/api"

import { filesApi } from "@/lib/api/endpoints/files"
import { paraphraseServices } from "@/features/paraphrase/options"
import { getPlagiarismService } from "@/features/plagiarism/data/plagiarism"
import { documentMime } from "@/features/plagiarism/services/document-file"
import type { ParaphraseDetails } from "@/features/paraphrase/types"

import { validateMarketplaceEmail } from "./order-rules"
import type { OrderDraft, PaymentDetails, PaymentOrder } from "../types"

/** API order codes, e.g. `MKT-7K2M9QXA` (preview ids start with `NGP-`). */
export const isOrderCode = (id: string) => /^[A-Z]{3}-[0-9A-Z]{8}$/.test(id)

function paraphraseDetails(
  o: OrderDetail,
  d: Extract<OrderDetail["details"], { kind: "paraphrase" }>
): ParaphraseDetails {
  return {
    kind: "paraphrase",
    slug: "parafrase-manual",
    title: paraphraseServices.find((s) => s.id === d.service)?.label ?? o.title,
    fileName: d.fileName,
    fileSize: o.fileSizeBytes ?? 0,
    wordCount: d.wordCount,
    service: d.service,
    reports: d.reports.map((r) => ({
      type: r.type,
      file: { name: r.fileName, size: r.fileSizeBytes },
      initialScore: r.initialScore,
      targetScore: r.targetScore,
    })),
    notes: d.notes ?? "",
    language: d.language,
    field: d.field ?? "",
    customerName: o.customerName,
    turnaround: d.turnaround,
    schedule: {
      paidAt: o.paidAt,
      deadlineAt: d.deadlineAt,
      startedAt: d.startedAt,
    },
    hasResult: d.hasResult,
  }
}

function documentDetails(
  o: OrderDetail,
  d: Extract<OrderDetail["details"], { kind: "turnitin" | "ai_check" }>
): PaymentDetails {
  const slug = d.kind === "turnitin" ? "turnitin" : "cek-ai"
  return {
    kind: "document",
    slug,
    title: getPlagiarismService(slug)?.title ?? o.title,
    fileName: d.fileName,
    fileSize: d.fileSizeBytes,
    filters: d.filters,
    wordCount: d.wordCount,
    score: d.resultScore,
    hasResult: d.hasResult,
    failReason: d.failReason,
    retriesLeft: d.retriesLeft,
    resultExpiresAt: d.resultExpiresAt,
  }
}

/** API order → the shape the payment pages already render. */
function fromApi(o: OrderDetail): PaymentOrder {
  let details: PaymentDetails
  if (o.details.kind === "paraphrase") {
    details = paraphraseDetails(o, o.details)
  } else if (o.details.kind === "turnitin" || o.details.kind === "ai_check") {
    details = documentDetails(o, o.details)
  } else {
    const d = o.details.kind === "marketplace" ? o.details : null
    details = {
      kind: "marketplace",
      slug: d?.productSlug ?? "",
      title: d?.productName ?? o.title,
      plan: d?.planName ?? "",
      duration: d?.durationLabel ?? "",
      warranty: d?.warrantyLabel,
      accountType: d?.accountType ?? undefined,
      customerName: o.customerName,
      customerEmail: o.customerEmail ?? undefined,
      delivery: d?.delivery ?? null,
    }
  }
  return {
    id: o.code,
    mode: "live",
    phone: o.whatsapp,
    amount: o.total,
    status: o.status === "refunded" ? "completed" : o.status,
    createdAt: o.createdAt,
    expiresAt: o.expiresAt,
    updatedAt: o.completedAt ?? o.paidAt ?? o.createdAt,
    details,
  }
}

const fail = (message: string): never => {
  throw new Error(message)
}

/** Keeps the order openable from this browser without login. */
function remember(o: CreatedOrder): PaymentOrder {
  orderTokens.save(o.code, o.accessToken)
  return fromApi(o)
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
      customerEmail,
      whatsapp: draft.phone,
      promoCode: draft.promoCode,
    })
    if (!res.success) return fail(res.error.message)
    return remember(res.data)
  },

  /** Files are uploaded first; the server recounts words and prices the order. */
  async createParaphraseOrder(draft: OrderDraft): Promise<PaymentOrder> {
    const d = draft.details
    if (
      d.kind !== "paraphrase" ||
      !d.sourceFileId ||
      d.reports.some((r) => !r.fileId)
    )
      return fail("Unggah dokumen dan laporan terlebih dahulu.")
    const res = await ordersApi.createParaphrase(
      {
        service: d.service,
        sourceFileId: d.sourceFileId,
        reports: d.reports.map((r) => ({
          type: r.type,
          fileId: r.fileId!,
          initialScore: r.initialScore,
          targetScore: r.targetScore,
        })),
        language: d.language,
        field: d.field || undefined,
        notes: d.notes || undefined,
        turnaround: d.turnaround,
        customerName: d.customerName,
        whatsapp: draft.phone,
      },
      draft.uploadToken
    )
    if (!res.success) return fail(res.error.message)
    return remember(res.data)
  },

  /** The file is uploaded first; the server counts words and prices the order. */
  async createAiCheckOrder(draft: OrderDraft): Promise<PaymentOrder> {
    const d = draft.details
    if (d.kind !== "document" || d.slug !== "cek-ai" || !d.fileId)
      return fail("Unggah dokumen terlebih dahulu.")
    const res = await ordersApi.createAiCheck(
      {
        documentTitle:
          d.fileName.replace(/\.[^.]+$/, "").slice(0, 200) || d.fileName,
        fileId: d.fileId,
        whatsapp: draft.phone,
        promoCode: draft.promoCode,
      },
      draft.uploadToken
    )
    if (!res.success) return fail(res.error.message)
    return remember(res.data)
  },

  async resubmit(code: string, file: File): Promise<PaymentOrder> {
    const up = await filesApi.upload(
      file,
      "doc_check_source",
      documentMime(file)
    )
    if (!up.success) return fail(up.error.message)
    const res = await ordersApi.resubmit(code, up.data.id, up.data.uploadToken)
    if (!res.success) return fail(res.error.message)
    return fromApi(res.data)
  },

  async resendDelivery(code: string): Promise<void> {
    const res = await ordersApi.resendDelivery(code)
    if (!res.success) fail(res.error.message)
  },

  async resultUrl(code: string): Promise<string> {
    const res = await ordersApi.result(code)
    if (!res.success) return fail(res.error.message)
    return res.data.url
  },

  /** null when missing or owned by someone else. */
  async getOrder(code: string): Promise<PaymentOrder | null> {
    const res = await ordersApi.get(code)
    if (res.success) return fromApi(res.data)
    if (res.error.status === 404) return null
    return fail(res.error.message)
  },

  async startPayment(code: string): Promise<PaymentSession> {
    const res = await ordersApi.pay(code)
    if (!res.success) return fail(res.error.message)
    return res.data
  },

  async simulate(code: string, result: "paid" | "failed") {
    const res = await ordersApi.simulatePayment(code, result)
    if (!res.success) return fail(res.error.message)
  },

  async cancel(code: string): Promise<PaymentOrder> {
    const res = await ordersApi.cancel(code)
    if (!res.success) return fail(res.error.message)
    return fromApi(res.data)
  },
}
