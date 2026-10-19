export type LegalSection = {
  title: string
  paragraphs?: string[]
  items?: string[]
}

export const privacyIntro =
  "Cara Ngampus menyimpan data akun, dokumen, dan pesananmu."

export const termsIntro =
  "Ketentuan pemesanan, pembayaran, dan pemakaian layanan Ngampus."

export const termsSections: LegalSection[] = [
  {
    title: "1. Ruang Lingkup Layanan",
    paragraphs: [
      "Layanan mencakup cek plagiasi, cek AI, dan jasa parafrase sesuai paket yang dipilih pengguna. Dengan menggunakan layanan, pengguna menyatakan dokumen yang diunggah adalah dokumen yang sah untuk diproses.",
    ],
  },
  {
    title: "2. Akun dan Tanggung Jawab Pengguna",
    items: [
      "Pengguna wajib memberikan data yang benar dan dapat dihubungi.",
      "Pengguna bertanggung jawab atas keamanan akun serta aktivitas yang terjadi pada akun tersebut.",
      "Dilarang menggunakan layanan untuk tindakan melanggar hukum, hak cipta, atau kebijakan institusi akademik.",
    ],
  },
  {
    title: "3. Pembayaran dan Pemesanan",
    items: [
      "Harga mengikuti yang tampil saat checkout.",
      "Pesanan diproses setelah pembayaran terverifikasi.",
      "Keterlambatan akibat gangguan pihak ketiga (gateway, provider, jaringan) akan diinformasikan secepatnya.",
    ],
  },
  {
    title: "4. Hasil Layanan",
    items: [
      "Hasil cek/plagiasi/AI dan parafrase bersifat bantuan teknis. Keputusan akademik final tetap menjadi kewenangan institusi pengguna.",
    ],
  },
  {
    title: "5. Pembatalan, Komplain, dan Refund",
    items: [
      "Komplain dapat diajukan melalui kontak resmi dengan menyertakan kode order. Penilaian refund mengikuti status pemrosesan dan bukti teknis yang tersedia pada sistem.",
    ],
  },
  {
    title: "6. Batas Tanggung Jawab",
    items: [
      "Ngampus.id tidak bertanggung jawab atas kerugian tidak langsung, konsekuensial, atau keputusan pihak ketiga yang berada di luar kendali operasional layanan.",
    ],
  },
  {
    title: "7. Perubahan Ketentuan",
    items: [
      "Ketentuan dapat diperbarui sewaktu-waktu. Versi terbaru akan dipublikasikan pada halaman ini.",
    ],
  },
  {
    title: "8. Kontak",
    items: [
      "Untuk pertanyaan terkait ketentuan ini, hubungi kami melalui WhatsApp resmi atau email yang tertera di footer situs.",
    ],
  },
]

export const privacySections: LegalSection[] = [
  {
    title: "1. Data yang Dikumpulkan",
    items: [
      "Data akun: nama, email, nomor WhatsApp, dan data transaksi.",
      "Data layanan: file/dokumen yang diunggah, metadata order, serta log proses teknis.",
      "Data perangkat dasar: alamat IP, user-agent, dan waktu akses untuk keamanan dan audit.",
    ],
  },
  {
    title: "2. Tujuan Penggunaan Data",
    items: [
      "Memproses order dan mengirim hasil layanan.",
      "Verifikasi pembayaran, dukungan pelanggan, dan penanganan komplain.",
      "Peningkatan keamanan sistem, pencegahan penyalahgunaan, serta analitik operasional internal.",
    ],
  },
  {
    title: "3. Penyimpanan dan Penghapusan Dokumen",
    paragraphs: [
      "Dokumen pengguna disimpan seperlunya untuk menjalankan layanan, lalu dihapus sesuai kebijakan retensi internal. Kami tidak menggunakan dokumen pengguna untuk pelatihan model tanpa persetujuan eksplisit.",
    ],
  },
  {
    title: "4. Berbagi Data ke Pihak Ketiga",
    paragraphs: [
      "Data dapat diproses oleh penyedia infrastruktur/pembayaran yang relevan untuk menjalankan layanan. Kami membatasi akses hanya pada kebutuhan operasional yang sah.",
    ],
  },
  {
    title: "5. Keamanan Data",
    paragraphs: [
      "Kami menerapkan kontrol teknis dan administratif yang wajar untuk melindungi data dari akses tidak sah, perubahan, atau kebocoran.",
    ],
  },
  {
    title: "6. Hak Pengguna",
    items: [
      "Meminta akses atau koreksi data akun.",
      "Meminta penghapusan data sesuai ketentuan hukum dan kebutuhan operasional minimum.",
      "Mencabut persetujuan komunikasi non-esensial kapan saja.",
    ],
  },
  {
    title: "7. Cookie dan Session",
    paragraphs: [
      "Kami menggunakan cookie/session untuk autentikasi, keamanan, dan kenyamanan penggunaan situs.",
    ],
  },
  {
    title: "8. Perubahan Kebijakan",
    paragraphs: [
      "Kebijakan privasi ini dapat diperbarui sewaktu-waktu. Perubahan berlaku sejak dipublikasikan pada halaman ini.",
    ],
  },
  {
    title: "9. Kontak Privasi",
    paragraphs: [
      "Jika Anda memiliki pertanyaan tentang kebijakan ini atau permintaan terkait data pribadi, silakan hubungi kanal resmi customer service kami.",
    ],
  },
]
