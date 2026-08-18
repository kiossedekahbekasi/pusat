# Toko Sembako Berkah Utama & Doa Anak Muslim (Website Gabungan)

Website gabungan dua aplikasi dalam **satu navbar tunggal**:

1. **Toko Sembako** — katalog produk eceran & grosir, paket hemat, keranjang &
   checkout dengan konfirmasi via WhatsApp, halaman Rumah Tahfidz, Kios Sedekah,
   halaman kustom, serta Panel Admin lengkap untuk mengelola semua isi website.
2. **Doa Anak (25 Doa Harian Anak Muslim)** — video animasi doa dipandu karakter,
   audio pelafalan, kata per kata, studio latihan rekam suara, kartu adab Islami,
   kuis interaktif, dan kartu hafalan yang bisa dicetak.

Kedua aplikasi diakses lewat menu yang sama di navbar atas (menu **"Doa Anak"**
berdampingan dengan Katalog, Rumah Tahfidz, Kios Sedekah, dll). Label & lencana
menu "Doa Anak" bisa diubah lewat Panel Admin, sama seperti menu lainnya.

## Teknologi

| Bagian | Teknologi |
| --- | --- |
| UI | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 (plugin Vite) |
| Ikon | lucide-react |
| Animasi & konfeti | motion, canvas-confetti |
| Data & Login | Firebase (Firestore + Authentication) — khusus bagian Toko Sembako |

## Menjalankan di komputer sendiri

Prasyarat: **Node.js 18 atau lebih baru**.

```bash
npm install       # pasang dependensi
npm run dev       # jalankan mode pengembangan di http://localhost:3000
npm run typecheck # periksa tipe TypeScript (tanpa membangun)
npm run build     # bangun versi produksi ke folder dist/
npm run preview   # tinjau hasil build produksi
```

Aplikasi ini **tidak memerlukan file `.env`**. Konfigurasi Firebase dibaca dari
`src/lib/firebase.ts` / `firebase-applet-config.json`. Bagian "Doa Anak" berjalan
sepenuhnya di browser (Web Audio API + Speech Synthesis bawaan browser), tidak
memerlukan Firebase maupun API key apa pun.

## Cara kerja penyimpanan data

- Semua data (produk, pesanan, pengaturan, foto, santri, halaman kustom) disimpan di
  `localStorage` browser dengan awalan kunci `tsbu_db_*_v1`.
- Data yang sama dicerminkan ke Firestore pada koleksi `store_data/{nama_dokumen}`
  sehingga perubahan admin muncul di semua perangkat.
- Perubahan dari cloud diterima lewat `onSnapshot`, ditulis kembali ke `localStorage`,
  lalu memicu event `tsbu-db-updated` agar tampilan ikut menyegarkan.
- Bila penyimpanan ke cloud gagal, Panel Admin menampilkan peringatan kuning
  (bukan lagi hanya pesan di console browser).
- Progres hafalan & tab aktif di bagian "Doa Anak" tersimpan sementara di memori
  komponen (state React) — belum disinkronkan ke Firestore/localStorage.

## Panel Admin

- Buka tab **Admin** di navigasi, lalu login memakai akun **Firebase Authentication**
  (email & kata sandi) yang sudah dibuat di Firebase Console.
- Fitur: kelola produk & stok, pesanan, informasi toko, tampilan (jenis huruf,
  ukuran huruf, warna utama, banner), galeri foto, profil Rumah Tahfidz, data santri,
  kegiatan, Kios Sedekah, halaman kustom, dan label/urutan menu navbar (termasuk
  menu "Doa Anak").

### Membuat akun admin pertama

1. Buka Firebase Console → **Authentication** → **Users** → **Add user**.
2. Isi email dan kata sandi, lalu simpan.
3. Login dengan akun tersebut di tab Admin.

## Keamanan (penting)

`firestore.rules` saat ini mengizinkan penulisan oleh **siapa pun yang login** ke
proyek Firebase ini. Untuk mengunci hanya ke admin toko:

1. Salin UID akun admin dari Firebase Console → Authentication → Users.
2. Masukkan UID itu ke fungsi `adminUids()` di `firestore.rules`.
3. Ubah `allow write: if isSignedIn();` menjadi `allow write: if isAdmin();`.
4. Deploy aturan: `firebase deploy --only firestore:rules`.

## Catatan teknis

- Foto disimpan sebagai base64 di dalam dokumen Firestore. Batas Firestore adalah
  **1 MB per dokumen**, jadi jangan mengunggah terlalu banyak foto besar dalam satu
  kategori. `src/utils/imageUpload.ts` sudah mengompres setiap gambar.
- Panel Admin dimuat terpisah (code splitting) supaya halaman pembeli tetap ringan.
- Ongkos kirim: gratis untuk belanja minimal Rp 100.000 (radius < 3 km), di bawah itu
  Rp 10.000. Jarak dikonfirmasi manual oleh petugas toko lewat WhatsApp.
- 5 gambar latar adegan video pada bagian "Doa Anak" (dari proyek asli) tidak ikut
  ter-export ke dalam file zip sumbernya, sehingga digantikan sementara dengan
  ilustrasi gradient SVG di `src/doa/utils/placeholderScenes.ts`. Ganti isi file ini
  dengan gambar/foto asli bila tersedia.

## Struktur folder

```
src/
├── components/   Komponen tampilan Toko Sembako (Navbar, katalog, keranjang, AdminPanel, dll.)
├── data/         Data awal Toko Sembako: produk, toko, tahfidz, kios sedekah
├── lib/          Inisialisasi Firebase
├── services/     db.ts — lapisan data localStorage + Firestore
├── utils/        Kompresi gambar & mesin tema (Toko Sembako)
├── types.ts      Definisi tipe TypeScript (Toko Sembako, termasuk key navbar "doa_anak")
├── App.tsx       Merender bagian aktif (catalog/tahfidz/doa_anak/kios_sedekah/about/dst.)
└── doa/          Aplikasi "25 Doa Harian Anak Muslim" (namespace terpisah)
    ├── DoaAnakApp.tsx   Komponen utama: hero + sub-tab (video/katalog/kata/latihan/adab/kuis)
    ├── components/      Video player, kartu adab, kuis, flashcard cetak, dll.
    ├── data/            25 doa harian, karakter pemandu, pertanyaan kuis
    ├── utils/           Web Audio API (efek suara, musik latar) & speech synthesis
    └── types.ts         Definisi tipe khusus bagian Doa Anak
```

