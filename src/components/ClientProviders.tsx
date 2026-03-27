"use client";

import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { ToastProvider } from "@/components/ui/Toast";
import { VisitorTracker } from "@/components/VisitorTracker";
import { Toaster } from "sonner";

export function ClientProviders({ children }: { children: React.ReactNode }) {
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
