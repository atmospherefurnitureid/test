import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Schemas';
import { verifyAuthFromRequest } from '@/lib/authGuard';
import mongoose from 'mongoose';

export async function GET() {
    // GET is public — accessible from storefront
    try {
        await dbConnect();
        // Use raw driver to avoid Mongoose schema validation mismatch
        const db = mongoose.connection.db!;
        const products = await db.collection('products')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();
        return NextResponse.json(products);
    } catch (err) {
        console.error('GET /api/products error:', err);
        return NextResponse.json({ error: "Failed to fetch products." }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    // Auth required
    const auth = await verifyAuthFromRequest(request);
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await request.json();
        const product = await Product.create(body);
        return NextResponse.json(product, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create product." }, { status: 400 });
    }
}
