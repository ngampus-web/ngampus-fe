# Ngampus Frontend

Frontend Ngampus untuk marketplace, plagiarisme, file tools, blog, akun, creator, dan klaim garansi. Menggunakan Next.js 16, React 19, TypeScript, Tailwind CSS 4, serta shadcn/Radix.

## Mulai

Gunakan Node.js 20.9+ dan jalankan:

```bash
npm ci
npm run dev
```

Buka http://localhost:3000. Untuk pemeriksaan:

```bash
npm run lint
npm run typecheck
npm run test:features
npm run format:check
npm run build
```

`npm run start` menjalankan build produksi. Build menggunakan font Google melalui `next/font` dan memerlukan akses jaringan ketika font belum tersedia.

## Struktur

```text
app/                  Rute, metadata, layout, dan komposisi halaman
features/
  auth/               Form daftar, masuk, dan lupa password
  blog/               Artikel, daftar, filter, dan pembacaan konten
  creator/            Kampanye, dashboard, submit, withdraw, sesi demo
  file-tools/         Pilihan merge, kompres, dan konversi
  home/               Bagian beranda
  legal/              Halaman syarat dan privasi
  marketplace/        Katalog, pilihan produk, harga, dan checkout
  payment/            Konfirmasi, QRIS, dan status pembayaran pratinjau
  paraphrase/         Form DOCX, laporan, target, dan kebutuhan parafrase
  orders/             Pencarian riwayat pesanan
  plagiarism/         Katalog layanan dan form pemeriksaan
  warranty/           Form dan daftar klaim garansi

components/
  ui/                 Primitif UI shadcn
  layout/             Navbar, footer, breadcrumb, dan kerangka halaman
  shared/             Komponen presentasi lintas fitur

lib/
  api/                Type-safe API client dan endpoints
    client.ts         Base API client dengan error handling
    endpoints/        API endpoints per domain (auth, orders, payment, dll)
    index.ts          Centralized API exports
  stores/             Global state management (Zustand)
    auth.ts           Authentication state dengan localStorage persistence
  hooks/              Custom React hooks
  config.ts           Environment variables dan app config
  utils.ts            Shared utilities

types/
  api/                Backend response types dan API contracts
  
config/               Navigasi, kontak, dan konten situs bersama
public/               Aset statis
scripts/              Pemeriksaan regresi data fitur
docs/                 Panduan arsitektur, integrasi backend, dan branch
```

### Peningkatan struktur untuk integrasi backend

**API Layer (`lib/api/`)**
- Type-safe client dengan error handling otomatis
- Endpoint modules terpisah per domain (auth, orders, payment, plagiarism, warranty, creator, marketplace)
- Support untuk file upload dengan multipart/form-data
- Request/response interceptors untuk auth token

**State Management (`lib/stores/`)**
- Zustand store untuk auth state dengan localStorage persistence
- Centralized state yang mudah diintegrasikan dengan backend

**Configuration (`lib/config.ts`)**
- Centralized environment variables
- Feature flags untuk toggle mock vs real API
- Service configuration (payment gateway, storage, WhatsApp)

**Type Safety (`types/api/`)**
- Shared types untuk request/response
- Backend contract definitions
- Pagination, sorting, dan search patterns

Setiap fitur memakai `components/` untuk UI, `data/` untuk konten lokal, `types.ts` untuk tipe domain bila diperlukan, `services/` untuk pembacaan data atau adapter, dan `hooks/` untuk state yang dipakai bersama. Folder hanya dibuat bila ada implementasinya.

- [Arsitektur dan aturan dependensi](docs/architecture.md)
- [Peta integrasi backend](docs/backend-integration.md)
- [Alur pembayaran frontend](docs/payment-flow.md)
- [Form dan alur Parafrase](docs/paraphrase-flow.md)
- [Alur kerja branch](docs/git-workflow.md)

## Integrasi Backend

### Quick Start

1. Set environment variables di `.env.local`:

```bash
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Feature flags
NEXT_PUBLIC_ENABLE_AUTH=true
NEXT_PUBLIC_ENABLE_ORDERS=true
NEXT_PUBLIC_PAYMENT_MODE=production
```

