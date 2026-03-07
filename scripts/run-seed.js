/**
 * Seeder: Atmosphere Furniture Indonesia
 * Run: npm run seed
 *
 * Hasil seed:
 * - 6 Categories
 * - 6 Products (masing-masing 8 media dari Unsplash)
 * - 6 Articles (full HTML content, tags, status Published)
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI tidak ditemukan di .env!');
    process.exit(1);
}

// ─── SCHEMAS ─────────────────────────────────────────────────────────────────

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
    specifications: [{ key: String, value: String, _id: false }],
    variations: [{ name: String, options: [String], _id: false }],
    dimensions: { product: String, weight: String, packaged: String, _id: false },
    fabric: { type: String, required: true },
    returns: { type: String, default: 'Dapat dikembalikan jika tidak sesuai dengan deskripsi' },
    additionalInfo: {
        warranty: String,
        production: { type: String, default: '14 hari kerja' },
        shipping: { type: String, default: '' },
        care: String,
        _id: false,
    },
}, { timestamps: true });

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

// ─── DATA ────────────────────────────────────────────────────────────────────

const categories = [
    { name: 'Kursi' }, { name: 'Meja' }, { name: 'Lemari' },
    { name: 'Rak' }, { name: 'Bangku' }, { name: 'Stool' },
];

const products = [];
const articles = [
    {
        title: 'Mengenal Keunggulan Furnitur Besi Tempa untuk Hunian Modern',
        description: 'Furnitur besi tempa bukan sekadar pilihan gaya — ia adalah investasi jangka panjang. Pelajari keunggulan teknis dan estetika yang membuatnya semakin populer di kalangan desainer interior.',
        image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=1200',
        category: 'Material & Teknik',
        author: 'Tim Atmosphere',
        date: 'Maret 5, 2026',
        featured: true, status: 'Published',
        tags: ['besi tempa', 'furnitur industrial', 'desain interior', 'material'],
        content: `<h2>Mengapa Besi Tempa Menjadi Pilihan Utama?</h2><p>Besi tempa (wrought iron) telah digunakan selama berabad-abad dalam pembuatan furnitur dan dekorasi. Berbeda dengan cast iron (besi cor), besi tempa memiliki kandungan karbon yang sangat rendah sehingga bersifat lebih lentur, kuat tarik tinggi, dan tahan terhadap karat alami.</p><h2>Keunggulan Teknis</h2><ul><li><strong>Kekuatan Superior:</strong> Tensile strength jauh lebih tinggi dibanding besi cor.</li><li><strong>Fleksibilitas Desain:</strong> Memungkinkan pengrajin menciptakan bentuk organik dan ornamen rumit.</li><li><strong>Daya Tahan Luar Biasa:</strong> Dengan perawatan minimal, dapat bertahan 50+ tahun.</li><li><strong>Ramah Lingkungan:</strong> 100% dapat didaur ulang tanpa kehilangan kualitas.</li></ul><h2>Perawatan Furnitur Besi</h2><p>Bersihkan secara rutin dengan kain kering. Aplikasikan wax berbasis minyak setiap 6 bulan untuk melindungi dari oksidasi.</p><blockquote><p>"Furnitur besi yang dirawat dengan baik makin indah seiring waktu." — Will Jones, Founder</p></blockquote>`,
    },
    {
        title: 'Panduan Lengkap Memilih Kayu untuk Furnitur Custom Anda',
        description: 'Tidak semua kayu diciptakan sama. Panduan ini membantu Anda memahami perbedaan jenis kayu dan mana yang paling cocok untuk kebutuhan furnitur Anda.',
        image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=1200',
        category: 'Panduan Pembelian',
        author: 'Tim Atmosphere',
        date: 'Februari 28, 2026',
        featured: true, status: 'Published',
        tags: ['kayu jati', 'kayu mahoni', 'kayu akasia', 'panduan', 'furnitur kayu'],
        content: `<h2>Mengenal Jenis Kayu untuk Furnitur</h2><p>Pemilihan kayu yang tepat adalah fondasi dari furnitur berkualitas. Setiap jenis kayu memiliki karakteristik unik dari kekerasan, pola serat, warna alami, hingga kemampuan menyerap finishing.</p><h2>1. Kayu Jati (Teak)</h2><p>Raja dari semua kayu furnitur. Kandungan minyak alami tinggi membuatnya tahan air, rayap, dan jamur secara inheren. <strong>Terbaik untuk:</strong> Meja makan, lemari, furnitur outdoor.</p><h2>2. Kayu Mahoni</h2><p>Pilihan premium dengan harga lebih terjangkau dari jati. Serat lurus dan halus dengan warna kemerahan khas yang semakin indah seiring waktu. <strong>Terbaik untuk:</strong> Kursi, meja kerja, rak.</p><h2>3. Kayu Akasia</h2><p>Kayu lokal yang underrated namun luar biasa. Serat dinamis dengan gradasi warna natural yang sangat indah.</p><h2>4. Kayu Ulin (Ironwood)</h2><p>Kayu terkeras dari Kalimantan. Mampu bertahan ratusan tahun bahkan dalam kondisi outdoor ekstrem. <strong>Terbaik untuk:</strong> Bangku taman, deck, furnitur outdoor berat.</p>`,
    },
    {
        title: '7 Tren Desain Interior 2026 yang Wajib Anda Ketahui',
        description: 'Dunia desain interior terus berevolusi. Inilah 7 tren dominan di 2026 yang diprediksi para desainer terkemuka global.',
        image: 'https://images.unsplash.com/photo-1492656975733-cfd6a6a0f70a?auto=format&fit=crop&q=80&w=1200',
        category: 'Tren Desain',
        author: 'Tim Atmosphere',
        date: 'Februari 20, 2026',
        featured: false, status: 'Published',
        tags: ['tren desain', 'interior 2026', 'desain rumah', 'inspirasi'],
        content: `<h2>Tren Interior 2026: Humanistic Design Bertemu Teknologi</h2><p>Tahun 2026 ditandai kebangkitan material alami berpadu estetika yang lebih "manusiawi". Pergeseran dari interior sangat steril ke ruangan yang terasa hangat, autentik, dan personal.</p><h2>1. Japandi Evolved</h2><p>Japandi versi 2026 lebih berani mengintegrasikan elemen material kasar seperti tembok batu dan besi hitam matte berpadu tekstur linen natural.</p><h2>2. Curved Furniture Dominates</h2><p>Sofa bundar, meja oval, lemari dengan sudut membulat mendominasi showroom global. Garis lurus sudah terlalu kaku.</p><h2>3. Biophilic Design 2.0</h2><p>Material alami mentah — kayu tidak diamplas halus, batu alam, rotan — sebagai elemen desain utama.</p><h2>4. Multifunctional Furniture</h2><p>Dengan meningkatnya WFH dan apartemen compact, furnitur multifungsi menjadi keharusan.</p><h2>5. Dark Moody Palettes</h2><p>Deep forest green, charcoal, navy, dan burnt terracotta mendominasi. Furnitur besi hitam matte sangat sesuai estetika ini.</p>`,
    },
    {
        title: 'Cara Merawat Furnitur Kayu Agar Tahan Puluhan Tahun',
        description: 'Pelajari teknik perawatan yang tepat dari para ahli Atmosphere untuk menjaga keindahan dan ketahanan furnitur kayu Anda selama puluhan tahun.',
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1200',
        category: 'Perawatan & Tips',
        author: 'Tim Atmosphere',
        date: 'Februari 12, 2026',
        featured: false, status: 'Published',
        tags: ['perawatan furnitur', 'kayu', 'tips', 'maintenance'],
        content: `<h2>Investasi yang Tepat Butuh Perawatan yang Tepat</h2><p>Furnitur kayu solid bukan seperti elektronik yang usang setelah beberapa tahun. Jika dirawat dengan benar, ia bisa bertahan puluhan bahkan ratusan tahun.</p><h2>Rutinitas Harian</h2><ul><li>Lap debu dengan kain microfiber kering setiap hari</li><li>Bersihkan tumpahan segera dengan kain lembab</li><li>Gunakan alas (coaster, placemat) di bawah gelas panas</li></ul><h2>Perawatan Bulanan</h2><p>Aplikasikan furniture wax atau wood conditioner mengikuti arah serat kayu. Produk berbasis beeswax sangat direkomendasikan.</p><h2>Perawatan Tahunan (Deep Care)</h2><ol><li>Gosok permukaan dengan steel wool halus (0000 grade)</li><li>Bersihkan sisa gosok dengan kain lembab</li><li>Biarkan kering 24 jam</li><li>Aplikasikan Danish Oil atau Teak Oil secara merata</li><li>Biarkan curing 72 jam sebelum digunakan</li></ol><h2>Yang Harus Dihindari</h2><ul><li>Paparan matahari langsung dalam waktu lama</li><li>Kelembaban ekstrem atau perubahan suhu mendadak</li><li>Pembersih kimia keras (bleach, ammonia)</li></ul>`,
    },
    {
        title: 'Proses Produksi Furnitur Besi: Dari Bahan Mentah ke Karya Seni',
        description: 'Temukan perjalanan sebuah furnitur besi — dari billet besi mentah hingga menjadi karya yang memperindah ruangan Anda. Inside tour eksklusif workshop Atmosphere.',
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1200',
        category: 'Behind The Scenes',
        author: 'Tim Atmosphere',
        date: 'Januari 28, 2026',
        featured: false, status: 'Published',
        tags: ['proses produksi', 'workshop', 'besi', 'handmade', 'artisan'],
        content: `<h2>Dari Billet Besi Menuju Karya Seni</h2><p>Setiap furnitur besi dari Atmosphere adalah hasil ratusan jam kerja tangan terampil, ketelitian tinggi, dan passion mendalam.</p><h2>Tahap 1: Seleksi Material</h2><p>Kami hanya menggunakan besi dengan spesifikasi tertentu. Tim QC memeriksa setiap batch — mengukur ketebalan, komposisi, dan memastikan tidak ada cacat sebelum produksi.</p><h2>Tahap 2: Pemotongan & Pembentukan</h2><p>Material dipotong menggunakan plasma cutter presisi tinggi untuk akurasi milimeter. Pembentukan dilakukan kombinasi mesin bending dan pengerjaan manual pengrajin berpengalaman.</p><h2>Tahap 3: Pengelasan (Welding)</h2><p>Pengrajin las kami bersertifikasi welding internasional. Setiap sambungan dilas dengan MIG welding untuk kekuatan maksimal, kemudian dihaluskan dengan gerinda.</p><h2>Tahap 4: Powder Coating</h2><p>Powder coat diaplikasikan secara elektrostatis dan di-cure dalam oven 200°C selama 20 menit. Lapisan finishing ultra-durable tahan goresan dan cuaca.</p><h2>Tahap 5: Quality Control</h2><p>Setiap produk jadi melewati 22 titik quality check sebelum dikemas. Termasuk stress test, visual inspection, dan cek dimensional.</p>`,
    },
    {
        title: 'Gunung & Furnitur: Inspirasi Desain dari Alam Pegunungan Indonesia',
        description: 'Alam Indonesia menjadi inspirasi tak habis-habis. Pelajari bagaimana keindahan pegunungan Jawa termanifestasi dalam koleksi terbaru Atmosphere.',
        image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200',
        category: 'Inspirasi & Sketsa',
        author: 'Tim Atmosphere',
        date: 'Januari 15, 2026',
        featured: false, status: 'Published',
        tags: ['inspirasi', 'alam', 'desain', 'koleksi baru', 'indonesia'],
        content: `<h2>Ketika Gunung Berbicara dalam Bahasa Furnitur</h2><p>Gunung Semeru telah menjadi inspirasi utama koleksi terbaru Atmosphere — "Semeru Collection". Tim desainer kami menghabiskan 2 minggu di kaki Semeru untuk menyerap essensi visual dan filosofi alam pegunungan.</p><h2>Filosofi: Kokoh Seperti Gunung</h2><p>Gunung mengajarkan kekuatan yang hadir dalam ketenangan. Semeru Collection mengadopsi filosofi ini — visual sederhana dan tenang, namun secara struktural sangat kuat dan tahan lama.</p><h2>Elemen Visual yang Terinspirasi</h2><ul><li><strong>Siluet Puncak:</strong> Bentuk trapezoid terinspirasi silhuet gunung pada kaki meja dan sandaran kursi</li><li><strong>Tekstur Batu Vulkanik:</strong> Finishing powder coat matte kasar menyerupai permukaan batu basalt</li><li><strong>Palet Warna Alam:</strong> Charcoal, Forest Green, Pumice Gray, Obsidian Black</li></ul><h2>Peluncuran Koleksi</h2><p>Semeru Collection akan meluncur resmi Maret 2026. Pre-order sudah bisa dilakukan dengan deposit 30%. Hubungi kami via WhatsApp untuk informasi lebih lanjut.</p>`,
    },
];

// ─── RUNNER ──────────────────────────────────────────────────────────────────

async function main() {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log('✅ Connected!\n');

    console.log('🗑️  Clearing existing data...');
    await Promise.all([
        Product.deleteMany({}),
        Article.deleteMany({}),
        Category.deleteMany({}),
    ]);
    console.log('✅ Cleared: Products, Articles, Categories\n');

    console.log('🌱 Seeding Categories...');
    const cats = await Category.insertMany(categories);
    console.log(`✅ ${cats.length} categories inserted\n`);

    console.log('🌱 Seeding Products...');
    const prods = await Product.insertMany(products);
    prods.forEach(p => console.log(`   ✓ [${p.code}] ${p.name} — ${p.media.length} media`));
    console.log('');

    console.log('🌱 Seeding Articles...');
    const arts = await Article.insertMany(articles);
    arts.forEach(a => console.log(`   ✓ [${a.status}] ${a.title}`));
    console.log('');

    console.log('─'.repeat(50));
    console.log(`✨ Seeding complete!`);
    console.log(`   Categories : ${cats.length}`);
    console.log(`   Products   : ${prods.length} (masing-masing 8 media)`);
    console.log(`   Articles   : ${arts.length}`);

    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error('\n❌ Error:', err.message);
    mongoose.disconnect();
    process.exit(1);
});
