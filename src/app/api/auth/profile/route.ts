import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import { User } from '@/models/Schemas';
import { verifyAuthFromRequest } from '@/lib/authGuard';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request: NextRequest) {
    const auth = await verifyAuthFromRequest(request);
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    try {
        await dbConnect();
        const user = await User.findById(auth.id).select("-password");
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error) {
        console.error("API GET Profile Error:", error);
        return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const auth = await verifyAuthFromRequest(request);
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await request.json();
        const { username, email, currentPassword, newPassword } = body;

        const user = await User.findById(auth.id);
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        // If password update is requested
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: "Current password is required to set a new password." }, { status: 400 });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
            }
            user.password = await bcrypt.hash(newPassword, 12);
        }

        const oldUsername = user.username;
        if (username) user.username = username;
        if (email !== undefined) user.email = email;

        await user.save();

        // If username changed, update cookie
        if (username && username !== oldUsername && JWT_SECRET) {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const token = await new SignJWT({
                id: user._id.toString(),
                username: user.username,
                role: user.role
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('1d')
                .sign(secret);

            const cookieStore = await cookies();
            const domain = process.env.NODE_ENV === 'production'
                ? `.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'atmospherefurnitureid.com'}`
                : undefined;

            cookieStore.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                domain,
                maxAge: 60 * 60 * 24
            });
        }

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully.",
            user: { username: user.username, email: user.email, role: user.role }
        });
    } catch (error: any) {
        console.error("API PUT Profile Error:", error);
        if (error.code === 11000) {
            return NextResponse.json({ error: "Username already taken." }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to update profile." }, { status: 400 });
    }
}
