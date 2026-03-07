import { NextResponse } from 'next/server';

export async function POST() {
    const res = NextResponse.json({ success: true, message: "Logged out" });

    const domain = process.env.NODE_ENV === 'production'
        ? `.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'atmospherefurnitureid.com'}`
        : undefined;

    // Hapus token dengan expired cookie
    res.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
        domain,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    return res;
}
