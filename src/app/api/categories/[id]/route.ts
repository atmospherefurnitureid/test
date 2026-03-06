import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Category, Article } from '@/models/Schemas';
import { verifyAuthFromRequest } from '@/lib/authGuard';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await verifyAuthFromRequest(request);
    if (!auth) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { id } = await params;
    try {
        await dbConnect();

        const category = await Category.findById(id);
        if (!category) {
            return NextResponse.json({ error: "Kategori tidak ditemukan." }, { status: 404 });
        }

        const isUsed = await Article.exists({ category: category.name });
        if (isUsed) {
            return NextResponse.json({ error: "Kategori sedang dipakai dan tidak bisa dihapus." }, { status: 400 });
        }

        await Category.findByIdAndDelete(id);
        return NextResponse.json({ message: "Kategori berhasil dihapus." });
    } catch {
        return NextResponse.json({ error: "Failed to delete category." }, { status: 500 });
    }
}
