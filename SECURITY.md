# 🔐 SECURITY.md — Atmosphere Furniture App

> Dokumen ini menjelaskan arsitektur keamanan aplikasi Next.js Atmosphere Furniture.  
> **Diperbarui**: 2026-03-06  
> **Scope**: Full-stack Next.js App (src/ directory)

---

## 📋 Ringkasan Lapisan Keamanan

| Lapisan | Mekanisme | File |
|---|---|---|
| Route Protection | Next.js Middleware + JWT | `src/middleware.ts` |
| API Auth Verification | Auth Guard Helper | `src/lib/authGuard.ts` |
| Rate Limiting | In-memory limiter (login) | `src/lib/rateLimit.ts` |
| XSS Sanitization | HTML strip + char filter | `src/lib/sanitize.ts` |
| Security Headers | CSP, X-Frame-Options, HSTS, dll | `next.config.ts` |
| Authentication | JWT + httpOnly Cookie | `api/auth/login/route.ts` |
| Session Logout | Cookie clearance via API | `api/auth/logout/route.ts` |
| Password Hashing | bcryptjs (cost factor 12) | `api/auth/login/route.ts` |
| Env Secrets | Mandatory JWT_SECRET env var | `.env.local` |

---

## 🛡️ 1. Middleware Otentikasi (`src/middleware.ts`)

Next.js Edge Middleware yang berjalan sebelum setiap request diproses.

### Cara Kerja
- Membaca cookie `token` dari request
- Memverifikasi JWT dengan `JWT_SECRET`
- Jika tidak valid: redirect ke `/login` (halaman) atau return `401` (API)

### Route yang Dilindungi
```
/dashboard/*               → Redirect ke /login jika tidak auth
/api/products/*            → 401 jika tidak auth (kecuali GET)
/api/articles/*            → 401 jika tidak auth (kecuali GET)
/api/categories/*          → 401 jika tidak auth
/api/comments/*            → 401 jika tidak auth (kecuali POST)
/api/visitors/*            → 401 jika tidak auth (kecuali POST)
/api/upload/*              → 401 jika tidak auth
```

### Route Publik (Dikecualikan)
```
/login                     → Halaman login
/api/auth/login            → Submit form login
/api/auth/logout           → Logout (hapus cookie)
/api/products GET          → Storefront public
/api/articles GET          → Storefront public
/api/visitors POST         → Visitor tracker
/api/comments POST         → Submit komentar dari pengunjung
```

---

## 🍪 2. Autentikasi JWT + httpOnly Cookie

### Flow Login
1. User mengirim `POST /api/auth/login` dengan `{ username, password }`
2. Server memverifikasi password dengan bcryptjs
3. Jika cocok, server menandatangani JWT berisi `{ id, username, role }`
4. Token disimpan di **httpOnly cookie** (tidak dapat diakses JavaScript)
5. Setiap request berikutnya otomatis menyertakan cookie ini

### Cookie Settings
```
httpOnly: true          → Tidak bisa diakses via document.cookie
secure: true            → Hanya dikirim via HTTPS (di production)
sameSite: 'strict'      → Mencegah CSRF cross-origin requests
maxAge: 86400           → Kedaluwarsa dalam 1 hari
path: '/'               → Berlaku untuk seluruh domain
```

---

## ⏱️ 3. Rate Limiting (`src/lib/rateLimit.ts`)

Membatasi percobaan login untuk mencegah brute-force.

| Endpoint | Limit | Window |
|---|---|---|
| `POST /api/auth/login` | 10 request | 1 menit per IP |

Response jika melampaui limit:
```json
{ "error": "Too many login attempts. Please wait a moment and try again." }
// Status: 429 Too Many Requests
```

> ⚠️ Rate limiter ini menggunakan in-memory Map. Di lingkungan multi-instance (cluster/Kubernetes), gunakan Redis untuk state terpusat.

---

## 🔑 4. Auth Guard (`src/lib/authGuard.ts`)

Defense-in-depth: setiap API route private melakukan verifikasi token sendiri (double-check setelah middleware).

```typescript
const auth = verifyAuthFromRequest(request);
if (!auth) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
```

Fungsi ini mengembalikan `AuthPayload | null`:
```typescript
interface AuthPayload {
    id: string;
    username: string;
    role: "admin" | "editor";
}
```

---

## 🧾 5. Sanitasi Input XSS (`src/lib/sanitize.ts`)

Semua input teks dari user dibersihkan sebelum disimpan ke database.

