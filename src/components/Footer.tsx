"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="mx-auto w-full max-w-7xl px-6 py-12 border-t border-zinc-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <Link href="/" className="font-bold text-zinc-900">Atmosphere</Link>
                    <span className="text-zinc-400">|</span>
                    <p className="text-zinc-500 text-xs">
                        © {new Date().getFullYear()} Atmosphere Furniture Indonesia. {t("footer.rights")}
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/privacy-policy" className="text-[11px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors tracking-wide">{t("footer.privacy")}</Link>
                    <Link href="/terms-of-service" className="text-[11px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors tracking-wide">{t("footer.terms")}</Link>
                    <Link href="/cookies" className="text-[11px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors tracking-wide">{t("footer.cookies")}</Link>
                </div>
            </div>
        </footer>
    );
}
