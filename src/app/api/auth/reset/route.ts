import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User, Product, Article, Category, Visitor, Comment } from '@/models/Schemas';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// ⚠️ DEVELOPMENT ONLY — drops all collections and creates a fresh admin
export async function POST(request: NextRequest) {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Forbidden in production." }, { status: 403 });
    }

    try {
        const body = await request.json().catch(() => ({}));
        const newUsername = body.username || "atmosAdmin";
        const newPassword = body.password;

        if (!newPassword || newPassword.length < 8) {
            return NextResponse.json({
                error: "Password harus minimal 8 karakter. Kirim body: { username, password }"
            }, { status: 400 });
        }

        await dbConnect();

        // Drop all application collections (clean slate)
        await Promise.all([
            User.deleteMany({}),
            Product.deleteMany({}),
            Article.deleteMany({}),
            Category.deleteMany({}),
            Visitor.deleteMany({}),
            Comment.deleteMany({}),
        ]);

        // Create new admin user
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const newUser = await User.create({
            username: newUsername.trim(),
            password: hashedPassword,
            role: "admin"
        });

        // Seed default categories
        await Category.insertMany([
            { name: "Furniture" },
            { name: "Besi" },
            { name: "Kayu" },
        ]);

        console.log(`[RESET] Database cleared. New admin: ${newUsername}`);

        return NextResponse.json({
            success: true,
            message: "Database berhasil direset. Semua data lama telah dihapus.",
            admin: {
                username: newUser.username,
                role: newUser.role,
            },
            seeded: ["default categories: Furniture, Besi, Kayu"],
            loginAt: "/login"
        });

    } catch (err: any) {
        console.error("[RESET ERROR]", err);
        return NextResponse.json({ error: "Reset gagal: " + err.message }, { status: 500 });
    }
}
