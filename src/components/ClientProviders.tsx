"use client";

import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { ToastProvider } from "@/components/ui/Toast";
import { VisitorTracker } from "@/components/VisitorTracker";

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <VisitorTracker />
            <LanguageProvider>
                {children}
            </LanguageProvider>
        </ToastProvider>
    );
}
