/**
 * Payment API endpoints
 */

import { apiClient } from '../client';
import type { PaymentRequest, PaymentResponse, ApiResponse } from '@/types/api';

export const paymentApi = {
  /**
   * Initiate payment for an order
   */
  async createPayment(data: PaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.post<PaymentResponse>('/payments', data);
  },

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.get<PaymentResponse>(`/payments/${paymentId}`);
  },

  /**
   * Verify payment callback (webhook handler)
   */
  async verifyCallback(
    signature: string,
    payload: Record<string, unknown>
  ): Promise<ApiResponse<{ valid: boolean }>> {
    return apiClient.post<{ valid: boolean }>('/payments/verify-callback', {
      signature,
      payload,
    });
  },
};
