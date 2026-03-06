import { NextResponse } from 'next/server';

export async function POST() {
    const res = NextResponse.json({ success: true, message: "Logged out" });

    // Hapus token dengan expired cookie
    res.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    return res;
}
