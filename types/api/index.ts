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
  delivery: {
    credentials: string
    instructions: string | null
    sentAt: string
    channels: string[]
  } | null
}

export interface OrderDetail extends OrderSummary {
  customerName: string
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
  /** Document/paraphrase details land with their changes. */
  details:
    | MarketplaceOrderDetails
    | ({ kind: Exclude<OrderKind, "marketplace"> } & Record<string, unknown>)
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
 * Warranty claim
 */
export interface WarrantyClaimRequest {
  orderId: string
  reason: string
  description: string
  evidence?: string[]
}

export interface WarrantyClaim {
  id: string
  orderId: string
  userId: string
  status: "pending" | "approved" | "rejected" | "resolved"
  reason: string
  description: string
  evidence?: string[]
  response?: string
  createdAt: string
  updatedAt: string
}

/**
 * Creator
 */
export interface CreatorStats {
  totalEarnings: number
  pendingEarnings: number
  totalSubmissions: number
  approvedSubmissions: number
}

export interface CreatorSubmission {
  id: string
  creatorId: string
  campaignId: string
  contentUrl: string
  status: "pending" | "approved" | "rejected"
  earnings?: number
  feedback?: string
  createdAt: string
}

export interface WithdrawRequest {
  amount: number
  bankName: string
  accountNumber: string
  accountName: string
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
