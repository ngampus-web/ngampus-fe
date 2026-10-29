/**
 * Shared API response types and error handling
 */

export interface ApiError {
  message: string
  code: string
  status: number
  details?: Record<string, unknown>
}

export type ApiResponse<T> =
  | { success: true; data: T; meta?: PaginationMeta }
  | { success: false; error: ApiError }

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

/**
 * Common API request types
 */
export interface PaginationParams {
  page?: number
  perPage?: number
}

export interface SortParams {
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface SearchParams {
  query?: string
}

/**
 * Authentication
 */
export type AuthApp = "web" | "admin"

export interface LoginRequest {
  email: string
  password: string
  app?: AuthApp
  remember?: boolean
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  turnstileToken?: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface User {
  id: string
  email: string
  name: string
  phone: string | null
  role: "customer" | "admin" | "superadmin"
  emailVerified: boolean
  isCreator: boolean
  createdAt: string
}

/**
 * Orders — docs/API-CONTRACT.md §6–§7
 */
export type OrderKind = "marketplace" | "turnitin" | "ai_check" | "paraphrase"
export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "expired"
  | "cancelled"
  | "failed"
  | "refunded"

export interface PriceBreakdown {
  subtotal: number
  discount: number
  serviceFee: number
  total: number
  lines: { label: string; amount: number }[]
  formulaVersion: string
}

export interface OrderSummary {
  code: string
  kind: OrderKind
  status: OrderStatus
  title: string
  total: number
  createdAt: string
  fileName?: string
  fileSizeBytes?: number
  filters?: string[]
}

export interface MarketplaceOrderDetails {
  kind: "marketplace"
  productSlug: string
  productName: string
  planName: string
  accountType: "private" | "sharing" | null
  durationLabel: string
  warrantyLabel: string
  unitPrice: number
  officialPrice: number
  warrantyExpiresAt: string | null
  /** Credentials are sent by WhatsApp/email only, never returned here. */
  delivery: {
    sentAt: string
    channels: string[]
  } | null
}

export interface ParaphraseOrderDetails {
  kind: "paraphrase"
  service: "turnitin" | "ai" | "combined"
  fileName: string
  wordCount: number
  language: "id" | "en"
  field: string | null
  notes: string | null
  turnaround: "relaxed" | "regular" | "urgent"
  deadlineAt: string | null
  startedAt: string | null
  deliveredAt: string | null
  resultNote: string | null
  reports: {
    type: "turnitin" | "ai"
    initialScore: number
    targetScore: number
    fileName: string
    fileSizeBytes: number
  }[]
  hasResult: boolean
}

export interface OrderDetail extends OrderSummary {
  customerName: string
  customerEmail?: string | null
  whatsapp: string
  subtotal: number
  discount: number
  serviceFee: number
  lines: PriceBreakdown["lines"]
  expiresAt: string
  paidAt: string | null
  completedAt: string | null
  timeline: { status: OrderStatus; at: string; note: string | null }[]
  payment: PaymentSession | null
  details:
    MarketplaceOrderDetails | ParaphraseOrderDetails | DocumentCheckOrderDetails
}

/** docs/API-CONTRACT.md `DocumentCheckDetails`. */
export interface DocumentCheckOrderDetails {
  kind: "turnitin" | "ai_check"
  documentTitle: string
  fileName: string
  fileSizeBytes: number
  pageCount: number | null
  wordCount: number
  charCount: number | null
  filters: string[]
  resultScore: number | null
  hasResult: boolean
  failReason: string | null
  retriesLeft: number
  resultExpiresAt: string | null
}

export interface PaymentSession {
  method: string
  reference: string | null
  amount: number
  qrString: string | null
  paymentUrl: string | null
  expiresAt: string
  status: "pending" | "paid" | "expired" | "failed" | "cancelled"
}

export interface OrderListMeta extends PaginationMeta {
  counts: { total: number; completed: number; unpaid: number }
}

/**
 * Payment
 */
export interface PaymentRequest {
  orderId: string
  method: "qris" | "bank_transfer" | "e_wallet"
  returnUrl?: string
}

export interface PaymentResponse {
  paymentId: string
  status: "pending" | "paid" | "expired" | "failed"
  qrisUrl?: string
  vaNumber?: string
  amount: number
  expiresAt: string
}

/**
 * Plagiarism check
 */
export interface PlagiarismCheckRequest {
  fileUrl: string
  serviceType: "turnitin" | "ai-detection" | "paraphrase"
  options?: {
    urgency?: "normal" | "express"
    paraphraseTarget?: number
  }
}

export interface PlagiarismCheckResponse {
  checkId: string
  status: "queued" | "processing" | "completed" | "failed"
  estimatedCompletionAt?: string
  resultUrl?: string
}

/**
 * File upload
 */
export interface FileUploadResponse {
  url: string
  filename: string
  size: number
  mimeType: string
}

/**
 * Uploads — docs/API-CONTRACT.md §3 (presigned PUT to R2, then complete)
 */
export type FilePurpose =
  | "claim_evidence"
  | "submission_proof"
  | "doc_check_source"
  | "paraphrase_source"
  | "paraphrase_report"

export interface UploadTicket {
  fileId: string
  /** Guests only: proves the uploads of one checkout. */
  uploadToken?: string
  uploadUrl: string
  method: "PUT"
  headers: { "Content-Type": string }
  expiresAt: string
}

export interface FileInfo {
  id: string
  fileName: string
  mimeType: string
  sizeBytes: number
  pageCount: number | null
  wordCount: number | null
  publicUrl: string | null
}

/**
 * Warranty claims — docs/API-CONTRACT.md §9
 */
export type ClaimCategory =
  | "logged_out"
  | "password_changed"
  | "quota_limit"
  | "suspended"
  | "invalid_license"
  | "other"

export type ClaimStatus =
  "submitted" | "reviewing" | "accepted" | "rejected" | "resolved"

export type ClaimTab = "in_progress" | "resolved" | "rejected"

export interface EligibleOrder {
  code: string
  productName: string
  planName: string
  warrantyExpiresAt: string
}

export interface ClaimSummary {
  code: string
  orderCode: string
  productName: string
  category: ClaimCategory
  status: ClaimStatus
  createdAt: string
}

export interface ClaimDetail extends ClaimSummary {
  planName: string | null
  description: string
  customerMessage: string | null
  resolution:
    "repair_access" | "replace_account" | "replace_access" | "refund" | null
  timeline: { status: ClaimStatus; at: string; note: string | null }[]
  evidence: { id: string; fileName: string; url: string | null }[]
}

export interface CreateClaimRequest {
  orderCode: string
  category: ClaimCategory
  description: string
  evidenceFileIds: string[]
}

/**
 * Creator — docs/API-CONTRACT.md §10
 */
export type CreatorPlatformKey = "tiktok" | "instagram" | "x_threads"
export type SubmissionStatus = "pending" | "approved" | "rejected"
export type WithdrawalStatus = "pending" | "paid" | "rejected"

export interface CreatorProfile {
  whatsapp: string
  status: "active" | "suspended"
  joinedAt: string
  bankName: string | null
  bankAccountNumber: string | null
  bankAccountName: string | null
}

export interface CreatorMe {
  profile: CreatorProfile
  stats: {
    totalContent: number
    totalReward: number
    balance: number
    pendingWithdrawal: number
  }
  withdraw: { min: number; fee: number }
}

export interface CreatorRegisterRequest {
  name: string
  email: string
  whatsapp: string
  password: string
  turnstileToken?: string
}

export interface CreatorSubmission {
  code: string
  contentUrl: string
  platform: CreatorPlatformKey
  accountUsername: string
  contentPublishedOn: string
  viewsCount: number
  status: SubmissionStatus
  rewardAmount: number | null
  reviewNote: string | null
  createdAt: string
}

export interface CreateSubmissionRequest {
  contentUrl: string
  platform: CreatorPlatformKey
  accountUsername: string
  contentPublishedOn: string
  viewsCount: number
  proofFileId: string
}

export interface CreatorWithdrawal {
  code: string
  amount: number
  fee: number
  netAmount: number
  status: WithdrawalStatus
  recipientName: string
  bankName: string
  accountNumber: string
  adminNote: string | null
  createdAt: string
  processedAt: string | null
}

export interface CreateWithdrawalRequest {
  amount: number
  recipientName: string
  whatsapp: string
  bankName: string
  accountNumber: string
}

/**
 * Blog
 */
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage?: string
  author: {
    name: string
    avatar?: string
  }
  publishedAt: string
  tags?: string[]
}
