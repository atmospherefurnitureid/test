import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Article } from '@/models/Schemas';
import { verifyAuthFromRequest } from '@/lib/authGuard';
import mongoose from 'mongoose';

export async function GET() {
    // GET is public — needed for public article listing
    try {
        await dbConnect();
        const db = mongoose.connection.db!;
        const articles = await db.collection('articles')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();
        return NextResponse.json(articles);
    } catch (error) {
        console.error("API GET Articles Error:", error);
        return NextResponse.json({ error: "Failed to fetch articles." }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    // Auth required
    const auth = verifyAuthFromRequest(request);
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await request.json();
        const article = await Article.create(body);
        return NextResponse.json(article, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create article." }, { status: 400 });
    }
}
