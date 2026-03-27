"use client";

import { useState, useEffect } from "react";
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
const AdUnit = dynamic(() => import("@/components/AdUnit"), { ssr: false });

import { useContentStore } from "@/lib/contentStore";
import { useProductStore } from "@/lib/productStore";
import { slugify } from "@/lib/utils";
import { ArrowUpRight, Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { DUMMY_FOUNDER } from "@/lib/dummyData";

interface HomePageClientProps {
  initialProducts?: any[];
  initialArticles?: any[];
}

export default function Home({ initialProducts = [], initialArticles = [] }: HomePageClientProps) {
  const { articles, fetchArticles, fetchCategories } = useContentStore();
  const { products, fetchProducts } = useProductStore();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [founder, setFounder] = useState<any>(DUMMY_FOUNDER);
  const [galleryProducts, setGalleryProducts] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    // Only fetch if stores are empty to avoid redundant network calls
    if (articles.length === 0) fetchArticles();
    if (products.length === 0) fetchProducts();
  }, [fetchArticles, fetchProducts, articles.length, products.length]);

  useEffect(() => {
    if (products.length > 0 || initialProducts.length > 0) {
      const sourceProducts = products.length > 0 ? products : initialProducts;
      if (galleryProducts.length === 0) {
        // Use a stable selection for SSR/Initial mount to avoid CLS
        // Shuffle only if specifically desired, but here we prefer consistency
        const sorted = [...sourceProducts].slice(0, 9);
        setGalleryProducts(sorted);
      }
    }
  }, [products, initialProducts, galleryProducts.length]);

  // Get 4 latest published articles (prefer initial if store empty)
  const currentArticles = articles.length > 0 ? articles : initialArticles;
  const latestArticles = (currentArticles || [])
    .filter(a => a.status === "Published")
    .slice(0, 4);


  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Header Section */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-4 pb-12 md:pt-16 text-center hero-content">
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
            <span className="text-sm text-zinc-900 font-semibold tracking-tight text-center md:text-left">
              {t("home.hero.badge")}
            </span>
            <span className="text-sm font-medium text-sky-700 tracking-normal text-center md:text-left">
              {t("home.hero.badge_desc")}
            </span>
          </div>
        </header>

        <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-semibold text-zinc-900 leading-[1.15] tracking-tight max-w-5xl whitespace-pre-line">
          {t("home.hero.title")}
        </h1>

        <p className="mb-8 text-zinc-500 text-base leading-relaxed max-w-2xl mx-auto font-medium">
          {t("home.hero.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="https://wa.me/62882005824231"
            target="_blank"
            className="rounded-full bg-sky-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-sky-600 transition-all shadow-lg flex items-center justify-center min-w-[200px] w-full sm:w-auto cursor-pointer"
          >
            {t("home.hero.cta_primary")}
          </Link>
          <span className="text-zinc-500 text-sm font-medium px-2">or</span>
          <Link
            href="/products"
            className="rounded-full border-2 border-sky-500 bg-white px-8 py-3.5 text-sm font-semibold text-sky-600 hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center min-w-[200px] w-full sm:w-auto cursor-pointer"
          >
            {t("home.hero.cta_secondary")}
          </Link>
        </div>
      </section>

      {/* Hero Gallery Grid Section */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-10">
          {(galleryProducts.length > 0 || initialProducts.length > 0) ? (
            <>
              {/* Row 1: 5 Items */}
              {(galleryProducts.length > 0 ? galleryProducts : initialProducts).slice(0, 5).map((product, idx) => (
                <Link
                  key={`hero-row1-${product.code}-${idx}`}
                  href={`/products/${product.code}/${slugify(product.name)}`}
                  className={`relative aspect-[4/5] sm:col-span-1 lg:col-span-2 overflow-hidden rounded-xl group hero-gallery-item ${idx > 1 ? 'hidden sm:block' : ''} ${idx > 1 ? 'lg:block' : ''}`}
                >
                  <Image
                    src={product.media[0] || "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=800"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority={idx < 2}
                    loading={idx < 2 ? "eager" : "lazy"}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-semibold">{product.name}</p>
                  </div>
                </Link>
              ))}

              {/* Row 2: 4 Items Centered */}
              {(() => {
                const currentData = galleryProducts.length > 0 ? galleryProducts : initialProducts;
                return currentData[5] && (
                  <Link
                    href={`/products/${currentData[5].code}/${slugify(currentData[5].name)}`}
                    className="group relative aspect-[4/5] sm:col-span-1 lg:col-span-2 lg:col-start-2 lg:row-start-2 overflow-hidden rounded-xl hero-gallery-item hidden md:block"
                  >
                    <Image
                      src={currentData[5].media[0] || "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=1200"}
                      alt={currentData[5].name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      sizes="(max-width: 1024px) 50vw, 20vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-semibold">{currentData[5].name}</p>
                    </div>
                  </Link>
                );
              })()}

              {/* Next 3 items just span normally in the second row */}
              {(() => {
                const currentData = galleryProducts.length > 0 ? galleryProducts : initialProducts;
                return currentData.slice(6, 9).map((product, idx) => (
                  <Link
                    key={`hero-row2-${product.code}-${idx}`}
                    href={`/products/${product.code}/${slugify(product.name)}`}
                    className="relative aspect-[4/5] sm:col-span-1 lg:col-span-2 overflow-hidden rounded-xl group hero-gallery-item hidden md:block"
                  >
                    <Image
                      src={product.media[0] || "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      sizes="(max-width: 1024px) 50vw, 20vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-semibold">{product.name}</p>
                    </div>
                  </Link>
                ));
              })()}
            </>
          ) : (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`loader-row1-${i}`} className={`bg-zinc-100 animate-pulse rounded-xl aspect-[4/5] sm:col-span-1 lg:col-span-2 ${i > 1 ? 'hidden sm:block' : ''}`} />
              ))}
              <div className="bg-zinc-100 animate-pulse rounded-xl sm:col-span-1 lg:col-start-2 lg:col-span-2 aspect-[4/5] hidden md:block" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`loader-row2-${i}`} className="bg-zinc-100 animate-pulse rounded-xl sm:col-span-1 lg:col-span-2 aspect-[4/5] hidden md:block" />
              ))}
            </>
          )}
        </div>

        {/* Load More Products Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/products"
            className="group flex items-center gap-2 rounded-full border border-sky-200 bg-white px-8 py-3.5 text-sm font-semibold text-sky-600 transition-all hover:bg-sky-50 hover:shadow-md"
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

      {/* AdSense Unit */}
      <AdUnit slot="4274589480" style={{ display: 'block' }} />





      {/* About Us Section */}


      <ServicesSection />

      <StepsSection />

      {/* Our Team Section */}


      <section id="articles-section" className="mx-auto w-full max-w-7xl px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 text-left">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-semibold text-zinc-900 leading-[1.2] tracking-tighter">
              {t("home.articles.title")}
            </h2>
            <p className="mt-4 text-zinc-500 text-base leading-relaxed max-w-2xl font-medium">
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
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized={article.image.startsWith("http") || article.image.startsWith("data:")}
                />
              </div>

              {/* Content Part */}
              <div className="flex flex-col flex-1 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-zinc-600">{article.author}</span>
                  <span className="text-sm text-zinc-300">•</span>
                  <span className="text-sm font-medium text-zinc-600">5 min read</span>
                </div>

                <div className="flex justify-between items-start gap-4 mb-3">
                  <h3 className="text-base font-semibold text-zinc-900 leading-tight group-hover:text-sky-600 transition-colors">
                    {article.title}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-900 transition-colors shrink-0 mt-1" />
                </div>

                <p className="text-base text-zinc-500 leading-relaxed line-clamp-2 mb-6 font-medium">
                  {article.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-5">
                  <span className="px-3 py-1 bg-zinc-50 text-zinc-500 text-sm font-medium rounded-lg border border-zinc-100">
                    {article.category}
                  </span>
                  <span className="text-sm font-medium text-zinc-400">
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
            className="group flex items-center gap-2 rounded-full border border-sky-200 bg-white px-8 py-3.5 text-sm font-semibold text-sky-600 transition-all hover:bg-sky-50 hover:shadow-md"
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
            <div className="relative z-10 w-28 h-28 flex items-center justify-center">
              <Image
                src="/logo-atmosphere.png"
                alt="Atmosphere Logo"
                fill
                className="object-contain"
                sizes="112px"
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
