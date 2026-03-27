"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { toSlug } from "@/lib/utils";

export default function StepsSection() {
    const { t } = useLanguage();

    const steps = [
        {
            slug: "konsultasi",
            title: t("contact.steps.step1.title"),
            desc: t("contact.steps.step1.desc"),
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
        },
        {
            slug: "dp-50",
            title: t("contact.steps.step2.title"),
            desc: t("contact.steps.step2.desc"),
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
        },
        {
            slug: "pengerjaan",
            title: t("contact.steps.step3.title"),
            desc: t("contact.steps.step3.desc"),
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a2 2 0 0 1 2.83 0l.3.3a2 2 0 0 1 0 2.83l-3.77 3.77a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0" /><path d="m2 22 5-5" /><path d="M9.5 14.5 16 8" /><path d="m17 2 5 5" /><path d="m7 14.5-5 5L4.5 22l5-5-2.5-2.5Z" /></svg>
        },
        {
            slug: "pelunasan",
            title: t("contact.steps.step4.title"),
            desc: t("contact.steps.step4.desc"),
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        },
        {
            slug: "pengiriman",
            title: t("contact.steps.step5.title"),
            desc: t("contact.steps.step5.desc"),
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="13" x="2" y="3" rx="2" /><path d="M16 21h4a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>
        },
        {
            slug: "garansi-kerusakan",
            title: t("contact.steps.step6.title"),
            desc: t("contact.steps.step6.desc"),
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>
        }
    ];

    return (
        <section id="steps-section" className="mx-auto w-full max-w-7xl px-6 py-24 border-t border-zinc-100 font-poppins text-left">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-5xl font-semibold text-zinc-900 mb-6 tracking-tight leading-tight">
                        {t("contact.steps.title")}
                    </h2>
                    <p className="text-zinc-500 text-base md:text-lg leading-relaxed font-medium">
                        {t("contact.steps.subtitle")}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {steps.map((step, idx) => {
                    const slug = step.slug;
                    const isFirst = idx === 0;
                    const href = `/steps/${slug}`;

                    return (
                        <div
                            key={idx}
                            className={`relative p-8 rounded-xl border flex flex-col h-auto md:h-[420px] justify-between group cursor-pointer transition-all duration-500 hover:-translate-y-2 text-left ${isFirst
                                ? "bg-sky-700 border-sky-600 hover:bg-[#F0F9FF] hover:border-sky-100/50 hover:shadow-2xl"
                                : "bg-[#F0F9FF] border-sky-100/50 hover:bg-sky-600 hover:shadow-xl"
                                }`}
                        >
                            <Link href={href} className="absolute inset-0 z-20" aria-label={step.title} prefetch={false}></Link>
                            <div className="flex flex-col h-full relative z-10 pointer-events-none">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-8 transition-all duration-300 ${isFirst
                                    ? "bg-white/20 backdrop-blur-md text-white group-hover:bg-[#0EA5E9]"
                                    : "text-[#0EA5E9] group-hover:scale-110 group-hover:text-white"
                                    }`}>
                                    {step.icon}
                                </div>
                                <h3 className={`text-2xl font-semibold mb-4 transition-colors duration-300 leading-tight ${isFirst
                                    ? "text-white group-hover:text-zinc-900"
                                    : "text-zinc-900 group-hover:text-white"
                                    }`}>
                                    {step.title}
                                </h3>
                                <p className={`text-base leading-relaxed transition-colors duration-300 hidden md:block font-medium ${isFirst
                                    ? "text-sky-50 group-hover:text-zinc-500"
                                    : "text-zinc-500 group-hover:text-sky-50"
                                    }`}>
                                    {step.desc}
                                </p>
                            </div>
                            <div className={`font-bold text-sm underline underline-offset-8 mt-8 transition-all duration-300 relative z-10 pointer-events-none ${isFirst
                                ? "text-white group-hover:text-sky-700"
                                : "text-sky-700 group-hover:text-white"
                                }`}>
                                {t("home.services.view_details")}
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    );
}
