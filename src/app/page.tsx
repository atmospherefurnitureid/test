"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqSection from "@/components/FaqSection";
import { useContentStore } from "@/lib/contentStore";
import { slugify } from "@/lib/utils";
import { ArrowUpRight, Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const { articles, fetchArticles, fetchCategories } = useContentStore();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [founder, setFounder] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    fetchArticles();
    fetchCategories();

    // Fetch founder data
    fetch('/api/founder').then(res => res.json()).then(data => setFounder(data)).catch(() => { });
  }, [fetchArticles, fetchCategories]);

  useEffect(() => {
    if (!mounted) return;

    gsap.registerPlugin(ScrollTrigger);

    // Create matchMedia for mobile-first approach
    const mm = gsap.matchMedia();

    let ctx = gsap.context(() => {
      // Mobile-First Default Animations (All screens)
      mm.add("(min-width: 0px)", () => {
        // Hero Content - Subtle fade up (autoAlpha avoids SSR hydration mismatch)
        gsap.from(".hero-content > *", {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          immediateRender: false,
        });

        // Hero Gallery pop in
        gsap.from(".hero-gallery-item", {
          scale: 0.95,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.06,
          ease: "expo.out",
          delay: 0.4,
          immediateRender: false,
        });

        // Section Reveals on scroll
        const sections = ["#about-section", "#services-section", "#steps-section", "#team-section", "#articles-section", "#cta-section"];
        sections.forEach(section => {
          if (!document.querySelector(section)) return;
          gsap.from(`${section} > div`, {
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              toggleActions: "play none none none"
            },
            y: 40,
            autoAlpha: 0,
            duration: 0.7,
            stagger: 0.18,
            ease: "power2.out",
            immediateRender: false,
          });
        });

        // Stats counter animation
        const stats = document.querySelectorAll(".stat-number");
        stats.forEach(stat => {
          const targetValue = parseInt(stat.getAttribute("data-value") || "0");
          gsap.to(stat, {
            scrollTrigger: {
              trigger: "#about-stats",
              start: "top 90%",
            },
            innerText: targetValue,
            duration: 2,
            snap: { innerText: 1 },
            ease: "expo.out",
            immediateRender: false,
          });
        });
      });

      // Desktop Specific Enhancements (min-width 1024px)
      mm.add("(min-width: 1024px)", () => {
        // Parallax on hero gallery
        gsap.to(".hero-gallery-item", {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-gallery-item",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          }
        });

        // Service cards slide in
        const serviceCards = document.querySelectorAll("#services-section .grid > div");
        if (serviceCards.length) {
          gsap.from(serviceCards, {
            scrollTrigger: { trigger: "#services-section", start: "top 72%" },
            x: 40, autoAlpha: 0, duration: 0.9, stagger: 0.15,
            ease: "power3.out", immediateRender: false,
          });
        }

        // Step cards pop
        const stepCards = document.querySelectorAll("#steps-section .grid > div");
        if (stepCards.length) {
          gsap.from(stepCards, {
            scrollTrigger: { trigger: "#steps-section", start: "top 72%" },
            scale: 0.92, autoAlpha: 0, duration: 0.7, stagger: 0.1,
            ease: "back.out(1.2)", immediateRender: false,
          });
        }
      });

    }, containerRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [mounted]);

  // Get 4 latest published articles
  const latestArticles = (articles || [])
    .filter(a => a.status === "Published")
    .slice(0, 4);
  return (
    <main ref={containerRef} className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Header Section */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-16 pb-12 text-center hero-content">
        <header className="mb-6 grid grid-cols-1 md:flex items-center gap-3 md:gap-4 justify-items-center">
          <div className="flex -space-x-3">
            {["id", "my", "sg", "jp", "bn", "us"].map((cc, i) => (
              <div
                key={cc}
                className="relative w-10 h-10 rounded-full border-[3px] border-white bg-slate-50 overflow-hidden shadow-sm ring-1 ring-zinc-100/50"
                style={{ zIndex: 50 - (i * 10) }}
              >
                <Image
                  src={`/images/flags/${cc}.png`}
                  alt={`${cc.toUpperCase()} Flag`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center md:items-start leading-none gap-1">
            <span className="text-[14px] text-zinc-900 font-semibold tracking-tight text-center md:text-left">
              {t("home.hero.badge")}
            </span>
            <span className="text-[9px] font-medium text-sky-600 tracking-[0.2em] uppercase text-center md:text-left">
              {t("home.hero.badge_desc")}
            </span>
          </div>
        </header>

        <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-semibold text-zinc-900 leading-[1.15] tracking-tight max-w-5xl whitespace-pre-line">
          {t("home.hero.title")}
        </h1>

        <p className="mb-8 text-zinc-500 text-sm md:text-[15px] leading-relaxed max-w-2xl mx-auto font-medium">
          {t("home.hero.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="https://wa.me/62882005824231"
            target="_blank"
            className="rounded-full bg-zinc-900 px-8 py-3.5 text-xs font-semibold text-white hover:bg-sky-600 transition-all shadow-lg flex items-center justify-center min-w-[200px] w-full sm:w-auto cursor-pointer"
          >
            {t("home.hero.cta_primary")}
          </Link>
          <span className="text-zinc-400 text-sm font-medium px-2">or</span>
          <Link
            href="/products"
            className="rounded-full border-2 border-zinc-900 bg-white px-8 py-3.5 text-xs font-semibold text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center min-w-[200px] w-full sm:w-auto cursor-pointer"
          >
            {t("home.hero.cta_secondary")}
          </Link>
        </div>
      </section>

      {/* Hero Gallery Grid Section */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">

          {/* div1: Item 1 - Ladder/Shelf */}
          <div className="relative aspect-4/5 lg:col-span-1 overflow-hidden rounded-xl group hero-gallery-item">
            <Image
              src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=800"
              alt="Artistic Wood Ladder Shelf"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority
            />
          </div>

          {/* div2: Item 2 - Dining Table */}
          <div className="group relative aspect-16/10 lg:col-span-2 overflow-hidden rounded-xl hero-gallery-item">
            <Image
              src="https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=1200"
              alt="Minimalist Wooden Dining Table"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority
            />
          </div>

          {/* div3: Item 3 - Iron Chair */}
          <div className="relative aspect-4/5 lg:col-start-4 overflow-hidden rounded-xl group hero-gallery-item">
            <Image
              src="https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800"
              alt="Industrial Iron Cafe Chair"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority
            />
          </div>

          {/* div4: Item 4 - Stool */}
          <div className="relative hidden lg:block aspect-4/5 lg:col-start-5 overflow-hidden rounded-xl group hero-gallery-item">
            <Image
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800"
              alt="Modern Minimalist Wood Stool"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority
            />
          </div>

          {/* div5: Item 5 - Workshop Details */}
          <div className="relative hidden lg:block aspect-16/10 lg:col-span-2 lg:row-start-2 overflow-hidden rounded-xl group hero-gallery-item">
            <Image
              src="https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1200"
              alt="Atmosphere Wood Joinery Workshop"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>

          {/* div6: Item 6 - Wood Furniture Details */}
          <div className="relative hidden lg:block aspect-4/5 lg:col-start-3 lg:row-start-2 overflow-hidden rounded-xl group hero-gallery-item">
            <Image
              src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800"
              alt="Premium Wood Furniture Detail"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>

          {/* div7: Item 7 - Luxury Desk */}
          <div className="relative hidden lg:block aspect-16/10 lg:col-span-2 lg:col-start-4 lg:row-start-2 overflow-hidden rounded-xl group hero-gallery-item">
            <Image
              src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200"
              alt="Modern Luxury Wood Desk"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>

        </div>

        {/* Load More Products Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/products"
            className="group flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-3.5 text-xs font-semibold text-zinc-900 transition-all hover:bg-zinc-50 hover:shadow-md"
          >
            Load More Products
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-y-0.5"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Link>
        </div>
      </section>





      {/* About Us Section */}
      <section id="about-section" className="mx-auto w-full max-w-7xl px-6 py-20 bg-white font-poppins">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-semibold text-zinc-900 leading-[1.1] tracking-tight">
              {t("home.about.title")}
            </h2>
            <p className="mt-6 text-sm md:text-base text-zinc-500 leading-relaxed max-w-2xl font-medium">
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
                <h3 className="text-2xl md:text-5xl font-semibold text-zinc-900 tracking-tight leading-tight">{t("home.about.headline")}</h3>
                <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-2xl font-medium">
                  {t("home.about.brief")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-zinc-100">
                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-zinc-900 border-l-4 border-sky-500 pl-4">{t("home.about.vision_title")}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed pl-4 font-medium italic">
                    {t("home.about.vision_desc")}
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-zinc-900 border-l-4 border-sky-500 pl-4">{t("home.about.mission_title")}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed pl-4 font-medium italic">
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
            <span className="text-4xl font-bold text-zinc-900 mb-3 transition-transform group-hover:scale-110">
              <span className="stat-number" data-value="150">0</span>+
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black">{t("home.about.stats.projects")}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center group border-l border-zinc-50">
            <span className="text-4xl font-bold text-zinc-900 mb-3 transition-transform group-hover:scale-110">
              <span className="stat-number" data-value="100">0</span>+
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black">{t("home.about.stats.team")}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center group border-l border-zinc-50">
            <span className="text-4xl font-bold text-zinc-900 mb-3 transition-transform group-hover:scale-110">
              <span className="stat-number" data-value="200">0</span>+
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black">{t("home.about.stats.reviews")}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center group border-l border-zinc-50">
            <span className="text-4xl font-bold text-zinc-900 mb-3 transition-transform group-hover:scale-110">
              <span className="stat-number" data-value="30">0</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black">{t("home.about.stats.awards")}</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="mx-auto w-full max-w-7xl px-6 py-24">
        {/* Services Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-semibold text-zinc-900 mb-6 tracking-tight leading-tight">
              {t("home.services.title")}
            </h2>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed font-medium">
              {t("home.services.subtitle")}
            </p>
          </div>
        </div>

        {/* Services Grid/Slider */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">

          {/* Card 1: Featured Sky Blue (Inverts on Hover) */}
          <div className="bg-sky-600 p-8 rounded-xl border border-sky-500 flex flex-col h-auto md:h-[420px] justify-between group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-[#F0F9FF] hover:border-sky-100/50">
            {/* Top Content Group */}
            <div className="flex flex-col">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-8 text-white shadow-soft transition-all duration-300 group-hover:bg-[#0EA5E9] group-hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a2 2 0 0 1 2.83 0l.3.3a2 2 0 0 1 0 2.83l-3.77 3.77a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a2 2 0 0 1 2.83 0l.3.3a2 2 0 0 1 0 2.83l-3.77 3.77a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0" /><path d="m2 22 5-5" /><path d="M9.5 14.5 16 8" /><path d="m17 2 5 5" /><path d="m7 14.5-5 5L4.5 22l5-5-2.5-2.5Z" /></svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4 transition-colors duration-300 group-hover:text-zinc-900 leading-tight">{t("home.services.card1.title")}</h3>
              <p className="text-sky-50 text-sm leading-relaxed transition-colors duration-300 group-hover:text-zinc-500 hidden md:block">
                {t("home.services.card1.desc")}
              </p>
            </div>
            {/* Bottom Button Group */}
            <Link href="/services/desain-yang-dipersonalisasi-sepenuhnya" className="w-fit text-white font-bold text-sm underline underline-offset-8 flex items-center gap-2 hover:gap-3 transition-all duration-300 group-hover:text-sky-500 group-hover:opacity-100 mt-8 md:mt-0">
              Learn More
            </Link>
          </div>

          {/* Card 2: Soft Sky Blue */}
          <div className="bg-[#F0F9FF] p-8 rounded-xl border border-sky-100/50 flex flex-col h-auto md:h-[420px] justify-between group cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:bg-sky-600">
            {/* Top Content Group */}
            <div className="flex flex-col">
              <div className="w-14 h-14 flex items-center justify-start mb-8 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              </div>
              <h3 className="text-2xl font-semibold text-zinc-900 mb-4 group-hover:text-white transition-colors duration-300 leading-tight">{t("home.services.card2.title")}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-sky-50 transition-colors duration-300 hidden md:block font-medium">
                {t("home.services.card2.desc")}
              </p>
            </div>
            {/* Bottom Button Group */}
            <Link href="/services/kualitas-dan-ketelitian-pengerjaan" className="w-fit text-sky-500 font-bold text-sm underline underline-offset-8 flex items-center gap-2 hover:gap-3 transition-all group-hover:text-white mt-8 md:mt-0">
              Learn More
            </Link>
          </div>

          {/* Card 3: Soft Sky Blue */}
          <div className="bg-[#F0F9FF] p-8 rounded-xl border border-sky-100/50 flex flex-col h-auto md:h-[420px] justify-between group cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:bg-sky-600">
            {/* Top Content Group */}
            <div className="flex flex-col">
              <div className="w-14 h-14 flex items-center justify-start mb-8 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300"><path d="M12 3a9 9 0 0 0-9 9l7 7 2 2 2-2 7-7a9 9 0 0 0-9-9Z" /><path d="M12 14v4" /></svg>
              </div>
              <h3 className="text-2xl font-semibold text-zinc-900 mb-4 group-hover:text-white transition-colors duration-300 leading-tight">{t("home.services.card3.title")}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-sky-50 transition-colors duration-300 hidden md:block font-medium">
                {t("home.services.card3.desc")}
              </p>
            </div>
            {/* Bottom Button Group */}
            <Link href="/services/solusi-fungsional-dan-estetis" className="w-fit text-sky-500 font-bold text-sm underline underline-offset-8 flex items-center gap-2 hover:gap-3 transition-all group-hover:text-white mt-8 md:mt-0">
              Learn More
            </Link>
          </div>

          {/* Card 4: Soft Sky Blue */}
          <div className="bg-[#F0F9FF] p-8 rounded-xl border border-sky-100/50 flex flex-col h-auto md:h-[420px] justify-between group cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:bg-sky-600">
            {/* Top Content Group */}
            <div className="flex flex-col">
              <div className="w-14 h-14 flex items-center justify-start mb-8 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300"><path d="M12 4v16" /><path d="M4 12h16" /><path d="M6 18l12-12" /><path d="M6 6l12 12" /></svg>
              </div>
              <h3 className="text-2xl font-semibold text-zinc-900 mb-4 group-hover:text-white transition-colors duration-300 leading-tight">{t("home.services.card4.title")}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-sky-50 transition-colors duration-300 hidden md:block font-medium">
                {t("home.services.card4.desc")}
              </p>
            </div>
            {/* Bottom Button Group */}
            <Link href="/services/kolaborasi-untuk-hasil-terbaik" className="w-fit text-sky-500 font-bold text-sm underline underline-offset-8 flex items-center gap-2 hover:gap-3 transition-all group-hover:text-white mt-8 md:mt-0">
              Learn More
            </Link>
          </div>

        </div>
      </section>

      {/* Steps-to-Steps Order Section */}
      <section id="steps-section" className="mx-auto w-full max-w-7xl px-6 py-24 border-t border-zinc-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl text-left">
            <h2 className="text-3xl md:text-5xl font-semibold text-zinc-900 mb-6 tracking-tight leading-tight">
              {t("contact.steps.title")}
            </h2>
            <p className="text-zinc-500 text-base md:text-lg leading-relaxed">
              {t("contact.steps.subtitle")}
            </p>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Step 1: Konsultasi */}
          <Link
            href="https://wa.me/62882005824231"
            target="_blank"
            className="bg-sky-600 p-8 rounded-xl border border-sky-500 flex flex-col h-auto md:h-[420px] justify-between group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-[#F0F9FF] hover:border-sky-100/50 text-left"
          >
            <div className="flex flex-col">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-8 text-white shadow-soft transition-all duration-300 group-hover:bg-[#0EA5E9] group-hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4 transition-colors duration-300 group-hover:text-zinc-900 leading-tight">{t("contact.steps.step1.title")}</h3>
              <p className="text-sky-50 text-sm leading-relaxed transition-colors duration-300 group-hover:text-zinc-500 hidden md:block font-normal">
                {t("contact.steps.step1.desc")}
              </p>
            </div>
            <div className="text-[10px] font-black uppercase text-white/50 group-hover:text-zinc-300 tracking-widest mt-4">Step 01</div>
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
            </div>
            <div className="text-[10px] font-black uppercase text-sky-200 group-hover:text-white/50 tracking-widest mt-4">Step 02</div>
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
            </div>
            <div className="text-[10px] font-black uppercase text-sky-200 group-hover:text-white/50 tracking-widest mt-4">Step 03</div>
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
            </div>
            <div className="text-[10px] font-black uppercase text-sky-200 group-hover:text-white/50 tracking-widest mt-4">Step 04</div>
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
            </div>
            <div className="text-[10px] font-black uppercase text-sky-200 group-hover:text-white/50 tracking-widest mt-4">Step 05</div>
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
            </div>
            <div className="text-[10px] font-black uppercase text-sky-200 group-hover:text-white/50 tracking-widest mt-4">Step 06</div>
          </div>

        </div>
      </section>

      {/* Our Team Section */}
      <section id="team-section" className="mx-auto w-full max-w-7xl px-6 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-zinc-900 leading-[1.15] tracking-tight max-w-3xl mx-auto">
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
              <p className="text-zinc-500 text-sm md:text-base leading-relaxed mb-6">
                {founder?.bio || t("home.team.ceo_desc")}
              </p>
              <div className="flex items-center gap-3">
                {founder ? (
                  <>
                    {founder.whatsapp && (
                      <a href={`https://wa.me/${founder.whatsapp}`} target="_blank" className="p-2 rounded-full bg-zinc-50 text-zinc-400 hover:text-green-600 hover:bg-green-50 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81 1.7A2 2 0 0 1 22 16.92z" /></svg>
                      </a>
                    )}
                    {founder.facebook && (
                      <a href={founder.facebook} target="_blank" className="p-2 rounded-full bg-zinc-50 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                      </a>
                    )}
                    {founder.instagram && (
                      <a href={`https://instagram.com/${founder.instagram.replace('@', '')}`} target="_blank" className="p-2 rounded-full bg-zinc-50 text-zinc-400 hover:text-pink-600 hover:bg-pink-50 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    <a href="#" className="p-2 rounded-full bg-zinc-50 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    </a>
                    <a href="#" className="p-2 rounded-full bg-zinc-50 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                    </a>
                    <a href="#" className="p-2 rounded-full bg-zinc-50 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
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
              <p className="text-zinc-500 text-sm md:text-base leading-relaxed font-bold mt-4">
                — {founder?.name || "Will Jones"}, {founder?.role || t("home.team.master")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="articles-section" className="mx-auto w-full max-w-7xl px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 text-left">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-[34px] font-semibold text-zinc-900 leading-[1.2] tracking-tighter">
              {t("home.articles.title")}
            </h2>
            <p className="mt-4 text-zinc-500 text-[13px] leading-relaxed max-w-2xl font-medium">
              {t("home.articles.desc")}
            </p>
          </div>
        </div>

        {/* Dynamic Articles Grid - Styled like Articles Page */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-zinc-100">
          {latestArticles.map((article) => (
            <Link
              key={article._id}
              href={`/articles/${article._id}/${slugify(article.title)}`}
              className="group flex flex-col p-6 border-r border-b border-zinc-100 transition-colors hover:bg-zinc-50/50"
            >
              {/* Image Part */}
              <div className="relative aspect-16/10 rounded-xl overflow-hidden mb-6 bg-zinc-50">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  unoptimized={article.image.startsWith("http") || article.image.startsWith("data:")}
                />
              </div>

              {/* Content Part */}
              <div className="flex flex-col flex-1 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[12px] font-medium text-zinc-400">{article.author}</span>
                  <span className="text-[12px] text-zinc-300">•</span>
                  <span className="text-[12px] font-medium text-zinc-400">5 min read</span>
                </div>

                <div className="flex justify-between items-start gap-4 mb-3">
                  <h3 className="text-[16px] font-semibold text-zinc-900 leading-tight group-hover:text-sky-600 transition-colors">
                    {article.title}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-900 transition-colors shrink-0 mt-1" />
                </div>

                <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-2 mb-6 font-normal">
                  {article.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-5">
                  <span className="px-3 py-1 bg-zinc-50 text-zinc-500 text-[11px] font-bold rounded-lg border border-zinc-100 uppercase tracking-wider">
                    {article.category}
                  </span>
                  <span className="text-[11px] font-medium text-zinc-400">
                    {article.date.split(',')[0]}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load All Articles Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/articles"
            className="group flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-3.5 text-xs font-semibold text-zinc-900 transition-all hover:bg-zinc-50 hover:shadow-md"
          >
            Load All Articles
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Link>
        </div>
      </section>
      {/* FAQ Section */}
      <FaqSection />

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

          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-2">
            Atmosphere Furniture Indonesia
          </h2>
          <p className="text-zinc-500 text-sm md:text-base font-semibold mb-6">
            {t("home.cta.tagline")}
          </p>

          <h3 className="text-zinc-400 text-xs md:text-sm max-w-xl leading-relaxed mb-10 italic font-medium">
            {t("home.cta.quote") === "home.cta.quote" ? t("contact.details.quote") : t("home.cta.quote")}
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link
              href="https://wa.me/62882005824231"
              target="_blank"
              className="rounded-full bg-zinc-900 px-10 py-3.5 text-sm font-bold text-white hover:bg-sky-600 transition-all shadow-xl cursor-pointer"
            >
              Get in touch
            </Link>
            <Link
              href="https://wa.me/62882005824231"
              target="_blank"
              className="rounded-full border border-zinc-900 bg-white px-10 py-3.5 text-sm font-bold text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all shadow-sm cursor-pointer"
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
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-zinc-900 transition-colors"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              <span className="text-sm font-medium group-hover:text-zinc-900 transition-colors">+62 882-0058-24231</span>
            </a>
          </div>

        </div>
      </section>
      <Footer />
    </main>
  );
}
