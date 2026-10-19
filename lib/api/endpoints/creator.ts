/**
 * Creator program API endpoints
 */

import { apiClient } from '../client';
import type {
  CreatorStats,
  CreatorSubmission,
  WithdrawRequest,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from '@/types/api';

export const creatorApi = {
  /**
   * Get creator dashboard stats
   */
  async getStats(): Promise<ApiResponse<CreatorStats>> {
    return apiClient.get<CreatorStats>('/creator/stats');
  },

  /**
   * Get creator submissions
   */
  async getSubmissions(
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<CreatorSubmission>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.perPage) searchParams.set('perPage', params.perPage.toString());

    const query = searchParams.toString();
    return apiClient.get<PaginatedResponse<CreatorSubmission>>(
      `/creator/submissions${query ? `?${query}` : ''}`
    );
  },

  /**
   * Submit content for campaign
   */
  async submitContent(
    campaignId: string,
    contentUrl: string
  ): Promise<ApiResponse<CreatorSubmission>> {
    return apiClient.post<CreatorSubmission>('/creator/submissions', {
      campaignId,
      contentUrl,
    });
  },

  /**
   * Request withdrawal
   */
  async requestWithdrawal(data: WithdrawRequest): Promise<ApiResponse<{ id: string }>> {
    return apiClient.post<{ id: string }>('/creator/withdraw', data);
  },
};
