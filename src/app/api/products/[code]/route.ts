import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Schemas';
import { verifyAuthFromRequest } from '@/lib/authGuard';
import { deleteUploadedFiles } from '@/lib/file-utils';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    // GET is public
    const { code } = await params;
    try {
        await dbConnect();
        const product = await Product.findOne({ code });
        if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
        return NextResponse.json(product);
    } catch {
        return NextResponse.json({ error: "Failed to fetch product." }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    const auth = await verifyAuthFromRequest(request);
    if (!auth) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { code } = await params;
    try {
        await dbConnect();
        const body = await request.json();

        // Fetch old product for media comparison
        const oldProduct = await Product.findOne({ code });
        if (!oldProduct) return NextResponse.json({ error: "Product not found." }, { status: 404 });

        const product = await Product.findOneAndUpdate({ code }, body, { new: true });

        // Clean up orphaned media files
        if (oldProduct.media && oldProduct.media.length > 0) {
            const newMediaList = product.media || [];
            const orphanedMedia = oldProduct.media.filter((m: string) => !newMediaList.includes(m));
            if (orphanedMedia.length > 0) {
                await deleteUploadedFiles(orphanedMedia);
            }
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("Update product error:", error);
        return NextResponse.json({ error: "Failed to update product." }, { status: 400 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    const auth = await verifyAuthFromRequest(request);
    if (!auth) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { code } = await params;
    try {
        await dbConnect();
        const product = await Product.findOneAndDelete({ code });
        if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

        // Clean up associated media files
        if (product.media && product.media.length > 0) {
            await deleteUploadedFiles(product.media);
        }

        return NextResponse.json({ message: "Product deleted successfully." });
    } catch (error) {
        console.error("Delete product error:", error);
        return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
    }
}
