const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI not found');
        process.exit(1);
    }
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    const db = mongoose.connection.db;
    console.log('📂 Database name:', mongoose.connection.name);
    
    const collections = await db.listCollections().toArray();
    console.log('📋 Collections:', collections.map(c => c.name));

    for (const coll of collections) {
        const count = await db.collection(coll.name).countDocuments();
        console.log(` - ${coll.name}: ${count} documents`);
        
        if (count > 0) {
            const first = await db.collection(coll.name).findOne();
            console.log(`   Sample from ${coll.name}:`, first?.name || first?.title || first?.id);
        }
    }

    await mongoose.disconnect();
}
check();
