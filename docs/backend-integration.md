# Backend Integration Guide

Panduan integrasi frontend dengan backend API.

## Architecture Overview

Frontend berkomunikasi dengan backend melalui type-safe API client yang terpusat di `lib/api/`. Setiap domain (auth, orders, payment, dll) memiliki module endpoint terpisah dengan types yang jelas.

```
Frontend Component
      ↓
   API Client (lib/api/client.ts)
      ↓
   Endpoint Module (lib/api/endpoints/*.ts)
      ↓
   Backend API (HTTP/JSON)
```

## API Client

### Base Client

`lib/api/client.ts` menyediakan base client dengan:
- Error handling otomatis
- Request/response type safety
- Auth token management
- File upload support

```typescript
import { apiClient } from '@/lib/api';

// GET request
const response = await apiClient.get<User>('/users/me');

// POST with body
const response = await apiClient.post<Order>('/orders', {
  items: [...],
  type: 'marketplace'
});

// File upload
const formData = new FormData();
formData.append('file', file);
const response = await apiClient.upload<FileUploadResponse>('/files', formData);
```

### Response Format

Semua endpoint mengembalikan `ApiResponse<T>`:

```typescript
type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: ApiError }

interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
}
```

### Error Handling

```typescript
const response = await authApi.login({ email, password });

if (response.success) {
  // Type-safe access to data
  console.log(response.data.user);
  console.log(response.data.token);
} else {
  // Handle error
  console.error(response.error.message);
  console.error(response.error.code);
}
```

## Endpoint Modules

### Authentication (`lib/api/endpoints/auth.ts`)

```typescript
import { authApi } from '@/lib/api';

// Login
const response = await authApi.login({ email, password });

// Register
const response = await authApi.register({ name, email, password, phone });

// Get current user
const response = await authApi.getMe();

// Logout
await authApi.logout();

// Password reset
await authApi.requestPasswordReset(email);
await authApi.resetPassword(token, newPassword);
```

### Orders (`lib/api/endpoints/orders.ts`)

```typescript
import { ordersApi } from '@/lib/api';

// Create order
const response = await ordersApi.createOrder({
  type: 'marketplace',
  items: [
    { productId: 'netflix-1m', productName: 'Netflix 1 Bulan', quantity: 1, price: 55000 }
  ]
});

// Get orders with pagination
const response = await ordersApi.getOrders({ page: 1, perPage: 10 });
if (response.success) {
  const orders = response.data.data; // Order[]
  const meta = response.data.meta;   // { page, perPage, total, totalPages }
}

// Get single order
const response = await ordersApi.getOrder(orderId);

// Search orders
const response = await ordersApi.searchOrders('netflix', { page: 1 });

// Cancel order
await ordersApi.cancelOrder(orderId);
```

### Payment (`lib/api/endpoints/payment.ts`)

```typescript
import { paymentApi } from '@/lib/api';

// Create payment
const response = await paymentApi.createPayment({
  orderId: 'order-123',
  method: 'qris',
  returnUrl: '/pembayaran/order-123'
});

if (response.success) {
  const { paymentId, qrisUrl, expiresAt } = response.data;
}

// Check payment status
const response = await paymentApi.getPaymentStatus(paymentId);
```

### Plagiarism Check (`lib/api/endpoints/plagiarism.ts`)

```typescript
import { plagiarismApi } from '@/lib/api';

// Upload file
const response = await plagiarismApi.uploadFile(file);
if (response.success) {
  const fileUrl = response.data.url;
}

// Submit check
const response = await plagiarismApi.checkPlagiarism({
  fileUrl,
  serviceType: 'turnitin',
  options: { urgency: 'express' }
});

// Get status
const response = await plagiarismApi.getCheckStatus(checkId);

// Download result
const response = await plagiarismApi.downloadResult(checkId);
```

### Warranty Claims (`lib/api/endpoints/warranty.ts`)

```typescript
import { warrantyApi } from '@/lib/api';

// Upload evidence
const response = await warrantyApi.uploadEvidence(file);
const evidenceUrl = response.success ? response.data.url : null;

// Create claim
const response = await warrantyApi.createClaim({
  orderId: 'order-123',
  reason: 'not_delivered',
  description: 'Belum menerima akun setelah 24 jam',
  evidence: [evidenceUrl]
});

// Get claims
const response = await warrantyApi.getClaims({ page: 1 });
```

### Creator Program (`lib/api/endpoints/creator.ts`)

```typescript
import { creatorApi } from '@/lib/api';

// Get stats
const response = await creatorApi.getStats();
if (response.success) {
  const { totalEarnings, pendingEarnings, totalSubmissions } = response.data;
}

// Get submissions
const response = await creatorApi.getSubmissions({ page: 1 });

// Submit content
const response = await creatorApi.submitContent(campaignId, contentUrl);

// Request withdrawal
const response = await creatorApi.requestWithdrawal({
  amount: 500000,
  bankName: 'BCA',
  accountNumber: '1234567890',
  accountName: 'John Doe'
});
```

