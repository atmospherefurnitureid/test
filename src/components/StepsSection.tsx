"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function StepsSection() {
    const { t } = useLanguage();

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();
        const ctx = gsap.context(() => {
            // Section Reveal
            gsap.from("#steps-section > div", {
                scrollTrigger: {
                    trigger: "#steps-section",
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

            // Desktop Staggered Pop
            const mm = gsap.matchMedia();
            mm.add("(min-width: 1024px)", () => {
                const stepCards = document.querySelectorAll("#steps-section .grid > div");
                if (stepCards.length) {
                    gsap.from(stepCards, {
                        scrollTrigger: { trigger: "#steps-section", start: "top 72%", once: true },
                        scale: 0.92, autoAlpha: 0, duration: 0.7, stagger: 0.1,
                        ease: "back.out(1.7)", immediateRender: false,
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
        <section id="steps-section" className="mx-auto w-full max-w-7xl px-6 py-24 border-t border-zinc-100">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="max-w-2xl text-left">
                    <h2 className="text-3xl md:text-5xl font-semibold text-zinc-900 mb-6 tracking-tight leading-tight">
                        {t("contact.steps.title")}
                    </h2>
                    <p className="text-zinc-500 text-base md:text-lg leading-relaxed font-normal">
                        {t("contact.steps.subtitle")}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Step 1: Konsultasi */}
                <Link
                    href="https://wa.me/62882005824231"
                    target="_blank"
                    className="bg-sky-700 p-8 rounded-xl border border-sky-600 flex flex-col h-auto md:h-[420px] justify-between group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-[#F0F9FF] hover:border-sky-100/50 text-left"
                >
                    <div className="flex flex-col">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-8 text-white shadow-soft transition-all duration-300 group-hover:bg-[#0EA5E9] group-hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-4 transition-colors duration-300 group-hover:text-zinc-900 leading-tight">{t("contact.steps.step1.title")}</h3>
                        <p className="text-sky-50 text-sm leading-relaxed transition-colors duration-300 group-hover:text-zinc-500 hidden md:block font-normal">
                            {t("contact.steps.step1.desc")}
                        </p>
                        <span className="text-white font-bold text-xs underline underline-offset-4 mt-4 transition-colors group-hover:text-sky-700">
                            {t("home.services.view_details")}
                        </span>
                    </div>
                    <div className="text-[10px] font-black uppercase text-white tracking-widest mt-4">Step 01</div>
                </Link>

                {/* Step 2: DP 50% */}
                <div className="bg-[#F0F9FF] p-8 rounded-xl border border-sky-100/50 flex flex-col h-auto md:h-[420px] justify-between group cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:bg-sky-600 text-left">
                    <div className="flex flex-col">
                        <div className="w-14 h-14 flex items-center justify-start mb-8 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-zinc-900 mb-4 group-hover:text-white transition-colors duration-300 leading-tight">{t("contact.steps.step2.title")}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-sky-50 transition-colors duration-300 hidden md:block font-medium">
                            {t("contact.steps.step2.desc")}
                        </p>
                        <span className="text-sky-700 font-bold text-xs underline underline-offset-4 mt-4 transition-colors group-hover:text-white">
                            {t("home.services.view_details")}
                        </span>
                    </div>
                    <div className="text-[10px] font-black uppercase text-sky-800 group-hover:text-white/80 tracking-widest mt-4 transition-colors">Step 02</div>
                </div>

                {/* Step 3: Pengerjaan */}
                <div className="bg-[#F0F9FF] p-8 rounded-xl border border-sky-100/50 flex flex-col h-auto md:h-[420px] justify-between group cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:bg-sky-600 text-left">
                    <div className="flex flex-col">
                        <div className="w-14 h-14 flex items-center justify-start mb-8 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a2 2 0 0 1 2.83 0l.3.3a2 2 0 0 1 0 2.83l-3.77 3.77a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0" /><path d="m2 22 5-5" /><path d="M9.5 14.5 16 8" /><path d="m17 2 5 5" /><path d="m7 14.5-5 5L4.5 22l5-5-2.5-2.5Z" /></svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-zinc-900 mb-4 group-hover:text-white transition-colors duration-300 leading-tight">{t("contact.steps.step3.title")}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-sky-50 transition-colors duration-300 hidden md:block font-medium">
                            {t("contact.steps.step3.desc")}
                        </p>
                        <span className="text-sky-700 font-bold text-xs underline underline-offset-4 mt-4 transition-colors group-hover:text-white">
                            {t("home.services.view_details")}
                        </span>
                    </div>
                    <div className="text-[10px] font-black uppercase text-sky-800 group-hover:text-white/80 tracking-widest mt-4 transition-colors">Step 03</div>
                </div>

                {/* Step 4: Pelunasan */}
                <div className="bg-[#F0F9FF] p-8 rounded-xl border border-sky-100/50 flex flex-col h-auto md:h-[420px] justify-between group cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:bg-sky-600 text-left">
                    <div className="flex flex-col">
                        <div className="w-14 h-14 flex items-center justify-start mb-8 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-zinc-900 mb-4 group-hover:text-white transition-colors duration-300 leading-tight">{t("contact.steps.step4.title")}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-sky-50 transition-colors duration-300 hidden md:block font-medium">
                            {t("contact.steps.step4.desc")}
                        </p>
                        <span className="text-sky-700 font-bold text-xs underline underline-offset-4 mt-4 transition-colors group-hover:text-white">
                            {t("home.services.view_details")}
                        </span>
                    </div>
                    <div className="text-[10px] font-black uppercase text-sky-800 group-hover:text-white/80 tracking-widest mt-4 transition-colors">Step 04</div>
                </div>

                {/* Step 5: Pengiriman */}
                <div className="bg-[#F0F9FF] p-8 rounded-xl border border-sky-100/50 flex flex-col h-auto md:h-[420px] justify-between group cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:bg-sky-600 text-left">
                    <div className="flex flex-col">
                        <div className="w-14 h-14 flex items-center justify-start mb-8 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300"><rect width="16" height="13" x="2" y="3" rx="2" /><path d="M16 21h4a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-zinc-900 mb-4 group-hover:text-white transition-colors duration-300 leading-tight">{t("contact.steps.step5.title")}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-sky-50 transition-colors duration-300 hidden md:block font-medium">
                            {t("contact.steps.step5.desc")}
                        </p>
                        <span className="text-sky-700 font-bold text-xs underline underline-offset-4 mt-4 transition-colors group-hover:text-white">
                            {t("home.services.view_details")}
                        </span>
                    </div>
                    <div className="text-[10px] font-black uppercase text-sky-800 group-hover:text-white/80 tracking-widest mt-4 transition-colors">Step 05</div>
                </div>

                {/* Step 6: Garansi Kerusakan */}
                <div className="bg-[#F0F9FF] p-8 rounded-xl border border-sky-100/50 flex flex-col h-auto md:h-[420px] justify-between group cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:bg-sky-600 text-left">
                    <div className="flex flex-col">
                        <div className="w-14 h-14 flex items-center justify-start mb-8 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-zinc-900 mb-4 group-hover:text-white transition-colors duration-300 leading-tight">{t("contact.steps.step6.title")}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-sky-50 transition-colors duration-300 hidden md:block font-medium">
                            {t("contact.steps.step6.desc")}
                        </p>
                        <span className="text-sky-700 font-bold text-xs underline underline-offset-4 mt-4 transition-colors group-hover:text-white">
                            {t("home.services.view_details")}
                        </span>
                    </div>
                    <div className="text-[10px] font-black uppercase text-sky-800 group-hover:text-white/80 tracking-widest mt-4 transition-colors">Step 06</div>
                </div>
            </div>
        </section>
    );
}
