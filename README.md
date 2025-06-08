# Bizly - Analisis Keuangan UMKM

**Bizly** adalah aplikasi digital yang dirancang untuk membantu pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) dalam mengelola keuangan mereka secara lebih efisien dan cerdas. UMKM sering menghadapi tantangan dalam pencatatan transaksi, analisis keuangan, dan pengambilan keputusan karena keterbatasan waktu dan sumber daya. Bizly hadir sebagai solusi untuk mencatat transaksi secara otomatis, menganalisis arus kas, serta memberikan insight keuangan yang mudah dipahami guna mendukung pertumbuhan bisnis yang berkelanjutan.

---

## 📥 Clone Repo

Clone repositori ini ke komputer lokal Anda:

```bash
git clone https://github.com/bizly-dbs/bizly-webapp
cd bizly-webapp
```
## 🚀 Cara Menjalankan Aplikasi

### 1. Menyiapkan Database PostgreSQL

Pastikan PostgreSQL sudah terinstal dan berjalan di sistem Anda. Anda bisa menggunakan [pgAdmin](https://www.pgadmin.org/) atau terminal untuk membuat database baru:

```bash
# Masuk ke PostgreSQL
psql -U postgres

# Buat database baru
CREATE DATABASE bizly_db;
```

Pastikan Anda menyesuaikan file `.env` di folder `backend`:

```
PORT=3000
DB_NAME=bizly_db
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
GMAIL_USER=bizlydbs@gmail.com
GMAIL_PASS=your_gmail_app_password
```

### 2. Menjalankan Backend

```bash
cd backend
npm install
nodemon index
```

### 3. Menjalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📌 Catatan

- Pastikan database PostgreSQL aktif sebelum menjalankan backend.
- Jangan lupa menyesuaikan file `.env` dengan konfigurasi database lokal Anda.
- Jika menggunakan Docker, Anda juga bisa mengatur PostgreSQL dalam container (tidak wajib).