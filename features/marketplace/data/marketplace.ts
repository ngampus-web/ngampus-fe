import type { CheckoutOffer, CheckoutSection } from "../types"

export const marketplaceCategories = [
  { id: "semua", label: "Semua" },
  { id: "ai-productivity", label: "AI & Productivity" },
  { id: "design-creative", label: "Design & Creative" },
  { id: "entertainment", label: "Entertainment" },
  { id: "learning", label: "Learning" },
] as const

export type MarketplaceCategory = (typeof marketplaceCategories)[number]["id"]

const marketplaceAppMetadata = [
  {
    slug: "chatgpt",
    name: "ChatGPT",
    description: "Asisten nulis, riset, dan brainstorm.",
    logo: "/images/app-chatgpt.png",
    logoBordered: false,
    cta: "Beli Sekarang",
    category: "ai-productivity" as const,
  },
  {
    slug: "claude",
    name: "Claude",
    description: "Asisten menulis, analisis dokumen, dan coding.",
    logo: "/images/app-claude.png",
    logoBordered: false,
    cta: "Beli Sekarang",
    category: "ai-productivity" as const,
  },
  {
    slug: "gemini",
    name: "Gemini",
    description: "Multimodal, nyambung ke Google.",
    logo: "/images/app-gemini.png",
    logoBordered: false,
    cta: "Beli Sekarang",
    category: "ai-productivity" as const,
  },
  {
    slug: "canva",
    name: "Canva",
    description: "Desain presentasi, poster, dan feed.",
    logo: "/images/app-canva.png",
    logoBordered: false,
    cta: "Beli Sekarang",
    category: "design-creative" as const,
  },
  {
    slug: "capcut",
    name: "CapCut",
    description: "Edit video tugas dan konten singkat.",
    logo: "/images/app-capcut.png",
    logoBordered: false,
    cta: "Beli Sekarang",
    category: "design-creative" as const,
  },
  {
    slug: "alight-motion",
    name: "Alight Motion",
    description: "Edit video, animasi, dan efek visual di mobile.",
    logo: "/images/app-alight-motion.png",
    logoBordered: false,
    cta: "Beli Sekarang",
    category: "design-creative" as const,
  },
  {
    slug: "spotify",
    name: "Spotify",
    description: "Dengar musik sambil ngerjain tugas.",
    logo: "/images/app-spotify.png",
    logoBordered: false,
    cta: "Beli Sekarang",
    category: "entertainment" as const,
  },
  {
    slug: "youtube",
    name: "YouTube",
    description: "Nonton tanpa iklan, termasuk YouTube Music.",
    logo: "/images/app-youtube.png",
    logoBordered: false,
    cta: "Beli Sekarang",
    category: "entertainment" as const,
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    description: "Riset cepat, jawabannya lengkap dengan sumber.",
    logo: "/images/app-perplexity.png",
    logoBordered: false,
    cta: "Beli Sekarang",
    category: "ai-productivity" as const,
  },
  {
    slug: "duolingo",
    name: "Duolingo",
    description: "Belajar bahasa tiap hari, tanpa batas hati.",
    logo: "/images/app-duolingo.jpg",
    logoBordered: false,
    cta: "Beli Sekarang",
    category: "learning" as const,
  },
  {
    slug: "disney-plus",
    name: "Disney+",
    description: "Film dan serial, dari Marvel sampai animasi.",
    logo: "/images/app-disney.jpg",
    logoBordered: false,
    cta: "Beli Sekarang",
    category: "entertainment" as const,
  },
  {
    slug: "loklok",
    name: "Loklok",
    description: "Film, serial, drama, dan anime dari berbagai negara.",
    logo: "/images/app-loklok.png",
    logoBordered: false,
    cta: "Beli Sekarang",
    category: "entertainment" as const,
  },
  {
    slug: "netflix",
    name: "Netflix",
    description: "Film dan serial, siap nemenin nugas.",
    logo: "/images/app-netflix.jpg",
    logoBordered: false,
    cta: "Beli Sekarang",
    category: "entertainment" as const,
  },
  {
    slug: "zoom",
    name: "Zoom",
    description: "Meeting kuliah dan kelompok, tanpa batas 40 menit.",
    logo: "/images/app-zoom.png",
    logoBordered: false,
    cta: "Beli Sekarang",
    category: "ai-productivity" as const,
  },
]

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

