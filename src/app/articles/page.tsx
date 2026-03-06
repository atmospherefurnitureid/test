"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { slugify } from "@/lib/utils";
import { useContentStore } from "@/lib/contentStore";
import { ArrowUpRight, Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ArticlesPage() {
    const { t, language } = useLanguage();
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const { articles, fetchArticles } = useContentStore();
    const publishedArticles = (articles || []).filter((a: any) => a.status === "Published");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        fetchArticles();
    }, [fetchArticles]);

    const containerRef = useRef<HTMLDivElement>(null);

    // Get unique categories for filters
    const categories = ["All", ...new Set(publishedArticles.map((a: any) => a.category))];

    // Filter articles based on active filter and search
    const filteredArticles = publishedArticles.filter((a: any) => {
        const matchesCategory = activeFilter === "All" || a.category === activeFilter;

        // Search trigger: only filter if query is 3 characters or more
        const matchesSearch = searchQuery.length < 3 ||
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.category.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    useEffect(() => {
        if (!isMounted) return;

        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();

        const ctx = gsap.context(() => {
            // Header Animation
            gsap.from(".articles-header > *", {
                y: 30,
                autoAlpha: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
                immediateRender: false,
            });

            // Mobile-first reveal for article cards
            mm.add("(min-width: 0px)", () => {
                const cards = document.querySelectorAll(".article-card");
                if (cards.length > 0) {
                    gsap.from(cards, {
                        scrollTrigger: {
                            trigger: ".articles-grid",
                            start: "top 85%",
                            toggleActions: "play none none none"
                        },
                        y: 40,
                        autoAlpha: 0,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: "power2.out",
                        immediateRender: false,
                    });
                }
            });

        }, containerRef);

        return () => {
            ctx.revert();
            mm.revert();
        };
    }, [isMounted, filteredArticles.length]);

    return (
        <main ref={containerRef} className="min-h-screen bg-white text-zinc-900 font-poppins">
            <Navbar />

            {/* Header */}
            <section className="mx-auto w-full max-w-7xl px-6 pt-16 pb-8 articles-header">
                <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-semibold text-zinc-900 leading-[1.15] tracking-tight max-w-5xl">
                    {t("articles.title")}
                </h1>
                <p className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-2xl font-medium">
                    {t("articles.subtitle")}
                </p>
            </section>

            {/* Filters — Aligned with Products Style */}
            <section className="mx-auto w-full max-w-7xl px-6 py-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center w-full sm:w-auto h-10 gap-3">
                        <span className="text-sm font-bold text-zinc-900 whitespace-nowrap">
                            {t("articles.category")}
                        </span>
                        <div className="h-4 w-px bg-zinc-200 hidden sm:block"></div>
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-normal whitespace-nowrap transition-all cursor-pointer ${activeFilter === cat
                                        ? "bg-zinc-900 text-white shadow-md shadow-zinc-200"
                                        : "text-zinc-400 hover:text-zinc-900"
                                        }`}
                                >
                                    {cat === "All" ? (t("ID") === "ID" ? "Semua" : "All") : cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <span className="text-sm text-zinc-400 font-normal whitespace-nowrap tracking-widest hidden sm:block uppercase">
                        {filteredArticles.length} {t("articles.stats")}
                    </span>
                </div>

                {/* Search Bar — Match Products Style */}
                <div className="pt-8">
                    <div className="relative w-full">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder={t("articles.search_placeholder")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-200 pl-9 pb-4 pt-2 text-base text-zinc-900 focus:border-zinc-900 outline-none transition-all font-normal placeholder:text-zinc-300 rounded-none"
                        />
                        {searchQuery.length > 0 && searchQuery.length < 3 && (
                            <p className="text-[11px] text-zinc-400 mt-2 animate-pulse italic">
                                {t("articles.search_hint").replace("{count}", (3 - searchQuery.length).toString())}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Grid Area */}
            <section className="mx-auto w-full max-w-7xl px-6 pb-20 articles-grid">
                {filteredArticles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
                        <p className="text-lg font-bold">{language === 'ID' ? 'Tidak ada artikel.' : 'No articles found.'}</p>
                        <p className="text-sm mt-1">{language === 'ID' ? 'Coba ubah filter atau pencarian Anda.' : 'Try changing your filter or search query.'}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-l border-zinc-100">
                        {filteredArticles.map((article: any) => (
                            <Link
                                key={article._id}
                                href={`/articles/${article._id}/${slugify(article.title)}`}
                                className="article-card group flex flex-col p-6 border-r border-b border-zinc-100 transition-colors hover:bg-zinc-50/50"
                            >
                                {/* Image Part */}
                                <div className="relative aspect-16/10 rounded-xl overflow-hidden mb-6 bg-zinc-50 shadow-sm">
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
                                <div className="flex flex-col flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-bold text-sky-600 uppercase tracking-tighter">{article.author}</span>
                                        <span className="text-sm text-zinc-300">•</span>
                                        <span className="text-xs font-medium text-zinc-400">{t("articles.read_time")}</span>
                                    </div>

                                    <div className="flex justify-between items-start gap-4 mb-3">
                                        <h3 className="text-lg font-semibold text-zinc-900 leading-tight group-hover:text-sky-600 transition-colors">
                                            {article.title}
                                        </h3>
                                        <ArrowUpRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-900 transition-colors shrink-0 mt-1" />
                                    </div>

                                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2 mb-6 font-medium">
                                        {article.description}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between pt-5">
                                        <span className="px-3 py-1 bg-zinc-50 text-zinc-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-zinc-100">
                                            {article.category}
                                        </span>
                                        <span className="text-xs font-medium text-zinc-400">
                                            {article.date}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
