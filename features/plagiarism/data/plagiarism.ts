export const plagiarismHub = {
  title: ["Cek tulisanmu", "sebelum dikumpulin"],
  description:
    "Cek similarity Turnitin, deteksi tulisan AI, atau parafrase manual. Bayar per file.",
}

export type PlagiarismService = {
  slug: string
  title: string
  description: string
  price: number
  summary: string
  filters: boolean
}

export const plagiarismServices: PlagiarismService[] = [
  {
    slug: "turnitin",
    title: "Cek Plagiasi Turnitin V2",
    description:
      "Cek similarity tugasmu dengan Turnitin, biar kamu bisa tahu bagian mana yang perlu diperbaiki",
    price: 7000,
    summary: "Cek similarity satu dokumen. Laporan masuk ke WhatsApp.",
    filters: true,
  },
  {
    slug: "cek-ai",
    title: "Cek AI",
    description:
      "Penasaran tulisanmu terdeteksi AI atau nggak? Cek dokumenmu dan lihat hasilnya di sini.",
    price: 4000,
    summary: "Cek deteksi AI satu dokumen. Hasil masuk ke WhatsApp.",
    filters: false,
  },
  {
    slug: "parafrase-manual",
    title: "Parafrase Manual",
    description:
      "Tulisan terasa terlalu mirip? Bantu rapikan dan parafrase tugasmu secara manual untuk kebutuhan AI maupun Turnitin",
    price: 25000,
    summary: "Parafrase manual satu dokumen. Hasil masuk ke WhatsApp.",
    filters: false,
  },
]

export const plagiarismFlowSteps = [
  {
    title: "Pilih Layanan",
    body: "Pilih layanan parafrase yang sesuai dengan kebutuhanmu",
  },
  {
    title: "Isi Data & Bayar",
    body: "Masukkan data dan dokumen yang diperlukan, lalu selesaikan pembayaran dengan metode yang tersedia",
  },
  {
    title: "Biar Kami yang Proses",
    body: "Dokumenmu akan kami proses sesuai layanan dan ketentuan yang kamu pilih",
  },
  {
    title: "Terima Laporan",
    body: "Setelah selesai, hasil parafrasemu akan dikirim dan bisa langsung kamu download untuk digunakan",
  },
]

export const plagiarismBenefits = [
  {
    title: "Cepat & Nggak Ribet",
    body: "Upload dokumenmu, pilih layanan yang kamu butuhkan, lalu tunggu hasilnya. Prosesnya dibuat simpel supaya kamu bisa langsung lanjut ngerjain tugas",
  },
  {
    title: "Akses 24 Jam",
    body: "Mau cek pagi, siang, atau bahkan pas deadline? Layanan Ngampus bisa kamu akses kapan pun kamu butuh",
  },
  {
    title: "Laporan Terverifikasi",
    body: "Dapatkan laporan hasil pengecekan yang jelas dan terverifikasi untuk membantu kamu memahami hasil similarity atau deteksi AI pada dokumenmu",
  },
]

export function getPlagiarismService(slug: string) {
  return plagiarismServices.find((service) => service.slug === slug)
}

export function formatStartPrice(price: number) {
  return `Start Rp ${price.toLocaleString("id-ID")}/file`
}

export const turnitinNotice = {
  title: "Ketentuan Similarity Check",
  body: "Dokumen yang kamu cek maksimal 10 MB, 200 halaman, atau 60.000 kata. Tenang, dokumenmu dijamin 100% No-Repository dan tidak tersimpan di database Turnitin.",
}

export const aiCheckNotice = {
  title: "Ketentuan Cek AI",
  body: "Dokumen maksimal 10 MB & 25.000 kata. Pengecekan AI menggunakan Multi-LLM seperti GPT-4o, Claude 3.5, Gemini, dan DeepSeek untuk mendeteksi indikasi kecerdasan buatan pada teks yang kamu cek serta dokumen tidak tersimpan di database.",
}

export const plagiarismCheckout = {
  summaryTitle: "Ringkasan Pembayaran",
  uploadTitle: "Upload Dokumen",
  uploadDescription: "PDF",
  emptyFile: "Belum ada dokumen",
  payLabel: "Bayar Sekarang",
}

export const plagiarismFilters = [
  {
    id: "sumber-kutipan",
    title: "Exclude Quotes",
    description: "Abaikan Kutipan",
    defaultChecked: true,
  },
  {
    id: "daftar-pustaka",
    title: "Exclude Bibliography",
    description: "Abaikan Daftar Pustaka",
    defaultChecked: false,
  },
  {
    id: "exclude-matches",
    title: "Exclude Small Matches",
    description: "Abaikan Kesamaan Kecil",
    defaultChecked: false,
  },
] as const
