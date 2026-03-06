import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Comment } from "@/models/Schemas";
import { verifyAuthFromRequest } from "@/lib/authGuard";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await verifyAuthFromRequest(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { id } = await params;
    try {
        await dbConnect();
        const body = await req.json();
        const updated = await Comment.findByIdAndUpdate(id, body, { new: true });
        if (!updated) return NextResponse.json({ error: "Comment not found." }, { status: 404 });
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: "Failed to update comment." }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await verifyAuthFromRequest(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { id } = await params;
    try {
        await dbConnect();
        const deleted = await Comment.findByIdAndDelete(id);
        if (!deleted) return NextResponse.json({ error: "Comment not found." }, { status: 404 });
        return NextResponse.json({ message: "Comment deleted successfully." });
    } catch {
        return NextResponse.json({ error: "Failed to delete comment." }, { status: 500 });
    }
}
