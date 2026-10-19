/**
 * Marketplace API endpoints
 */

import { apiClient } from '../client';
import type { ApiResponse } from '@/types/api';

export interface MarketplaceProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  duration?: string;
  features: string[];
  badge?: string;
  image?: string;
  popular?: boolean;
}

export const marketplaceApi = {
  /**
   * Get all products
   */
  async getProducts(): Promise<ApiResponse<MarketplaceProduct[]>> {
    return apiClient.get<MarketplaceProduct[]>('/marketplace/products');
  },

  /**
   * Get product by slug
   */
  async getProduct(slug: string): Promise<ApiResponse<MarketplaceProduct>> {
    return apiClient.get<MarketplaceProduct>(`/marketplace/products/${slug}`);
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string): Promise<ApiResponse<MarketplaceProduct[]>> {
    return apiClient.get<MarketplaceProduct[]>(`/marketplace/products?category=${category}`);
  },
};
