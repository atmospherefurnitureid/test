"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { DUMMY_FOUNDER } from "@/lib/dummyData";

export default function AboutPageClient() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [founder, setFounder] = useState<any>(DUMMY_FOUNDER);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-white font-poppins">
      <Navbar />

      {/* Hero Section (Relocated from Homepage) */}
      <section id="about-section" className="mx-auto w-full max-w-7xl px-6 pt-4 pb-20 md:pt-4 md:pb-32 bg-white">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-semibold text-zinc-900 leading-[1.1] tracking-tight">
              {t("home.about.title")}
            </h2>
            <p className="mt-6 text-base text-zinc-500 leading-relaxed max-w-2xl font-medium">
              {t("home.about.desc")}
            </p>
          </div>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="relative aspect-square flex items-center justify-center p-6 group">
            <Image
              src="/logo-atmosphere.png"
              alt="Logo Atmosphere Furniture Indonesia"
              fill
              className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className="md:col-span-2 flex flex-col justify-center text-left">
            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="text-3xl md:text-5xl font-semibold text-zinc-900 tracking-tight leading-tight">{t("home.about.headline")}</h3>
                <p className="text-zinc-500 text-base leading-relaxed max-w-2xl font-medium">
                  {t("home.about.brief")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-zinc-100">
                <div className="space-y-3">
                  <h4 className="text-2xl font-semibold text-zinc-900 border-l-4 border-sky-500 pl-4">{t("home.about.vision_title")}</h4>
                  <p className="text-zinc-500 text-base leading-relaxed pl-4 font-medium italic">
                    {t("home.about.vision_desc")}
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-2xl font-semibold text-zinc-900 border-l-4 border-sky-500 pl-4">{t("home.about.mission_title")}</h4>
                  <p className="text-zinc-500 text-base leading-relaxed pl-4 font-medium italic">
                    {t("home.about.mission_desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div id="about-stats" className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-16 border-t border-zinc-100">
          <div className="flex flex-col items-center justify-center text-center group">
            <span className="text-4xl text-zinc-900 mb-3 transition-transform group-hover:scale-110">
              <span className="stat-number" data-value="150">150</span>+
            </span>
            <span className="text-sm text-zinc-600 font-medium">{t("home.about.stats.projects")}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center group border-l border-zinc-50">
            <span className="text-4xl text-zinc-900 mb-3 transition-transform group-hover:scale-110">
              <span className="stat-number" data-value="100">100</span>+
            </span>
            <span className="text-sm text-zinc-600 font-medium">{t("home.about.stats.team")}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center group border-l border-zinc-50">
            <span className="text-4xl text-zinc-900 mb-3 transition-transform group-hover:scale-110">
              <span className="stat-number" data-value="200">200</span>+
            </span>
            <span className="text-sm text-zinc-600 font-medium">{t("home.about.stats.reviews")}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center group border-l border-zinc-50">
            <span className="text-4xl text-zinc-900 mb-3 transition-transform group-hover:scale-110">
              <span className="stat-number" data-value="30">30</span>
            </span>
            <span className="text-sm text-zinc-600 font-medium">{t("home.about.stats.awards")}</span>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team-section" className="mx-auto w-full max-w-7xl px-6 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold text-zinc-900 leading-[1.1] tracking-tight max-w-3xl mx-auto">
            {t("home.team.title")}
          </h2>
        </div>

        {/* Team Content - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Team Member Profile */}
          <div className="flex flex-col md:flex-row items-start gap-8 group">
            <div className="relative aspect-3/4 w-full md:w-72 shrink-0 rounded-xl overflow-hidden shadow-xl">
              <Image
                src={founder?.image || "/images/team-1.png"}
                alt={founder?.name || "Will Jones"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="pt-4 text-left">
              <h3 className="text-2xl md:text-3xl font-semibold text-zinc-900 mb-3 tracking-tight">
                {founder?.name || "Will Jones"}
              </h3>
              <p className="text-zinc-500 text-base leading-relaxed mb-6">
                {founder?.bio || t("home.team.ceo_desc")}
              </p>
              <div className="flex items-center gap-3">
                {founder ? (
                  <>
                    {founder.whatsapp && (
                      <a
                        href={founder.whatsapp.startsWith('http') ? founder.whatsapp : `https://wa.me/${founder.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        aria-label="WhatsApp"
                        className="p-2 rounded-full bg-zinc-50 text-zinc-400 hover:text-green-600 hover:bg-green-50 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81 1.7A2 2 0 0 1 22 16.92z" /></svg>
                      </a>
                    )}
                    {founder.facebook && (
                      <a
                        href={founder.facebook.startsWith('http') ? founder.facebook : `https://facebook.com/${founder.facebook}`}
                        target="_blank"
                        aria-label="Facebook"
                        className="p-2 rounded-full bg-zinc-50 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                      </a>
                    )}
                    {founder.instagram && (
                      <a
                        href={founder.instagram.startsWith('http') ? founder.instagram : `https://instagram.com/${founder.instagram.replace('@', '')}`}
                        target="_blank"
                        aria-label="Instagram"
                        className="p-2 rounded-full bg-zinc-50 text-zinc-400 hover:text-pink-600 hover:bg-pink-50 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    <a href="#" aria-label="WhatsApp" className="p-2 rounded-full bg-zinc-50 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81 1.7A2 2 0 0 1 22 16.92z" /></svg>
                    </a>
                    <a href="#" aria-label="Facebook" className="p-2 rounded-full bg-zinc-50 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                    </a>
                    <a href="#" aria-label="Instagram" className="p-2 rounded-full bg-zinc-50 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Founder's Quote */}
          <div className="flex items-center justify-center">
            <div className="space-y-6 py-8 px-6 bg-zinc-50/50 rounded-xl border border-zinc-100 w-full">
              <blockquote className="text-xl md:text-2xl font-semibold text-zinc-900 italic leading-relaxed">
                {founder?.quote || t("home.team.quote")}
              </blockquote>
              <p className="text-zinc-500 text-base leading-relaxed font-medium mt-4">
                — {founder?.name || "Will Jones"}, {founder?.role || t("home.team.master")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist CTA Section - Matching User Image */}
      <section id="cta-section" className="mx-auto w-full max-w-7xl px-6 py-24 border-t border-zinc-100">
        <div className="flex flex-col items-center text-center">

          {/* Logo with Divider Line - Full Width */}
          <div className="relative w-full flex items-center justify-center mb-10 overflow-x-clip">
            <div className="absolute left-[-100vw] right-[-100vw] h-px bg-zinc-200"></div>
            <div className="relative z-10 w-24 h-24 bg-white rounded-full border border-zinc-100 shadow-sm overflow-hidden flex items-center justify-center">
              <Image
                src="/logo-atmosphere.png"
                alt="Atmosphere Logo"
                fill
                className="object-cover scale-150"
              />
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-semibold text-zinc-900 mb-2">
            Atmosphere Furniture Indonesia
          </h2>
          <p className="text-zinc-500 text-base font-medium mb-6">
            {t("home.cta.tagline")}
          </p>

          <h3 className="text-zinc-500 text-base max-w-xl leading-relaxed mb-10 italic font-medium">
            {t("home.cta.quote") === "home.cta.quote" ? t("contact.details.quote") : t("home.cta.quote")}
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link
              href="https://wa.me/62882005824231"
              target="_blank"
              className="rounded-full bg-sky-500 px-10 py-3.5 text-sm font-semibold text-white hover:bg-sky-600 transition-all shadow-xl cursor-pointer"
            >
              Get in touch
            </Link>
            <Link
              href="https://wa.me/62882005824231"
              target="_blank"
              className="rounded-full border border-sky-500 bg-white px-10 py-3.5 text-sm font-semibold text-sky-600 hover:bg-sky-500 hover:text-white transition-all shadow-sm cursor-pointer"
            >
              Schedule a call
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-zinc-600">
            <a href="mailto:atmosphere.furnitureid@gmail.com" className="flex items-center gap-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-zinc-900 transition-colors"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              <span className="text-sm font-medium group-hover:text-zinc-900 transition-colors">atmosphere.furnitureid@gmail.com</span>
            </a>
            <a href="https://atmospherefurnitureid.com" className="flex items-center gap-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-zinc-900 transition-colors"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="2" x2="22" y1="15" y2="15" /><line x1="12" x2="12" y1="18" y2="18" /></svg>
              <span className="text-sm font-medium group-hover:text-zinc-900 transition-colors">atmospherefurnitureid.com</span>
            </a>
            <a href="https://instagram.com/atmosphere.furnitureid" className="flex items-center gap-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-zinc-900 transition-colors"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              <span className="text-sm font-medium group-hover:text-zinc-900 transition-colors">atmosphere.furnitureid</span>
            </a>
            <a href="https://wa.me/62882005824231" className="flex items-center gap-2 group" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-zinc-900 transition-colors"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81 1.7A2 2 0 0 1 22 16.92z" /></svg>
              <span className="text-sm font-medium group-hover:text-zinc-900 transition-colors">+62 882-0058-24231</span>
            </a>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
