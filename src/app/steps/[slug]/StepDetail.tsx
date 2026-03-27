"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Media data mapping for steps
const stepsMediaMap = {
    'konsultasi': {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>,
        color: 'bg-sky-600',
        borderColor: 'border-sky-500',
        textColor: 'text-white',
        image: 'https://images.unsplash.com/photo-1573161158521-8032486948ad?auto=format&fit=crop&q=80&w=800'
    },
    'dp-50': {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>,
        color: 'bg-[#F0F9FF]',
        borderColor: 'border-sky-100/50',
        textColor: 'text-zinc-900',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800'
    },
    'pengerjaan': {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a2 2 0 0 1 2.83 0l.3.3a2 2 0 0 1 0 2.83l-3.77 3.77a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0" /><path d="m2 22 5-5" /><path d="M9.5 14.5 16 8" /><path d="m17 2 5 5" /><path d="m7 14.5-5 5L4.5 22l5-5-2.5-2.5Z" /></svg>,
        color: 'bg-[#F0F9FF]',
        borderColor: 'border-sky-100/50',
        textColor: 'text-zinc-900',
        image: 'https://images.unsplash.com/photo-1581421046200-2475ab5e227a?auto=format&fit=crop&q=80&w=800'
    },
    'pelunasan': {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
        color: 'bg-[#F0F9FF]',
        borderColor: 'border-sky-100/50',
        textColor: 'text-zinc-900',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800'
    },
    'pengiriman': {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="13" x="2" y="3" rx="2" /><path d="M16 21h4a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>,
        color: 'bg-[#F0F9FF]',
        borderColor: 'border-sky-100/50',
        textColor: 'text-zinc-900',
        image: 'https://images.unsplash.com/photo-1586528116311-ad86d7560868?auto=format&fit=crop&q=80&w=800'
    },
    'garansi-kerusakan': {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>,
        color: 'bg-[#F0F9FF]',
        borderColor: 'border-sky-100/50',
        textColor: 'text-zinc-900',
        image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=800'
    }
};

export default function StepDetail() {
    const params = useParams();
    const slug = params?.slug as string;
    const { t } = useLanguage();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const stepItems = t("steps.items");
    const stepUI = t("steps.ui");
    const stepContent = stepItems[slug];
    const stepMedia = stepsMediaMap[slug as keyof typeof stepsMediaMap];

    if (!isMounted) return null;

    if (!stepContent || !stepMedia) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center font-poppins">
                    <h1 className="text-2xl font-bold text-zinc-900 mb-4">{stepUI.not_found}</h1>
                    <Link href="/" className="text-sky-500 hover:text-sky-600 underline">
                        {stepUI.back_home}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white font-poppins">
            <Navbar />

            {/* Header */}
            <section className="mx-auto w-full max-w-7xl px-6 pt-6 pb-4 md:pt-32">
                <h1 className="mb-4 text-3xl md:text-5xl font-semibold text-zinc-900 leading-[1.1] tracking-tight max-w-5xl uppercase">
                    {stepContent.title}
                </h1>
                <p className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-2xl font-medium">
                    {stepContent.description}
                </p>
            </section>

            {/* Content Section */}
            <div className="mx-auto w-full max-w-7xl px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Description */}
                    <div>
                        <div className="prose prose-lg max-w-none">
                            <h2 className="text-3xl md:text-5xl font-semibold text-zinc-900 mb-8 tracking-tight leading-tight">{stepUI.about_step}</h2>
                            <p className="text-zinc-500 text-base leading-relaxed mb-10 whitespace-pre-line font-medium">
                                {stepContent.longDescription}
                            </p>

                            <h3 className="text-2xl md:text-4xl font-semibold text-zinc-900 mb-6 tracking-tight">{stepUI.why_important}</h3>
                            <ul className="space-y-3">
                                {stepContent.features.map((feature: string, index: number) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="w-5 h-5 bg-sky-100 rounded-full flex items-center justify-center mt-1 shrink-0">
                                            <svg className="w-3 h-3 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-zinc-500 text-base font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Status Card */}
                        <div className="bg-zinc-50 rounded-[2rem] p-8 border border-zinc-100">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${stepMedia.color} ${stepMedia.textColor}`}>
                                {stepMedia.icon}
                            </div>
                            <h3 className="text-2xl md:text-4xl font-semibold text-zinc-900 mb-4 tracking-tight leading-tight">{stepUI.start_now}</h3>
                            <p className="text-zinc-500 text-base font-medium mb-8">
                                Siap melangkah ke tahap ini? Tim kami siap membimbing Anda melalui proses yang transparan dan berkualitas.
                            </p>

                            <div className="space-y-4">
                                <Link
                                    href="https://wa.me/62882005824231"
                                    target="_blank"
                                    className="w-full bg-sky-600 text-white py-4 px-6 rounded-xl font-semibold text-center block hover:bg-sky-700 transition-colors shadow-lg shadow-sky-100"
                                >
                                    Mulai Konsultasi Melalui WhatsApp
                                </Link>

                                <Link
                                    href="/contact"
                                    className="w-full border border-zinc-300 text-zinc-700 py-4 px-6 rounded-xl font-semibold text-center block hover:bg-zinc-50 transition-colors"
                                >
                                    {stepUI.contact_us}
                                </Link>
                            </div>
                        </div>

                        {/* Visual Context */}
                        <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-zinc-100">
                            <img
                                src={stepMedia.image}
                                alt={stepContent.title}
                                className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
                                <p className="text-white text-sm font-medium italic opacity-80">"Atmosphere Furniture - High-Quality Iron & Wood Fusion"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back Nav */}
            <div className="mx-auto w-full max-w-7xl px-6 pb-24">
                <Link
                    href="/#steps-section"
                    className="inline-flex items-center gap-3 text-sky-600 hover:text-sky-700 font-semibold group"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    {stepUI.back_to_steps}
                </Link>
            </div>
            <Footer />
        </main>
    );
}
