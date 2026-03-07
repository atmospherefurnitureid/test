/**
 * Product Seeder based on local folders
 * Run: node scripts/seed-products.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI tidak ditemukan di .env!');
    process.exit(1);
}

// --- SCHEMAS (Simplified for seeder to avoid import issues with Next.js/Mongoose) ---
const ProductSpecSchema = new mongoose.Schema({
    key: { type: String, required: true },
    value: { type: String, required: true }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    label: { type: String, enum: ["Kayu", "Besi", "Mixed"], required: true },
    category: { type: String, required: true },
    collection: { type: String, required: true },
    price: { type: Number, required: true },
    memberPrice: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    status: { type: String, enum: ["In Stock", "Low Stock", "Out of Stock", "Pre-order"], required: true },
    media: [{ type: String }],
    mainMediaIndex: { type: Number, default: 0 },
    delivery: { type: String, default: "" },
    description: { type: String, default: "" },
    specifications: { type: [ProductSpecSchema], default: [] },
    dimensions: {
        product: { type: String, default: "-" },
        weight: { type: String, default: "-" },
        packaged: { type: String, default: "-" }
    },
    fabric: { type: String, default: "-" },
    additionalInfo: {
        warranty: { type: String, default: "1 Tahun" },
        production: { type: String, default: "14 hari kerja" },
        care: { type: String, default: "Bersihkan dengan kain setengah basah" }
    }
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const productCategories = {
    '11': 'Meja',
    '21': 'Kursi',
    '22': 'Bench',
    '23': 'Stool'
};

const materialLabels = {
    'W': 'Kayu',
    'I': 'Besi',
    'WI': 'Mixed'
};

const materials = {
    'W': 'Wood',
    'I': 'Iron',
    'WI': 'Wood & Iron'
};

const baseDir = path.join(process.cwd(), 'public', 'uploads', 'products');

async function main() {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!\n');

    console.log('🔍 Scanning folders at:', baseDir);
    const productsToInsert = [];
    const uniqueCategories = new Set();

    if (fs.existsSync(baseDir)) {
        const materialFolders = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

        materialFolders.forEach(mFolder => {
            const fullMPath = path.join(baseDir, mFolder);
            const skuFolders = fs.readdirSync(fullMPath).filter(f => fs.statSync(path.join(fullMPath, f)).isDirectory());

            skuFolders.forEach(sku => {
                const skuPath = path.join(fullMPath, sku);
                const files = fs.readdirSync(skuPath).filter(f => fs.statSync(path.join(skuPath, f)).isFile());

                // Decode SKU structure
                const parts = sku.split('-');
                const matCode = parts[0];
                const catCode = parts[1] ? parts[1].substring(0, 2) : '21';

                const category = productCategories[catCode] || 'Kursi';
                const materialLabel = materialLabels[matCode] || 'Kayu';
                const materialName = materials[matCode] || 'Wood';

                const media = files.map(f => `/uploads/products/${mFolder}/${sku}/${f}`);
                uniqueCategories.add(category);

                const price = 850000 + (Math.floor(Math.random() * 30) * 50000);

                productsToInsert.push({
                    code: sku,
                    name: `${materialName} ${category} ${parts[1] || ''}`,
                    label: materialLabel,
                    category: category,
                    collection: 'Atmosphere Collection',
                    price: price,
                    memberPrice: price - 100000,
                    stock: 5 + Math.floor(Math.random() * 15),
                    status: 'In Stock',
                    media: media,
                    mainMediaIndex: 0,
                    description: `${materialName} ${category} dengan kualitas premium. Dibuat oleh pengrajin lokal berpengalaman untuk keindahan interior hunian Anda.`,
                    specifications: [
                        { key: 'Material', value: materialName },
                        { key: 'Handmade', value: 'Ya' },
                        { key: 'Origin', value: 'Indonesia' }
                    ],
                    dimensions: {
                        product: "50 x 50 x 85 cm",
                        weight: "7 kg",
                        packaged: "55 x 55 x 90 cm"
                    },
                    fabric: "N/A",
                    additionalInfo: {
                        warranty: "Garansi struktur 1 tahun",
                        production: "7-14 hari kerja",
                        care: "Hindari paparan sinar matahari langsung dalam waktu lama"
                    }
                });
            });
        });
    } else {
        console.error('❌ Folder uploads tidak ditemukan!');
        process.exit(1);
    }

    console.log(`🚀 Found ${productsToInsert.length} products to seed.\n`);

    console.log('🗑️  Clearing old products and categories...');
    await Product.deleteMany({});
    // We keep articles and other data as is, only products and categories related to them.
    await Category.deleteMany({});
    console.log('✅ Cleared.\n');

    console.log('🌱 Inserting categories...');
    const categoryDocs = Array.from(uniqueCategories).map(name => ({ name }));
    await Category.insertMany(categoryDocs);
    console.log(`✅ ${categoryDocs.length} categories inserted.\n`);

    console.log('🌱 Inserting products...');
    const result = await Product.insertMany(productsToInsert);
    console.log(`✅ ${result.length} products inserted successfully!`);

    result.forEach(p => console.log(`   ✓ [${p.code}] ${p.name}`));

    console.log('\n✨ Seeding complete!');
    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error('\n❌ Error:', err);
    mongoose.disconnect();
    process.exit(1);
});
