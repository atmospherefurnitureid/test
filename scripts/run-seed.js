/**
 * Seeder: Atmosphere Furniture Indonesia
 * Run: npm run seed
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI tidak ditemukan di .env!');
    process.exit(1);
}

const now = new Date();

const categories = [
    { name: 'Kursi' }, { name: 'Meja' }, { name: 'Lemari' },
    { name: 'Rak' }, { name: 'Bangku' }, { name: 'Stool' },
];

const products = [
    {
        code: 'KJS-001', name: 'Kursi Jati Semeru — Minimalist Wood Chair',
        label: 'Kayu', category: 'Kursi', collection: 'Semeru Collection',
        price: 1850000, memberPrice: 1655000, stock: 12, status: 'In Stock', rating: 4.8,
        media: [
            'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1200'
        ],
        mainMediaIndex: 0, delivery: 'Dikirim dalam 3-5 hari kerja',
        description: 'Kursi makan minimalis dengan desain pegunungan yang ikonik. Terbuat dari kayu jati solid pilihan dengan finishing natural oil.',
        specifications: [{ key: 'Material', value: 'Kayu Jati Solid TPK' }, { key: 'Finishing', value: 'Natural Teak Oil' }],
        variations: [{ name: 'Warna', options: ['Natural', 'Dark Walnut', 'Bleached'] }],
        dimensions: { product: '45 x 50 x 85 cm', weight: '8 kg', packaged: '50 x 55 x 90 cm' },
        fabric: 'Solid Wood', returns: 'Dapat dikembalikan jika tidak sesuai deskripsi',
        additionalInfo: { warranty: '2 Tahun Struktur', production: '14 hari kerja', shipping: '', care: 'Bersihkan dengan kain microfiber.' },
        createdAt: now, updatedAt: now
    },
    {
        code: 'MJB-002', name: 'Meja Kerja Bromo — Industrial Steel Table',
        label: 'Besi', category: 'Meja', collection: 'Industrial Series',
        price: 3450000, memberPrice: 3200000, stock: 5, status: 'Pre-order', rating: 4.9,
        media: [
            'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1200'
        ],
        mainMediaIndex: 0, delivery: 'Pre-order: 21 hari kerja',
        description: 'Meja kerja industrial dengan rangka besi hollow tebal dan top table kayu akasia. Cocok untuk office maupun home studio.',
        specifications: [{ key: 'Frame', value: 'Hollow Steel 4x4 (Powder Coated)' }, { key: 'Top Table', value: 'Kayu Akasia Solid 3cm' }],
        variations: [],
        dimensions: { product: '120 x 60 x 75 cm', weight: '24 kg', packaged: '125 x 65 x 15 cm' },
        fabric: 'Steel & Wood', returns: 'Dapat dikembalikan jika tidak sesuai deskripsi',
        additionalInfo: { warranty: '5 Tahun Anti Karat', production: '21 hari kerja', shipping: '', care: 'Lap dengan kain kering.' },
        createdAt: now, updatedAt: now
    },
    {
        code: 'LMK-003', name: 'Lemari Kerajinan Ijen — Craft Storage',
        label: 'Mixed', category: 'Lemari', collection: 'Artisan Collection',
        price: 5200000, memberPrice: 4850000, stock: 3, status: 'In Stock', rating: 4.7,
        media: [
            'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1594420310237-775791e3e783?auto=format&fit=crop&q=80&w=1200'
        ],
        mainMediaIndex: 0, delivery: 'Dikirim dalam 5-7 hari kerja',
        description: 'Lemari yang memadukan kehangatan kayu jati dengan aksen anyaman rotan pada pintu.',
        specifications: [{ key: 'Body', value: 'Kayu Jati Grade A' }, { key: 'Pintu', value: 'Natural Rattan Inset' }],
        variations: [],
        dimensions: { product: '80 x 40 x 160 cm', weight: '45 kg', packaged: '85 x 45 x 165 cm' },
        fabric: 'Rattan & Wood', returns: 'Dapat dikembalikan jika tidak sesuai deskripsi',
        additionalInfo: { warranty: '1 Tahun', production: '14 hari kerja', shipping: '', care: 'Hindari tempat lembab.' },
        createdAt: now, updatedAt: now
    },
    {
        code: 'RKM-004', name: 'Rak Minimalis Merbabu — Modular Shelf',
        label: 'Mixed', category: 'Rak', collection: 'Modular System',
        price: 2150000, memberPrice: 1950000, stock: 20, status: 'In Stock', rating: 4.6,
        media: [
            'https://images.unsplash.com/photo-1594620302200-9a7622d4a137?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=1200'
        ],
        mainMediaIndex: 0, delivery: 'Dikirim dalam 3-5 hari kerja',
        description: 'Rak modular serbaguna yang dapat disusun sesuai kebutuhan. Rangka besi ringan dengan ambalan kayu mahoni.',
        specifications: [{ key: 'Shelf', value: 'Kayu Mahoni Oven' }, { key: 'Frame', value: 'Iron Round Bar' }],
        variations: [],
        dimensions: { product: '100 x 30 x 120 cm', weight: '15 kg', packaged: '105 x 35 x 20 cm' },
        fabric: 'Wood & Iron', returns: 'Dapat dikembalikan jika tidak sesuai deskripsi',
        additionalInfo: { warranty: '1 Tahun', production: '14 hari kerja', shipping: '', care: 'Lap dengan kain kering.' },
        createdAt: now, updatedAt: now
    },
    {
        code: 'STR-005', name: 'Stool Etnik Rinjani — Round Seat',
        label: 'Kayu', category: 'Stool', collection: 'Rinjani Series',
        price: 950000, memberPrice: 850000, stock: 15, status: 'Low Stock', rating: 4.8,
        media: [
            'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1502472545332-e24172e7009a?auto=format&fit=crop&q=80&w=1200'
        ],
        mainMediaIndex: 0, delivery: 'Dikirim dalam 3-5 hari kerja',
        description: 'Stool bundar minimalis yang terinspirasi dari kearifan lokal. Kokoh dan stabil.',
        specifications: [{ key: 'Material', value: 'Kayu Jati Perhutani' }, { key: 'Joinery', value: 'Dovetail' }],
        variations: [],
        dimensions: { product: 'Dia. 35 x 45 cm', weight: '5 kg', packaged: '38 x 38 x 48 cm' },
        fabric: 'Solid Wood', returns: 'Dapat dikembalikan jika tidak sesuai deskripsi',
        additionalInfo: { warranty: '2 Tahun', production: '14 hari kerja', shipping: '', care: 'Bersihkan dengan kain kering.' },
        createdAt: now, updatedAt: now
    },
    {
        code: 'BTM-006', name: 'Bangku Taman Merapi — Outdoor Bench',
        label: 'Besi', category: 'Bangku', collection: 'Outdoor Living',
        price: 2850000, memberPrice: 2600000, stock: 0, status: 'Pre-order', rating: 4.7,
        media: [
            'https://images.unsplash.com/photo-1504933350103-e840ede978d4?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1549497538-30622842e624?auto=format&fit=crop&q=80&w=1200'
        ],
        mainMediaIndex: 0, delivery: 'Pre-order: 30 hari kerja',
        description: 'Bangku taman besi tempa dengan cat anti-UV. Tidak akan luntur di bawah terik matahari Indonesia.',
        specifications: [{ key: 'Finish', value: 'Outdoor Powder Coating' }, { key: 'UV Protect', value: 'Yes' }],
        variations: [],
        dimensions: { product: '150 x 50 x 70 cm', weight: '30 kg', packaged: '155 x 55 x 75 cm' },
        fabric: 'Wrought Iron', returns: 'Dapat dikembalikan jika tidak sesuai deskripsi',
        additionalInfo: { warranty: '10 Tahun Anti Karat', production: '30 hari kerja', shipping: '', care: 'Oleskan anti-rust oil setahun sekali.' },
        createdAt: now, updatedAt: now
    },
];

const articles = [
    {
        title: 'Mengenal Keunggulan Furnitur Besi Tempa untuk Hunian Modern',
        description: 'Furnitur besi tempa bukan sekadar pilihan gaya — ia adalah investasi jangka panjang.',
        image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=1200',
        category: 'Material & Teknik', author: 'Tim Atmosphere', date: 'Maret 5, 2026',
        featured: true, status: 'Published', tags: ['besi tempa', 'furnitur industrial'],
        content: '<h2>Mengapa Besi Tempa Menjadi Pilihan Utama?</h2><p>Besi tempa telah digunakan selama berabad-abad dalam pembuatan furnitur.</p>',
        createdAt: now, updatedAt: now
    },
    {
        title: 'Panduan Lengkap Memilih Kayu untuk Furnitur Custom Anda',
        description: 'Tidak semua kayu diciptakan sama. Panduan ini membantu Anda memahami perbedaan jenis kayu.',
        image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=1200',
        category: 'Panduan Pembelian', author: 'Tim Atmosphere', date: 'Februari 28, 2026',
        featured: true, status: 'Published', tags: ['kayu jati', 'panduan'],
        content: '<h2>Mengenal Jenis Kayu untuk Furnitur</h2><p>Pemilihan kayu yang tepat adalah fondasi dari furnitur berkualitas.</p>',
        createdAt: now, updatedAt: now
    },
    {
        title: '7 Tren Desain Interior 2026 yang Wajib Anda Ketahui',
        description: 'Inilah 7 tren dominan di 2026 yang diprediksi para desainer terkemuka global.',
        image: 'https://images.unsplash.com/photo-1492656975733-cfd6a6a0f70a?auto=format&fit=crop&q=80&w=1200',
        category: 'Tren Desain', author: 'Tim Atmosphere', date: 'Februari 20, 2026',
        featured: false, status: 'Published', tags: ['tren desain', 'interior 2026'],
        content: '<h2>Tren Interior 2026</h2><p>Tahun 2026 ditandai kebangkitan material alami berpadu estetika yang lebih manusiawi.</p>',
        createdAt: now, updatedAt: now
    },
    {
        title: 'Cara Merawat Furnitur Kayu Agar Tahan Puluhan Tahun',
        description: 'Teknik perawatan yang tepat dari para ahli untuk menjaga keindahan furnitur kayu.',
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1200',
        category: 'Perawatan & Tips', author: 'Tim Atmosphere', date: 'Februari 12, 2026',
        featured: false, status: 'Published', tags: ['perawatan', 'tips'],
        content: '<h2>Investasi yang Tepat Butuh Perawatan yang Tepat</h2><p>Furnitur kayu solid bisa bertahan puluhan tahun jika dirawat dengan benar.</p>',
        createdAt: now, updatedAt: now
    },
    {
        title: 'Proses Produksi Furnitur Besi: Dari Bahan Mentah ke Karya Seni',
        description: 'Inside tour eksklusif workshop Atmosphere. Dari billet besi hingga menjadi karya indoor.',
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1200',
        category: 'Behind The Scenes', author: 'Tim Atmosphere', date: 'Januari 28, 2026',
        featured: false, status: 'Published', tags: ['proses produksi', 'workshop'],
        content: '<h2>Dari Billet Besi Menuju Karya Seni</h2><p>Setiap furnitur dari Atmosphere adalah hasil ratusan jam kerja tangan terampil.</p>',
        createdAt: now, updatedAt: now
    },
    {
        title: 'Gunung & Furnitur: Inspirasi Desain dari Alam Pegunungan Indonesia',
        description: 'Keindahan pegunungan Jawa termanifestasi dalam koleksi terbaru Atmosphere.',
        image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200',
        category: 'Inspirasi & Sketsa', author: 'Tim Atmosphere', date: 'Januari 15, 2026',
        featured: false, status: 'Published', tags: ['inspirasi', 'alam', 'indonesia'],
        content: '<h2>Ketika Gunung Berbicara dalam Bahasa Furnitur</h2><p>Gunung Semeru menjadi inspirasi utama koleksi terbaru kami.</p>',
        createdAt: now, updatedAt: now
    },
];

// ─── RUNNER ──────────────────────────────────────────────────────────────────

async function main() {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    const db = mongoose.connection.db;
    console.log(`✅ Connected to database: "${mongoose.connection.name}"\n`);

    // Use raw MongoDB driver to bypass ALL Mongoose schema validation
    console.log('🗑️  Clearing existing data...');
    await db.collection('products').deleteMany({});
    await db.collection('articles').deleteMany({});
    await db.collection('categories').deleteMany({});
    console.log('✅ Cleared: Products, Articles, Categories\n');

    console.log('🌱 Seeding Categories...');
    const catResult = await db.collection('categories').insertMany(categories);
    console.log(`✅ ${catResult.insertedCount} categories inserted\n`);

    console.log('🌱 Seeding Products...');
    const prodResult = await db.collection('products').insertMany(products);
    console.log(`✅ ${prodResult.insertedCount} products inserted\n`);
    products.forEach(p => console.log(`   ✓ [${p.code}] ${p.name}`));

    console.log('\n🌱 Seeding Articles...');
    const artResult = await db.collection('articles').insertMany(articles);
    console.log(`✅ ${artResult.insertedCount} articles inserted\n`);

    console.log('─'.repeat(50));
    console.log(`✨ Seeding complete!`);
    console.log(`   Categories : ${catResult.insertedCount}`);
    console.log(`   Products   : ${prodResult.insertedCount}`);
    console.log(`   Articles   : ${artResult.insertedCount}`);

    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error('\n❌ Error:', err.message);
    mongoose.disconnect();
    process.exit(1);
});
