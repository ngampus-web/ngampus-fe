/**
 * Type-safe API client with error handling and request/response interceptors
 */

import { config } from '@/lib/config';
import type { ApiError, ApiResponse } from '@/types/api';

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || config.apiUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set authorization token for authenticated requests
   */
  setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders = {
        ...this.defaultHeaders,
        Authorization: `Bearer ${token}`,
      };
    } else {
      const { Authorization, ...rest } = this.defaultHeaders as Record<string, string>;
      this.defaultHeaders = rest;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = { ...this.defaultHeaders, ...options.headers };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          message: data.message || 'Request failed',
          code: data.code || 'UNKNOWN_ERROR',
          status: response.status,
          details: data.details,
        };
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Network error',
        code: 'NETWORK_ERROR',
        status: 0,
      };
      return { success: false, error: apiError };
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Upload file with multipart/form-data
   */
  async upload<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const { 'Content-Type': _, ...headersWithoutContentType } = this
      .defaultHeaders as Record<string, string>;

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: headersWithoutContentType,
    });
  }
}

// Global singleton instance
export const apiClient = new ApiClient();
