# Branch dan rilis

## Kondisi saat refactor

- Branch bersama yang ditemukan: `cursor/ngampus-frontend` (tracking `origin/cursor/ngampus-frontend`).
- Branch refactor: `codex/refactor-feature-structure`, dimulai dari `26ea63e`.
- Tidak ada branch remote yang dihapus atau diganti namanya. Pengaturan default branch dan production branch Vercel belum diubah.

## Alur kerja

1. Mulai branch pekerjaan dari branch bersama yang sudah diperbarui.
2. Gunakan `codex/<pekerjaan>` untuk pekerjaan agen; kelompokkan pekerjaan per fitur agar PR mudah ditinjau.
3. Commit satu perubahan logis, lalu jalankan lint, typecheck, test fitur, dan build.
4. Push branch pekerjaan dan buat PR ke `cursor/ngampus-frontend` selama itulah branch bersama yang berlaku.
5. Setelah review dan verifikasi preview, merge melalui GitHub. Hapus branch pekerjaan setelah merge bila sudah tidak diperlukan.

## Jika ingin beralih ke main

Migrasi ke `main` sebaiknya menjadi perubahan operasional tersendiri: tentukan commit sumber, buat branch, perbarui default branch GitHub, perbarui production branch Vercel dan target PR, lalu verifikasi deployment. Jangan menghapus branch lama sebelum seluruh referensi dan deployment tervalidasi.

Refactor struktur folder tidak memerlukan migrasi branch produksi. Hindari force push pada branch bersama.
