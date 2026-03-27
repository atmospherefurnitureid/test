"use client";

import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { ToastProvider } from "@/components/ui/Toast";
import { VisitorTracker } from "@/components/VisitorTracker";
import { Toaster } from "sonner";
import { useEffect } from "react";

export function ClientProviders({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Inject AdSense script manually on the client side to avoid SSR hydration mismatches 
        // and bypass the "data-nscript" attribute warning from next/script.
        const script = document.createElement("script");
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5144148071107084";
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
    }, []);

    return (
        <ToastProvider>
            <Toaster position="bottom-right" richColors closeButton />
            <VisitorTracker />
            <LanguageProvider>
                {children}
            </LanguageProvider>
        </ToastProvider>
    );
}
