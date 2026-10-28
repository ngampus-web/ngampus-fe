# Parafrase Manual (frontend)

Rute: `/cek-plagiarisme/parafrase-manual`. Adapter rute memilih `features/paraphrase/components/paraphrase-checkout.tsx`; Turnitin dan Cek AI tetap memakai checkout PDF sebelumnya.

- Jenis layanan: Turnitin, AI, atau gabungan. Gabungan memerlukan dua laporan PDF dengan skor/target masing-masing.
- Dokumen asli DOCX serta laporan PDF maksimal 25 MB per file. DOCX dibaca lokal melalui Mammoth `extractRawText`; tidak merender HTML atau mengirim file ke server. Penggantian file membatalkan penerapan hasil hitung lama.
- Skor awal diisi pengguna sesuai PDF, bukan ditebak otomatis dari angka persentase di laporan. Target minimal 10% dan lebih rendah dari skor awal. Backend perlu memverifikasi skor berdasarkan laporan.
- Catatan dan bidang opsional; bahasa Indonesia/Inggris, nama, WhatsApp, serta paket pengerjaan tersimpan dalam order.
- Santai Aja >48 jam, Gaskeun 24–48 jam, Kejar Deadline <24 jam. Estimasi dimulai setelah pembayaran terverifikasi dan dokumen lengkap; tidak menampilkan tanggal selesai pasti sebelum backend menyediakan jadwal.
- Harga dinamis: `(jumlah kata × tarif kata + total selisih skor awal–target × tarif per poin) × multiplier`. Layanan gabungan menjumlahkan penurunan Turnitin dan AI, biaya kata dihitung sekali.
- Tarif: ≤5.000 kata Rp5,50/kata + Rp2.500/poin; 5.001–9.999 Rp5/kata + Rp3.250/poin; 10.000–14.999 Rp4,50/kata + Rp4.000/poin; ≥15.000 Rp4/kata + Rp4.750/poin. Batas 10.000 mengikuti contoh perhitungan yang diberikan.
- Multiplier Santai ×1; Gaskeun ×1,3; Kejar Deadline ×1,5. Selisih skor dalam poin persentase, maksimal dua desimal. Total akhir dibulatkan ke Rupiah terdekat, rincian dasar tidak dibulatkan lebih awal.
- `services/pricing.ts` dan `price-formula.ts` memusatkan perhitungan. Form dan pembayaran memakai fungsi yang sama; amount diverifikasi terhadap rincian saat membuat/membaca order. Pesanan pratinjau lama dengan harga tetap yang tidak cocok harus dibuat ulang. Backend wajib menghitung ulang harga dari data terverifikasi saat integrasi.
- `ParaphraseDetails` adalah varian `PaymentDetails` dengan `kind: "paraphrase"`. Validasi ulang dilakukan saat order dibuat/dibaca. Semua metadata tampil di konfirmasi dan status pembayaran; proses menampilkan pemberitahuan hasil dikirim lewat WhatsApp.
- Saat "Bayar Sekarang" (sudah login), DOCX (`paraphrase_source`) dan PDF laporan (`paraphrase_report`) diunggah lewat presigned URL, lalu `POST /orders/paraphrase` membuat order. Server menghitung ulang kata dan harga; total di halaman pembayaran adalah total server. File yang sama tidak diunggah ulang saat mencoba lagi.
- Halaman status order live menampilkan estimasi selesai (`deadlineAt`), waktu dibayar, dan waktu tim mulai (WIB). Setelah selesai, tombol "Unduh Hasil Parafrase" mengambil URL dari `GET /orders/:code/result`.
- Pesanan pratinjau lama (tanpa login/ID berkas) tetap memakai simulasi frontend.

Validasi: `npm run test:docx`, `npm run test:features`, lint, typecheck, build, dan uji alur browser.
