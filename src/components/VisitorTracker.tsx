"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function VisitorTracker() {
    const pathname = usePathname();
    const lastTrackedPath = useRef<string | null>(null);

    useEffect(() => {
        // Only track if the path has changed to avoid duplicate tracking in dev or re-renders
        if (lastTrackedPath.current === pathname) return;

        // Don't track dashboard visits for analytics (optional, but usually we want public site visits)
        // if (pathname.startsWith('/dashboard')) return;

        const trackVisit = async () => {
            try {
                await fetch('/api/visitors', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        page: pathname,
                        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Server',
                        // IP is handled by the server
                    }),
                });
                lastTrackedPath.current = pathname;
            } catch (error) {
                console.error("Failed to track visit:", error);
            }
        };

        trackVisit();
    }, [pathname]);

    return null;
}
