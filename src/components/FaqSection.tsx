"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const faqs = [
    {
        question: "Bagaimana cara melakukan pemesanan?",
        answer: "Anda dapat melakukan pemesanan langsung melalui WhatsApp kami atau mengisi formulir di halaman Contact. Tim kami akan segera menghubungi Anda untuk mendiskusikan detail desain, bahan, dan estimasi waktu pengerjaan."
    },
    {
        question: "Berapa lama waktu pengerjaan (lead time)?",
        answer: "Lead time standar kami adalah 4-8 minggu, tergantung pada kompleksitas desain dan ketersediaan bahan. Untuk pesanan kustom dalam jumlah besar, waktu pengerjaan mungkin disesuaikan lebih lanjut."
    },
    {
        question: "Apakah ada garansi untuk setiap produk?",
        answer: "Ya, Atmosphere Furniture memberikan garansi struktur selama 1 tahun untuk setiap produk kami. Kami berkomitmen untuk menjaga kualitas dan ketahan lama furnitur yang kami ciptakan."
    },
    {
        question: "Apakah bisa kustom desain sesuai keinginan saya?",
        answer: "Tentu saja. Kami spesialis dalam mewujudkan ide furnitur unik Anda. Anda dapat membawa referensi gambar atau sketsa sederhana, dan desainer kami akan membantu mematangkan konsepnya sebelum naik ke tahap produksi."
    },
    {
        question: "Metode pembayaran apa saja yang tersedia?",
        answer: "Kami menerima pembayaran melalui transfer bank (BCA), Visa, Mastercard, dan PayPal. Sistem pembayaran biasanya dibagi menjadi DP (Down Payment) untuk memulai produksi dan pelunasan saat barang siap dikirim."
    }
];

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Header animation
            gsap.from(".faq-header > *", {
                scrollTrigger: {
                    trigger: ".faq-header",
                    start: "top 85%",
                },
                y: 30,
                autoAlpha: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
                immediateRender: false
            });

            // FAQ Items staggered reveal
            gsap.from(".faq-item", {
                scrollTrigger: {
                    trigger: ".faq-list",
                    start: "top 85%",
                },
                y: 20,
                autoAlpha: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out",
                immediateRender: false
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="mx-auto w-full max-w-4xl px-6 py-24 font-poppins">
            <div className="flex flex-col items-center mb-16 text-center faq-header">
                <h2 className="text-3xl md:text-5xl font-semibold text-zinc-900 leading-tight mb-4">
                    Frequently Asked <br className="hidden md:block" /> Questions
                </h2>
                <p className="text-zinc-500 text-sm md:text-base max-w-xl mx-auto">
                    Temukan jawaban atas pertanyaan umum seputar pesanan, kustomisasi, dan layanan Atmosphere Furniture di sini.
                </p>
            </div>

            <div className="space-y-4 faq-list">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`faq-item border rounded-3xl transition-all duration-300 ${openIndex === index
                            ? "border-zinc-200 bg-zinc-50/50"
                            : "border-zinc-100 hover:border-zinc-200"
                            }`}
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            aria-expanded={openIndex === index}
                            className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none group"
                        >
                            <span className={`text-base md:text-lg font-semibold transition-colors ${openIndex === index ? "text-zinc-900" : "text-zinc-500 group-hover:text-zinc-900"
                                }`}>
                                {faq.question}
                            </span>
                            <div className={`p-2 rounded-full border transition-all ${openIndex === index
                                ? "border-zinc-900 bg-zinc-900 text-white rotate-45"
                                : "border-zinc-200 text-zinc-500 group-hover:border-zinc-900 group-hover:text-zinc-900"
                                }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                            </div>
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                            }`}>
                            <div className="px-6 md:px-8 pb-8 pt-0 text-zinc-500 text-sm md:text-base leading-relaxed">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
