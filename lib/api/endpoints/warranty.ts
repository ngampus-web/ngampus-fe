/**
 * Warranty claim API endpoints
 */

import { apiClient } from '../client';
import type {
  WarrantyClaim,
  WarrantyClaimRequest,
  PaginatedResponse,
  PaginationParams,
  ApiResponse,
} from '@/types/api';

export const warrantyApi = {
  /**
   * Get user's warranty claims
   */
  async getClaims(
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<WarrantyClaim>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.perPage) searchParams.set('perPage', params.perPage.toString());

    const query = searchParams.toString();
    return apiClient.get<PaginatedResponse<WarrantyClaim>>(
      `/warranty/claims${query ? `?${query}` : ''}`
    );
  },

  /**
   * Get claim by ID
   */
  async getClaim(claimId: string): Promise<ApiResponse<WarrantyClaim>> {
    return apiClient.get<WarrantyClaim>(`/warranty/claims/${claimId}`);
  },

  /**
   * Submit new warranty claim
   */
  async createClaim(data: WarrantyClaimRequest): Promise<ApiResponse<WarrantyClaim>> {
    return apiClient.post<WarrantyClaim>('/warranty/claims', data);
  },

  /**
   * Upload evidence file
   */
  async uploadEvidence(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.upload<{ url: string }>('/warranty/upload', formData);
  },
};