### Apa yang Disanitasi
- Strip semua HTML tags (`<script>`, `<img>`, dll)
- Remove null bytes (`\x00`)
- Block `javascript:` protocol
- Block event handlers (`onclick=`, `onload=`, dll)
- Trim whitespace + limit panjang karakter

### Dipakai di
- `POST /api/comments` — konten komentar dari pengunjung
- Field `author`, `email`, `content`, `articleId` semua disanitasi

---

## 🧱 6. Security Headers (`next.config.ts`)

Header HTTP yang ditambahkan ke setiap response:

| Header | Nilai | Fungsi |
|---|---|---|
| `X-Frame-Options` | `DENY` | Cegah clickjacking / iframe embedding |
| `X-Content-Type-Options` | `nosniff` | Cegah MIME-type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Kontrol data referrer |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Blokir akses hardware sensitif |
| `X-XSS-Protection` | `1; mode=block` | XSS filter browser lama |
| `Content-Security-Policy` | Lihat di bawah | Whitelist sumber konten |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Paksa HTTPS (production) |

### Content Security Policy (CSP)
```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com
img-src 'self' data: https://images.unsplash.com https://res.cloudinary.com blob:
frame-src https://challenges.cloudflare.com
connect-src 'self'
object-src 'none'
```

---

## 🔒 7. Environment Variables

### Variabel Wajib di `.env.local`

```bash
# MongoDB connection string
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# Secret key untuk JWT signing — HARUS kuat dan unik
JWT_SECRET=ganti_dengan_random_string_panjang_minimal_64_karakter
```

### Aturan
- **Jangan** commit `.env.local` ke git (ada di `.gitignore`)
- `JWT_SECRET` harus minimal 64 karakter random — generate dengan:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- Server akan **crash saat startup** jika `JWT_SECRET` tidak didefinisikan (fail-fast)

---

## 🚫 8. Proteksi Setup Admin

Endpoint `/api/auth/setup` hanya bisa diakses di environment **development**.

Di **production**:
```json
{ "error": "Forbidden: setup endpoint is disabled in production." }
// Status: 403 Forbidden
```

---

## 🔄 9. CSRF Protection

Perlindungan CSRF dilakukan melalui kombinasi:
1. **`sameSite: 'strict'`** pada cookie — browser tidak mengirim cookie jika request berasal dari domain lain
2. **httpOnly cookie** — JavaScript tidak dapat mengakses token, mencegah token theft via XSS
3. Semua mutasi menggunakan **JSON body** (bukan form data), yang browser tidak kirimkan cross-origin secara default

---

## 📊 10. Logging & Monitoring

### Saat Ini
- Semua error server dicatat melalui `console.error()` (tampil di Next.js terminal)
- Error detail **tidak dikirim ke client** (hanya pesan generik)

### Rekomendasi untuk Production
- Integrasikan **Sentry** untuk error tracking dan alerting
- Gunakan **Vercel Analytics** atau **logtail** untuk API request logs
- Monitor anomali seperti spike 401/429 responses

---

## 📦 11. Dependency Security Audit

Jalankan secara berkala:

```bash
# Cek kerentanan di semua dependensi
npm audit

# Auto-fix yang bisa diperbaiki otomatis
npm audit fix

# Update patch versions
npm update
```

---

## ✅ Checklist Sebelum Deploy ke Production

- [ ] `JWT_SECRET` sudah diset dengan nilai kuat (min 64 char) di environment production
- [ ] `MONGODB_URI` sudah diset dan hanya bisa diakses dari server
- [ ] `NODE_ENV=production` sudah dikonfigurasi
- [ ] HTTPS sudah aktif (Vercel otomatis menyediakannya)
- [ ] Jalankan `npm audit` dan perbaiki semua CR/H vulnerabilities
- [ ] Password default admin `admin123` sudah diganti setelah setup
- [ ] Endpoint `/api/auth/setup` sudah diverifikasi mengembalikan 403 di production
- [ ] Test logout: pastikan cookie `token` benar-benar terhapus setelah logout

---

## 🧪 Testing Keamanan

### Uji Middleware
```bash
# Coba akses dashboard tanpa login — harus redirect ke /login
curl -L http://localhost:3000/dashboard

# Coba akses API tanpa token — harus 401
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'
```

### Uji Rate Limiting
```bash
# Kirim 11 request login berturut-turut — request ke-11 harus 429
for i in {1..11}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"wrong","password":"wrong"}'
done
```

### Uji Security Headers
```bash
# Periksa response headers
curl -I http://localhost:3000 | grep -E "X-Frame|X-Content|CSP|Referrer"
```
