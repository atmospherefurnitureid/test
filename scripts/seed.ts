/**
 * Seeder: Atmosphere Furniture Indonesia
 * Run: npx ts-node --project tsconfig.json -e "require('dotenv').config(); require('./scripts/seed.ts')"
 * Or via: npm run seed
 *
 * Relasi yang diseed:
 * - Category (master): Kursi, Meja, Lemari, Rak, Bangku, Stool
 * - Product: 6 produk, masing-masing 8 media (foto Unsplash real), relasi ke Category via field `category`
 * - Article: 6 artikel, masing-masing dengan content HTML penuh, tags, dan relasi ke category artikel
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined in .env');

// ─── SCHEMAS (inline agar standalone) ───────────────────────────────────────

const ProductSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    label: { type: String, enum: ['Kayu', 'Besi', 'Mixed'], required: true },
    category: { type: String, required: true },
    collection: { type: String, required: true },
    price: { type: Number, required: true },
    memberPrice: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    status: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock', 'Pre-order'], required: true },
    rating: { type: Number, default: 0 },
    media: [{ type: String }],
    mainMediaIndex: { type: Number, default: 0 },
    delivery: { type: String, default: '' },
    description: { type: String, default: '' },
    specifications: [{
        key: { type: String, required: true },
        value: { type: String, required: true },
        _id: false,
    }],
    variations: [{
        name: { type: String, required: true },
        options: [{ type: String }],
        _id: false,
    }],
    dimensions: {
        product: { type: String, required: true },
        weight: { type: String, required: true },
        packaged: { type: String, required: true },
        _id: false,
    },
    fabric: { type: String, required: true },
    returns: { type: String, default: 'Dapat dikembalikan jika tidak sesuai dengan deskripsi' },
    additionalInfo: {
        warranty: { type: String, required: true },
        production: { type: String, default: '14 hari kerja' },
        shipping: { type: String, default: '' },
        care: { type: String, default: 'Lap dengan kain lembab, hindari sinar matahari langsung' },
        _id: false,
    },
}, { timestamps: true, suppressReservedKeysWarning: true });

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: String, required: true },
    featured: { type: Boolean, default: false },
    content: { type: String },
    tags: [{ type: String }],
    status: { type: String, enum: ['Published', 'Draft', 'Scheduled'], default: 'Draft' },
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Article = mongoose.models.Article || mongoose.model('Article', ArticleSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

// ─── CATEGORY DATA ────────────────────────────────────────────────────────────

const categories = [
    { name: 'Kursi' },
    { name: 'Meja' },
    { name: 'Lemari' },
    { name: 'Rak' },
    { name: 'Bangku' },
    { name: 'Stool' },
];

// ─── PRODUCT DATA ─────────────────────────────────────────────────────────────
// Setiap produk memiliki 8 media (gambar Unsplash furnitur nyata)

const products = [
    {
        code: 'ATM-KRS-001',
        name: 'Kursi Cafe Industrial Iron',
        label: 'Besi',
        category: 'Kursi',
        collection: 'Industrial Series',
        price: 1850000,
        memberPrice: 1650000,
        stock: 24,
        status: 'In Stock',
        rating: 4.8,
        mainMediaIndex: 0,
        media: [
            'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
        ],
        delivery: 'Pengiriman 3-5 hari kerja untuk wilayah Jawa. Luar Jawa 7-14 hari kerja.',
        description: '<p>Kursi Cafe Industrial Iron adalah perpaduan sempurna antara estetika industrial dengan kenyamanan modern. Dibuat dari besi tempa pilihan dengan finishing powder coat hitam matte yang tahan lama dan anti karat.</p><p>Cocok untuk kafe, restoran, ruang makan, atau ruang tamu bergaya industrial. Kaki kursi dari pipa besi solid memberikan stabilitas maksimal bahkan untuk penggunaan intensif.</p>',
        specifications: [
            { key: 'Material Rangka', value: 'Besi Tempa Grade A' },
            { key: 'Finishing', value: 'Powder Coat Hitam Matte' },
            { key: 'Kapasitas Beban', value: '150 kg' },
            { key: 'Ketebalan Besi', value: '3mm' },
            { key: 'Asal Material', value: 'Lokal Indonesia' },
            { key: 'Kode Warna', value: 'RAL 9005 Jet Black' },
        ],
        variations: [
            { name: 'Warna', options: ['Hitam Matte', 'Putih Matte', 'Bronze'] },
            { name: 'Sandaran', options: ['Dengan Sandaran', 'Tanpa Sandaran'] },
        ],
        dimensions: {
            product: 'P45 x L45 x T80 cm | Tinggi Dudukan: 45cm',
            weight: '5.5 kg',
            packaged: 'P50 x L50 x T85 cm | 7 kg',
        },
        fabric: 'Besi Tempa Cold-Rolled Steel',
        returns: 'Dapat dikembalikan dalam 7 hari jika terdapat cacat produksi',
        additionalInfo: {
            warranty: '1 tahun garansi struktur dari cacat produksi',
            production: '7-10 hari kerja',
            shipping: 'Dikirim dalam kondisi terlindungi bubble wrap + styrofoam',
            care: 'Lap dengan kain kering. Hindari paparan air berlebih. Oleskan cat anti karat setiap 6 bulan untuk perawatan optimal.',
        },
    },
    {
        code: 'ATM-MJA-001',
        name: 'Meja Makan Kayu Solid Jati',
        label: 'Kayu',
        category: 'Meja',
        collection: 'Natural Wood Series',
        price: 8500000,
        memberPrice: 7650000,
        stock: 8,
        status: 'In Stock',
        rating: 4.9,
        mainMediaIndex: 0,
        media: [
            'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1200',
        ],
        delivery: 'Pengiriman 5-7 hari kerja. Termasuk tim instalasi untuk wilayah Jabodebek.',
        description: '<p>Meja Makan Kayu Solid Jati adalah masterpiece keahlian tangan pengrajin Atmosphere. Terbuat dari kayu jati pilihan berumur 20+ tahun yang diproses secara bertanggung jawab dari hutan terkelola.</p><p>Serat kayu jati alami yang unik menjadikan setiap meja memiliki karakter berbeda. Finishing natural oil menonjolkan keindahan serat asli sekaligus melindungi permukaan dari noda dan goresan sehari-hari.</p>',
        specifications: [
            { key: 'Material', value: 'Kayu Jati Solid Grade A' },
            { key: 'Finishing', value: 'Natural Oil + Waterbased Varnish' },
            { key: 'Ketebalan Meja', value: '5cm' },
            { key: 'Kapasitas', value: '6-8 orang' },
            { key: 'Moisture Content', value: '12-15%' },
            { key: 'Sertifikasi', value: 'SVLK (Sistem Verifikasi Legalitas Kayu)' },
        ],
        variations: [
            { name: 'Ukuran', options: ['160x80cm', '180x90cm', '200x100cm'] },
            { name: 'Finishing', options: ['Natural Oil', 'Dark Walnut', 'Ebony'] },
            { name: 'Kaki', options: ['Kayu Solid', 'Besi Iron'] },
        ],
        dimensions: {
            product: 'P180 x L90 x T75 cm',
            weight: '65 kg',
            packaged: 'P190 x L100 x T80 cm | 75 kg',
        },
        fabric: 'Kayu Jati Solid (Tectona grandis)',
        returns: 'Dapat ditukar jika terdapat cacat dalam 7 hari pertama',
        additionalInfo: {
            warranty: '5 tahun garansi struktur, 1 tahun garansi finishing',
            production: '21-28 hari kerja (custom)',
            shipping: 'Dikirim bongkar pasang dengan tim instalasi',
            care: 'Bersihkan dengan kain lembab. Apply wood oil setiap 6 bulan. Hindari paparan matahari langsung.',
        },
    },
    {
        code: 'ATM-RAK-001',
        name: 'Rak Buku Industrial Mixed Iron-Wood',
        label: 'Mixed',
        category: 'Rak',
        collection: 'Industrial Series',
        price: 4200000,
        memberPrice: 3780000,
        stock: 15,
        status: 'In Stock',
        rating: 4.7,
        mainMediaIndex: 0,
        media: [
            'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1599619351208-3e6c839d6828?auto=format&fit=crop&q=80&w=800',
        ],
        delivery: 'Pengiriman 3-5 hari kerja. Paket flat-pack untuk kemudahan pengiriman.',
        description: '<p>Rak Buku Industrial Mixed menggabungkan kekokohan rangka besi pipa dengan kehangatan papan kayu akasia solid. Desain terbuka 5 tingkat memberikan kapasitas penyimpanan maksimal sekaligus tampilan yang estetis.</p><p>Rangka dari pipa besi 1.5 inch dengan sistem sambungan sekrup yang kuat. Papan dari kayu akasia solid setebal 3cm yang kuat menopang beban buku.</p>',
        specifications: [
            { key: 'Material Rangka', value: 'Pipa Besi ERW 1.5 inch' },
            { key: 'Material Rak', value: 'Kayu Akasia Solid 3cm' },
            { key: 'Finishing Besi', value: 'Powder Coat Hitam Matte' },
            { key: 'Finishing Kayu', value: 'Waterbased Clear Matte' },
            { key: 'Jumlah Tingkat', value: '5 Tingkat' },
            { key: 'Kapasitas per Shelf', value: '30 kg' },
        ],
        variations: [
            { name: 'Warna Besi', options: ['Hitam Matte', 'Bronze Antik'] },
            { name: 'Warna Kayu', options: ['Natural', 'Walnut', 'Ebony'] },
            { name: 'Tinggi', options: ['180cm', '200cm'] },
        ],
        dimensions: {
            product: 'P120 x L30 x T180 cm',
            weight: '35 kg',
            packaged: 'P125 x L35 x T185 cm | 40 kg',
        },
        fabric: 'Pipa Besi ERW + Kayu Akasia Solid',
        returns: 'Dapat dikembalikan jika tidak sesuai dengan deskripsi dalam 7 hari',
        additionalInfo: {
            warranty: '2 tahun garansi struktur',
            production: '14 hari kerja',
            shipping: 'Dikirim flat-pack dengan instruksi pemasangan lengkap',
            care: 'Bersihkan besi dengan kain kering. Lap kayu dengan kain lembab. Oleskan wood wax 3 bulan sekali.',
        },
    },
    {
        code: 'ATM-STL-001',
        name: 'Bar Stool Minimalis Besi',
        label: 'Besi',
        category: 'Stool',
        collection: 'Minimalist Series',
        price: 1350000,
        memberPrice: 1215000,
        stock: 3,
        status: 'Low Stock',
        rating: 4.6,
        mainMediaIndex: 0,
        media: [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&q=80&w=800',
        ],
        delivery: 'Pengiriman 3-5 hari kerja. Ready stock untuk pengiriman ekspres.',
        description: '<p>Bar Stool Minimalis dari besi solid cocok untuk dapur bar, coffee counter, atau meja tinggi. Desain sederhana namun kokoh dengan kaki silang yang memberikan stabilitas sempurna.</p><p>Ketinggian kursi bar yang ideal (75cm) sesuai dengan standar meja bar 90-105cm. Tersedia dalam berbagai pilihan warna powder coat.</p>',
        specifications: [
            { key: 'Material', value: 'Besi Solid 2mm' },
            { key: 'Finishing', value: 'Powder Coat' },
            { key: 'Kapasitas Beban', value: '120 kg' },
            { key: 'Tipe Kaki', value: 'Silang (Cross Leg)' },
            { key: 'Pelindung Kaki', value: 'Rubber Anti-Scratch' },
        ],
        variations: [
            { name: 'Warna', options: ['Hitam Matte', 'Putih Susu', 'Gold Brushed', 'Bronze'] },
            { name: 'Seat', options: ['Iron Flat', 'Cushion Hitam', 'Cushion Abu'] },
        ],
        dimensions: {
            product: 'Diameter 35cm x T75cm',
            weight: '4 kg',
            packaged: 'P40 x L40 x T80 cm | 5 kg',
        },
        fabric: 'Besi Cold-Rolled 2mm',
        returns: 'Dapat dikembalikan dalam 7 hari',
        additionalInfo: {
            warranty: '1 tahun garansi struktur',
            production: '7 hari kerja',
            shipping: 'Dikirim dalam packaging karton tebal',
            care: 'Lap dengan kain kering. Aplikasikan anti-rust spray 6 bulan sekali.',
        },
    },
    {
        code: 'ATM-LMR-001',
        name: 'Lemari Pakaian 3 Pintu Kayu Jati',
        label: 'Kayu',
        category: 'Lemari',
        collection: 'Classic Wood Series',
        price: 12500000,
        memberPrice: 11250000,
        stock: 5,
        status: 'In Stock',
        rating: 4.9,
        mainMediaIndex: 0,
        media: [
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800',
        ],
        delivery: 'Pengiriman 7-10 hari kerja. Termasuk instalasi untuk Jabodebek.',
        description: '<p>Lemari Pakaian 3 Pintu dari kayu jati solid adalah perpaduan fungsi dan keindahan. Dibangun dengan joinery tradisional mortise & tenon yang diperkuat dengan dowel kayu untuk ketahanan jangka panjang.</p><p>Interior lemari dirancang fungsional dengan area gantung baju di satu sisi dan rak bertingkat di sisi lain. Handle brass antik menambah kesan klasik yang elegan.</p>',
        specifications: [
            { key: 'Material', value: 'Kayu Jati Solid Grade A' },
            { key: 'Finishing Luar', value: 'Walnut Stain + Waterbased Varnish Gloss' },
            { key: 'Interior', value: 'Cat Natural Putih' },
            { key: 'Handle', value: 'Brass Antik' },
            { key: 'Engsel', value: 'Full Overlay Soft-Close Blum' },
            { key: 'Jumlah Pintu', value: '3 Pintu' },
        ],
        variations: [
            { name: 'Finishing', options: ['Walnut Dark', 'Natural Light', 'Ebony Black'] },
            { name: 'Handle', options: ['Brass Antik', 'Stainless Modern', 'Tanpa Handle (Push)'] },
        ],
        dimensions: {
            product: 'P180 x L60 x T200 cm',
            weight: '180 kg',
            packaged: 'P190 x L65 x T205 cm | 210 kg',
        },
        fabric: 'Kayu Jati Solid Seasoned',
        returns: 'Dapat ditukar jika ada cacat produksi dalam 14 hari',
        additionalInfo: {
            warranty: '10 tahun garansi struktur, 2 tahun garansi finishing',
            production: '28-35 hari kerja',
            shipping: 'Tim instalasi disertakan. Tidak bisa dikirim via ekspedisi reguler.',
            care: 'Bersihkan dengan kain lembab. Polish kayu 6 bulan sekali. Jauhkan dari paparan matahari langsung.',
        },
    },
    {
        code: 'ATM-BNK-001',
        name: 'Bangku Panjang Kayu-Besi Outdoor',
        label: 'Mixed',
        category: 'Bangku',
        collection: 'Outdoor Series',
        price: 3200000,
        memberPrice: 2880000,
        stock: 0,
        status: 'Pre-order',
        rating: 4.7,
        mainMediaIndex: 0,
        media: [
            'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200',
        ],
        delivery: 'Pre-order: Estimasi produksi 21 hari kerja. Pengiriman setelah produk selesai.',
        description: '<p>Bangku Panjang Outdoor dirancang khusus untuk ketahanan di lingkungan luar ruangan. Menggunakan kombinasi kayu ulin (kayu besi Kalimantan) yang terkenal tahan terhadap cuaca dan rangka besi galvanis anti karat.</p><p>Ideal untuk teras, taman, koridor hotel, atau area outdoor kafe. Bobotnya yang berat memberikan stabilitas alami tanpa perlu dipasang ke tanah.</p>',
        specifications: [
            { key: 'Material Atas', value: 'Kayu Ulin (Ironwood) 4cm' },
            { key: 'Material Rangka', value: 'Besi Hollow Galvanis 4x4cm' },
            { key: 'Finishing Kayu', value: 'Decking Oil Exterior Grade' },
            { key: 'Finishing Besi', value: 'Hot-Dip Galvanized + Powder Coat' },
            { key: 'Kapasitas', value: '3-4 orang' },
            { key: 'Ketahanan Cuaca', value: 'UV Resistant, Waterproof' },
        ],
        variations: [
            { name: 'Panjang', options: ['120cm', '150cm', '180cm'] },
            { name: 'Warna Besi', options: ['Hitam Industrial', 'Putih Bersih'] },
        ],
        dimensions: {
            product: 'P150 x L40 x T45 cm',
            weight: '45 kg',
            packaged: 'P155 x L45 x T50 cm | 52 kg',
        },
        fabric: 'Kayu Ulin + Besi Galvanis',
        returns: 'Tidak dapat dikembalikan untuk produk pre-order kecuali cacat produksi',
        additionalInfo: {
            warranty: '3 tahun garansi untuk penggunaan outdoor normal',
            production: '21 hari kerja',
            shipping: 'Pengiriman kargo untuk perabot berat',
            care: 'Bersihkan dengan air dan sabun. Aplikasikan decking oil setiap tahun. Simpan atau tutup saat tidak digunakan dalam waktu lama.',
        },
    },
];

// ─── ARTICLE DATA ─────────────────────────────────────────────────────────────

const articles = [
    {
        title: 'Mengenal Keunggulan Furnitur Besi Tempa untuk Hunian Modern',
        description: 'Furnitur besi tempa bukan sekadar pilihan gaya — ia adalah investasi jangka panjang. Pelajari keunggulan teknis dan estetika yang membuatnya semakin populer di kalangan desainer interior.',
        image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=1200',
        category: 'Material & Teknik',
        author: 'Tim Atmosphere',
        date: 'Maret 5, 2026',
        featured: true,
        status: 'Published',
        tags: ['besi tempa', 'furnitur industrial', 'desain interior', 'material'],
        content: `
<h2>Mengapa Besi Tempa Menjadi Pilihan Utama?</h2>
<p>Besi tempa (wrought iron) telah digunakan selama berabad-abad dalam pembuatan furnitur dan dekorasi. Berbeda dengan cast iron (besi cor), besi tempa memiliki kandungan karbon yang sangat rendah sehingga bersifat lebih lentur, kuat tarik tinggi, dan tahan terhadap karat alami.</p>
<p>Di Atmosphere Furniture, kami menggabungkan teknik penempaan tradisional dengan teknologi finishing modern untuk menghasilkan furnitur yang tidak hanya indah secara visual, tetapi juga mampu bertahan melewati generasi.</p>

<h2>Keunggulan Teknis Besi Tempa</h2>
<ul>
  <li><strong>Kekuatan Superior:</strong> Besi tempa memiliki tensile strength yang jauh lebih tinggi dibanding besi cor, menjadikannya pilihan ideal untuk furnitur berbeban berat.</li>
  <li><strong>Fleksibilitas Desain:</strong> Sifat lentur besi tempa memungkinkan pengrajin menciptakan bentuk-bentuk organik dan detail ornamen yang rumit.</li>
  <li><strong>Daya Tahan Luar Biasa:</strong> Dengan perawatan minimal, furnitur besi tempa dapat bertahan 50+ tahun tanpa penggantian komponen utama.</li>
  <li><strong>Ramah Lingkungan:</strong> Besi adalah material yang 100% dapat didaur ulang tanpa kehilangan kualitas.</li>
</ul>

<h2>Gaya Desain yang Cocok</h2>
<p>Furnitur besi sangat versatil dalam hal gaya. Ia bisa tampil mewah dalam interior klasik Victorian, terasa autentik dalam gaya Industrial Modern, atau bahkan terlihat minimalis bersih dalam konsep Japandi.</p>

<h2>Perawatan Furnitur Besi</h2>
<p>Merawat furnitur besi tidaklah sulit. Bersihkan secara rutin dengan kain kering. Aplikasikan wax berbasis minyak setiap 6 bulan untuk melindungi dari oksidasi. Untuk furnitur outdoor, gunakan cat anti-karat khusus eksterior setiap 1-2 tahun.</p>

<blockquote>
  <p>"Furnitur besi yang dirawat dengan baik bukan hanya bertahan lama — ia makin indah seiring waktu, seperti wine yang mengalami aging." — Will Jones, Founder Atmosphere Furniture</p>
</blockquote>
`,
    },
    {
        title: 'Panduan Lengkap Memilih Kayu untuk Furnitur Custom Anda',
        description: 'Tidak semua kayu diciptakan sama. Panduan ini membantu Anda memahami perbedaan jenis kayu, karakteristiknya, dan mana yang paling cocok untuk kebutuhan furnitur Anda.',
        image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=1200',
        category: 'Panduan Pembelian',
        author: 'Tim Atmosphere',
        date: 'Februari 28, 2026',
        featured: true,
        status: 'Published',
        tags: ['kayu jati', 'kayu mahoni', 'kayu akasia', 'panduan', 'furnitur kayu'],
        content: `
<h2>Mengenal Jenis Kayu untuk Furnitur</h2>
<p>Pemilihan kayu yang tepat adalah fondasi dari furnitur berkualitas. Setiap jenis kayu memiliki karakteristik unik mulai dari kekerasan, pola serat, warna alami, hingga kemampuan menyerap finishing. Berikut panduan komprehensif dari tim ahli Atmosphere Furniture.</p>

<h2>1. Kayu Jati (Teak)</h2>
<p>Raja dari semua kayu furnitur. Kayu jati memiliki kandungan minyak alami tinggi yang membuatnya secara inheren tahan terhadap air, rayap, dan jamur tanpa treatment kimia tambahan.</p>
<ul>
  <li><strong>Kekerasan:</strong> 1155 lbf (Janka Hardness)</li>
  <li><strong>Ketahanan Cuaca:</strong> Sangat Baik (cocok Indoor & Outdoor)</li>
  <li><strong>Harga:</strong> Premium</li>
  <li><strong>Terbaik untuk:</strong> Meja makan, lemari, tempat tidur, furnitur outdoor</li>
</ul>

<h2>2. Kayu Mahoni</h2>
<p>Pilihan premium dengan harga yang lebih terjangkau dari jati. Mahoni dikenal dengan serat kayunya yang lurus dan halus serta warna kemerahan yang khas yang semakin indah seiring waktu.</p>
<ul>
  <li><strong>Kekerasan:</strong> 800 lbf</li>
  <li><strong>Ketahanan Cuaca:</strong> Baik (indoor terbaik)</li>
  <li><strong>Harga:</strong> Menengah-Atas</li>
  <li><strong>Terbaik untuk:</strong> Kursi, meja kerja, rak, cabinet</li>
</ul>

<h2>3. Kayu Akasia</h2>
<p>Kayu lokal yang underrated namun luar biasa. Akasia memiliki serat yang dinamis dengan gradasi warna natural yang sangat indah. Lebih terjangkau dari jati namun tidak kalah kokoh.</p>

<h2>4. Kayu Ulin (Ironwood)</h2>
<p>Kayu terkeras dari Kalimantan. Dikenal mampu bertahan ratusan tahun bahkan dalam kondisi outdoor ekstrem. Ideal untuk bangku taman, deck, dan furnitur outdoor berat.</p>

<h2>Tips Memilih Kayu Berdasarkan Ruangan</h2>
<p><strong>Kamar Tidur:</strong> Mahoni atau Jati — hangat dan tidak menimbulkan alergi.</p>
<p><strong>Ruang Makan:</strong> Jati solid — tahan noda dan mudah dibersihkan.</p>
<p><strong>Area Outdoor:</strong> Ulin atau Jati — tahan cuaca ekstrem Indonesia.</p>
`,
    },
    {
        title: '7 Tren Desain Interior 2026 yang Wajib Anda Ketahui',
        description: 'Dunia desain interior terus berevolusi. Inilah 7 tren dominan di 2026 yang diprediksi para desainer terkemuka, dan bagaimana furnitur Atmosphere bisa menjadi bagiannya.',
        image: 'https://images.unsplash.com/photo-1492656975733-cfd6a6a0f70a?auto=format&fit=crop&q=80&w=1200',
        category: 'Tren Desain',
        author: 'Tim Atmosphere',
        date: 'Februari 20, 2026',
        featured: false,
        status: 'Published',
        tags: ['tren desain', 'interior 2026', 'desain rumah', 'inspirasi'],
        content: `
<h2>Tren Interior 2026: Humanistic Design Bertemu Teknologi</h2>
<p>Tahun 2026 ditandai dengan kebangkitan kembali material alami berpadu dengan estetika yang lebih "manusiawi". Para desainer terkemuka dunia memprediksi pergeseran dari interior yang sangat steril ke ruangan yang terasa hangat, autentik, dan personal.</p>

<h2>1. Japandi Evolved</h2>
<p>Japandi (Japan + Scandinavia) tidak hanya bertahan tapi berevolusi. Versi 2026-nya lebih berani dengan mengintegrasikan elemen material kasar seperti tembok batu dan besi hitam matte berpadu dengan tekstur linen natural.</p>

<h2>2. Curved Furniture Dominates</h2>
<p>Garis lurus sudah terlalu kaku. 2026 adalah era bagi furnitur dengan lekukan organik. Sofa bundar, meja oval, lemari dengan sudut membulat semua mendominasi showroom furniture global.</p>

<h2>3. Biophilic Design 2.0</h2>
<p>Mendekatkan alam ke dalam rumah bukan hanya dengan tanaman. 2026 mengintegrasikan material alami mentah — kayu tidak diamplas halus, batu alam, rotan — sebagai elemen desain utama.</p>

<h2>4. Multifunctional Furniture</h2>
<p>Dengan meningkatnya konsep WFH dan apartemen compact, furnitur multifungsi menjadi keharusan. Meja yang bisa jadi standing desk, bangku yang menjadi storage, rak yang berfungsi sebagai room divider.</p>

<h2>5. Dark Moody Palettes</h2>
<p>Warna-warna gelap seperti deep forest green, charcoal, navy, dan burnt terracotta mendominasi pilihan warna interior. Furnitur besi hitam matte sangat sesuai dengan estetika ini.</p>

<h2>6. Maximalist Details</h2>
<p>Setelah dekade minimalism, 2026 menyambut kembalinya detail ornamental pada furnitur — ukiran, pola geometris, inlay kayu kontras, dan hardware dekoratif.</p>

<h2>7. Artisan Pieces as Focal Points</h2>
<p>Satu buah furnitur handmade berkualitas tinggi sebagai focal point ruangan, bukan mengisi seluruh ruangan dengan furnitur massal.</p>
`,
    },
    {
        title: 'Cara Merawat Furnitur Kayu Agar Tahan Puluhan Tahun',
        description: 'Furnitur kayu solid adalah investasi. Pelajari teknik perawatan yang tepat dari para ahli Atmosphere untuk menjaga keindahan dan ketahanan furnitur kayu Anda selama puluhan tahun.',
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1200',
        category: 'Perawatan & Tips',
        author: 'Tim Atmosphere',
        date: 'Februari 12, 2026',
        featured: false,
        status: 'Published',
        tags: ['perawatan furnitur', 'kayu', 'tips', 'maintenance'],
        content: `
<h2>Investasi yang Tepat Butuh Perawatan yang Tepat</h2>
<p>Furnitur kayu solid bukan seperti elektronik yang usang setelah beberapa tahun. Jika dirawat dengan benar, ia bisa bertahan puluhan bahkan ratusan tahun — bahkan menjadi warisan keluarga yang berharga.</p>

<h2>Rutinitas Harian</h2>
<ul>
  <li>Lap debu dengan kain microfiber kering setiap hari atau minimal 2-3 kali seminggu</li>
  <li>Bersihkan tumpahan segera dengan kain lembab — jangan biarkan air meresap terlalu lama</li>
  <li>Gunakan alas (coaster, placemat) di bawah gelas, piring panas, atau benda tajam</li>
</ul>

<h2>Perawatan Bulanan</h2>
<p>Setiap bulan, aplikasikan furniture wax atau wood conditioner mengikuti arah serat kayu. Produk berbasis beeswax sangat direkomendasikan karena natural dan tidak mengubah warna kayu.</p>

<h2>Perawatan Tahunan (Deep Care)</h2>
<ol>
  <li>Gosok permukaan dengan steel wool halus (0000 grade) mengikuti arah serat</li>
  <li>Bersihkan sisa gosok dengan kain kembab</li>
  <li>Biarkan kering 24 jam</li>
  <li>Aplikasikan Danish Oil atau Teak Oil secara merata</li>
  <li>Lap kelebihan oil setelah 30 menit</li>
  <li>Biarkan curing selama 72 jam sebelum digunakan kembali</li>
</ol>

<h2>Hal-hal yang Harus Dihindari</h2>
<ul>
  <li>Paparan matahari langsung dalam waktu lama — menyebabkan fading dan cracking</li>
  <li>Kelembaban ekstrem atau perubahan suhu mendadak</li>
  <li>Pembersih kimia keras (bleach, ammonia)</li>
  <li>Meletakkan benda sangat berat di satu titik terlalu lama</li>
</ul>

<blockquote>
  <p>"Kayu adalah material hidup yang terus bernapas. Ia membutuhkan perhatian dan cinta seperti tanaman."</p>
</blockquote>
`,
    },
    {
        title: 'Proses Produksi Furnitur Besi: Dari Bahan Mentah ke Karya Seni',
        description: 'Temukan perjalanan luar biasa sebuah furnitur besi — dari billet besi mentah hingga menjadi karya yang memperindah ruangan Anda. Inside tour eksklusif workshop Atmosphere.',
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1200',
        category: 'Behind The Scenes',
        author: 'Tim Atmosphere',
        date: 'Januari 28, 2026',
        featured: false,
        status: 'Published',
        tags: ['proses produksi', 'workshop', 'besi', 'handmade', 'artisan'],
        content: `
<h2>Dari Billet Besi Menuju Karya Seni</h2>
<p>Setiap furnitur besi yang keluar dari workshop Atmosphere adalah hasil dari ratusan jam kerja tangan yang terampil, ketelitian tinggi, dan passion mendalam. Mari kita telusuri proses produksinya dari awal.</p>

<h2>Tahap 1: Seleksi Material</h2>
<p>Kami hanya menggunakan besi dengan spesifikasi tertentu. Tim quality control kami memeriksa setiap batch material yang masuk — mengukur ketebalan, memeriksa konsistensi komposisi, dan memastikan tidak ada cacat material sebelum masuk produksi.</p>

<h2>Tahap 2: Pemotongan & Pembentukan</h2>
<p>Material dipotong menggunakan plasma cutter presisi tinggi untuk akurasi milimeter. Pembentukan dilakukan dengan kombinasi mesin bending dan pembentukan manual oleh pengrajin berpengalaman.</p>

<h2>Tahap 3: Pengelasan (Welding)</h2>
<p>Ini adalah tahap yang paling kritis. Pengrajin las kami memiliki sertifikasi welding internasional. Setiap sambungan dilas dengan teknik MIG welding untuk kekuatan maksimal, kemudian dihaluskan dengan gerinda.</p>

<h2>Tahap 4: Surface Preparation</h2>
<p>Sebelum finishing, permukaan besi harus 100% bersih dari karat, minyak, dan kontaminan. Kami menggunakan sandblasting untuk membuka pori besi sehingga powder coat dapat melekat dengan sempurna.</p>

<h2>Tahap 5: Powder Coating</h2>
<p>Powder coat diaplikasikan secara elektrostatis dan di-cure dalam oven 200°C selama 20 menit. Hasilnya adalah lapisan finishing ultra-durable yang tahan goresan, tahan cuaca, dan tersedia dalam ribuan pilihan warna RAL.</p>

<h2>Tahap 6: Quality Control Final</h2>
<p>Setiap produk jadi melewati 22 titik quality check sebelum dikemas. Termasuk stress test, visual inspection, dan cek dimensional.</p>
`,
    },
    {
        title: 'Gunung & Furnitur: Inspirasi Desain dari Alam Pegunungan Indonesia',
        description: 'Alam Indonesia menjadi inspirasi tak habis-habis bagi tim desainer Atmosphere. Pelajari bagaimana keindahan pegunungan Jawa termanifestasi dalam koleksi terbaru kami.',
        image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200',
        category: 'Inspirasi & Sketsa',
        author: 'Tim Atmosphere',
        date: 'Januari 15, 2026',
        featured: false,
        status: 'Published',
        tags: ['inspirasi', 'alam', 'desain', 'koleksi baru', 'indonesia'],
        content: `
<h2>Ketika Gunung Berbicara dalam Bahasa Furnitur</h2>
<p>Berdiri di 3.676 meter di atas permukaan laut, Gunung Semeru di Jawa Timur telah menjadi inspirasi utama koleksi terbaru Atmosphere — "Semeru Collection". Tim desainer kami menghabiskan 2 minggu di kaki Semeru untuk menyerap essensi visual dan filosofi alam pegunungan.</p>

<h2>Filosofi Desain: Kokoh Seperti Gunung</h2>
<p>Gunung mengajarkan kita tentang kekuatan yang hadir dalam ketenangan. Furnitur dalam Semeru Collection mengadopsi filosofi ini — secara visual sederhana dan tenang, tetapi secara struktural sangat kuat dan tahan lama.</p>

<h2>Elemen Visual yang Terinspirasi</h2>
<ul>
  <li><strong>Siluet Puncak:</strong> Bentuk trapezoid yang terinspirasi silhuet gunung hadir dalam kaki meja dan sandaran kursi</li>
  <li><strong>Tekstur Batu Vulkanik:</strong> Finishing powder coat dengan tekstur matte kasar yang menyerupai permukaan batu basalt</li>
  <li><strong>Palet Warna Alam:</strong> Charcoal, Forest Green, Pumice Gray, dan Obsidian Black</li>
  <li><strong>Ritme Kontur:</strong> Garis-garis paralel dalam detail ornamen yang terinspirasi kontur topografi peta gunung</li>
</ul>

<h2>Material yang Mencerminkan Alam</h2>
<p>Untuk koleksi ini, kami memilih kombinasi besi matte dengan kayu sengon lokal yang difinishing dengan arang aktif sebagai natural stain. Hasilnya adalah warna hitam pekat alami tanpa bahan kimia.</p>

<h2>Peluncuran Koleksi</h2>
<p>Semeru Collection akan diluncurkan secara resmi pada Maret 2026. Pre-order sudah bisa dilakukan mulai sekarang dengan deposit 30%. Hubungi kami via WhatsApp untuk informasi lebih lanjut.</p>
`,
    },
];

// ─── SEEDER RUNNER ────────────────────────────────────────────────────────────

async function main() {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log('✅ Connected!');

    console.log('\n🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await Article.deleteMany({});
    await Category.deleteMany({});
    console.log('✅ Cleared: Products, Articles, Categories');

    console.log('\n🌱 Seeding Categories...');
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ Inserted ${insertedCategories.length} categories`);

    console.log('\n🌱 Seeding Products...');
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Inserted ${insertedProducts.length} products`);
    insertedProducts.forEach(p => console.log(`   - [${p.code}] ${p.name} | ${p.media.length} media`));

    console.log('\n🌱 Seeding Articles...');
    const insertedArticles = await Article.insertMany(articles);
    console.log(`✅ Inserted ${insertedArticles.length} articles`);
    insertedArticles.forEach(a => console.log(`   - [${a.status}] ${a.title}`));

    console.log('\n\n✨ Seeding complete!');
    console.log(`   Categories : ${insertedCategories.length}`);
    console.log(`   Products   : ${insertedProducts.length} (masing-masing 8 media)`);
    console.log(`   Articles   : ${insertedArticles.length}`);

    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error('❌ Seeder error:', err);
    mongoose.disconnect();
    process.exit(1);
});
