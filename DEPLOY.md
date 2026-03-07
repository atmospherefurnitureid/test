# Panduan Deployment & Multi-Domain Security
## Atmosphere Furniture Indonesia

Dokumen ini ringkasan teknis bagaimana mengelola satu aplikasi Next.js untuk dua domain (`atmospherefurnitureid.com` dan `admin.atmospherefurnitureid.com`) secara aman.

---

### 1. Konsep Satu Kode, Dua Wajah
Aplikasi ini menggunakan fitur **Next.js Proxy** (`src/proxy.ts`) untuk membedakan traffic berdasarkan domain yang masuk.

#### Keamanan Utama:
- **Domain Utama:** Jika diakses pada path `/login` atau `/dashboard`, sistem akan merespons dengan **404 Not Found** (bukan redirect). Ini memastikan publik tidak tahu area admin eksis di domain utama.
- **Subdomain Admin:** Hanya subdomain ini yang diizinkan mengakses area login dan dashboard. Jika mengakses halaman publik dari sini, sistem akan me-redirect kembali ke domain utama.

---

### 2. Persiapan Environment
Pastikan file `.env` dan `.env.local` memiliki variabel berikut di server:

```env
NEXT_PUBLIC_MAIN_DOMAIN=atmospherefurnitureid.com
NEXT_PUBLIC_ADMIN_SUBDOMAIN=admin.atmospherefurnitureid.com
MONGODB_URI=mongodb+srv://...
JWT_SECRET=rahasia_sangat_kuat
NODE_ENV=production
```

> **Note:** Gunakan `cp .env .env.local` di server agar proses `npm run build` bisa membaca database.

---

### 3. Konfigurasi Nginx (Reverse Proxy)
Nginx bertugas meneruskan traffic dan **memberikan informasi domain** ke Next.js.

```nginx
server {
    listen 80;
    server_name atmospherefurnitureid.com www.atmospherefurnitureid.com admin.atmospherefurnitureid.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host; # Baris paling krusial untuk multi-domain
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

### 4. Langkah Deployment (Urutan Perintah)

Gunakan urutan ini untuk hasil yang bersih:

#### Tahap A: Pembersihan & Build
```bash
# 1. Update kode
git pull origin main

# 2. Persiapkan env
cp .env .env.local

# 3. Install & Build (Wajib setiap ada perubahan kode)
npm install
npm run build
```

#### Tahap B: Menjalankan Aplikasi
```bash
# 4. Jalankan dengan PM2
pm2 restart atmosphere || pm2 start npm --name "atmosphere" -- start
pm2 save
```

#### Tahap C: Keamanan SSL (HTTPS)
```bash
# 5. Install SSL untuk semua domain sekaligus
sudo certbot --nginx -d atmospherefurnitureid.com -d www.atmospherefurnitureid.com -d admin.atmospherefurnitureid.com
```

---

### 5. Cara Update Aplikasi di Masa Depan
Jika ada perubahan kode, Anda tidak perlu mengulang semua. Cukup:
```bash
cd /var/www/atmosphere
git pull
npm run build
pm2 restart atmosphere
```

---

### 6. Verifikasi Keamanan
| URL | Ekspektasi |
| :--- | :--- |
| `atmospherefurnitureid.com` | ✅ Halaman Web Publik |
| `atmospherefurnitureid.com/login` | ❌ 404 Not Found (Branded) |
| `admin.atmospherefurnitureid.com` | ✅ Area Admin (Login) |
| `admin.atmospherefurnitureid.com/produk` | ↪️ Redirect ke domain utama |