// Product details and offers transcribed from Data Katalog.pdf (14 products).
export const checkoutCatalog: Record<
  string,
  {
    name: string
    paragraphs: string[]
    planDescriptions: string[]
    notes: string[]
    offers: CheckoutOffer[]
    additionalWarranty?: string[]
  }
> = {
  netflix: {
    name: "Netflix",
    paragraphs: [
      "Netflix adalah platform streaming yang menyediakan berbagai film, serial, anime, dokumenter, dan tayangan Netflix Original. Nikmati tontonan favorit dengan pilihan subtitle, kualitas video hingga 4K pada paket tertentu, serta fitur download untuk menonton secara offline.",
    ],
    planDescriptions: [
      "1P2U merupakan paket satu profil untuk dua pengguna yang berpotensi mengalami limit screen.",
      "1P1U merupakan paket satu profil untuk satu pengguna, tetapi tetap berpotensi mengalami limit screen.",
      "Semi Private merupakan paket satu profil untuk satu pengguna yang dapat login pada dua perangkat, tetapi tidak dapat menonton bersamaan dan tetap berpotensi mengalami limit screen.",
      "Private merupakan paket dengan satu akun yang dialokasikan untuk satu pelanggan sehingga penggunaan lebih leluasa sesuai batas paket Netflix.",
    ],
    notes: [
      "Satu akun Netflix dapat memiliki hingga 5 profil dengan maksimal 4 layar aktif bersamaan pada paket tertentu. Untuk mengurangi kendala limit screen, pengguna dapat mengunduh tayangan dan menontonnya secara offline. Penggunaan tetap mengikuti kebijakan Netflix.",
    ],
    offers: [
      {
        plan: "Sharing 1P2U",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 22000,
        official: 186000,
      },
      {
        plan: "Sharing 1P1U",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 37000,
        official: 186000,
      },
      {
        plan: "Semi Private",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 50000,
        official: 186000,
      },
      {
        plan: "Private",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 165000,
        official: 186000,
      },
    ],
  },
  gemini: {
    name: "Gemini AI",
    paragraphs: [
      "Gemini AI adalah asisten kecerdasan buatan dari Google yang membantu belajar, menulis, riset, coding, dan produktivitas sehari-hari. Dilengkapi fitur pembuatan konten, analisis dokumen, peringkasan informasi, serta pengembangan ide kreatif.",
    ],
    planDescriptions: [
      "Google AI Plus Family merupakan paket Google AI Plus dengan akses fitur AI premium untuk penulisan, riset, dan produktivitas melalui undangan Family pada akun Google pribadi.",
      "Google AI Pro Head merupakan paket Google AI Pro dengan fitur lanjutan dan batas penggunaan lebih tinggi untuk riset, coding, dan analisis dokumen, serta dapat mengundang hingga 5 pengguna melalui fitur Family yang memenuhi syarat.",
    ],
    notes: [
      "Pastikan akun Google aktif dan memenuhi persyaratan aktivasi. Google AI Plus Family menggunakan undangan Family, sedangkan Google AI Pro Head menggunakan metode redeem sesuai panduan ngampus.co.id. Pembagian manfaat AI kepada anggota Family mengikuti kebijakan dan kelayakan akun Google.",
    ],
    offers: [
      {
        plan: "Family Plus",
        warranty: "3 Bulan",
        duration: "12 Bulan",
        price: 30000,
        official: 75000,
      },
      {
        plan: "Head Pro",
        warranty: "3 Bulan",
        duration: "18 Bulan",
        price: 45000,
        official: 300000,
      },
    ],
  },
  zoom: {
    name: "Zoom",
    paragraphs: [
      "Zoom Pro adalah layanan video conference untuk meeting online, kelas virtual, presentasi, dan kegiatan organisasi. Paket ini menyediakan akun khusus untuk satu pelanggan dengan kapasitas maksimal 100 peserta , dilengkapi fitur meeting lebih panjang, screen sharing, recording, Breakout Rooms, dan Waiting Room.",
    ],
    planDescriptions: [],
    notes: [
      "Pastikan akun Zoom Pro aktif sebelum digunakan untuk meeting penting. Jangan mengubah email, password, atau pengaturan akun tanpa izin ngampus.co.id. Kapasitas peserta dan fitur mengikuti ketentuan Zoom yang berlaku.",
    ],
    offers: [
      {
        plan: "Private",
        warranty: "6 Hari",
        duration: "7 Hari",
        price: 6000,
        official: 67500,
      },
      {
        plan: "Private",
        warranty: "12 Hari",
        duration: "14 Hari",
        price: 10000,
        official: 135000,
      },
      {
        plan: "Private",
        warranty: "25 Hari",
        duration: "1 Bulan",
        price: 15000,
        official: 270000,
      },
    ],
  },
  youtube: {
    name: "YouTube",
    paragraphs: [
      "YouTube Premium adalah layanan berlangganan untuk menikmati video, musik, podcast, dan konten pembelajaran tanpa gangguan iklan pada konten yang didukung. Dilengkapi fitur background play, download offline, dan akses YouTube Music Premium.",
    ],
    planDescriptions: [
      "Family Plan (Famplan) merupakan paket YouTube Premium yang diaktifkan melalui undangan Family menggunakan akun Google pribadi.",
      "Individual Plan (Indplan) merupakan paket YouTube Premium untuk satu pengguna dengan akses fitur Premium melalui akun yang disediakan ngampus.co.id.",
    ],
    notes: [
      "Pastikan email Google tidak sedang tergabung dalam grup Family lain.",
      "Jika sebelumnya pernah bergabung dengan Family lain, pelanggan perlu keluar dari grup tersebut sebelum aktivasi.",
      "Perpindahan Family memiliki batasan dari Google. Jika akun tidak memenuhi syarat, gunakan akun Google lain yang memenuhi ketentuan.",
      "Ikuti panduan aktivasi ngampus.co.id.",
    ],
    offers: [
      {
        plan: "Famplan",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 10000,
        official: 139000,
      },
      {
        plan: "Indplan",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 25000,
        official: 139000,
      },
    ],
  },
  capcut: {
    name: "CapCut Pro",
    paragraphs: [
      "CapCut Pro adalah aplikasi editing video untuk membuat konten TikTok, Instagram Reels, YouTube Shorts, dan video promosi. Dilengkapi template premium, efek, filter, transisi, Auto Captions, penghapus background AI, serta fitur keyframe dan animasi.",
    ],
    planDescriptions: [],
    notes: [
      "Private maksimal login pada 2 perangkat.",
      "Sharing maksimal login pada 1 perangkat.",
      "Jangan mengubah informasi akun tanpa izin ngampus.co.id.",
    ],
    offers: [
      {
        plan: "Private",
        warranty: "6 Hari",
        duration: "7 Hari",
        price: 10000,
        official: 36000,
      },
      {
        plan: "Private",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 35000,
        official: 144000,
      },
      {
        plan: "Sharing",
        warranty: "6 Hari",
        duration: "7 Hari",
        price: 7000,
        official: 36000,
      },
      {
        plan: "Sharing",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 25000,
        official: 144000,
      },
    ],
  },
  "alight-motion": {
    name: "Alight Motion",
    paragraphs: [
      "Alight Motion Pro adalah aplikasi editing video dan motion graphics untuk membuat animasi, transisi, serta efek visual melalui smartphone. Dilengkapi fitur animasi keyframe, multilayer editing, animasi teks, berbagai efek visual, dan ekspor premium.",
    ],
    planDescriptions: [
      "Private merupakan paket Alight Motion Pro dengan satu akun yang dialokasikan untuk satu pelanggan guna mengakses fitur editing dan motion graphics premium.",
    ],
    notes: [
      "Gunakan akun sesuai panduan ngampus.co.id dan jangan mengubah informasi login tanpa izin. Simpan proyek penting secara mandiri. Fitur dan performa aplikasi mengikuti kompatibilitas perangkat.",
    ],
    offers: [
      {
        plan: "Private",
        warranty: "3 Bulan",
        duration: "12 Bulan",
        price: 6000,
        official: 199000,
      },
    ],
  },
  canva: {
    name: "Canva",
    additionalWarranty: [
      "Jika masa berlaku akun Canva berakhir dan tidak sesuai dengan ketentuan garansi produk, pelanggan dapat mengajukan klaim garansi untuk mendapatkan invitation terbaru sesuai ketentuan yang berlaku.",
    ],
    paragraphs: [
      "Canva adalah platform desain online untuk membuat poster, presentasi, CV, logo, dan konten media sosial. Dilengkapi berbagai template dan elemen premium, Background Remover, Magic Resize, fitur AI, serta kemampuan membuat dan mengelola desain secara kolaboratif sesuai paket.",
    ],
    planDescriptions: [
      "Member merupakan paket Canva dengan akses fitur premium, tetapi tanpa izin mengunggah font, color palette, logo, dan elemen Brand Kit tertentu.",
      "Designer merupakan paket Canva dengan akses fitur premium serta izin mengunggah font, color palette, logo, dan mengelola Brand Kit sesuai pengaturan workspace.",
      "Head/Owner merupakan paket Canva dengan peran pengelola workspace untuk mengatur anggota, desain tim, dan pengaturan administratif sesuai hak akses akun.",
    ],
    notes: [
      "Member dan Designer menggunakan email pribadi melalui undangan workspace. Hak akses mengikuti peran serta pengaturan tim. Jangan mengubah pengaturan atau menghapus desain anggota lain tanpa izin ngampus.co.id.",
    ],
    offers: [
      {
        plan: "Member",
        warranty: "1 Bulan",
        duration: "1 Bulan",
        price: 7000,
        official: 39000,
      },
      {
        plan: "Member",
        warranty: "2 Bulan",
        duration: "2 Bulan",
        price: 12000,
        official: 69000,
      },
      {
        plan: "Member",
        warranty: "3 Bulan",
        duration: "3 Bulan",
        price: 15000,
        official: 99000,
      },
      {
        plan: "Designer",
        warranty: "1 Bulan",
        duration: "1 Bulan",
        price: 9000,
        official: 39000,
      },
      {
        plan: "Designer",
        warranty: "2 Bulan",
        duration: "2 Bulan",
        price: 14000,
        official: 69000,
      },
      {
        plan: "Designer",
        warranty: "3 Bulan",
        duration: "3 Bulan",
        price: 17000,
        official: 99000,
      },
      {
        plan: "Head/Owner",
        warranty: "1 Bulan",
        duration: "1 Bulan",
        price: 35000,
        official: 349000,
      },
    ],
  },
  perplexity: {
    name: "Perplexity AI",
    paragraphs: [
      "Perplexity AI Pro adalah platform pencarian berbasis kecerdasan buatan untuk menemukan informasi, melakukan riset, dan memperoleh referensi secara cepat. Dilengkapi pencarian AI lanjutan, referensi sumber, analisis dokumen, serta akses model AI sesuai paket yang digunakan.",
    ],
    planDescriptions: [
      "Sharing 5U merupakan paket Perplexity Pro dengan akses fitur pencarian dan riset AI melalui satu akun yang dialokasikan untuk lima pengguna.",
    ],
    notes: [
      "Jangan mengubah informasi akun tanpa izin ngampus.co.id. Hindari memasukkan data pribadi atau dokumen sensitif karena akun digunakan bersama. Selalu periksa kembali sumber dan hasil jawaban AI.",
    ],
    offers: [
      {
        plan: "Sharing 5U",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 25000,
        official: 70000,
      },
    ],
  },
  claude: {
    name: "Claude AI",
    paragraphs: [
      "Claude AI adalah asisten kecerdasan buatan dari Anthropic yang membantu menulis, menganalisis dokumen panjang, coding, debugging, serta mengembangkan ide kreatif dan perencanaan proyek. Cocok untuk kebutuhan akademik dan profesional.",
    ],
    planDescriptions: [
      "Private merupakan paket Claude AI dengan satu akun yang dialokasikan untuk satu pelanggan guna mengakses fitur AI sesuai langganan yang aktif.",
      "Sharing 5U merupakan paket Claude AI dengan akses fitur AI melalui satu akun yang dialokasikan untuk lima pengguna, dengan batas penggunaan yang dapat dipengaruhi aktivitas pengguna lain.",
    ],
    notes: [
      "Batas penggunaan mengikuti kebijakan Anthropic. Jangan mengubah informasi akun tanpa izin ngampus.co.id dan hindari memasukkan informasi pribadi atau dokumen sensitif pada akun yang digunakan bersama.",
    ],
    offers: [
      {
        plan: "Private",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 450000,
        official: 499000,
      },
      {
        plan: "Sharing 5U",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 150000,
        official: 299000,
      },
    ],
  },
  chatgpt: {
    name: "ChatGPT",
    paragraphs: [
      "ChatGPT adalah asisten kecerdasan buatan dari OpenAI untuk membantu belajar, menulis, riset, coding, menganalisis dokumen, dan mengolah data. Dilengkapi kemampuan pengolahan file serta fitur AI lanjutan sesuai paket yang digunakan.",
    ],
    planDescriptions: [
      "ChatGPT Go merupakan paket AI untuk membantu belajar, menulis, membuat konten, menganalisis file, dan mendukung produktivitas sehari-hari.",
      "ChatGPT Plus merupakan paket AI dengan akses fitur lanjutan dan batas penggunaan lebih tinggi untuk riset mendalam, coding, analisis dokumen, serta pekerjaan kompleks.",
    ],
    notes: [
      "Paket Plus dan Go memiliki perbedaan fitur serta batas penggunaan. OpenAI tidak mengizinkan berbagi kredensial akun individual dengan pengguna lain, sehingga penawaran penggunaan akun bersama perlu disesuaikan dengan ketentuan resmi OpenAI.",
    ],
    offers: [
      {
        plan: "Plus Private",
        warranty: "14 Hari",
        duration: "25-30 Hari",
        price: 200000,
        official: 349000,
      },
      {
        plan: "Plus Sharing 5U",
        warranty: "14 Hari",
        duration: "25-30 Hari",
        price: 70000,
        official: 179000,
      },
      {
        plan: "GO Private",
        warranty: "25 Hari",
        duration: "3 Bulan",
        price: 90000,
        official: 225000,
      },
      {
        plan: "GO Sharing 5U",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 20000,
        official: 75000,
      },
    ],
  },
  spotify: {
    name: "Spotify",
    paragraphs: [
      "Spotify Premium adalah layanan streaming musik dan podcast untuk menikmati berbagai lagu, album, dan playlist. Dilengkapi fitur mendengarkan musik tanpa iklan audio, download offline, pemutaran lagu sesuai keinginan, serta rekomendasi musik personal.",
    ],
    planDescriptions: [
      "Individual Plan (Indplan) merupakan paket Spotify Premium untuk satu pengguna dengan akses musik tanpa iklan audio, download offline, dan playlist personal.",
      "Family Plan (Famplan) merupakan paket Spotify Premium untuk anggota keluarga yang memenuhi persyaratan, dengan fitur Premium dan rekomendasi musik pada akun masing-masing.",
    ],
    notes: [
      "Family Plan wajib memenuhi persyaratan keanggotaan yang ditetapkan Spotify. Pastikan akun memenuhi ketentuan aktivasi dan ikuti panduan dari ngampus.co.id.",
    ],
    offers: [
      {
        plan: "Indplan",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 30000,
        official: 119900,
      },
      {
        plan: "Famplan",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 25000,
        official: 119900,
      },
    ],
  },
  loklok: {
    name: "LOKLOK",
    paragraphs: [
      "LOKLOK adalah platform hiburan digital yang menyediakan berbagai film, serial, drama, dan anime. Dilengkapi fitur pencarian tayangan, pilihan subtitle, serta kualitas pemutaran sesuai paket yang digunakan.",
    ],
    planDescriptions: [
      "Basic Private merupakan paket LOKLOK Basic dengan akses satu akun khusus untuk satu pelanggan.",
      "Basic Sharing 3U merupakan paket LOKLOK Basic dengan satu akun yang digunakan oleh tiga pengguna, masing-masing mendapatkan satu slot perangkat.",
    ],
    notes: [
      "Maksimal login 3 perangkat dalam satu akun (1 PC dan 2 mobile).",
      "Hanya dapat digunakan melalui HP dan PC/laptop.",
      "Tidak mendukung login melalui Smart TV.",
    ],
    offers: [
      {
        plan: "Basic Private",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 39000,
        official: 99000,
      },
      {
        plan: "Basic Sharing 3U",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 25000,
        official: 49000,
      },
    ],
  },
  duolingo: {
    name: "Duolingo",
    paragraphs: [
      "Duolingo adalah aplikasi pembelajaran bahasa dengan metode interaktif untuk meningkatkan kemampuan membaca, menulis, mendengarkan, kosakata, dan tata bahasa. Dilengkapi latihan harian, sistem streak, serta fitur pembelajaran tambahan sesuai langganan premium.",
    ],
    planDescriptions: [
      "Private merupakan paket Duolingo dengan aktivasi akses premium melalui email pribadi pelanggan untuk mendukung pembelajaran bahasa secara lebih nyaman.",
    ],
    notes: [
      "Pastikan email aktif dan dapat menerima instruksi aktivasi dari ngampus.co.id. Gunakan akun pribadi agar progres pembelajaran tetap tersimpan. Fitur premium mengikuti jenis langganan yang diaktifkan.",
    ],
    offers: [
      {
        plan: "Private",
        warranty: "6 Hari",
        duration: "7 Hari",
        price: 5000,
        official: 40000,
      },
      {
        plan: "Private",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 15000,
        official: 105000,
      },
    ],
  },
  "disney-plus": {
    name: "Disney+",
    paragraphs: [
      "Disney+ adalah platform streaming yang menyediakan film, serial, animasi, dan dokumenter dari Disney, Pixar, Marvel, Star Wars, serta studio populer lainnya. Dilengkapi pilihan subtitle, audio, kualitas streaming, dan fitur download pada paket yang mendukung.",
    ],
    planDescriptions: [
      "Private merupakan paket Disney+ dengan satu akun yang dialokasikan untuk satu pelanggan guna menikmati berbagai tayangan yang tersedia.",
      "Sharing 3 User merupakan paket Disney+ dengan akses berbagai tayangan melalui satu akun yang dialokasikan untuk tiga pengguna.",
    ],
    notes: [
      "Gunakan profil yang telah ditentukan dan jangan mengubah pengaturan akun tanpa izin ngampus.co.id. Jumlah perangkat dan streaming bersamaan mengikuti batas paket serta kebijakan Disney+.",
    ],
    offers: [
      {
        plan: "Private",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 99000,
        official: 119000,
      },
      {
        plan: "Sharing 3 User",
        warranty: "25 Hari",
        duration: "25-30 Hari",
        price: 39000,
        official: 69000,
      },
    ],
  },
}

// Keep listing prices aligned with the cheapest available offer and its official price.
export const marketplaceApps = marketplaceAppMetadata.map((app) => {
  const product = checkoutCatalog[app.slug]
  const startingOffer = product.offers.reduce((lowest, offer) =>
    offer.price < lowest.price ? offer : lowest
  )
  return {
    ...app,
    name: product.name,
    price: `Rp ${startingOffer.price.toLocaleString("id-ID")}`,
    comparePrice: `Rp ${startingOffer.official.toLocaleString("id-ID")}`,
  }
})