### Marketplace (`lib/api/endpoints/marketplace.ts`)

```typescript
import { marketplaceApi } from '@/lib/api';

// Get all products
const response = await marketplaceApi.getProducts();

// Get product by slug
const response = await marketplaceApi.getProduct('netflix-premium-1m');

// Get by category
const response = await marketplaceApi.getProductsByCategory('streaming');
```

## State Management

### Auth Store

Global authentication state dengan Zustand:

```typescript
'use client';

import { useAuthStore } from '@/lib/stores/auth';
import { useEffect } from 'react';

export function App() {
  const { user, isAuthenticated, initAuth, login, logout } = useAuthStore();
  
  // Initialize auth on mount (load from localStorage)
  useEffect(() => {
    initAuth();
  }, [initAuth]);
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

Auth store otomatis:
- Persist token dan user ke localStorage
- Set Authorization header di API client
- Validate token on init
- Clear state on logout

## Configuration

### Environment Setup

Buat `.env.local`:

```bash
# API endpoint
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Feature flags
NEXT_PUBLIC_ENABLE_AUTH=true
NEXT_PUBLIC_ENABLE_ORDERS=true
NEXT_PUBLIC_PAYMENT_MODE=production
```

### Using Config

```typescript
import { config } from '@/lib/config';

console.log(config.apiUrl);              // API base URL
console.log(config.features.realAuth);   // Feature flags
console.log(config.payment.mode);        // Payment mode
```

## Migration dari Mock ke Real API

### 1. Update Feature Services

Ganti mock data dengan real API calls:

**Sebelum** (`features/orders/services/filter-orders.ts`):
```typescript
export function filterOrders(query: string) {
  return mockOrders.filter(order => 
    order.id.includes(query) || order.productName.includes(query)
  );
}
```

**Sesudah**:
```typescript
import { ordersApi } from '@/lib/api';

export async function filterOrders(query: string) {
  const response = await ordersApi.searchOrders(query);
  return response.success ? response.data.data : [];
}
```

### 2. Update Components

Ganti direct data access dengan API hooks:

**Sebelum**:
```tsx
import { demoOrders } from '@/features/orders/data/demo-orders';

export function OrderList() {
  const [orders] = useState(demoOrders);
  // ...
}
```

**Sesudah**:
```tsx
import { ordersApi } from '@/lib/api';
import { useEffect, useState } from 'react';

export function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadOrders() {
      const response = await ordersApi.getOrders();
      if (response.success) {
        setOrders(response.data.data);
      }
      setLoading(false);
    }
    loadOrders();
  }, []);
  
  if (loading) return <Spinner />;
  // ...
}
```

### 3. Remove Demo/Mock Data

Setelah endpoint backend siap:
1. Delete files di `features/*/data/demo-*.ts`
2. Remove `demo-session.ts` dan ganti dengan real auth
3. Update `config.ts` feature flags ke `true`

## Backend API Contract

Frontend mengharapkan backend API mengikuti contract ini:

### Response Format

Semua response harus JSON dengan struktur:

**Success**:
```json
{
  "data": { ... }
}
```

**Error**:
```json
{
  "message": "Error message",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

### Pagination

Endpoint list harus support query params:
- `page` (default: 1)
- `perPage` (default: 10)

Response format:
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "perPage": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Authentication

- Login/register returns: `{ token: string, user: User }`
- Protected endpoints expect: `Authorization: Bearer <token>` header
- Invalid/expired token returns 401

### File Upload

- Accept `multipart/form-data`
- Return: `{ url: string, filename: string, size: number, mimeType: string }`

### Webhook/Callback

Payment callback dari gateway:
- Verify signature dengan `POST /payments/verify-callback`
- Update order status berdasarkan callback

## Testing

Test API integration dengan mock responses:

```typescript
import { apiClient } from '@/lib/api';

// Mock fetch for testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({ data: { id: '123', name: 'Test' } })
  })
) as jest.Mock;

test('should fetch user', async () => {
  const response = await apiClient.get('/users/me');
  expect(response.success).toBe(true);
  if (response.success) {
    expect(response.data.id).toBe('123');
  }
});
```

## Troubleshooting

### CORS Issues

Jika frontend di localhost:3000 dan backend di localhost:8000, pastikan backend mengirim CORS headers:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### Auth Token Tidak Tersimpan

Check:
1. `useAuthStore` dipanggil dalam Client Component (`'use client'`)
2. `initAuth()` dipanggil di root layout atau `useEffect`
3. localStorage tidak diblok browser

### Type Errors

Jika backend response tidak match type:
1. Update `types/api/index.ts` sesuai backend contract
2. Regenerate types dari OpenAPI spec jika ada
3. Add type guard untuk backward compatibility

```typescript
function isValidUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'email' in data
  );
}
```
