import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthPayload {
    id: string;
    username: string;
    role: "admin" | "editor";
}

/**
 * Verifies the JWT token from the request cookie.
 * Returns the decoded payload or null if invalid/missing.
 */
export async function verifyAuthFromRequest(req: NextRequest): Promise<AuthPayload | null> {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token || !JWT_SECRET) return null;

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as AuthPayload;
    } catch {
        return null;
    }
}

/**
 * Checks if the request has admin role.
 */
export async function isAdmin(req: NextRequest): Promise<boolean> {
    const auth = await verifyAuthFromRequest(req);
    return auth?.role === "admin";
}
