# Panduan Kode Produk (SKU) Atmosphere Furniture

Dokumen ini menjelaskan aturan penamaan kode produk (SKU) dan struktur penyimpanan media untuk koleksi Atmosphere Furniture.

## 1. Struktur Kode Produk (SKU)

Kode produk (SKU) dibentuk berdasarkan kombinasi material, kategori produk, dan nomor urutan.

**Format:** `[MATERIAL]-[KATEGORI][URUTAN]`

### A. Kode Material (Prefix)
| Kode | Deskripsi |
|------|-----------|
| **W** | Wood (Kayu) |
| **I** | Iron (Besi) |
| **WI** | Wood & Iron (Kayu & Besi) |

### B. Kode Kategori Produk
| Kode | Kategori |
|------|----------|
| **11** | Meja (Table) |
| **21** | Kursi (Chair) |
| **22** | Bench |
| **23** | Stool |

### C. Nomor Urutan (Sequence)
Nomor urutan terdiri dari **3 digit** angka yang dimulai dari `001` untuk setiap kategori.

---

## 2. Contoh Implementasi

| Produk | Kode | Penjelasan |
|--------|------|------------|
| Meja Kayu Pertama | `W-11001` | **W** (Wood), **11** (Meja), **001** (Urutan 1) |
| Kursi Besi Ketiga | `I-21003` | **I** (Iron), **21** (Kursi), **003** (Urutan 3) |
| Bench Kayu & Besi Kedua | `WI-22002` | **WI** (Wood & Iron), **22** (Bench), **002** (Urutan 2) |

---

## 3. Struktur Folder Media

Media (Gambar/Video) produk disimpan secara terstruktur di dalam direktori `public/uploads/products/` berdasarkan prefix material dan kode lengkap produk.

**Format Jalur:** `/public/uploads/products/[PREFIX]/[SKU]/`

**Contoh Lokasi File:**
- `public/uploads/products/W/W-11001/fotoproduk.png`
- `public/uploads/products/WI/WI-22002/videoproduk.mp4`

---

## 4. Ketentuan Penambahan Produk Otomatis
1. Sistem akan mendeteksi **Jenis Material** dan **Kategori** yang dipilih user.
2. Sistem akan mencari nomor urutan terakhir dalam kategori tersebut di basis data.
3. Kode baru akan dibuat dengan menaikkan angka urutan (**Increment**) sebanyak 1.
4. Folder penyimpanan otomatis dibuat mengikuti kode produk yang dihasilkan.
