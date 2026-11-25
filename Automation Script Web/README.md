# Demo CURA Playwright

Suite Playwright dan TypeScript untuk [Demo CURA](https://katalon-demo-cura.herokuapp.com/). Empat kasus dari [spreadsheet skenario](https://docs.google.com/spreadsheets/d/17e1KXwIWOEA0sY1Tta-ulTWmZ4Qmf8bLAnweKAN3QE4/edit) dijalankan di Chromium, Firefox, dan WebKit.

| ID | Kasus | Hasil yang diperiksa |
| --- | --- | --- |
| 1.1 | Login dengan kredensial tidak valid | Halaman login tetap terbuka dan pesan gagal tampil |
| 1.2 | Login dengan kredensial valid | Halaman Make Appointment terbuka |
| 2.1 | Appointment tanpa tanggal | Browser menandai tanggal sebagai wajib dan tetap di form |
| 2.2 | Appointment dengan form lengkap | Halaman konfirmasi menampilkan data yang dikirim |

## Menjalankan pengujian 

Gunakan Node.js 24 dan koneksi ke situs demo. Jalankan dari folder `ecommerce-playwright`.

```powershell
npm.cmd ci
npm.cmd run install:browsers
npm.cmd run typecheck
npm.cmd test
npm.cmd run report
```

Gunakan `npm` pada macOS atau Linux. Jalankan satu kasus di Chromium dengan `npm.cmd test -- --project=chromium --grep 'TC 2.1'`. Laporan HTML tersimpan di `playwright-report/` dan artefak kegagalan di `test-results/`. Workflow GitHub Actions menjalankan pemeriksaan tipe dan pengujian, lalu mengunggah laporan HTML.

Playwright memakai URL Demo CURA secara default. Variabel environment `BASE_URL` dapat menunjuk ke instance CURA lain. Data uji mencakup akun demo publik, kredensial invalid sintetis, dan detail appointment sintetis.

## Struktur

| Lokasi | Isi |
| --- | --- |
| `config/playwright.config.ts` | Proyek browser, eksekusi paralel, dan laporan |
| `src/pages/` | Page Object untuk Home, Login, dan Appointment |
| `src/tests/` | Skenario Login dan Make Appointment |
| `src/fixtures/testFixtures.ts` | Setup login dan sesi terautentikasi terpisah untuk tiap tes appointment |
| `src/utils/testData.ts` | Akun demo dan input appointment |
| `.github/workflows/` | Workflow CI GitHub Actions |
| `.vscode/` | Rekomendasi ekstensi Playwright |

