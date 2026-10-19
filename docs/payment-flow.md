# Flow pembayaran frontend

Implementasi mengacu pada dokumen STEP FLOW PAYMENT NGAMPUS: konfirmasi → QRIS → proses → selesai. Berlaku untuk marketplace, Turnitin, cek AI, dan parafrase manual.

## Rute dan modul

- `app/marketplace/[slug]/checkout.tsx` dan `app/cek-plagiarisme/[slug]/checkout.tsx`: komposisi checkout fitur dengan modul payment.
- `/pembayaran/[orderId]`: konfirmasi dan status pesanan.
- `/pembayaran/[orderId]/qris`: pratinjau halaman gateway.
- `features/payment/types.ts`: model pesanan, detail per layanan, kontrak gateway.
- `services/order-rules.ts`: validasi input dan transisi status.
- `services/preview-gateway.ts`: adapter lokal eksplisit, memakai sessionStorage.
- `hooks/use-payment-order.ts`: subscription tampilan terhadap perubahan pesanan.
- `components/payment-flow.tsx`: UI konfirmasi, gateway, proses, hasil, dan status terminal.

Halaman checkout meneruskan data melalui callback. Impor tipe payment dipakai sebagai kontrak lintas fitur; komponen checkout tidak memanggil adapter secara langsung.

## Perilaku pratinjau

Pesanan tersimpan hanya di sesi tab, dapat dibuka ulang melalui URL yang sama dalam tab tersebut, dan hilang ketika sesi berakhir. URL hanya memuat ID acak; kontak serta rincian file tidak dimasukkan ke URL. File biner tidak disimpan atau diunggah. Metadata nama dan ukuran file ditampilkan pada ringkasan. Harga dihitung berdasarkan pilihan checkout saat ini; promo dan biaya gateway belum diterapkan.

- Marketplace: produk, paket, durasi, garansi, pembeli, dan WhatsApp.
- Dokumen: layanan, nama/ukuran PDF, WhatsApp, dan filter Turnitin yang dipilih. AI tidak menampilkan filter Turnitin.
- Parafrase: form khusus DOCX dan laporan PDF, skor/target, catatan, bahasa, bidang, kontak, dan estimasi pengerjaan. Lihat [alur Parafrase](paraphrase-flow.md).
- QRIS berupa area placeholder yang tidak dapat dipakai membayar.
- Tombol simulasi mengubah pending → processing → completed. Tidak ada pembayaran atau pengiriman sungguhan.
- Tersedia simulasi gagal/kedaluwarsa dan pembatalan. Pending kedaluwarsa setelah 30 menit.
- Hasil marketplace menunjukkan pratinjau pemberitahuan akses dikirim.
- Hasil dokumen tidak menampilkan grafik skor; tombol unduh belum aktif sampai laporan asli tersedia. Hasil Turnitin/AI menyediakan CTA ke Parafrase Manual.
- Input awal memeriksa nomor WhatsApp Indonesia, file PDF maksimal 10 MB, dan batas kata yang dapat dibaca. Penghitung kata menggunakan PDF.js secara lokal (PDF scan tanpa lapisan teks membutuhkan OCR); validasi dokumen, halaman, dan jumlah kata yang otoritatif harus dilakukan server.

## Integrasi backend berikutnya

1. Implementasikan adapter pengganti `PaymentGateway` untuk pembuatan order, pembacaan status, dan URL checkout provider. Kontrak saat ini mendeskripsikan preview; ubah `mode` dan pisahkan respons server saat live diimplementasikan.
2. Kirim ID produk/varian serta durasi; harga, biaya, promo, kedaluwarsa, dan status ditentukan ulang oleh server. Jangan mempercayai amount/status dari browser.
3. Upload dokumen ke storage yang terlindungi dan sertakan ID upload pada order. Metadata lokal saja tidak cukup untuk memproses file.
4. `startPayment` harus mengembalikan URL checkout dari gateway terpilih. Validasi origin URL di adapter sebelum redirect.
5. Verifikasi signature webhook dan idempotensi event di server. Browser tidak boleh mengubah status paid/completed. Hapus kontrol simulasi dari mode live.
6. Poll status server atau gunakan subscription untuk proses dan selesai. Sediakan kondisi loading, error, retry, dan kedaluwarsa.
7. Hanya tampilkan pemberitahuan akun terkirim setelah fulfillment terkonfirmasi. Tombol unduh menggunakan URL hasil terotorisasi, bukan file contoh.
8. Lindungi pembacaan pesanan dengan sesi/token akses; ID acak bukan otorisasi. Hubungkan riwayat pesanan ketika API tersedia.

Tidak ada endpoint tebakan, kredensial gateway, QR pembayaran palsu, atau notifikasi keluar dalam implementasi ini.

## Verifikasi

`npm run test:features` mencakup validasi, empat jenis checkout, penyimpanan preview, transisi, kedaluwarsa, dan larangan transisi dari status terminal. Lanjutkan lint, typecheck, format, build, dan uji browser desktop/mobile.
