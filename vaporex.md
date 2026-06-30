# Product Requirements Document (PRD)
# Aplikasi Web Toko Vape (VapeStore)

| Atribut | Detail |
|---|---|
| Nama Produk | VapeStore Web App |
| Versi Dokumen | 1.0 |
| Tanggal | 29 Juni 2026 |
| Status | Draft |
| Platform | Web Application (Responsive) |
| Tech Stack Utama | ReactJS, Node.js/Express, MySQL, Midtrans API |

---

## 1. Latar Belakang

Toko vape saat ini menjual produk secara offline (toko fisik) dan membutuhkan kanal penjualan online agar dapat menjangkau lebih banyak pelanggan, mengelola stok secara terpusat, serta menyatukan pencatatan transaksi online dan offline dalam satu sistem yang sama.

Aplikasi ini akan berbentuk **website** berbasis **ReactJS** di sisi frontend, dengan backend yang terhubung ke **database MySQL**, serta pembayaran online melalui **Midtrans Payment Gateway**. Admin juga dapat menginput transaksi penjualan **offline** (di toko) dan mencetak **struk**, sehingga stok selalu update baik dari penjualan online maupun offline.

> **Catatan kepatuhan:** Karena produk vape termasuk kategori produk dengan batasan usia, sistem wajib memiliki mekanisme verifikasi usia dan mengikuti regulasi lokal terkait penjualan rokok elektrik/vape (misalnya pembatasan usia pembeli, larangan iklan ke anak di bawah umur, dan kepatuhan pajak cukai jika berlaku). Hal ini dibahas lebih detail di bagian Non-Functional Requirements.

---

## 2. Tujuan Produk

1. Menyediakan etalase produk vape online yang menarik dan mudah digunakan.
2. Memungkinkan pelanggan membeli produk secara online dengan keranjang & checkout yang aman.
3. Mengintegrasikan pembayaran online via Midtrans (berbagai metode: VA, e-wallet, QRIS, kartu kredit).
4. Menyatukan data stok antara penjualan online dan offline dalam satu database.
5. Memberikan admin tools lengkap untuk mengelola produk, stok, harga, pesanan, dan laporan.
6. Memungkinkan admin mencatat penjualan offline (POS sederhana) dan mencetak struk.

---

## 3. Target Pengguna

| Peran | Deskripsi |
|---|---|
| **Pelanggan (Customer)** | Pengguna umum (dewasa, 18+/21+ sesuai regulasi) yang membeli produk vape secara online. |
| **Admin** | Pemilik/karyawan toko yang mengelola produk, stok, pesanan, laporan, dan transaksi kasir offline. |
| **Kasir (opsional, role turunan Admin)** | Karyawan yang hanya bertugas menginput transaksi offline di toko. |

---

## 4. Lingkup Produk (Scope)

### 4.1 Termasuk dalam Scope (In-Scope)
- Landing page
- Etalase toko (katalog produk, kategori, pencarian, filter)
- Autentikasi: Login/Register Pelanggan & Login Admin
- Keranjang belanja & checkout
- Manajemen stok, harga, kategori, varian produk
- Integrasi database MySQL
- Integrasi pembayaran Midtrans
- Modul kasir/POS untuk input penjualan offline
- Cetak struk (thermal printer/PDF)
- Dashboard admin (laporan penjualan, stok, pesanan)
- Riwayat pesanan pelanggan

### 4.2 Tidak Termasuk Scope (Out of Scope) — fase awal
- Aplikasi mobile native (Android/iOS)
- Program afiliasi/reseller
- Live chat customer service
- Multi-cabang/multi-gudang (bisa jadi fase 2)
- Integrasi marketplace (Tokopedia, Shopee, dll)

---

## 5. Fitur Utama & Requirement Detail

### 5.1 Landing Page

**Tujuan:** Memberikan kesan pertama yang menarik dan informatif tentang toko.

**Komponen:**
- Hero banner (promo, produk unggulan, banner musiman)
- Highlight kategori produk (Pod, Mod, Liquid, Coil, Aksesoris)
- Produk terbaru / terlaris (best seller)
- Verifikasi usia (Age Gate Modal) — muncul saat pertama kali akses, wajib konfirmasi usia ≥18/21 tahun sebelum melanjutkan
- Section promo/diskon
- Testimoni pelanggan (opsional)
- Informasi toko (alamat, jam operasional, kontak, peta lokasi)
- Footer (link kebijakan privasi, syarat & ketentuan, media sosial)

**User Story:**
- Sebagai pengunjung baru, saya ingin melihat ringkasan toko & produk unggulan agar tertarik menjelajah lebih lanjut.
- Sebagai pengunjung, saya harus mengonfirmasi usia sebelum dapat mengakses katalog produk.

---

### 5.2 Etalase Toko (Katalog Produk)

