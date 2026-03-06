import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Article } from '@/models/Schemas';
import { verifyAuthFromRequest } from '@/lib/authGuard';
import { deleteUploadedFile } from '@/lib/file-utils';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await dbConnect();
        const article = await Article.findById(id);
        if (!article) return NextResponse.json({ error: "Article not found." }, { status: 404 });
        return NextResponse.json(article);
    } catch {
        return NextResponse.json({ error: "Failed to fetch article." }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await verifyAuthFromRequest(request);
    if (!auth) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { id } = await params;
    try {
        await dbConnect();
        const body = await request.json();

        // Fetch old article to check for image changes
        const oldArticle = await Article.findById(id);
        if (!oldArticle) return NextResponse.json({ error: "Article not found." }, { status: 404 });

        const article = await Article.findByIdAndUpdate(id, body, { new: true });

        // If image has changed, delete the old file
        if (oldArticle.image && oldArticle.image !== article.image) {
            await deleteUploadedFile(oldArticle.image);
        }

        return NextResponse.json(article);
    } catch (error) {
        console.error("Update article error:", error);
        return NextResponse.json({ error: "Failed to update article." }, { status: 400 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await verifyAuthFromRequest(request);
    if (!auth) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { id } = await params;
    try {
        await dbConnect();
        const article = await Article.findByIdAndDelete(id);
        if (!article) return NextResponse.json({ error: "Article not found." }, { status: 404 });

        // Clean up associated image file
        if (article.image) {
            await deleteUploadedFile(article.image);
        }

        return NextResponse.json({ message: "Article deleted successfully." });
    } catch (error) {
        console.error("Delete article error:", error);
        return NextResponse.json({ error: "Failed to delete article." }, { status: 500 });
    }
}
