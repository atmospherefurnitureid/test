import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/Schemas';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}

export async function POST(request: Request) {
    // Rate limiting: max 10 login attempts per IP per minute
    const ip = getClientIp(request);
    const allowed = checkRateLimit(ip, 10, 60_000);
    if (!allowed) {
        return NextResponse.json(
            { error: "Too many login attempts. Please wait a moment and try again." },
            { status: 429 }
        );
    }

    try {
        await dbConnect();
        const body = await request.json().catch(() => null);

        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
        }

        const { username, password } = body;

        // Input validation
        if (!username || !password) {
            return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
        }
        if (typeof username !== "string" || typeof password !== "string") {
            return NextResponse.json({ error: "Invalid input types." }, { status: 400 });
        }
        if (username.length > 100 || password.length > 200) {
            return NextResponse.json({ error: "Input exceeds maximum length." }, { status: 400 });
        }

        // Find user in database
        const user = await User.findOne({ username: username.trim() });
        if (!user) {
            // Generic error to prevent username enumeration
            return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
        }

        // Generate JWT token using jose
        const secret = new TextEncoder().encode(JWT_SECRET);
        const payload = {
            id: user._id.toString(),
            username: user.username,
            role: user.role
        };

        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1d')
            .sign(secret);

        console.log(`[LOGIN] User "${user.username}" authenticated successfully. Setting cookie.`);

        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return NextResponse.json({
            success: true,
            message: "Login successful.",
            user: { username: payload.username, role: payload.role }
        });

    } catch (err: any) {
        console.error("Login API Error:", err);
        // Never expose internal error details to client
        return NextResponse.json({ error: "Authentication failed. Please try again." }, { status: 500 });
    }
}
