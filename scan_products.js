const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'public', 'uploads', 'products');
const categories = {
    '11': 'Meja',
    '21': 'Kursi',
    '22': 'Bench',
    '23': 'Stool'
};

const materials = {
    'W': 'Wood',
    'I': 'Iron',
    'WI': 'Wood & Iron'
};

const products = [];

if (fs.existsSync(baseDir)) {
    const materialFolders = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

    materialFolders.forEach(mFolder => {
        const fullMPath = path.join(baseDir, mFolder);
        const skuFolders = fs.readdirSync(fullMPath).filter(f => fs.statSync(path.join(fullMPath, f)).isDirectory());

        skuFolders.forEach(sku => {
            const skuPath = path.join(fullMPath, sku);
            const files = fs.readdirSync(skuPath).filter(f => fs.statSync(path.join(skuPath, f)).isFile());

            const parts = sku.split('-');
            const matCode = parts[0];
            const catCode = parts[1] ? parts[1].substring(0, 2) : '21';

            const category = categories[catCode] || 'Kursi';
            const material = materials[matCode] || 'Wood';

            const media = files.map(f => `/uploads/products/${mFolder}/${sku}/${f}`);

            products.push({
                code: sku,
                name: `${material} ${category} ${sku.split('-')[1] || ''}`,
                slug: `${category.toLowerCase()}-${material.toLowerCase()}-${sku}`.replace(/\s+/g, '-'),
                category: category,
                collection: 'Atmosphere Minimalist',
                price: 1500000 + (Math.floor(Math.random() * 20) * 100000),
                stock: 10 + Math.floor(Math.random() * 20),
                status: 'In Stock',
                media: media,
                mainMediaIndex: 0,
                description: `Elegansi ${material} dalam desain ${category} yang fungsional. Sangat cocok untuk memperindah ruangan Anda dengan sentuhan modern namun alami.`,
                specifications: [
                    { label: 'Material', value: material },
                    { label: 'Finish', value: 'Natural Semi-Gloss' },
                    { label: 'Handicraft', value: 'Yes' }
                ],
                dimensions: { length: 50, width: 50, height: 75, unit: 'cm' },
                weight: { value: 5, unit: 'kg' },
                delivery: 'Siap kirim dalam 2-3 hari kerja.'
            });
        });
    });
}

console.log(JSON.stringify(products, null, 2));
