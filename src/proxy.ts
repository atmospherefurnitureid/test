import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}

/**
 * Public routes that do NOT require authentication.
 * Add paths here that should be accessible without a token.
 */
const PUBLIC_PATHS = [
    "/login",
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/setup",
    "/api/auth/reset",
];

/**
 * API paths where GET is public but mutations require auth.
 * Only the GET method of these paths will be allowed without auth.
 */
const PUBLIC_GET_PATHS = [
    "/api/products",
    "/api/articles",
    "/api/categories",
    "/api/comments",
];

/**
 * API paths where POST is public (e.g. visitor tracker, public comment submit).
 * Only POST on these paths is allowed without auth.
 */
const PUBLIC_POST_PATHS = [
    "/api/visitors",
    "/api/comments",
];

function isPublicPath(pathname: string, method: string): boolean {
    // Exact or prefix public paths
    const isAlwaysPublic = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"));
    if (isAlwaysPublic) return true;

    // GET-only public paths
    if (method === "GET") {
        const isPublicGet = PUBLIC_GET_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"));
        if (isPublicGet) return true;
    }

    // POST-only public paths
    if (method === "POST") {
        const isPublicPost = PUBLIC_POST_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"));
        if (isPublicPost) return true;
    }

    return false;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const method = request.method;

    // Allow all non-dashboard, non-api routes freely (public pages)
    const isDashboard = pathname.startsWith("/dashboard");
    const isApiRoute = pathname.startsWith("/api");

    if (!isDashboard && !isApiRoute) {
        return NextResponse.next();
    }

    // Check if route is explicitly public
    if (isPublicPath(pathname, method)) {
        return NextResponse.next();
    }

    // Log ALL cookies to terminal to debug if 'token' is actually arriving
    const allCookies = request.cookies.getAll().map(c => c.name).join(", ");
    console.log(`[MIDDLEWARE] Path: ${pathname} | Cookies found: [${allCookies}]`);

    const token = request.cookies.get("token")?.value;

    if (!token) {
        console.warn(`[MIDDLEWARE] Redirecting to login: No token cookie found for protected path ${pathname}`);
        if (isApiRoute) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        const secretKey = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secretKey);

        console.log(`[MIDDLEWARE] Token valid for user: ${(payload as any).username}`);
        return NextResponse.next();
    } catch (err: any) {
        console.error(`[MIDDLEWARE] Token invalid for ${pathname}: ${err.message}`);
        if (isApiRoute) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        const res = NextResponse.redirect(loginUrl);
        // Clean bad cookie
        res.cookies.set("token", "", { expires: new Date(0), path: "/" });
        return res;
    }
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/products/:path*",
        "/api/articles/:path*",
        "/api/categories/:path*",
        "/api/comments/:path*",
        "/api/visitors/:path*",
        "/api/upload/:path*",
    ],
};
