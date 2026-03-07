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
const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "atmospherefurnitureid.com";
const ADMIN_DOMAIN = process.env.NEXT_PUBLIC_ADMIN_SUBDOMAIN || "admin.atmospherefurnitureid.com";

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

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const method = request.method;
    const host = request.headers.get("host") || "";
    const hostname = host.split(":")[0]; // Ignore port in dev
    const isDev = hostname === "localhost" || hostname === "127.0.0.1";

    // 1. Static assets & Next.js internals - allow immediately
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/public") ||
        pathname.startsWith("/api/upload") || // Assuming uploads are public or handled separately
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    /**
     * DOMAIN SEPARATION LOGIC (Production Only)
     */
    if (!isDev) {
        // Support with and without 'www'
        const isMainDomain = hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}`;
        const isAdminDomain = hostname === ADMIN_DOMAIN;

        // A. Block Admin Paths on Main Domain — rewrite to built-in 404 page
        if (isMainDomain) {
            if (pathname.startsWith("/dashboard") || pathname.startsWith("/login")) {
                // Rewrite to Next.js native not-found so custom not-found.tsx is rendered.
                // URL in browser stays unchanged (no redirect), status 404 is returned.
                const notFoundUrl = new URL("/_not-found", request.url);
                return NextResponse.rewrite(notFoundUrl, { status: 404 });
            }
        }

        // B. Redirection from Admin Domain to Main Domain
        if (isAdminDomain) {
            // Redirect root to dashboard (safer than rewrite to ensure auth check runs on /dashboard)
            if (pathname === "/") {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }

            const allowedOnAdmin =
                pathname.startsWith("/dashboard") ||
                pathname.startsWith("/login") ||
                pathname.startsWith("/api");

            if (!allowedOnAdmin) {
                const url = new URL(request.url);
                url.hostname = MAIN_DOMAIN;
                return NextResponse.redirect(url);
            }
        }
    }

    // 2. AUTHENTICATION LOGIC
    const isDashboard = pathname.startsWith("/dashboard");
    const isApiRoute = pathname.startsWith("/api");

    // Public pages & public API routes
    if (!isDashboard && !isApiRoute) {
        return NextResponse.next();
    }

    if (isPublicPath(pathname, method)) {
        return NextResponse.next();
    }

    // Protected Area Check
    const token = request.cookies.get("token")?.value;

    if (!token) {
        if (isApiRoute) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        const secretKey = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secretKey);
        // Token valid
        return NextResponse.next();
    } catch (err: any) {
        if (isApiRoute) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        const res = NextResponse.redirect(loginUrl);
        // Remove invalid cookie correctly across subdomains in production
        const domain = !isDev ? `.${MAIN_DOMAIN}` : undefined;
        res.cookies.set("token", "", { expires: new Date(0), path: "/", domain });
        return res;
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (unless you want middleware to filter api)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
