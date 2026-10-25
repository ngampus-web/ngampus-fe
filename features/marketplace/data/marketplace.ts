import type { PromoSlide } from "../../../components/shared/promo-slides"
import type { CheckoutSection } from "../types"

export const marketplaceCategories = [
  { id: "semua", label: "Semua" },
  { id: "ai-productivity", label: "AI & Productivity" },
  { id: "design-creative", label: "Design & Creative" },
  { id: "entertainment", label: "Entertainment" },
  { id: "learning", label: "Learning" },
] as const

export type MarketplaceCategory = (typeof marketplaceCategories)[number]["id"]

// Bundled logos used until product logos are uploaded to the CDN (admin → Produk).
export const marketplaceLogoFallback: Record<string, string> = {
  chatgpt: "/images/app-chatgpt.png",
  claude: "/images/app-claude.png",
  gemini: "/images/app-gemini.png",
  canva: "/images/app-canva.png",
  capcut: "/images/app-capcut.png",
  "alight-motion": "/images/app-alight-motion.png",
  spotify: "/images/app-spotify.png",
  youtube: "/images/app-youtube.png",
  perplexity: "/images/app-perplexity.png",
  duolingo: "/images/app-duolingo.jpg",
  "disney-plus": "/images/app-disney.jpg",
  loklok: "/images/app-loklok.png",
  netflix: "/images/app-netflix.jpg",
  zoom: "/images/app-zoom.png",
}

export const marketplaceOrderSteps = [
  {
    title: "Pilih Produk",
    body: "Cari dan pilih akun yang kamu butuhkan.",
  },
  {
    title: "Cek Detail Produk",
    body: "Baca detail akun, pilihan paket, garansi, dan ketentuan penggunaan sebelum melanjutkan.",
  },
  {
    title: "Isi Data & Bayar",
    body: "Masukkan data yang diperlukan, lalu lakukan pembayaran dengan metode yang tersedia.",
  },
  {
    title: "Terima Akun",
    body: "Setelah pembayaran terverifikasi, detail akun akan segera dikirimkan ke data yang kamu berikan.",
  },
]

export const marketplaceWarrantyBanner = {
  title: ["Akun bermasalah?", "Klaim garansi di sini"],
  description:
    "Kalau akun yang kamu terima tidak sesuai ketentuan, ajukan klaim dengan bukti pembelian. Tim Ngampus bantu cek dan kasih solusi.",
  cta: "Klaim Garansi",
  href: "/klaim-garansi",
}

export const marketplaceBenefits = [
  {
    title: "Akun Lengkap, Harga Ramah",
    body: "Berbagai akun digital untuk kebutuhan kuliah, desain, sampai hiburan tersedia di satu tempat dengan harga yang ramah buat kantong kamu!",
  },
  {
    title: "Proses Mudah & Nggak Ribet",
    body: "Cari akun, cek detailnya, isi data, lalu bayar. Setelah pembayaran terverifikasi, pesananmu segera kami proses",
  },
  {
    title: "Ada Garansi, Jadi Lebih Tenang",
    body: "Setiap produk punya ketentuan garansi yang jelas. Kalau produk yang kamu terima tidak sesuai ketentuan, kamu bisa ajukan klaim melalui Ngampus",
  },
]

const durations = [
  { id: "1", label: "1 Bulan", months: 1 },
  { id: "6", label: "6 Bulan", months: 6 },
  { id: "12", label: "12 Bulan", months: 12 },
]

export { durations as checkoutDurations }

export const checkoutTypes = ["Private", "Sharing"]

export const warranty: CheckoutSection = {
  title: "Garansi",
  items: [
    {
      body: "Produk ini dilengkapi dengan garansi sesuai dengan durasi garansi yang tercantum pada masing-masing produk. Jika terjadi kendala akses selama masa garansi, tim NGAMPUS akan membantu melakukan pengecekan dan memberikan solusi sesuai kebijakan yang berlaku.",
    },
    {
      body: "Solusi garansi dapat berupa perbaikan akses, penggantian akun, penggantian akses, atau refund apabila kendala tidak dapat diselesaikan berdasarkan hasil pengecekan tim NGAMPUS.",
    },
  ],
}

export const warrantyTerms: CheckoutSection = {
  title: "Syarat & Ketentuan",
  items: [
    {
      body: "Durasi garansi mengikuti waktu yang tercantum pada masing-masing produk.",
    },
    {
      body: "Garansi mencakup kendala akses atau layanan yang berasal dari produk yang dibeli.",
    },
    {
      body: "Pelanggan wajib mengikuti panduan dan ketentuan penggunaan yang diberikan NGAMPUS.",
    },
    {
      body: "Garansi tidak berlaku jika pelanggan membagikan akun, mengubah data akun tanpa izin, atau menggunakan layanan di luar ketentuan produk.",
    },
    {
      body: "Pengajuan garansi wajib disertai bukti kendala yang diperlukan untuk proses pengecekan.",
    },
    {
      body: "Penyelesaian dapat berupa perbaikan akses, penggantian akun, penggantian akses, atau refund sesuai hasil pengecekan.",
    },
    {
      body: "Jika refund menjadi solusi terakhir, nominal refund dihitung berdasarkan: Harga × (Durasi Tersisa ÷ Durasi Garansi) × 80%.",
    },
    {
      body: "Keputusan akhir terkait garansi ditentukan oleh tim NGAMPUS berdasarkan hasil pengecekan dan kebijakan yang berlaku.",
    },
  ],
}

/** Shown when the banner API is unavailable or has no live banners. */
export const fallbackMarketplaceSlides: PromoSlide[] = [
  {
    image: "/images/marketplace/banner-premium.png",
    href: "#marketplace-search",
    label: "Akun Premium",
    alt: "Dapatkan akun premium, harga mahasiswa. Mulai dari Rp10.000",
  },
  {
    image: "/images/marketplace/banner-gpt-go.png",
    href: "/marketplace/chatgpt",
    label: "GPT Go",
    alt: "Dapatkan akun GPT Go, harga terjangkau! Mulai dari Rp20.000",
  },
]
