# Arsitektur frontend

## Arah dependensi

`app → features → components / config / lib`

- `app/` menangani URL, metadata, parameter Next.js, redirect, dan komposisi. UI fitur yang besar diletakkan di `features/<fitur>/components`.
- Fitur boleh memakai komponen bersama dan modul internalnya. Integrasi lintas fitur dikoordinasikan lewat `app/`; jangan mengimpor UI internal fitur lain.
- `components/`, `config/`, dan `lib/` tidak mengimpor fitur atau rute. ESLint memeriksa batas ini untuk impor alias.
- Gunakan impor file secara langsung, misalnya `@/features/marketplace/services/catalog`. Hindari satu barrel `index.ts` yang mencampur modul server dan client.
- Pertahankan `"use client"` hanya pada komponen dan hook yang membutuhkan browser. Layanan server mendatang menggunakan `import "server-only"` dan tidak diimpor komponen client.

## Memilih tempat perubahan

| Perubahan                         | Lokasi                                                                      |
| --------------------------------- | --------------------------------------------------------------------------- |
| Label menu, kontak, link sosial   | `config/navigation.ts`                                                      |
| Deskripsi footer                  | `config/site.ts`                                                            |
| Konten dan bagian beranda         | `features/home/`                                                            |
| Harga, paket, garansi produk      | `features/marketplace/data/marketplace.ts`                                  |
| Mapping produk ke model checkout  | `features/marketplace/services/catalog.ts`                                  |
| Form checkout                     | `features/marketplace/components/marketplace-checkout.tsx`                  |
| Kampanye dan tiga langkah Creator | `features/creator/data/campaign.ts`                                         |
| Sesi demo dan sinkronisasi UI     | `features/creator/services/demo-session.ts`, `hooks/use-creator-session.ts` |
| Artikel dan fungsi filter         | `features/blog/data/blog.ts`, `services/posts.ts`                           |
| Klaim contoh                      | `features/warranty/data/demo-claims.ts`                                     |
| Teks form klaim                   | `features/warranty/data/warranty-claims.ts`                                 |
| Tampilan umum                     | `components/ui`, `components/layout`, `components/shared`                   |

`data/` berisi sumber lokal saat ini; `demo-*` secara eksplisit merupakan data contoh. `services/` memuat fungsi yang benar-benar dipakai, bukan endpoint backend fiktif. Pisahkan DTO API dari model tampilan ketika kontrak backend disepakati.

## Menambah fitur

1. Buat modul dalam `features/<nama>/` dengan hanya folder yang diperlukan.
2. Letakkan tipe domain bersama fitur; hindari satu folder tipe global untuk semua domain.
3. Tambahkan rute tipis di `app/` dan gunakan komponen fitur.
4. Jika memerlukan backend, implementasikan adapter dalam fitur dan validasi input serta izin di server.
5. Jalankan lint, typecheck, test fitur, dan build. Untuk perubahan UI periksa desktop dan mobile.

Refactor ini mempertahankan URL dan teks produk. Sesi Creator disatukan melalui subscription agar header, banner, dan dashboard membaca sumber state yang sama. Perubahan query File Tools mereset panel menggunakan React key.
