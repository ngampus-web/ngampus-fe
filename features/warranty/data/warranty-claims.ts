import type { WarrantyClaimStatus } from "../types"

export const warrantyClaimsPage = {
  title: "Pusat Klaim Garansi Marketplace Ngampus",
  description:
    "Ada produk yang tidak sesuai ketentuan? Ajukan klaim di sini, dan kami bantu proses sesuai ketentuan garansi produkmu",
  cta: "Ajukan Klaim",
}

export const warrantyClaimFilters = [
  { id: "semua", label: "Semua Klaim" },
  { id: "dalam-proses", label: "Dalam Proses" },
  { id: "selesai", label: "Selesai" },
  { id: "ditolak", label: "Ditolak" },
] as const

export const warrantyClaimStatusLabel: Record<WarrantyClaimStatus, string> = {
  "dalam-proses": "Dalam Proses",
  selesai: "Selesai",
  ditolak: "Ditolak",
}

export const warrantyClaimCategories = [
  "Akun Ter-logout Otomatis",
  "Password Berubah",
  "Limit Tercapai",
]

export const warrantyClaimForm = {
  title: "Pengajuan Klaim Garansi Baru",
  description: "Isi rincian kendala lisensi untuk verifikasi oleh tim support",
  orderLabel: "ID / Nomor Faktur Pesanan",
  orderPlaceholder: "Masukkan ID atau nomor faktur pesananmu",
  categoryLabel: "Kategori Kendala",
  categoryPlaceholder: "Apa Kendala yang Kamu Alami?",
  detailLabel: "Ceritakan Kendalamu",
  detailPlaceholder:
    "Jelaskan kendala yang kamu alami secara detail, termasuk kapan kendala terjadi dan pesan error jika ada…",
  proofLabel: "Bukti Screenshot",
  proofTitle: "Upload Bukti Screenshot",
  proofHint:
    "Lampirkan screenshot yang menunjukkan kendala pada akun atau produkmu",
  proofButton: "Upload Screenshot",
  cancel: "Batal",
  submit: "Kirim Pengajuan Klaim",
}
