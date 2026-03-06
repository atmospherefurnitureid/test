/**
 * Input sanitization helpers to prevent XSS and injection attacks.
 * Strips HTML tags and dangerous characters from user-provided strings.
 */

/**
 * Strips all HTML tags from a string.
 */
export function stripHtml(input: string): string {
    return input.replace(/<[^>]*>/g, "").trim();
}

/**
 * Sanitizes a plain text string: strips HTML, trims whitespace, 
 * and removes null bytes.
 */
export function sanitizeString(input: unknown, maxLength: number = 1000): string {
    if (typeof input !== "string") return "";
    return input
        .replace(/<[^>]*>/g, "")          // strip HTML tags
        .replace(/[\x00]/g, "")           // remove null bytes
        .replace(/javascript:/gi, "")     // prevent JS protocol
        .replace(/on\w+=/gi, "")          // remove event handlers
        .trim()
        .slice(0, maxLength);
}

/**
 * Sanitizes an object's string fields recursively (shallow, one level).
 */
export function sanitizeObject(
    obj: Record<string, unknown>,
    maxLength: number = 1000
): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "string") {
            sanitized[key] = sanitizeString(value, maxLength);
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}
