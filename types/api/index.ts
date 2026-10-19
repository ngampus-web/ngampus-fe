/**
 * Shared API response types and error handling
 */

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
}

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Common API request types
 */
export interface PaginationParams {
  page?: number;
  perPage?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  query?: string;
}

/**
 * Authentication
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'creator' | 'admin';
  createdAt: string;
}

/**
 * Orders
 */
export interface Order {
  id: string;
  userId: string;
  type: 'marketplace' | 'plagiarism' | 'paraphrase';
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'failed' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  paymentMethod?: string;
  paymentProof?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  metadata?: Record<string, unknown>;
}

export interface CreateOrderRequest {
  type: Order['type'];
  items: Omit<OrderItem, 'id'>[];
  metadata?: Record<string, unknown>;
}

export interface CreateOrderResponse {
  order: Order;
  paymentUrl?: string;
  qrisUrl?: string;
}

/**
 * Payment
 */
export interface PaymentRequest {
  orderId: string;
  method: 'qris' | 'bank_transfer' | 'e_wallet';
  returnUrl?: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: 'pending' | 'paid' | 'expired' | 'failed';
  qrisUrl?: string;
  vaNumber?: string;
  amount: number;
  expiresAt: string;
}

/**
 * Plagiarism check
 */
export interface PlagiarismCheckRequest {
  fileUrl: string;
  serviceType: 'turnitin' | 'ai-detection' | 'paraphrase';
  options?: {
    urgency?: 'normal' | 'express';
    paraphraseTarget?: number;
  };
}

export interface PlagiarismCheckResponse {
  checkId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  estimatedCompletionAt?: string;
  resultUrl?: string;
}

/**
 * File upload
 */
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

/**
 * Warranty claim
 */
export interface WarrantyClaimRequest {
  orderId: string;
  reason: string;
  description: string;
  evidence?: string[];
}

export interface WarrantyClaim {
  id: string;
  orderId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected' | 'resolved';
  reason: string;
  description: string;
  evidence?: string[];
  response?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Creator
 */
export interface CreatorStats {
  totalEarnings: number;
  pendingEarnings: number;
  totalSubmissions: number;
  approvedSubmissions: number;
}

export interface CreatorSubmission {
  id: string;
  creatorId: string;
  campaignId: string;
  contentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  earnings?: number;
  feedback?: string;
  createdAt: string;
}

export interface WithdrawRequest {
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

/**
 * Blog
 */
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  tags?: string[];
}
