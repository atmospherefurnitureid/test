import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env"
    );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        console.log("🛠️ [Database] Using cached connection.");
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, // Fail fast after 5 seconds
            heartbeatFrequencyMS: 10000,
            socketTimeoutMS: 45000,
            family: 4 // Force IPv4 to avoid potential IPv6 resolution issues
        };

        console.log("🛠️ [Database] Creating new connection to MongoDB Atlas...");
        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            console.log("✅ [Database] Connection established successfully!");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error("❌ [Database] Connection failed:", e);
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
