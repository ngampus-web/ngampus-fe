/**
 * Centralized configuration for environment variables and app constants
 */

export const config = {
  /**
   * API base URL - defaults to relative path for same-origin API
   * Set NEXT_PUBLIC_API_URL in .env for different backend
   */
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',

  /**
   * App metadata
   */
  app: {
    name: 'Ngampus',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://ngampus.id',
  },

  /**
   * Payment gateway
   */
  payment: {
    // Set to 'production' to use real payment gateway
    mode: (process.env.NEXT_PUBLIC_PAYMENT_MODE as 'preview' | 'production') || 'preview',
  },

  /**
   * Feature flags
   */
  features: {
    // Enable real authentication (vs demo session)
    realAuth: process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true',
    // Enable real order history (vs mock data)
    realOrders: process.env.NEXT_PUBLIC_ENABLE_ORDERS === 'true',
  },

  /**
   * External services
   */
  services: {
    whatsapp: {
      apiKey: process.env.WHATSAPP_API_KEY,
      baseUrl: process.env.WHATSAPP_API_URL,
    },
    payment: {
      tripay: {
        apiKey: process.env.TRIPAY_API_KEY,
        privateKey: process.env.TRIPAY_PRIVATE_KEY,
        merchantCode: process.env.TRIPAY_MERCHANT_CODE,
      },
      xendit: {
        apiKey: process.env.XENDIT_API_KEY,
      },
    },
    storage: {
      r2: {
        accountId: process.env.R2_ACCOUNT_ID,
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        bucket: process.env.R2_BUCKET_NAME,
      },
    },
  },
} as const;

export type Config = typeof config;
