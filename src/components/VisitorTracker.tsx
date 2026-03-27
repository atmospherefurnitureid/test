"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function VisitorTracker() {
    const pathname = usePathname();
    const lastTrackedPath = useRef<string | null>(null);

    useEffect(() => {
        // Disabled for frontend-only dummy data mode
        return;
        // Only track if the path has changed to avoid duplicate tracking in dev or re-renders
        if (lastTrackedPath.current === pathname) return;
        // ... (rest of the code)
    }, [pathname]);

    return null;
}
