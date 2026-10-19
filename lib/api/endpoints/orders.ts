/**
 * Orders API endpoints
 */

import { apiClient } from '../client';
import type {
  Order,
  CreateOrderRequest,
  CreateOrderResponse,
  PaginatedResponse,
  PaginationParams,
  ApiResponse,
} from '@/types/api';

export const ordersApi = {
  /**
   * Get user's order history
   */
  async getOrders(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Order>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.perPage) searchParams.set('perPage', params.perPage.toString());

    const query = searchParams.toString();
    return apiClient.get<PaginatedResponse<Order>>(`/orders${query ? `?${query}` : ''}`);
  },

  /**
   * Get order by ID
   */
  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    return apiClient.get<Order>(`/orders/${orderId}`);
  },

  /**
   * Create new order
   */
  async createOrder(data: CreateOrderRequest): Promise<ApiResponse<CreateOrderResponse>> {
    return apiClient.post<CreateOrderResponse>('/orders', data);
  },

  /**
   * Cancel order (only if status is 'pending')
   */
  async cancelOrder(orderId: string): Promise<ApiResponse<Order>> {
    return apiClient.post<Order>(`/orders/${orderId}/cancel`);
  },

  /**
   * Search orders by keyword
   */
  async searchOrders(
    query: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Order>>> {
    const searchParams = new URLSearchParams({ query });
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.perPage) searchParams.set('perPage', params.perPage.toString());

    return apiClient.get<PaginatedResponse<Order>>(`/orders/search?${searchParams.toString()}`);
  },
};
