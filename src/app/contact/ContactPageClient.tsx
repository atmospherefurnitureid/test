"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { RefreshCw } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

export default function Contact() {
    const { t } = useLanguage();
    const { toast } = useToast();

    const [isMounted, setIsMounted] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get("name") as string || "Tidak diisi";
        const email = formData.get("email") as string || "Tidak diisi";
        const whatsapp = formData.get("whatsapp") as string || "Tidak diisi";
        const address = formData.get("address") as string || "Tidak diisi";
        const needsValue = formData.get("needs") as string || "konsultasi";
        const message = formData.get("message") as string || "Tidak ada pesan tambahan";

        const needsLabel = needsValue === "order" ? "Pemesanan Produk" : "Konsultasi Desain";

        if (!token) {
            toast({
                title: "Verifikasi Diperlukan",
                description: "Silakan selesaikan verifikasi keamanan sebelum mengirim.",
                type: "warning"
            });
            return;
        }

        setIsSubmitting(true);

        const waMessage = `Halo Atmosphere Furniture Indonesia,%0A%0ASaya ${name}, ingin melakukan *${needsLabel}*.%0A%0ABerikut detail saya:%0A- *Nama*: ${name}%0A- *Email*: ${email}%0A- *WhatsApp*: ${whatsapp}%0A- *Alamat*: ${address}%0A%0A*Pesan*:%0A${message}%0A%0AMohon bantuan informasinya. Terima kasih!`;
        const waLink = `https://wa.me/62882005824231?text=${waMessage}`;

        setTimeout(() => {
            toast({
                title: t("contact.form.success") || "Pesan Berhasil Terkirim",
                description: "Membuka WhatsApp untuk mengirim pesan...",
                type: "success"
            });
            setIsSubmitting(false);
            setToken(null);
            window.open(waLink, "_blank");
            (e.target as HTMLFormElement).reset();
        }, 1200);
    };

    if (!isMounted) return null;

    return (
        <main className="min-h-screen bg-white font-poppins">
            <Navbar />

            {/* Contact Grid Section - 2 Columns (Form on left, Text on right) */}
            <section className="mx-auto w-full max-w-7xl px-6 pt-16 pb-20">
                {/* Centered Header */}
                <div className="mb-12">
                    <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-semibold text-zinc-900 tracking-tight leading-tight">
                        {t("contact.title")}
                    </h1>
                    <p className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-2xl">
                        {t("contact.subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 items-stretch">

                    {/* Left Column: Contact Form */}
                    <div className="rounded-[2.5rem] flex flex-col h-full">
                        <form onSubmit={handleSubmit} className="space-y-8 flex-grow">
                            {/* Name */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-zinc-900">{t("contact.form.name")}</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder={t("contact.form.name_placeholder")}
                                    className="w-full bg-transparent border-b border-zinc-200 py-3 text-base text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                                />
                            </div>

                            {/* Email & WhatsApp */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-medium text-zinc-900">{t("contact.form.email")}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder={t("contact.form.email_placeholder")}
                                        className="w-full bg-transparent border-b border-zinc-200 py-3 text-base text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-medium text-zinc-900">{t("contact.form.whatsapp")}</label>
                                    <input
                                        type="text"
                                        name="whatsapp"
                                        required
                                        placeholder={t("contact.form.whatsapp_placeholder")}
                                        className="w-full bg-transparent border-b border-zinc-200 py-3 text-base text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            {/* Alamat */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-zinc-900">{t("contact.form.address")}</label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    placeholder={t("contact.form.address_placeholder")}
                                    className="w-full bg-transparent border-b border-zinc-200 py-3 text-base text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                                />
                            </div>

                            {/* Kebutuhan Dropdown */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-zinc-900">{t("contact.form.needs")}</label>
                                <div className="relative">
                                    <select
                                        name="needs"
                                        required
                                        defaultValue=""
                                        className="w-full appearance-none bg-transparent border-b border-zinc-200 py-3 text-base text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all pr-10 font-medium cursor-pointer"
                                    >
                                        <option value="" disabled>{t("contact.form.needs_placeholder")}</option>
                                        <option value="konsultasi">{t("contact.form.needs_options.consultation")}</option>
                                        <option value="order">{t("contact.form.needs_options.order")}</option>
                                    </select>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-zinc-900">{t("contact.form.message")}</label>
                                <textarea
                                    name="message"
                                    required
                                    rows={4}
                                    placeholder={t("contact.form.message_placeholder")}
                                    className="w-full bg-transparent border-b border-zinc-200 py-3 text-base text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all resize-none font-medium"
                                />
                            </div>
                            {/* Cloudflare Turnstile */}
                            <div className="pt-4">
                                {isMounted && (
                                    <Turnstile
                                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                                        onSuccess={(token) => setToken(token)}
                                        onExpire={() => setToken(null)}
                                        onError={() => setToken(null)}
                                        options={{
                                            theme: 'light',
                                            size: 'normal'
                                        }}
                                    />
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full bg-zinc-900 text-white rounded-xl py-4 text-base font-semibold transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed bg-zinc-700' : 'hover:bg-sky-600 shadow-zinc-200'}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        MENGIRIM...
                                    </>
                                ) : (
                                    t("contact.form.submit")
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Contact Details */}
                    <div className="flex flex-col justify-between lg:border-l lg:border-zinc-100 lg:pl-16 pt-8 lg:pt-0">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl md:text-4xl font-semibold text-zinc-900 mb-4 tracking-tight leading-tight">
                                    Atmosphere Furniture Indonesia
                                </h2>
                                <p className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-md">
                                    {t("contact.details.tagline")}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <a href="mailto:atmosphere.furnitureid@gmail.com" aria-label="Email Us" className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-sky-600 transition-colors"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 transition-colors">atmosphere.furnitureid@gmail.com</span>
                                </a>
                                <a href="https://atmospherefurnitureid.com" aria-label="Official Website" className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-sky-600 transition-colors"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="2" x2="22" y1="15" y2="15" /><line x1="12" x2="12" y1="18" y2="18" /></svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 transition-colors">atmospherefurnitureid.com</span>
                                </a>
                                <a href="https://instagram.com/atmosphere.furnitureid" aria-label="Instagram" className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-sky-600 transition-colors"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 transition-colors">atmosphere.furnitureid</span>
                                </a>
                                <a href="https://wa.me/62882005824231" aria-label="WhatsApp" className="flex items-center gap-4 group" target="_blank">
                                    <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-sky-600 transition-colors"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 transition-colors">+62 882-0058-24231</span>
                                </a>
                            </div>

                            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                                <h3 className="text-base md:text-lg font-normal text-zinc-900 mb-2 italic">{t("contact.details.quote")}</h3>
                                <p className="text-sm text-zinc-400 font-normal">— Will Jones, {t("contact.details.founder")}</p>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-zinc-100">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">{t("contact.details.payment_methods")}</p>
                            <div className="flex flex-wrap items-center gap-8 opacity-80 transition-all duration-700">
                                {/* BCA */}
                                <div className="flex items-center">
                                    <span className="text-xl font-black text-[#0060AF] tracking-tighter">BCA</span>
                                </div>
                                {/* PayPal */}
                                <div className="flex items-center">
                                    <span className="text-xl font-black text-[#003087] italic tracking-tighter">Pay<span className="text-[#009CDE]">Pal</span></span>
                                </div>
                                {/* Visa */}
                                <div className="text-xl font-black text-[#1A1F71] italic tracking-tight">VISA</div>
                                {/* Mastercard */}
                                <div className="flex items-center gap-1">
                                    <div className="flex -space-x-2">
                                        <div className="w-5 h-5 rounded-full bg-[#EB001B]"></div>
                                        <div className="w-5 h-5 rounded-full bg-[#F79E1B] opacity-80"></div>
                                    </div>
                                    <span className="font-bold text-zinc-900 text-[10px] italic">mastercard</span>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >

            </section >



            {/* Thank You Message */}
            <div className="pb-24 text-center">
                <p className="text-gray-500 text-sm font-medium italic">
                    {t("contact_thanks")}
                </p>
            </div>

            <Footer />
        </main >
    );
}
