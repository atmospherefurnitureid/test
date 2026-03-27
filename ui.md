# Standar Tipografi & Ukuran Teks (Aturan Google & SEO)

Dokumen ini mendefinisikan standar ukuran teks yang diterapkan pada proyek **Atmosphere Furniture Indonesia** untuk memastikan aksesibilitas maksimal, pengalaman pengguna (UX) yang premium, dan performa SEO yang optimal sesuai standar Google terbaru.

---

## 1. Aturan Dasar Ukuran Teks (Typography Scale)

| Level Teks | Ukuran (px) | Class Tailwind | Kegunaan |
| :--- | :--- | :--- | :--- |
| **Main Title (H2)** | 30px - 48px | `text-3xl md:text-5xl` | Judul utama setiap section/halaman. |
| **Headline (H3)** | 24px - 36px | `text-2xl md:text-4xl` | Judul sekunder di dalam grid atau sub-konten. |
| **Sub-headline (H4)**| 24px | `text-2xl` | Judul fitur kecil, kartu layanan, atau visi-misi. |
| **Normal Body** | **16px** | `text-base` | **Standard Normal:** Digunakan untuk semua deskripsi dan teks panjang. |
| **Small Label** | **14px** | `text-sm` | Keterangan statistik, label micro, atau footer text. |

> [!IMPORTANT]
> **Minimal 16px:** Teks deskripsi utama tidak boleh menggunakan ukuran di bawah 16px (`text-base`) untuk menghindari penalti SEO pada pencarian mobile.

---

## 2. Parameter Desain & Readability

Untuk menjaga estetika "High-End Minimalist", aturan berikut harus dipatuhi:

### A. Line Height (Spasi Baris)
*   Menggunakan **`leading-relaxed` (1.5 / 150%)** untuk teks normal agar mata tidak mudah lelah.
*   Menggunakan **`leading-tight` atau `leading-[1.1]`** untuk judul besar agar teks terlihat lebih solid dan editorial.

### B. Font Weight (Bobot)
*   **Normal Content:** Gunakan `font-medium` (500) untuk keterbacaan yang lebih tegas pada background putih.
*   **Headings:** Gunakan `font-semibold` (600) agar terlihat premium namun tidak terlalu "berat".
*   **Avoid:** Hindari penggunaan `font-bold` atau `font-black` secara berlebihan pada teks panjang agar tidak merusak ritme visual yang bersih.

### C. Case & Tracking (Spasi Huruf)
*   Teks narasi harus menggunakan **Normal Case** (bukan uppercase otomatis).
*   Hindari spasi antar-huruf yang lebar (`tracking-widest`) pada teks berukuran normal agar kata-kata menyatu dengan baik secara optik.

---

## 3. Dasar Referensi SEO (Google Standard)

Penerapan aturan ini didasarkan pada:
1.  **Google Lighthouse Performance:** Skor aksesibilitas akan menurun jika teks utama di bawah 16px karena dianggap menyulitkan pengguna mobile.
2.  **Material Design 3 (Google System):** Merekomendasikan **Body Large (16px)** sebagai standar keterbacaan global.
3.  **User Experience (UX):** Ukuran 16px mengurangi *bounce rate* karena pengunjung tidak perlu melakukan *pinch-to-zoom* saat membaca konten di ponsel.

---
*Terakhir diperbarui: 26 Maret 2026*
