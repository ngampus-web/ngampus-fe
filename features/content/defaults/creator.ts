export const creatorDefault = {
  submitLabel: "Submit Konten",
  title: "Ngampus Creator",
  description:
    "Daftar atau masuk untuk membuka dashboard creator, lalu submit konten kampanye kamu.",
  imageFileId: null as string | null,
  joinTitle: "Gimana Cara Ikutan Jadi Ngampus Creator?",
  joinSteps: [
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
  ],
  platforms: [
    {
      icon: "instagram",
      name: "Instagram",
      items: [
        "Gunakan akun pribadi dan pastikan akunmu tidak dalam mode private.",
        "Buat konten dalam format Reels dengan durasi minimal 30 detik.",
        "Konten wajib menyebutkan atau menampilkan Ngampus.co.id.",
        "Konten harus dibuat dan dipublikasikan langsung oleh pemilik akun yang terdaftar sebagai Ngampus Creator.",
      ],
    },
    {
      icon: "tiktok",
      name: "TikTok",
      items: [
        "Gunakan akun pribadi dan pastikan akunmu tidak dalam mode private.",
        "Buat video dengan durasi minimal 30 detik.",
        "Konten wajib menyebutkan atau menampilkan Ngampus.co.id.",
        "Konten harus dibuat dan dipublikasikan langsung oleh pemilik akun yang terdaftar sebagai Ngampus Creator.",
      ],
    },
    {
      icon: "x",
      name: "X / Thread",
      items: [
        "Gunakan akun pribadi dan pastikan akunmu tidak dalam mode private.",
        "Buat konten dalam format thread.",
        "Thread wajib menampilkan screenshot atau tampilan website Ngampus.co.id.",
        "Thread harus dibuat dan dipublikasikan langsung oleh pemilik akun yang terdaftar sebagai Ngampus Creator.",
      ],
    },
  ],
  fees: [
    {
      name: "Instagram",
      text: "Mencapai 3.000 views → Rp10.000\nMencapai 15.000 views → Rp50.000\nMencapai 100.000 views → Rp150.000",
    },
    {
      name: "TikTok",
      text: "Mencapai 3.000 views → Rp10.000\nMencapai 15.000 views → Rp50.000\nMencapai 100.000 views → Rp150.000",
    },
    {
      name: "X / Thread",
      text: "Mencapai 3.000 impressions → Rp10.000\nMencapai 15.000 impressions → Rp50.000\nMencapai 100.000 impressions → Rp150.000",
    },
  ],
  feeNote:
    "Reward diberikan setelah jumlah views/impressions dinyatakan memenuhi syarat melalui proses verifikasi.",
  contentRules: [
    "Kenalkan Ngampus secara natural. Sebutkan atau tampilkan Ngampus.co.id tanpa membuat konten terasa seperti iklan.",
    "Bikin konten yang relate. Angkat pengalaman, tips, rekomendasi, storytelling, atau topik yang dekat dengan kehidupan mahasiswa.",
    "Tetap kasih value. Pastikan kontenmu memberikan informasi, insight, atau hiburan, bukan sekadar promosi Ngampus.",
    "Gunakan informasi yang sesuai. Pastikan informasi tentang fitur dan layanan Ngampus benar dan tersedia di website.",
    "Buat konten original. Konten harus hasil karya sendiri dan bukan repost atau karya milik creator lain.",
    "Jaga konten tetap publik. Konten yang sudah disubmit harus tetap dapat diakses publik selama proses verifikasi.",
    "Satu platform, satu akun. Setiap user hanya dapat mendaftarkan 1 akun Instagram, 1 TikTok, 1 X, dan 1 Thread.",
    "Satu URL, satu submission. Setiap URL konten hanya dapat diajukan satu kali di seluruh sistem.",
  ],
  sections: [
    {
      title: "Yang Nggak Boleh Dilakukan",
      items: [
        "Menggunakan bot, jasa beli views, atau cara tidak organik untuk menaikkan views/impressions.",
        "Memanipulasi engagement demi mengejar reward.",
        "Menggunakan karya creator lain tanpa izin.",
        "Mengajukan konten yang sama melalui lebih dari satu akun.",
        "Menghapus atau mengubah konten menjadi private sebelum verifikasi selesai.",
        "Membuat konten yang mengandung SARA, pornografi, ujaran kebencian, kekerasan, hoaks, atau aktivitas ilegal.",
        "Menyebarkan informasi palsu atau klaim yang dapat merugikan Ngampus.",
      ],
    },
    {
      title: "Proses Verifikasi",
      items: [
        "Konten dicek. Setiap submission akan diperiksa sebelum reward diberikan.",
        "Performa diverifikasi. Views/impressions yang digunakan adalah angka yang terlihat saat proses verifikasi.",
        "Hasil ditentukan. Submission yang tidak sesuai ketentuan atau memiliki engagement tidak organik dapat ditolak.",
        "Reward diproses. Submission yang lolos akan mendapatkan reward sesuai pencapaian.",
        "Maksimal 1 minggu. Verifikasi dan pemberian reward dilakukan maksimal 1 minggu setelah submission diajukan.",
      ],
    },
    {
      title: "Cara Submit Konten",
      items: [
        "Buat & Publish. Buat konten sesuai ketentuan, lalu upload di akun yang sudah terdaftar.",
        "Cek Kontenmu. Pastikan akun dan konten masih bisa diakses publik.",
        "Siapkan Data. Salin URL konten dan siapkan screenshot views/impressions terbaru.",
        "Submit di Ngampus. Pilih platform, masukkan URL, lalu lengkapi data yang diminta.",
        "Tunggu Verifikasi. Kirim submission dan pantau prosesnya di Ngampus.",
        "Dapatkan Reward. Jika memenuhi ketentuan, reward diberikan berdasarkan views/impressions yang terverifikasi.",
      ],
    },
  ],
  seo: {
    title: "Ngampus Creator",
    description:
      "Syarat social media, fee, dan cara submit untuk campaign UGC Ngampus.",
    imageFileId: null as string | null,
  },
}
