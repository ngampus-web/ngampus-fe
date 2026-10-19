import type { BlogPost } from "./blog"

export const kenanPosts: BlogPost[] = [
  {
    slug: "cara-cek-plagiarisme-skripsi-sebelum-dikirim-ke-dosen",
    thumbnail: "/images/blog/cek-plagiarisme-skripsi.png",
    title:
      "Jangan Panik Dulu! Ini Cara Cek Plagiarisme Skripsi Sebelum Dikirim ke Dosen",
    excerpt:
      "Pahami hasil similarity, perbaiki sitasi dan parafrase, lalu cek kembali skripsimu dengan tenang sebelum dikirim ke dosen.",
    date: "18 Oktober 2026",
    category: "akademik",
    paragraphs: [],
    content: [
      {
        type: "paragraph",
        text: "Skripsi udah selesai belum nih, tinggal kirim ke dosen?? Eitss tapi sebelum klik submit, ada satu langkah yang sering bikin dugun-dugun… cek similarity. Banyak mahasiswa langsung panik begitu melihat angkanya, padahal angka itu belum tentu berarti kamu menjiplak. Di artikel ini kita bahas cara membaca hasilnya dengan benar, supaya revisimu tenang dan tepat sasaran.",
      },
      {
        type: "heading",
        text: "Apa itu plagiarisme dan similarity?",
      },
      {
        type: "paragraph",
        text: "Menurut Permendikbudristek No. 39 Tahun 2021 tentang Integritas Akademik, plagiat mencakup tiga perbuatan, yaitu mengambil sebagian atau seluruh karya orang lain tanpa menyebut sumber secara tepat, menulis ulang karya orang lain tanpa memakai bahasa sendiri, walaupun sumbernya disebut, dan mengambil karya atau gagasanmu sendiri yang sudah terbit tanpa menyebut sumber secara tepat. Poin kedua penting dicatat yaitu menyebut sumber saja belum cukup kalau kalimatnya masih menempel pada aslinya. Aturan ini menggantikan Permendiknas No. 17 Tahun 2010 yang lebih lama. Dalam literatur, bentuk plagiarisme sering dibagi menjadi empat, kata demi kata, atas sumber, kepengarangan, dan self-plagiarism.",
      },
      {
        type: "paragraph",
        text: "Sementara itu, similarity adalah tingkat kemiripan teksmu dengan teks lain. Alat seperti Turnitin membandingkan naskahmu dengan databasenya, yang berisi halaman web, tugas mahasiswa yang pernah diunggah, serta jurnal dan publikasi. Hasilnya berupa persentase dan highlight pada bagian yang mirip. Jadi, similarity bicara soal kemiripan, sedangkan plagiarisme bicara soal apakah kemiripan itu melanggar etika, maka dua hal itu merupakan hal berbeda.",
      },
      {
        type: "heading",
        text: "Kenapa Similarity perlu diperhatikan?",
      },
      {
        type: "paragraph",
        text: "Pelanggaran integritas akademik, termasuk plagiat, bisa dikenai sanksi administratif bagi mahasiswa. Bentuknya mulai dari pengurangan nilai karya ilmiah, penundaan atau pembatalan sebagian hak mahasiswa, pembatalan nilai mata kuliah, pemberhentian dari status mahasiswa, sampai pembatalan ijazah. Di luar itu, UU Sisdiknas mengancam lulusan yang terbukti memakai karya jiplakan untuk mendapat gelar dengan pidana penjara paling lama dua tahun dan/atau denda paling banyak Rp200 juta.",
      },
      {
        type: "paragraph",
        text: "Selain itu, mahasiswa yang masih belajar menulis akademik sering kesulitan dalam sitasi dan parafrase, sehingga plagiat bisa terjadi tanpa sengaja. Mengecek lebih awal memberimu kesempatan untuk memperbaiki sebelum dosen menemukannya.",
      },
      {
        type: "heading",
        text: "Kapan waktu yang tepat untuk melakukan pengecekan",
      },
      {
        type: "paragraph",
        text: "Jangan menunggu semuanya selesai. Ini saran praktis yang bisa kamu pakai nih:",
      },
      {
        type: "unordered-list",
        items: [
          "Cek per bab setelah bab itu selesai direvisi, supaya masalah ketahuan selagi masih kecil.",
          "Cek keseluruhan naskah sekali lagi sebelum dikirim ke dosen.",
          "Sisakan waktu untuk revisi. Jangan cek tepat di malam sebelum deadline.",
          "Tanyakan ke perpustakaan atau dosen pembimbing apakah kampusmu menyediakan akses cek mandiri. Beberapa kampus menyediakan titik submit uji coba untuk itu.",
        ],
      },
      {
        type: "heading",
        text: "Bagian skripsi yang biasanya memiliki similarity tinggi",
      },
      {
        type: "paragraph",
        text: "Hasil tiap naskah berbeda, tapi bagian-bagian ini sering muncul dengan kemiripan tinggi:",
      },
      {
        type: "unordered-list",
        items: [
          "Tinjauan pustaka dan landasan teori. Definisi dan teori baku cenderung ditulis mirip oleh banyak orang.",
          "Daftar pustaka dan kutipan langsung. Keduanya memang dipakai ulang oleh banyak penulis, dan Turnitin menyediakan opsi untuk mengecualikannya dari perhitungan.",
          "Metodologi. Kalimat prosedur standar, misalnya cara pengumpulan data, sering mirip antarpenelitian.",
          "Halaman bertemplate. Materi template institusi juga bisa ikut terdeteksi.",
        ],
      },
      {
        type: "heading",
        text: "Cara memahami hasil similarity",
      },
      {
        type: "unordered-list",
        items: [
          "Angka bukan vonis. Tidak ada skor ideal yang berlaku universal, dan batas yang dipakai berbeda-beda di tiap kampus. Cek pedoman kampusmu.",
          "Buka laporannya, jangan cuma lihat persentase. Telusuri highlight dan sumber satu per satu. Skor kecil pun bisa menyembunyikan satu paragraf yang diambil utuh dari satu sumber.",
          "Perhatikan polanya. Satu sumber dengan kecocokan panjang biasanya lebih perlu dicermati daripada banyak kecocokan kecil 1–2% dari berbagai sumber.",
          "Manfaatkan filter. Kamu bisa mengecualikan kutipan dan daftar pustaka supaya laporan lebih fokus. Tapi pengecualian yang kamu buat sebagai mahasiswa hanya sementara dan tidak mengubah skor resmi yang dilihat dosen.",
        ],
      },
      {
        type: "heading",
        text: "Apakah similarity tinggi selalu berarti plagiarisme?",
      },
      {
        type: "paragraph",
        text: "Tidak selalu lhoo, bahkan skor tinggi bisa muncul dari kutipan yang sah atau referensi yang pemformatannya kurang tepat, yang menentukan ada tidaknya plagiarisme adalah penilaian manusia, yaitu dosen atau tim kampus yang menilai konteksnya.",
      },
      {
        type: "paragraph",
        text: "Sebaliknya, skor rendah juga bukan jaminan aman. Tulisan hasil joki atau hasil content spinner bisa saja punya skor rendah padahal tidak orisinal, jadi jangan cuma mengejar angka, pastikan tulisanmu memang benar-benar milikmu.",
      },
      {
        type: "heading",
        text: "Faktor yang bisa membuat similarity tinggi",
      },
      {
        type: "unordered-list",
        items: [
          "Terlalu banyak kutipan langsung.",
          "Format kutipan atau sitasi kurang tepat, sehingga kutipan tidak terbaca sebagai kutipan.",
          "Daftar pustaka yang panjang.",
          "Template atau materi instruksi dari kampus.",
          "Istilah baku dan kalimat definisi yang sulit diubah.",
          "Bergantung pada satu atau dua sumber saja.",
          "Parafrase yang terlalu tipis, hanya mengganti beberapa kata.",
          "Tulisan lamamu sendiri yang pernah diunggah sebelumnya bisa disimpan oleh database sebagai tugas terdahulu.",
          "Kecocokan pendek. Pada laporan versi baru Turnitin, secara bawaan hanya kecocokan sepanjang 8 kata atau lebih yang ditampilkan.",
        ],
      },
      {
        type: "heading",
        text: "Cara mengurangi similarity tanpa mengubah makna tulisan",
      },
      {
        type: "paragraph",
        text: "Tujuannya bukan sekadar menurunkan angka, tapi memperbaiki cara kamu menggunakan sumber.",
      },
      {
        type: "ordered-list",
        items: [
          "Buka laporan dan cari bagian yang disorot. Lihat sumbernya, lalu putuskan ini kutipan yang sah, perlu sitasi, atau perlu diparafrasekan?",
          "Parafrase dengan benar. Parafrase berarti menyampaikan ulang isi sumber dengan bahasa sendiri tanpa mengubah makna. Caranya dengan membaca dan memahami paragraf sumber, menutup sumbernya, menulis ulang dari pemahamanmu, lalu membandingkan supaya maknanya tetap sama. Mengganti beberapa kata dengan sinonim saja belum cukup, ubah juga struktur kalimatnya.",
          "Tetap cantumkan sitasi. Hasil parafrase tetap berasal dari ide orang lain, jadi sumbernya wajib disebut.",
          "Kutip langsung seperlunya. Kalau memang butuh kalimat persis dari sumber (misalnya definisi hukum), pakai tanda kutip dan sitasi yang benar. Pendekkan kutipan yang terlalu panjang.",
          "Gabungkan beberapa sumber. Rangkum pandangan beberapa penulis dan tambahkan analisismu sendiri, supaya tulisan tidak menempel pada satu sumber.",
        ],
      },
      {
        type: "heading",
        text: "Kesalahan yang sering dilakukan saat mengejar similarity rendah",
      },
      {
        type: "unordered-list",
        items: [
          "Hanya mengganti sinonim. Struktur kalimat dan ide tetap sama, jadi masih berisiko dianggap kurang orisinal.",
          "Memakai tools parafrase otomatis tanpa membaca hasilnya. Makna bisa melenceng atau kalimat jadi janggal, dan kamu tidak bisa mempertanggungjawabkannya saat sidang.",
          "Mengakali sistem, misalnya dengan teks tersembunyi atau menyisipkan karakter aneh. Turnitin bisa menandai hal seperti ini, dan secara etika itu justru masalah baru.",
          "Menghapus sitasi supaya tidak terdeteksi. Ini malah mengubah kutipan yang sah menjadi plagiat.",
          "Menghapus kutipan penting atau daftar pustaka seenaknya demi angka.",
          "Mengira filter di laporanmu mengubah skor resmi. Pengecualian mahasiswa hanya berlaku di tampilanmu sendiri.",
          "Mengubah makna demi menurunkan angka sampai isi penelitian jadi tidak akurat.",
        ],
      },
      {
        type: "heading",
        text: "Kapan perlu melakukan pengecekan ulang",
      },
      {
        type: "unordered-list",
        items: [
          "Setelah merevisi bagian yang banyak disorot.",
          "Setelah dosen pembimbing memberi masukan dan kamu mengubah banyak bagian.",
          "Setelah menambah bab, kutipan, atau referensi baru.",
          "Sebelum pengumpulan final, terutama kalau ada perubahan besar sejak pengecekan terakhir.",
        ],
      },
      {
        type: "heading",
        text: "Checklist sebelum skripsi atau tugas dikumpulkan",
      },
      {
        type: "unordered-list",
        items: [
          "Sudah mengecek similarity pada versi terbaru naskah",
          "Sudah membuka laporan dan memeriksa sumber di setiap bagian yang disorot",
          "Semua kutipan langsung memakai tanda kutip dan sitasi",
          "Semua parafrase tetap punya sitasi",
          "Setiap sitasi ada di daftar pustaka, dan sebaliknya",
          "Tidak ada bagian yang diubah hanya untuk mengakali angka",
          "Sudah tahu batas similarity yang berlaku di kampusmu",
          "Sudah mengecek ulang setelah revisi besar",
        ],
      },
      {
        type: "paragraph",
        text: "Banyak bukan yang perlu diperhatikan? Tapi dengan memperhatikan tiap checklist yang ada itu bakal membantu kalian meminimalkan adanya plagiarisme. Jangan lupa cek similarity kamu ya, dan kamu bisa pakai tips and tricks di atas. Semangat menyelesaikan skripsi, wahai pejuang lulus!",
      },
    ],
  },
  {
    slug: "10-cara-menggunakan-ai-untuk-tugas-kuliah",
    thumbnail: "/images/blog/ai-untuk-tugas-kuliah.png",
    title:
      "10 Cara Menggunakan AI untuk Membantu Tugas Kuliah Tanpa Jadi Ketergantungan",
    excerpt:
      "Gunakan AI sebagai teman belajar untuk mencari ide, memahami materi, dan merapikan tugas sambil tetap berpikir mandiri.",
    date: "18 Oktober 2026",
    category: "ai-teknologi",
    paragraphs: [],
    content: [
      {
        type: "paragraph",
        text: "Siapa di sini yang pernah buka AI waktu tugas menumpuk? Wajar, hampir semua mahasiswa pernah. Pemerintah pun sudah mengakui hal ini. Pada 11 Oktober 2024, Kemendikbudristek merilis Panduan Penggunaan Generative AI pada Pembelajaran di Perguruan Tinggi untuk mahasiswa dan dosen, dengan tujuan supaya AI dipakai secara etis dan bertanggung jawab. Jadi pertanyaannya bukan lagi boleh atau tidak, tapi bagaimana memakainya dengan benar. Berikut 10 cara yang bisa kamu terapin nih.",
      },
      {
        type: "heading",
        text: "AI sebagai alat bantu belajar bukan pengganti proses berpikir",
      },
      {
        type: "paragraph",
        text: "Bayangkan AI seperti kalkulator. Ia mempercepat hitungan, tapi kamu tetap harus paham konsepnya. Kalau semua pekerjaan berpikir diserahkan ke AI, kamu kehilangan inti dari kuliah itu sendiri. Ada dua pertanyaan sederhana untuk dicek. Pertama, apakah AI membuatmu melewati proses belajar atau justru memperkuatnya? Kedua, bisakah kamu menjelaskan isi tugasmu tanpa bantuan AI? Kalau jawaban kedua adalah tidak, berarti kamu belum benar-benar menguasainya.",
      },
      {
        type: "heading",
        text: "Cara 1: Brainstorming Ide",
      },
      {
        type: "paragraph",
        text: "Buntu mencari topik makalah atau judul penelitian? Minta AI memberi beberapa sudut pandang atau pertanyaan penelitian, lalu pilih dan kembangkan sendiri. Trik tambahan adalah menulis dulu ide kasarmu (freewriting) sebelum bertanya ke AI. Dengan begitu, AI membantu memperluas idemu, bukan menggantikannya.",
      },
      {
        type: "paragraph",
        text: "Contoh prompt: Aku ingin menulis makalah tentang dampak media sosial pada kesehatan mental remaja. Beri 5 sudut pandang berbeda yang bisa diangkat, beserta alasan singkatnya.",
      },
      {
        type: "heading",
        text: "Cara 2: Memahami materi kuliah yang sulit",
      },
      {
        type: "paragraph",
        text: "AI bagus untuk menjelaskan konsep rumit dengan bahasa yang lebih sederhana, memberi analogi, atau menjelaskan ulang dengan cara berbeda. Setelah itu, cocokkan pemahamanmu dengan buku atau slide dosen. Kamu juga bisa minta AI mengujimu dengan beberapa pertanyaan untuk mengecek apakah kamu benar-benar paham.",
      },
      {
        type: "paragraph",
        text: "Contoh prompt: Jelaskan konsep [nama materi] seolah aku baru pertama kali belajar, pakai analogi sehari-hari. Setelah itu, ajukan 3 pertanyaan untuk menguji pemahamanku.",
      },
      {
        type: "heading",
        text: "Cara 3: Membuat outline tugas atau tulisan",
      },
      {
        type: "paragraph",
        text: "AI bisa membantu menyusun kerangka supaya tulisanmu runtut. Panduan Kemendikbudristek menyarankan agar judul atau kerangka tulisan buatan AI ditulis ulang dengan bahasamu sendiri. Anggap hasil AI sebagai draf awal, lalu sesuaikan urutan, hapus yang tidak relevan, dan tambahkan bagian yang menurutmu penting.",
      },
      {
        type: "heading",
        text: "Cara 4: Membantu memahami jurnal dan bacaan panjang",
      },
      {
        type: "paragraph",
        text: "Jurnal ilmiah itu padat. AI bisa membantu merangkum garis besar, menjelaskan istilah teknis, atau menunjukkan bagian mana yang penting. Tapi baca sendiri bagian metode dan hasilnya, dan cocokkan angka atau klaim penting dengan teks aslinya. Hati-hati juga soal privasi, jangan mengunggah materi berhak cipta atau naskah yang belum terbit sembarangan, karena itu bisa melanggar kebijakan.",
      },
      {
        type: "heading",
        text: "Cara 5: Mencari sudut pandang atau contoh untuk tugas",
      },
      {
        type: "paragraph",
        text: "Butuh contoh kasus atau argumen pro dan kontra? AI bisa jadi teman diskusi yang cepat. Minta beberapa contoh, lalu verifikasi sendiri. Kalau AI menyebut kasus, tokoh, atau data tertentu, cari sumber aslinya sebelum kamu pakai.",
      },
      {
        type: "heading",
        text: "Cara 6: Membantu proofreading dan memperbaiki struktur tulisan",
      },
      {
        type: "paragraph",
        text: "AI berguna untuk menemukan salah ketik, kalimat ambigu, atau paragraf yang kurang runtut. Tips yang benar itu minta ia memberi komentar atau saran perbaikan, bukan menulis ulang semuanya. Kamu yang memutuskan perubahan mana yang diterima, supaya gaya dan isi tulisan tetap milikmu.",
      },
      {
        type: "paragraph",
        text: "Contoh prompt: Baca paragraf ini dan tunjukkan kalimat yang kurang jelas atau tidak efektif, beserta alasan dan saran perbaikannya. Jangan tulis ulang seluruh paragraf.",
      },
      {
        type: "heading",
        text: "Cara 7: Membantu persiapan presentasi",
      },
      {
        type: "paragraph",
        text: "AI bisa membantu menyusun alur presentasi, membuat poin singkat untuk slide, memperkirakan pertanyaan yang mungkin diajukan dosen, dan menjadi lawan latihan tanya jawab. Tapi pastikan kamu menguasai isinya. Slide yang bagus tidak menolong kalau kamu tidak bisa menjelaskannya sendiri.",
      },
      {
        type: "heading",
        text: "Cara 8: Memeriksa kembali informasi dari AI",
      },
      {
        type: "paragraph",
        text: "AI bisa berhalusinasi, yaitu memberikan informasi keliru dengan nada yang sangat meyakinkan. Jadi biasakan untuk:",
      },
      {
        type: "unordered-list",
        items: [
          "Mengecek fakta penting ke sumber tepercaya, seperti buku teks, jurnal, atau situs resmi.",
          "Memastikan referensi yang disebut AI benar-benar ada. Cari judul dan penulisnya di Google Scholar atau katalog perpustakaan.",
          "Mencocokkan kutipan, angka, dan tahun dengan sumber aslinya.",
          "Jangan memakai sumber yang tidak bisa kamu temukan sendiri.",
        ],
      },
      {
        type: "paragraph",
        text: "Hati-hati dengan verification drift, yaitu kebiasaan mengecek di awal lalu makin lama makin berhenti mengecek. Sebuah studi di University of Wollongong menemukan hal ini pada mahasiswa yang memakai AI untuk tugas.",
      },
      {
        type: "heading",
        text: "Kesalahan penggunaan AI yang perlu dihindari",
      },
      {
        type: "unordered-list",
        items: [
          "Copy-paste mentah. Hasil AI langsung dikumpulkan tanpa dibaca, dikritisi, atau ditulis ulang.",
          "Percaya begitu saja pada fakta dan referensi dari AI.",
          "Tidak mengecek aturan. Kebijakan AI bisa berbeda di tiap mata kuliah. Cek silabus atau tanya dosen sebelum memakainya.",
          "Tidak mengakui penggunaan AI padahal diwajibkan. Panduan Kemendikbudristek menyebut bahwa bila diizinkan, penggunaannya sebaiknya didokumentasikan dengan atribusi.",
          "Membagikan data sensitif atau karya orang lain ke tools AI.",
          "Mulai dari AI sebelum berpikir sendiri. Lama-lama kemampuan analisismu tidak terasah.",
          "Menjadikan AI sumber fakta utama. AI itu alat, bukan sumber kebenaran.",
        ],
      },
      {
        type: "heading",
        text: "Cara 9: Menjaga agar tugas tetap mencerminkan pemikiran sendiri",
      },
      {
        type: "unordered-list",
        items: [
          "Tulis dulu pendapat atau kerangka kasarmu, baru minta masukan AI.",
          "Perlakukan AI sebagai teman diskusi, bukan penulis.",
          "Tulis ulang semua hasil AI dengan bahasamu sendiri, dan tambahkan analisis serta contoh dari pemahamanmu.",
          "Dokumentasikan bagaimana kamu memakai AI (prompt apa, bagian mana yang dipakai, apa yang kamu ubah). Ini berguna kalau dosen bertanya.",
          "Lakukan tes terakhir, bisakah kamu menjelaskan tugasmu dengan lancar tanpa melihat hasil AI? Ini merupakan point penting dalam mengerjakan tugas walaupun menggunakan AI kamu harus bisa memahami secara mendalam mengenai tugas kamu.",
        ],
      },
      {
        type: "heading",
        text: "Cara 10: Tips memilih AI sesuai kebutuhan",
      },
      {
        type: "unordered-list",
        items: [
          "Tentukan dulu kebutuhannya. Menjelaskan konsep, merangkum dokumen, mencari referensi, atau merapikan tulisan bisa cocok dengan tools yang berbeda.",
          "Cek kemampuan sitasinya. Tools yang menampilkan sumber lebih mudah diverifikasi, tapi sumbernya tetap harus kamu cek.",
          "Perhatikan privasi. Baca kebijakan soal penyimpanan dan penggunaan data yang kamu masukkan.",
          "Utamakan tools yang disetujui kampus, kalau ada.",
          "Bandingkan gratis dan berbayar sesuai kebutuhan, tidak perlu langsung langganan.",
          "Lihat daftar rujukan resmi. Buku panduan Kemendikbudristek memuat puluhan aplikasi AI beserta fungsi dan status gratis atau berbayarnya.",
        ],
      },
      {
        type: "paragraph",
        text: "AI itu seperti teman belajar yang pintar tapi kadang juga belum tentu tepat lho. Pakai untuk mempercepat dan memperluas pemahamanmu, tapi keputusan akhir, pemahaman, dan tanggung jawab tetap di tanganmu. Selalu cek aturan kampus, verifikasi hasilnya, dan pastikan tugasmu mencerminkan pemikiranmu sendiri. Jangan sampai 100% ketergantungan sama AI, kalian harus bisa mengolah dan memilah ya sobat kampus!",
      },
    ],
  },
  {
    slug: "10-kesalahan-saat-mengumpulkan-tugas",
    thumbnail: "/images/blog/kesalahan-mengumpulkan-tugas.png",
    title:
      "10 Kesalahan yang Sering Dilakukan Mahasiswa Saat Mengumpulkan Tugas",
    excerpt:
      "Hindari salah format, salah versi, dan masalah upload dengan checklist sederhana sebelum mengumpulkan tugas.",
    date: "18 Oktober 2026",
    category: "tips-mahasiswa",
    paragraphs: [],
    content: [
      {
        type: "paragraph",
        text: "Tugas sudah dikerjakan berhari-hari, tapi nilainya terpotong cuma gara-gara salah upload. Nyesek, kan? Kesalahan saat mengumpulkan tugas itu sering bukan soal kemampuan, tapi soal kurang teliti di menit-menit terakhir. Ini 10 kesalahan yang paling sering terjadi, lengkap dengan cara menghindarinya.",
      },
      {
        type: "heading",
        text: "1. Tidak membaca instruksi tugas secara menyeluruh",
      },
      {
        type: "paragraph",
        text: "Banyak yang langsung mengerjakan setelah membaca sekilas. Padahal instruksi biasanya memuat detail penting yaitu format, jumlah halaman, gaya sitasi, nama file, dan cara pengumpulan. Baca instruksi dari awal sampai akhir sebelum mulai, lalu baca lagi sebelum submit.",
      },
      {
        type: "heading",
        text: "2. Salah format file",
      },
      {
        type: "paragraph",
        text: "Dosen minta PDF, kamu kirim Word, atau sebaliknya. Platform submit juga bisa membatasi jenis file yang diterima. Cek format yang diminta dan ikuti persis. Kalau diminta PDF, buka hasil konversinya dulu untuk memastikan tampilan dan font tidak berantakan.",
      },
      {
        type: "heading",
        text: "3. Ukuran file terlalu besar",
      },
      {
        type: "paragraph",
        text: "File dengan banyak gambar beresolusi tinggi sering melebihi batas unggah. Sebagai gambaran, Turnitin di banyak kampus punya batas sekitar 100 MB, dan satu kampus menyarankan di bawah 40 MB supaya aman. Batas di kampusmu bisa berbeda, jadi cek ketentuannya. Kalau terlalu besar, kompres gambar atau kompres PDF-nya.",
      },
      {
        type: "heading",
        text: "4. Nama file tidak sesuai ketentuan",
      },
      {
        type: "paragraph",
        text: "Banyak dosen meminta format nama tertentu, misalnya NIM_Nama_MataKuliah. Nama file yang seragam memudahkan dosen mengelola puluhan atau ratusan tugas. Ikuti formatnya persis, termasuk huruf besar kecil dan tanda pemisah.",
      },
      {
        type: "heading",
        text: "5. Mengirim versi dokumen yang salah",
      },
      {
        type: "paragraph",
        text: "File bernama final, final_revisi, atau final_banget sering membuat bingung sendiri. Biasakan memberi nomor versi atau tanggal, dan simpan dalam satu folder khusus tugas. Sebelum submit, buka file yang akan diunggah dan pastikan isinya adalah versi terakhir.",
      },
      {
        type: "heading",
        text: "6. Lupa mengecek similarity",
      },
      {
        type: "paragraph",
        text: "Kalau kampus atau dosenmu memakai pengecekan similarity, cek lebih dulu sebelum mengumpulkan. Jadi kamu bisa memperbaiki sitasi dan parafrase sebelum dosen menemukannya. Ingat, angka similarity bukan vonis plagiat, tapi tetap perlu dibuka dan dicermati.",
      },
      {
        type: "heading",
        text: "7. Tidak melakukan proofreading terakhir",
      },
      {
        type: "paragraph",
        text: "Salah ketik, nama dosen yang keliru, nomor halaman berantakan, atau format paragraf yang tidak konsisten memberi kesan kurang rapi. Baca ulang tugasmu dari awal sampai akhir. Tips yang berguna yaitu baca dengan suara pelan, atau istirahat dulu sebelum mengecek, atau minta teman membaca sekilas.",
      },
      {
        type: "heading",
        text: "8. Referensi atau lampiran belum lengkap",
      },
      {
        type: "paragraph",
        text: "Daftar pustaka kosong, sitasi di teks tidak ada di daftar pustaka, lampiran lupa dimasukkan, atau halaman sampul tidak ada. Cocokkan sitasi di teks dengan daftar pustaka, dan lihat lagi instruksi untuk daftar lampiran yang diminta.",
      },
      {
        type: "heading",
        text: "9. Tidak mengecek kembali file setelah diunggah",
      },
      {
        type: "paragraph",
        text: "Banyak yang langsung menutup halaman setelah klik submit. Padahal upload bisa gagal atau file yang masuk salah. Setelah mengunggah, buka kembali file atau unduh file lagi yang tersimpan di sistem dan pastikan statusnya sudah berhasil. Sebagian platform mengirim email konfirmasi, jadi simpan sebagai bukti. Kalau konfirmasi tidak muncul, coba submit ulang dan segera hubungi dosen sambil melampirkan tugasmu.",
      },
      {
        type: "paragraph",
        text: "Kalau ternyata salah file, cek dulu apakah sistem mengizinkan pengumpulan ulang. Di banyak sistem, file baru akan menggantikan yang lama. Tapi umumnya kamu tidak bisa menghapus pengumpulan sendiri, jadi kalau salah titik submit, kamu harus minta bantuan dosen.",
      },
      {
        type: "heading",
        text: "10. Mengumpulkan terlalu dekat dengan deadline",
      },
      {
        type: "paragraph",
        text: "Ketika semua orang upload di menit terakhir, sistem bisa lambat, internet bisa putus, dan error kecil jadi tidak sempat diatasi. Sebuah panduan universitas menyarankan mengunggah minimal satu jam sebelum batas waktu, dan memakai koneksi yang stabil. Target pribadimu bisa lebih awal lagi, misalnya beberapa jam sebelum deadline.",
      },
      {
        type: "heading",
        text: "Checklist sederhana sebelum submit tugas",
      },
      {
        type: "unordered-list",
        items: [
          "Sudah membaca ulang instruksi tugas sampai tuntas",
          "Format file sesuai permintaan",
          "Ukuran file di bawah batas",
          "Nama file sesuai ketentuan",
          "Versi file yang dikirim adalah yang terbaru",
          "Similarity sudah dicek (jika diperlukan)",
          "Proofreading terakhir sudah dilakukan",
          "Referensi, lampiran, dan halaman sampul sudah lengkap",
          "Waktu submit masih jauh dari deadline",
          "Sudah membuka ulang file setelah upload dan menyimpan bukti pengumpulan",
        ],
      },
      {
        type: "heading",
        text: "Tips membuat kebiasaan final check sebelum mengumpulkan tugas",
      },
      {
        type: "unordered-list",
        items: [
          "Buat checklist pribadi dan simpan di catatan HP, lalu pakai tiap kali submit.",
          "Pasang pengingat dua tahap, yaitu satu untuk final check dan satu untuk submit. Jangan mepet.",
          "Tetapkan jam aman. Targetkan selesai beberapa jam sebelum deadline, bukan tepat di batasnya.",
          "Rapikan folder dan penamaan versi dari awal mengerjakan, supaya tidak bingung di akhir.",
          "Minta teman mengecek (misalnya format dan kelengkapan) kalau tugasnya penting.",
          "Simpan bukti pengumpulan berupa tangkapan layar atau email konfirmasi.",
        ],
      },
      {
        type: "paragraph",
        text: "Kebiasaan kecil seperti ini kelihatan sepele, tapi bisa menyelamatkan nilaimu dari kesalahan yang sebenarnya bisa dihindari, perhatikan dan selalu cek tugasmu sebelum dikumpulkan, ya sobat kampus!",
      },
    ],
  },
]