**Komponen:**
- Daftar produk dalam bentuk grid/card (gambar, nama, harga, status stok)
- Filter: kategori, rentang harga, brand, rasa (untuk liquid), nikotin (mg), ketersediaan stok
- Sorting: termurah, termahal, terbaru, terlaris
- Search bar dengan autocomplete
- Halaman detail produk:
  - Galeri gambar produk
  - Deskripsi produk
  - Varian (rasa, ukuran, warna)
  - Harga & diskon (jika ada)
  - Status stok ("Tersedia", "Stok Terbatas", "Habis")
  - Tombol "Tambah ke Keranjang" / "Beli Sekarang"
  - Produk terkait/rekomendasi

**Data Produk (atribut minimal):**
- SKU, nama produk, kategori, brand, deskripsi, harga, harga diskon, stok, satuan, gambar, varian, status aktif/nonaktif, kadar nikotin (jika liquid), tanggal masuk.

---

### 5.3 Autentikasi (Login & Registrasi)

#### a. Pelanggan
- Registrasi: nama, email, no. HP, password, **tanggal lahir (wajib untuk verifikasi usia)**
- Login: email/no. HP + password
- Opsi: Login via Google (opsional, fase 2)
- Lupa password (reset via email/OTP)
- Halaman profil: edit data diri, alamat pengiriman, riwayat pesanan

#### b. Admin
- Login khusus admin (URL/halaman terpisah, mis. `/admin/login`)
- Role-based access: **Super Admin**, **Admin Produk**, **Kasir**
- Autentikasi menggunakan JWT (JSON Web Token) dengan refresh token
- Opsional: 2FA (Two-Factor Authentication) untuk keamanan tambahan

**Keamanan:**
- Password di-hash menggunakan bcrypt
- Rate limiting untuk percobaan login
- Session/token expiry

---

### 5.4 Keranjang & Checkout

**Keranjang:**
- Tambah/kurang qty produk
- Hapus item
- Kalkulasi subtotal otomatis
- Validasi stok real-time (cegah beli melebihi stok tersedia)
- Simpan keranjang (untuk user login) agar persist saat logout/login kembali

**Checkout:**
1. Review pesanan (daftar item, subtotal)
2. Input/pilih alamat pengiriman
3. Pilih metode pengiriman (kurir/ekspedisi — JNE, J&T, dll — opsional integrasi RajaOngkir untuk estimasi ongkir)
4. Pilih metode pembayaran (redirect ke Midtrans)
5. Konfirmasi & buat pesanan (status: "Menunggu Pembayaran")
6. Setelah pembayaran sukses (callback Midtrans) → status berubah "Diproses"

**Status Pesanan:**
`Menunggu Pembayaran` → `Dibayar/Diproses` → `Dikirim` → `Selesai` (atau `Dibatalkan`/`Kedaluwarsa`)

---

### 5.5 Integrasi Pembayaran — Midtrans

**Metode pembayaran yang didukung (melalui Midtrans Snap/Core API):**
- Virtual Account (BCA, BNI, BRI, Mandiri, Permata)
- E-Wallet (GoPay, ShopeePay, OVO)
- QRIS
- Kartu Kredit/Debit
- Convenience Store (Indomaret/Alfamart) — opsional

**Flow Integrasi:**
1. Sistem backend membuat **Transaction Token** via Midtrans Snap API saat checkout.
2. Frontend menampilkan **Snap popup/redirect** untuk proses pembayaran.
3. Midtrans mengirim **notifikasi webhook** ke endpoint backend (`/api/payment/notification`) setiap ada perubahan status transaksi.
4. Backend memverifikasi signature key dari notifikasi, lalu update status pesanan & mengurangi stok jika pembayaran sukses.
5. Pelanggan menerima notifikasi (email) status pesanan.

**Status Midtrans yang ditangani:** `pending`, `settlement/capture`, `deny`, `cancel`, `expire`, `refund`.

---

### 5.6 Manajemen Stok, Harga, dan Produk (Admin)

**Fitur:**
- CRUD produk (tambah/edit/hapus/nonaktifkan)
- Upload multi-gambar produk
- Atur kategori & sub-kategori
- Manajemen varian produk (rasa, ukuran, kadar nikotin)
- Update stok manual (restock) + riwayat perubahan stok (stock log/mutasi)
- Atur harga & diskon/promo per produk atau per kategori
- Notifikasi stok menipis (low stock alert), threshold dapat diatur
- Import/export data produk via CSV/Excel (opsional, mempermudah input massal)

**Stok terintegrasi:** Setiap transaksi (online maupun offline/kasir) akan mengurangi stok yang sama di database MySQL secara real-time, sehingga tidak terjadi oversell.

---

### 5.7 Modul Penjualan Offline (Kasir/POS) & Cetak Struk

