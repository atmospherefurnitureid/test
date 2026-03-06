import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Comment } from "@/models/Schemas";
import { verifyAuthFromRequest } from "@/lib/authGuard";
import { sanitizeString } from "@/lib/sanitize";

export async function GET(request: NextRequest) {
    // If authenticated, return all. If not, only approved.
    const auth = await verifyAuthFromRequest(request);

    try {
        await dbConnect();
        const filter = auth ? {} : { status: "Approved" };
        const comments = await Comment.find(filter).sort({ timestamp: -1 });
        return NextResponse.json(comments);
    } catch (error) {
        console.error("API GET Comments Error:", error);
        return NextResponse.json({ error: "Failed to fetch comments." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    // POST is public — visitors can submit comments from public site
    try {
        await dbConnect();
        const body = await req.json().catch(() => null);

        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
        }

        // Validate required fields
        const { articleId, author, email, content, whatsapp } = body;
        if (!articleId || !author || !email || !content) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }
        if (typeof content !== "string" || content.trim().length === 0) {
            return NextResponse.json({ error: "Comment content is required." }, { status: 400 });
        }

        // Sanitize all string inputs
        const newComment = await Comment.create({
            articleId: sanitizeString(String(articleId), 100),
            author: sanitizeString(String(author), 100),
            email: sanitizeString(String(email), 200),
            whatsapp: whatsapp ? sanitizeString(String(whatsapp), 30) : "",
            content: sanitizeString(String(content), 2000),
            status: "Pending", // Always starts as pending
            timestamp: new Date(),
        });

        return NextResponse.json(newComment, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to submit comment." }, { status: 500 });
    }
}
