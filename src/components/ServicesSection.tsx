"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ServicesSection() {
    const { t } = useLanguage();

    useEffect(() => {
        const mm = gsap.matchMedia();
        const ctx = gsap.context(() => {
            // Mobile-First Reveal
            gsap.from("#services-section > div", {
                scrollTrigger: {
                    trigger: "#services-section",
                    start: "top 88%",
                    toggleActions: "play none none none",
                    once: true
                },
                y: 40,
                autoAlpha: 0,
                duration: 0.7,
                stagger: 0.18,
                ease: "power2.out",
                immediateRender: false,
            });

            // Desktop Specific Enhancements
            mm.add("(min-width: 1024px)", () => {
                const serviceCards = document.querySelectorAll("#services-section .grid > div");
                if (serviceCards.length) {
                    gsap.from(serviceCards, {
                        scrollTrigger: { trigger: "#services-section", start: "top 72%", once: true },
                        x: 40, autoAlpha: 0, duration: 0.9, stagger: 0.15,
                        ease: "power3.out", immediateRender: false,
                    });
                }
            });
        });

        return () => {
            ctx.revert();
            mm.revert();
        };
    }, []);

    return (
        <section id="services-section" className="mx-auto w-full max-w-7xl px-6 py-24">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="max-w-2xl text-left">
                    <h2 className="text-3xl md:text-5xl font-semibold text-zinc-900 mb-6 tracking-tight leading-tight">
                        {t("home.services.title")}
                    </h2>
                    <p className="text-zinc-500 text-sm md:text-base leading-relaxed font-medium">
                        {t("home.services.subtitle")}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {/* Each card mirrors the page.tsx original exactly */}
                <div className="bg-sky-700 p-8 rounded-xl border border-sky-600 flex flex-col h-auto md:h-[420px] justify-between group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-[#F0F9FF] hover:border-sky-100/50">
                    <div className="flex flex-col text-left">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-8 text-white shadow-soft transition-all duration-300 group-hover:bg-[#0EA5E9] group-hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a2 2 0 0 1 2.83 0l.3.3a2 2 0 0 1 0 2.83l-3.77 3.77a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a2 2 0 0 1 2.83 0l.3.3a2 2 0 0 1 0 2.83l-3.77 3.77a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0" /><path d="m2 22 5-5" /><path d="M9.5 14.5 16 8" /><path d="m17 2 5 5" /><path d="m7 14.5-5 5L4.5 22l5-5-2.5-2.5Z" /></svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-4 transition-colors duration-300 group-hover:text-zinc-900 leading-tight">{t("home.services.card1.title")}</h3>
                        <p className="text-sky-50 text-sm leading-relaxed transition-colors duration-300 group-hover:text-zinc-500 hidden md:block">
                            {t("home.services.card1.desc")}
                        </p>
                    </div>
                    <Link href="/services/desain-yang-dipersonalisasi-sepenuhnya" aria-label={t("home.services.view_details")} className="w-fit text-white font-bold text-sm underline underline-offset-8 flex items-center gap-2 hover:gap-3 transition-all duration-300 group-hover:text-sky-700 group-hover:opacity-100 mt-8 md:mt-0">
                        {t("home.services.view_details")}
                    </Link>
                </div>

                <div className="bg-[#F0F9FF] p-8 rounded-xl border border-sky-100/50 flex flex-col h-auto md:h-[420px] justify-between group cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:bg-sky-600 text-left">
                    <div className="flex flex-col">
                        <div className="w-14 h-14 flex items-center justify-start mb-8 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-zinc-900 mb-4 group-hover:text-white transition-colors duration-300 leading-tight">{t("home.services.card2.title")}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-sky-50 transition-colors duration-300 hidden md:block font-medium">
                            {t("home.services.card2.desc")}
                        </p>
                    </div>
                    <Link href="/services/kualitas-dan-ketelitian-pengerjaan" aria-label={t("home.services.view_details")} className="w-fit text-sky-700 font-bold text-sm underline underline-offset-8 flex items-center gap-2 hover:gap-3 transition-all group-hover:text-white mt-8 md:mt-0">
                        {t("home.services.view_details")}
                    </Link>
                </div>

                <div className="bg-[#F0F9FF] p-8 rounded-xl border border-sky-100/50 flex flex-col h-auto md:h-[420px] justify-between group cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:bg-sky-600 text-left">
                    <div className="flex flex-col">
                        <div className="w-14 h-14 flex items-center justify-start mb-8 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300"><path d="M12 3a9 9 0 0 0-9 9l7 7 2 2 2-2 7-7a9 9 0 0 0-9-9Z" /><path d="M12 14v4" /></svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-zinc-900 mb-4 group-hover:text-white transition-colors duration-300 leading-tight">{t("home.services.card3.title")}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-sky-50 transition-colors duration-300 hidden md:block font-medium">
                            {t("home.services.card3.desc")}
                        </p>
                    </div>
                    <Link href="/services/solusi-fungsional-dan-estetis" aria-label={t("home.services.view_details")} className="w-fit text-sky-700 font-bold text-sm underline underline-offset-8 flex items-center gap-2 hover:gap-3 transition-all group-hover:text-white mt-8 md:mt-0">
                        {t("home.services.view_details")}
                    </Link>
                </div>

                <div className="bg-[#F0F9FF] p-8 rounded-xl border border-sky-100/50 flex flex-col h-auto md:h-[420px] justify-between group cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:bg-sky-600 text-left">
                    <div className="flex flex-col">
                        <div className="w-14 h-14 flex items-center justify-start mb-8 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300"><path d="M12 4v16" /><path d="M4 12h16" /><path d="M6 18l12-12" /><path d="M6 6l12 12" /></svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-zinc-900 mb-4 group-hover:text-white transition-colors duration-300 leading-tight">{t("home.services.card4.title")}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-sky-50 transition-colors duration-300 hidden md:block font-medium">
                            {t("home.services.card4.desc")}
                        </p>
                    </div>
                    <Link href="/services/kolaborasi-untuk-hasil-terbaik" aria-label={t("home.services.view_details")} className="w-fit text-sky-700 font-bold text-sm underline underline-offset-8 flex items-center gap-2 hover:gap-3 transition-all group-hover:text-white mt-8 md:mt-0">
                        {t("home.services.view_details")}
                    </Link>
                </div>
            </div>
        </section>
    );
}
