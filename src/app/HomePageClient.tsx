"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";

// Low priority components below the fold - Dynamically Imported
const FaqSection = dynamic(() => import("@/components/FaqSection"), {
  loading: () => <div className="h-20 animate-pulse bg-zinc-50" />
});
const Footer = dynamic(() => import("@/components/Footer"));
const ServicesSection = dynamic(() => import("@/components/ServicesSection"));
const StepsSection = dynamic(() => import("@/components/StepsSection"));

import { useContentStore } from "@/lib/contentStore";
import { useProductStore } from "@/lib/productStore";
import { slugify } from "@/lib/utils";
import { ArrowUpRight, Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ limitCallbacks: true });
}
export default function Home() {
  const { articles, fetchArticles, fetchCategories } = useContentStore();
  const { products, fetchProducts } = useProductStore();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [founder, setFounder] = useState<any>(null);
  const [galleryProducts, setGalleryProducts] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchArticles();
    fetchCategories();
    fetchProducts();

    // Fetch founder data
    fetch('/api/founder').then(res => res.json()).then(data => setFounder(data)).catch(() => { });
  }, [fetchArticles, fetchCategories, fetchProducts]);

  useEffect(() => {
    if (mounted && products.length > 0 && galleryProducts.length === 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setGalleryProducts(shuffled.slice(0, 7));
    }
  }, [mounted, products, galleryProducts]);

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
        const sections = ["#about-section", "#team-section", "#articles-section", "#cta-section"];
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
          const counter = { val: 0 };
          gsap.to(counter, {
            scrollTrigger: {
              trigger: "#about-stats",
              start: "top 90%",
              once: true,
            },
            val: targetValue,
            duration: 2,
            ease: "expo.out",
            onUpdate: () => {
              stat.textContent = Math.round(counter.val).toString();
            }
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

        // Animations for Services and Steps have been moved to their respective components
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

  if (!mounted) return null;

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
                  sizes="40px"
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
            <span className="text-[9px] font-medium text-sky-700 tracking-[0.2em] uppercase text-center md:text-left">
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
          <span className="text-zinc-500 text-sm font-medium px-2">or</span>
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
          {galleryProducts.length > 0 ? (
            <>
              {/* Item 1 */}
              <Link
                href={`/products/${galleryProducts[0].code}/${slugify(galleryProducts[0].name)}`}
                className="relative aspect-4/5 lg:col-span-1 overflow-hidden rounded-xl group hero-gallery-item"
              >
                <Image
                  src={galleryProducts[0].media[0] || "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=800"}
                  alt={galleryProducts[0].name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-semibold">{galleryProducts[0].name}</p>
                </div>
              </Link>

              {/* Item 2 */}
              {galleryProducts[1] && (
                <Link
                  href={`/products/${galleryProducts[1].code}/${slugify(galleryProducts[1].name)}`}
                  className="group relative aspect-16/10 lg:col-span-2 overflow-hidden rounded-xl hero-gallery-item"
                >
                  <Image
                    src={galleryProducts[1].media[0] || "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=1200"}
                    alt={galleryProducts[1].name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-semibold">{galleryProducts[1].name}</p>
                  </div>
                </Link>
              )}

              {/* Item 3 */}
              {galleryProducts[2] && (
                <Link
                  href={`/products/${galleryProducts[2].code}/${slugify(galleryProducts[2].name)}`}
                  className="relative aspect-4/5 lg:col-start-4 overflow-hidden rounded-xl group hero-gallery-item"
                >
                  <Image
                    src={galleryProducts[2].media[0] || "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800"}
                    alt={galleryProducts[2].name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-semibold">{galleryProducts[2].name}</p>
                  </div>
                </Link>
              )}

              {/* Item 4 */}
              {galleryProducts[3] && (
                <Link
                  href={`/products/${galleryProducts[3].code}/${slugify(galleryProducts[3].name)}`}
                  className="relative hidden lg:block aspect-4/5 lg:col-start-5 overflow-hidden rounded-xl group hero-gallery-item"
                >
                  <Image
                    src={galleryProducts[3].media[0] || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800"}
                    alt={galleryProducts[3].name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-semibold">{galleryProducts[3].name}</p>
                  </div>
                </Link>
              )}

              {/* Item 5 */}
              {galleryProducts[4] && (
                <Link
                  href={`/products/${galleryProducts[4].code}/${slugify(galleryProducts[4].name)}`}
                  className="relative hidden lg:block aspect-16/10 lg:col-span-2 lg:row-start-2 overflow-hidden rounded-xl group hero-gallery-item"
                >
                  <Image
                    src={galleryProducts[4].media[0] || "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1200"}
                    alt={galleryProducts[4].name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-semibold">{galleryProducts[4].name}</p>
                  </div>
                </Link>
              )}

              {/* Item 6 */}
              {galleryProducts[5] && (
                <Link
                  href={`/products/${galleryProducts[5].code}/${slugify(galleryProducts[5].name)}`}
                  className="relative hidden lg:block aspect-4/5 lg:col-start-3 lg:row-start-2 overflow-hidden rounded-xl group hero-gallery-item"
                >
                  <Image
                    src={galleryProducts[5].media[0] || "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800"}
                    alt={galleryProducts[5].name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-semibold">{galleryProducts[5].name}</p>
                  </div>
                </Link>
              )}

              {/* Item 7 */}
              {galleryProducts[6] && (
                <Link
                  href={`/products/${galleryProducts[6].code}/${slugify(galleryProducts[6].name)}`}
                  className="relative hidden lg:block aspect-16/10 lg:col-span-2 lg:col-start-4 lg:row-start-2 overflow-hidden rounded-xl group hero-gallery-item"
                >
                  <Image
                    src={galleryProducts[6].media[0] || "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200"}
                    alt={galleryProducts[6].name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-semibold">{galleryProducts[6].name}</p>
                  </div>
                </Link>
              )}
            </>
          ) : (
            // Fallback empty loaders or placeholders could go here if products haven't loaded
            Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={`bg-zinc-100 animate-pulse rounded-xl ${i === 1 || i === 4 || i === 6 ? 'lg:col-span-2 aspect-16/10' : 'aspect-4/5'}`} />
            ))
          )}
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
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black">{t("home.about.stats.projects")}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center group border-l border-zinc-50">
            <span className="text-4xl font-bold text-zinc-900 mb-3 transition-transform group-hover:scale-110">
              <span className="stat-number" data-value="100">0</span>+
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black">{t("home.about.stats.team")}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center group border-l border-zinc-50">
            <span className="text-4xl font-bold text-zinc-900 mb-3 transition-transform group-hover:scale-110">
              <span className="stat-number" data-value="200">0</span>+
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black">{t("home.about.stats.reviews")}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center group border-l border-zinc-50">
            <span className="text-4xl font-bold text-zinc-900 mb-3 transition-transform group-hover:scale-110">
              <span className="stat-number" data-value="30">0</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black">{t("home.about.stats.awards")}</span>
          </div>
        </div>
      </section>

      <ServicesSection />

      <StepsSection />

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
                  <span className="text-[12px] font-medium text-zinc-600">{article.author}</span>
                  <span className="text-[12px] text-zinc-300">•</span>
                  <span className="text-[12px] font-medium text-zinc-600">5 min read</span>
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
                  <span className="text-[11px] font-medium text-zinc-600">
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

          <h3 className="text-zinc-500 text-xs md:text-sm max-w-xl leading-relaxed mb-10 italic font-medium">
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
