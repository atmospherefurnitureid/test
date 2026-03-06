/**
 * In-memory rate limiter.
 * Tracks request counts per IP. Resets after a window period.
 * Note: In a multi-instance production environment, use Redis instead.
 */

interface RateLimitRecord {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitRecord>();

/**
 * @param ip - The client IP address
 * @param limit - Max number of requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns true if allowed, false if rate limited
 */
export function checkRateLimit(
    ip: string,
    limit: number = 10,
    windowMs: number = 60_000
): boolean {
    const now = Date.now();
    const record = store.get(ip);

    // If no record or window has expired, create/reset
    if (!record || now > record.resetAt) {
        store.set(ip, { count: 1, resetAt: now + windowMs });
        return true;
    }

    // Increment counter
    record.count++;

    if (record.count > limit) {
        return false; // Rate limited
    }

    return true;
}

/**
 * Helper to get client IP from Next.js request headers
 */
export function getClientIp(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    return "unknown";
}
