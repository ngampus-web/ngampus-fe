export const creatorJoinSteps = [
  {
    title: "Daftar & Pahami Ketentuannya",
    body: "Isi data pendaftaran dengan lengkap, lalu baca ketentuan dan panduan Ngampus Creator sebelum mulai",
  },
  {
    title: "Buat & Submit Kontenmu",
    body: "Buat konten sesuai ketentuan, upload di media sosialmu, lalu submit link konten melalui website Ngampus",
  },
  {
    title: "Tunggu Verifikasi & Dapatkan Reward",
    body: "Kontenmu akan kami verifikasi. Kalau dinyatakan valid, reward akan masuk ke saldo akunmu dan bisa langsung kamu withdraw",
  },
]

export const campaignPlatforms = [
  {
    icon: "instagram" as const,
    name: "Instagram",
    items: [
      "Menggunakan akun pribadi dan bukan akun private.",
      "Memiliki konten Reels dengan durasi minimal 30 detik.",
      "Konten wajib menyebutkan atau menampilkan Ngampus.co.id",
      "Konten harus dibuat dan dipublikasikan oleh pemilik akun yang terdaftar.",
    ],
  },
  {
    icon: "tiktok" as const,
    name: "TikTok",
    items: [
      "Menggunakan akun pribadi dan bukan akun private.",
      "Video memiliki durasi minimal 30 detik.",
      "Konten wajib menyebutkan atau menampilkan Ngampus.co.id",
      "Konten harus dibuat dan dipublikasikan oleh pemilik akun yang terdaftar.",
    ],
  },
  {
    icon: "x" as const,
    name: "X / Thread",
    items: [
      "Menggunakan akun pribadi dan bukan akun private.",
      "Konten dibuat dalam format thread.",
      "Thread wajib menampilkan screenshot atau tampilan website Ngampus.co.id",
      "Thread harus dibuat dan dipublikasikan oleh pemilik akun yang terdaftar.",
    ],
  },
]

export const campaignFees = [
  {
    name: "Instagram",
    text: "Setiap konten yang mencapai 3.000 views berhak mendapatkan Rp10.000 atau 1 akun Premium NGAMPUS secara random.",
  },
  {
    name: "TikTok",
    text: "Setiap video yang mencapai 3.000 views berhak mendapatkan Rp10.000 atau 1 akun Premium NGAMPUS secara random.",
  },
  {
    name: "X / Thread",
    text: "Setiap thread yang mencapai 3.000 impressions berhak mendapatkan Rp10.000 atau 1 akun Premium NGAMPUS secara random.",
  },
]

export const campaignFeeNote =
  "Reward diberikan setelah jumlah views/impressions dinyatakan memenuhi syarat melalui proses verifikasi."

export const campaignContentRules = [
  "Konten wajib menyebutkan atau memperkenalkan Ngampus.co.id secara natural.",
  "Penyampaian NGAMPUS harus menggunakan pendekatan soft selling, bukan hard selling atau iklan yang terlalu promosi.",
  "Konten sebaiknya dikemas dalam bentuk pengalaman, tips, rekomendasi, storytelling, atau pembahasan yang relevan dengan kehidupan mahasiswa.",
  "Konten tetap harus memberikan informasi atau value kepada audience, bukan hanya mengajak untuk membeli atau menggunakan NGAMPUS.",
  "Konten wajib mencantumkan nama atau link Ngampus.co.id agar dapat ditemukan oleh audience.",
  "Konten harus merupakan karya sendiri dan tidak mengambil atau mengunggah ulang konten milik pihak lain.",
  "Informasi mengenai fitur dan layanan NGAMPUS harus sesuai dengan layanan yang tersedia.",
  "Konten tidak boleh menggunakan klaim yang menyesatkan atau memberikan informasi yang tidak dapat dipertanggungjawabkan.",
  "Konten yang telah didaftarkan harus tetap dapat diakses secara publik selama proses verifikasi.",
  "Setiap konten hanya dapat digunakan untuk 1 kali pengajuan reward.",
]

export const campaignSections: {
  title: string
  items: string[]
}[] = [
  {
    title: "Larangan",
    items: [
      "Dilarang menggunakan bot, jasa pembelian views, atau metode lain untuk meningkatkan views/impressions secara tidak organik.",
      "Dilarang melakukan manipulasi engagement untuk memenuhi target reward.",
      "Dilarang menggunakan konten milik creator lain tanpa izin.",
      "Dilarang menggunakan lebih dari satu akun untuk mengajukan konten yang sama.",
      "Dilarang menghapus atau mengubah status publik konten sebelum proses verifikasi selesai.",
      "Dilarang membuat konten yang mengandung SARA, pornografi, ujaran kebencian, kekerasan, hoaks, atau aktivitas yang melanggar hukum.",
      "Dilarang mencantumkan informasi palsu atau membuat klaim yang dapat merugikan NGAMPUS.",
    ],
  },
  {
    title: "Verifikasi",
    items: [
      "Setiap pengajuan akan diperiksa oleh tim NGAMPUS sebelum reward diberikan.",
      "Jumlah views atau impressions yang digunakan adalah angka yang terlihat pada saat proses verifikasi.",
      "NGAMPUS dapat menolak pengajuan apabila konten tidak memenuhi ketentuan campaign.",
      "Jika ditemukan indikasi engagement tidak organik, pengajuan tidak akan mendapatkan reward.",
      "Proses verifikasi dan pemberian reward dilakukan maksimal 3–7 hari kerja setelah konten diajukan.",
    ],
  },
  {
    title: "Cara Submit",
    items: [
      "Buat dan publikasikan konten sesuai ketentuan campaign.",
      "Pastikan akun dan konten dapat diakses secara publik.",
      "Salin link konten yang telah dipublikasikan.",
      "Masuk ke halaman Submit Content NGAMPUS.",
      "Pilih platform yang digunakan dan masukkan link konten.",
      "Masukkan jumlah views/impressions yang diperoleh.",
      "Upload screenshot sebagai bukti jumlah views/impressions.",
      "Kirim submission dan tunggu proses verifikasi dari tim NGAMPUS.",
      "Reward akan diberikan apabila konten dan jumlah views/impressions telah memenuhi seluruh ketentuan.",
    ],
  },
]