**Tujuan:** Admin/kasir dapat menginput transaksi yang terjadi di toko fisik langsung ke sistem, agar stok & laporan tetap akurat dan terpusat.

**Fitur:**
- Halaman kasir (`/admin/pos`) dengan tampilan sederhana:
  - Pencarian produk cepat (scan barcode/SKU atau ketik nama)
  - Tambah item ke "keranjang kasir"
  - Edit qty, diskon manual per item/transaksi
  - Pilih metode pembayaran offline: Tunai, QRIS statis, Debit/Kredit (EDC), Transfer
  - Input jumlah uang diterima & kembalian (jika tunai)
  - Input data pelanggan (opsional, untuk member/riwayat)
- Setelah transaksi disimpan:
  - Stok otomatis berkurang
  - Data transaksi tersimpan di tabel transaksi (terpisah/ditandai sebagai channel = "offline")
  - **Struk otomatis dapat dicetak** (lihat detail di bawah)
- Riwayat transaksi kasir (filter per tanggal, kasir, metode bayar)
- Fitur void/cancel transaksi (dengan approval admin, untuk audit trail)

**Cetak Struk:**
- Generate struk dalam format **PDF** (untuk cetak via printer thermal 58mm/80mm atau printer biasa) menggunakan browser print API atau library seperti `react-thermal-printer` / `jsPDF`.
- Isi struk: nama toko, alamat, no. transaksi, tanggal/waktu, daftar item (nama, qty, harga, subtotal), total, diskon, metode bayar, kasir yang bertugas, footer (terima kasih/kebijakan retur).
- Opsi cetak ulang struk dari riwayat transaksi.
- (Opsional fase 2) Integrasi langsung dengan printer thermal via Web USB/Web Serial API atau aplikasi bridge lokal.

---

### 5.8 Dashboard & Laporan Admin

- Dashboard ringkasan: total penjualan (hari/minggu/bulan), online vs offline, produk terlaris, stok menipis
- Laporan penjualan (filter tanggal, kategori, channel online/offline), dapat diekspor ke Excel/PDF
- Laporan stok (mutasi stok masuk/keluar)
- Manajemen pesanan online (lihat detail, update status pengiriman, input no. resi)
- Manajemen pengguna (lihat daftar pelanggan, blokir/aktifkan akun)
- Manajemen role/karyawan (tambah kasir/admin baru)

---

## 6. Arsitektur Teknis (Tech Stack)

| Layer | Teknologi |
|---|---|
| Frontend | ReactJS (Vite/CRA), React Router, Redux/Zustand untuk state management, Axios, TailwindCSS/Material UI |
| Backend | Node.js + Express.js (REST API) |
| Database | MySQL (dengan ORM: Sequelize atau Prisma) |
| Autentikasi | JWT + bcrypt |
| Payment Gateway | Midtrans Snap API / Core API |
| File Storage | Local storage / Cloud storage (AWS S3 / Cloudinary) untuk gambar produk |
| Cetak Struk | jsPDF / react-thermal-printer + Web Print/Web USB API |
| Hosting (saran) | VPS/Cloud (misal: AWS, GCP, atau hosting lokal) + Nginx reverse proxy |
| Lainnya | Redis (opsional, untuk cache & session), Nodemailer (email notifikasi) |

---

## 7. Skema Database (Garis Besar)

Tabel utama yang dibutuhkan di MySQL:

- **users** — id, nama, email, no_hp, password_hash, tanggal_lahir, role (customer/admin/kasir), status, created_at
- **categories** — id, nama_kategori, parent_id
- **products** — id, sku, nama, deskripsi, category_id, brand, harga, harga_diskon, stok, kadar_nikotin, status, created_at
- **product_images** — id, product_id, url_gambar
- **product_variants** — id, product_id, nama_varian (rasa/ukuran), stok_varian, harga_tambahan
- **carts** — id, user_id, product_id, variant_id, qty
- **orders** — id, user_id, no_order, total_harga, status_order, channel (online/offline), alamat_kirim, metode_bayar, created_at
- **order_items** — id, order_id, product_id, variant_id, qty, harga_satuan, subtotal
- **payments** — id, order_id, midtrans_transaction_id, payment_type, status, paid_at
- **stock_logs** — id, product_id, jenis (masuk/keluar), qty, keterangan, source (online_sale/offline_sale/restock), created_by, created_at
- **offline_transactions** — id, no_transaksi, kasir_id, total, metode_bayar, uang_diterima, kembalian, created_at
- **receipts** — id, transaction_id (FK ke orders/offline_transactions), nomor_struk, file_path/cetak_at

> ERD detail (relasi antar tabel) disarankan dibuat dalam tools seperti dbdiagram.io sebelum development dimulai.

---

