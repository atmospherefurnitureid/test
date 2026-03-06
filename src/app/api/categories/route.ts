import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Category } from '@/models/Schemas';
import { verifyAuthFromRequest } from '@/lib/authGuard';

export async function GET() {
    // GET is public — needed for public article filters/listing

    try {
        await dbConnect();
        const categories = await Category.find({}).sort({ name: 1 });
        return NextResponse.json(categories);
    } catch {
        return NextResponse.json({ error: "Failed to fetch categories." }, { status: 500 });
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
        const { name } = await request.json();
        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return NextResponse.json({ error: "Category name is required." }, { status: 400 });
        }
        const category = await Category.create({ name: name.trim().slice(0, 100) });
        return NextResponse.json(category, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create category." }, { status: 400 });
    }
}
