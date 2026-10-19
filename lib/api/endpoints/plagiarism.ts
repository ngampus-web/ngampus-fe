/**
 * Plagiarism check API endpoints
 */

import { apiClient } from '../client';
import type {
  PlagiarismCheckRequest,
  PlagiarismCheckResponse,
  FileUploadResponse,
  ApiResponse,
} from '@/types/api';

export const plagiarismApi = {
  /**
   * Upload file for plagiarism check
   */
  async uploadFile(file: File): Promise<ApiResponse<FileUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.upload<FileUploadResponse>('/plagiarism/upload', formData);
  },

  /**
   * Submit plagiarism check request
   */
  async checkPlagiarism(
    data: PlagiarismCheckRequest
  ): Promise<ApiResponse<PlagiarismCheckResponse>> {
    return apiClient.post<PlagiarismCheckResponse>('/plagiarism/check', data);
  },

  /**
   * Get check status
   */
  async getCheckStatus(checkId: string): Promise<ApiResponse<PlagiarismCheckResponse>> {
    return apiClient.get<PlagiarismCheckResponse>(`/plagiarism/check/${checkId}`);
  },

  /**
   * Download result
   */
  async downloadResult(checkId: string): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.get<{ downloadUrl: string }>(`/plagiarism/check/${checkId}/download`);
  },
};