## 8. Daftar API Endpoint (Contoh Garis Besar)

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/auth/register` | Registrasi pelanggan |
| POST | `/api/auth/login` | Login pelanggan/admin |
| GET | `/api/products` | List produk (dengan filter/search) |
| GET | `/api/products/:id` | Detail produk |
| POST | `/api/admin/products` | Tambah produk (admin) |
| PUT | `/api/admin/products/:id` | Update produk/stok/harga |
| POST | `/api/cart` | Tambah item ke keranjang |
| POST | `/api/checkout` | Proses checkout & buat transaction token Midtrans |
| POST | `/api/payment/notification` | Webhook notifikasi Midtrans |
| GET | `/api/orders` | Riwayat pesanan pelanggan |
| GET | `/api/admin/orders` | List semua pesanan (admin) |
| POST | `/api/admin/pos/transaction` | Input transaksi penjualan offline |
| GET | `/api/admin/pos/receipt/:id` | Generate/ambil data struk |
| GET | `/api/admin/reports/sales` | Laporan penjualan |

---

## 9. Non-Functional Requirements

### 9.1 Keamanan
- Verifikasi usia wajib (age gate) sebelum akses katalog/pembelian, sesuai regulasi produk vape/rokok elektrik yang berlaku.
- Validasi signature key Midtrans di setiap webhook untuk mencegah pemalsuan notifikasi pembayaran.
- HTTPS wajib di seluruh sistem (terutama halaman pembayaran & login).
- Sanitasi input untuk mencegah SQL Injection & XSS.
- Backup database otomatis secara berkala.

### 9.2 Performa
- Waktu muat halaman katalog < 2 detik (dengan pagination/lazy load gambar).
- Sistem mampu menangani transaksi bersamaan (concurrent) tanpa terjadi konflik stok (gunakan transaction lock di level database saat update stok).

### 9.3 Kepatuhan & Legalitas
- Disclaimer kesehatan terkait produk vape ditampilkan di landing page/footer sesuai ketentuan yang berlaku di Indonesia.
- Pembatasan usia pembeli ditegakkan secara konsisten di seluruh flow pembelian (online & offline).
- Penyimpanan data pribadi pelanggan mengikuti prinsip perlindungan data (UU PDP).

### 9.4 Skalabilitas
- Arsitektur backend dirancang modular (service-based) agar mudah dikembangkan ke multi-cabang di fase berikutnya.

---

## 10. User Flow Singkat

**Pelanggan (Online):**
`Landing Page → Verifikasi Usia → Etalase Toko → Detail Produk → Tambah ke Keranjang → Login/Register (jika belum) → Checkout → Bayar via Midtrans → Konfirmasi Pesanan → Lacak Status Pesanan`

**Admin (Manajemen):**
`Login Admin → Dashboard → Kelola Produk/Stok/Harga → Kelola Pesanan Online → Lihat Laporan`

**Kasir (Offline):**
`Login Kasir → Halaman POS → Cari/Scan Produk → Input Qty & Pembayaran → Simpan Transaksi → Cetak Struk`

---

## 11. Milestone & Estimasi Fase Pengembangan (Saran)

| Fase | Cakupan | Estimasi Durasi |
|---|---|---|
| Fase 1 | Setup project, database, autentikasi, landing page, etalase | 2–3 minggu |
| Fase 2 | Keranjang, checkout, integrasi Midtrans | 2 minggu |
| Fase 3 | Dashboard admin, manajemen produk/stok | 2 minggu |
| Fase 4 | Modul kasir/POS offline + cetak struk | 1–2 minggu |
| Fase 5 | Testing (QA), perbaikan bug, deployment | 1–2 minggu |

*(Estimasi dapat menyesuaikan jumlah developer dan kompleksitas final.)*

---

## 12. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Race condition stok saat transaksi online & offline bersamaan | Gunakan database transaction & locking saat update stok |
| Webhook Midtrans gagal diterima | Implementasi retry mechanism & pengecekan status manual via Midtrans API |
| Penjualan ke pembeli di bawah umur | Age gate wajib + validasi tanggal lahir saat registrasi |
| Kegagalan cetak struk (printer offline) | Sediakan opsi simpan/cetak ulang struk dalam format PDF |

---

## 13. Lampiran — Daftar Halaman (Sitemap)

**Customer-facing:**
- `/` — Landing Page
- `/shop` — Etalase Toko
- `/shop/:id` — Detail Produk
- `/cart` — Keranjang
- `/checkout` — Checkout
- `/login`, `/register` — Autentikasi pelanggan
- `/account` — Profil & riwayat pesanan

**Admin-facing:**
- `/admin/login`
- `/admin/dashboard`
- `/admin/products`
- `/admin/orders`
- `/admin/pos` — Kasir/Penjualan Offline
- `/admin/reports`
- `/admin/users`

---

*Dokumen ini adalah draft awal PRD dan dapat disesuaikan lebih lanjut berdasarkan diskusi dengan stakeholder/tim development.*
