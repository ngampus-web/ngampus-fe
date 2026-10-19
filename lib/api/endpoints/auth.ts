/**
 * Authentication API endpoints
 */

import { apiClient } from '../client';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ApiResponse,
} from '@/types/api';

export const authApi = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  /**
   * Get current authenticated user
   */
  async getMe(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/auth/me');
  },

  /**
   * Logout current user
   */
  async logout(): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/logout');
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/reset-password', { token, password });
  },
};