2. Import dan gunakan API client di komponen:

```tsx
import { authApi, ordersApi } from '@/lib/api';

// Login
const response = await authApi.login({ email, password });
if (response.success) {
  console.log(response.data.user);
}

// Get orders
const ordersResponse = await ordersApi.getOrders({ page: 1, perPage: 10 });
if (ordersResponse.success) {
  console.log(ordersResponse.data.data); // Order array
  console.log(ordersResponse.data.meta); // Pagination
}
```

3. Gunakan auth store untuk global state:

```tsx
'use client';

import { useAuthStore } from '@/lib/stores/auth';

export function ProfileButton() {
  const { user, isAuthenticated, logout } = useAuthStore();
  
  if (!isAuthenticated) return <LoginButton />;
  
  return (
    <div>
      <p>Hello, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### API Endpoints

Tersedia endpoints untuk:
- **Auth**: login, register, logout, password reset
- **Orders**: create, list, get, cancel, search
- **Payment**: create payment, check status, verify callback
- **Plagiarism**: upload file, submit check, get status, download result
- **Warranty**: create claim, list claims, upload evidence
- **Creator**: get stats, submissions, submit content, withdraw
- **Marketplace**: get products, product detail

Lihat `lib/api/endpoints/` untuk detail lengkap setiap endpoint.

## Status integrasi

**Mode saat ini**: Preview mode dengan mock data

Backend produksi belum terhubung. Checkout menyediakan alur pembayaran pratinjau (konfirmasi, QRIS, proses, selesai), tanpa transaksi nyata; autentikasi umum belum aktif, dan riwayat belum membaca pesanan asli. Creator memakai sesi demo di `sessionStorage`; itu bukan autentikasi. Data contoh Creator dan garansi diberi nama `demo-*`. File Tools saat ini hanya menyediakan pemilihan file.

**Untuk mengaktifkan backend real**:
1. Set `NEXT_PUBLIC_API_URL` ke backend URL
2. Set `NEXT_PUBLIC_ENABLE_AUTH=true`
3. Set `NEXT_PUBLIC_ENABLE_ORDERS=true`
4. Set `NEXT_PUBLIC_PAYMENT_MODE=production`

URL publik tetap: `/`, `/marketplace`, `/marketplace/[slug]`, `/cek-plagiarisme`, `/cek-plagiarisme/[slug]`, `/file-tools`, `/blog`, `/blog/[slug]`, `/riwayat-pesanan`, `/klaim-garansi`, `/daftar`, `/masuk`, `/lupa-password`, `/creator` beserta halaman turunannya, `/syarat-ketentuan`, dan `/kebijakan-privasi`. `/ugc-campaign` mengarah ke `/creator`.

## Environment Variables

```bash
# Required for production
NEXT_PUBLIC_API_URL=              # Backend API base URL
NEXT_PUBLIC_APP_URL=              # Frontend URL untuk callback

# Feature flags
NEXT_PUBLIC_ENABLE_AUTH=          # Enable real auth (default: false)
NEXT_PUBLIC_ENABLE_ORDERS=        # Enable real orders (default: false)
NEXT_PUBLIC_PAYMENT_MODE=         # 'preview' or 'production'

# Backend only (tidak exposed ke client)
WHATSAPP_API_KEY=                 # Fonnte/Wablas API key
WHATSAPP_API_URL=                 # WhatsApp gateway URL

TRIPAY_API_KEY=                   # Tripay merchant API key
TRIPAY_PRIVATE_KEY=               # Tripay private key untuk signature
TRIPAY_MERCHANT_CODE=             # Tripay merchant code

XENDIT_API_KEY=                   # Xendit secret key

R2_ACCOUNT_ID=                    # Cloudflare R2 account ID
R2_ACCESS_KEY_ID=                 # R2 access key
R2_SECRET_ACCESS_KEY=             # R2 secret key
R2_BUCKET_NAME=                   # R2 bucket name
```

`.env*` files diabaikan Git. Konfigurasi hosting tetap mengikuti pengaturan proyek Vercel.
