"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    ShoppingCart, Plus, Minus,
    Package, Play, Search, Check
} from "lucide-react";
import { useProductStore } from "@/lib/productStore";
import { useCartStore } from "@/lib/cartStore";
import { toSlug } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { toast } from "sonner";

// Preset order used for sorting category buttons
const CATEGORY_ORDER = ["All", "Kursi", "Meja", "Lemari", "Rak", "Bangku", "Stool", "Kabinet", "Credenza", "Nakas", "Bed Frame", "Sofa", "Konsol"];

export default function ProductsPageClient() {
    const { t, language } = useLanguage();
    const { products, fetchProducts } = useProductStore();
    const { addToCart, items: cartItems } = useCartStore();
    const [isMounted, setIsMounted] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeLabel, setActiveLabel] = useState("All Labels");
    const [searchQuery, setSearchQuery] = useState("");
    const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});
    const [activeImages, setActiveImages] = useState<Record<string, number>>({});

    useEffect(() => {
        setIsMounted(true);
        fetchProducts();
    }, []);

    // Build categories dynamically from products, preserving preferred ordering
    const categories = [
        "All",
        ...CATEGORY_ORDER.filter((c) => c !== "All" && products.some((p) => p.category === c)),
        ...Array.from(new Set(products.map((p) => p.category)))
            .filter((cat) => !CATEGORY_ORDER.includes(cat))
            .sort(),
    ];

    const labels = ["All Labels", "Kayu", "Besi", "Mixed"];

    const filteredProductsRaw = (products || []).filter((p) => {
        const matchesCategory = activeCategory === "All" || p.category === activeCategory;
        const matchesLabel = activeLabel === "All Labels" || p.label === activeLabel;
        const matchesSearch = searchQuery.length < 3 ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.code.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesLabel && matchesSearch;
    });

    // Deduplicate by code (SKU) to prevent redundant data entries
    const seenCodes = new Set();
    const filteredProducts = filteredProductsRaw.filter((p) => {
        if (seenCodes.has(p.code)) return false;
        seenCodes.add(p.code);
        return true;
    });

    const updateActiveImage = (code: string, idx: number) => {
        setActiveImages(prev => ({ ...prev, [code]: idx }));
    };

    const updateQty = useCallback((productCode: string, val: number) => {
        setProductQuantities(prev => ({ ...prev, [productCode]: val }));
    }, []);

    const getQty = useCallback((productCode: string) => {
        return productQuantities[productCode] || 0;
    }, [productQuantities]);

    const getMaxLimit = useCallback((product: any) => {
        if (product.status === "Pre-order") return 20;
        return product.stock || 0;
    }, []);

    return (
        <main className="min-h-screen bg-white text-zinc-900">
            <Navbar />

            {/* Header */}
            <section className="mx-auto w-full max-w-7xl px-6 pt-4 pb-4 md:pt-4 products-header text-left">
                <h1 className="mb-4 text-3xl md:text-5xl font-semibold text-zinc-900 leading-[1.1] tracking-tight max-w-5xl">
                    {t("home.products.title")}
                </h1>
                <p className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
                    {t("home.products.subtitle")}
                </p>
            </section>

            {/* Filter Units */}
            <section className="mx-auto w-full max-w-7xl px-6 py-8 space-y-2 filter-section">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center w-full sm:w-auto h-10 gap-6">
                        <span className="text-sm font-bold text-zinc-900 whitespace-nowrap w-16 pr-2 transition-colors uppercase tracking-tight">
                            {t("home.products.filter_type")}
                        </span>
                        <div className="h-4 w-px bg-zinc-200 hidden sm:block"></div>
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                            {labels.map((label) => (
                                <button
                                    key={label}
                                    onClick={() => setActiveLabel(label)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${activeLabel === label ? "bg-sky-500 text-white shadow-md shadow-sky-100" : "text-zinc-400 hover:text-zinc-900"}`}
                                >
                                    {(t(`home.products.labels.${label}`) as string) || label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center w-full sm:w-auto h-10 gap-6">
                        <span className="text-sm font-bold text-zinc-900 whitespace-nowrap w-16 pr-2 transition-colors uppercase tracking-tight">
                            {t("home.products.filter_category")}
                        </span>
                        <div className="h-4 w-px bg-zinc-200 hidden sm:block"></div>
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${activeCategory === cat ? "bg-sky-500 text-white shadow-md shadow-sky-100" : "text-zinc-400 hover:text-zinc-900"}`}
                                >
                                    {(t(`home.products.categories.${cat}`) as string) || cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <span className="text-sm text-zinc-400 font-normal whitespace-nowrap hidden sm:block">
                        {isMounted ? filteredProducts.length : 0} {t("home.products.stats")}
                    </span>
                </div>

                <div className="pt-8">
                    <div className="relative w-full">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder={t("home.products.search_placeholder")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-200 pl-9 pb-4 pt-2 text-base text-zinc-900 focus:border-zinc-900 outline-none transition-all font-normal placeholder:text-zinc-300 rounded-none"
                        />
                        {searchQuery.length > 0 && searchQuery.length < 3 && (
                            <p className="text-[11px] text-zinc-400 mt-2 animate-pulse italic">
                                {t("home.products.search_hint").replace("{count}", (3 - searchQuery.length).toString())}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Product Grid Area */}
            <section className="mx-auto w-full max-w-7xl px-6 pb-20 product-grid">
                {!isMounted ? (
                    <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
                        <p className="text-lg font-bold">{t("home.products.loading")}</p>
                        <p className="text-sm mt-1">{t("home.products.loading_subtitle")}</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
                        <p className="text-lg font-bold">{t("home.products.not_found")}</p>
                        <p className="text-sm mt-1">{t("home.products.not_found_subtitle")}</p>
                    </div>
                ) : (

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-l border-zinc-100">
                        {filteredProducts.map((product, productIdx) => {
                            const slug = toSlug(product.name);
                            const detailHref = `/products/${product.code}/${slug}`;
                            const discountPercentage = product.price > (product.memberPrice || product.price)
                                ? Math.round(((product.price - (product.memberPrice || product.price)) / product.price) * 100)
                                : 0;

                            return (
                                <div key={product.code} className="product-card group flex flex-col p-3 sm:p-6 border-r border-b border-zinc-100 transition-colors hover:bg-zinc-50/50">
                                        <div className="relative rounded-xl overflow-hidden mb-3 sm:mb-4 aspect-square bg-zinc-50 border border-zinc-100 group/img">
                                            <Link href={detailHref}>
                                                {(() => {
                                                    const displayIndex = activeImages[product.code] !== undefined ? activeImages[product.code] : product.mainMediaIndex;
                                                    const currentMedia = product.media[displayIndex] || product.media[0];
                                                    if (!currentMedia) return null;
                                                    const isVideo = currentMedia.match(/\.(mp4|webm|ogg|quicktime)$/i) || currentMedia.includes("video");
                                                    if (isVideo) return (
                                                        <video src={currentMedia} className="w-full h-full object-cover" muted loop playsInline autoPlay />
                                                    );
                                                    const isLCP = productIdx < 8;
                                                    return (
                                                        <Image 
                                                            src={currentMedia} 
                                                            alt={product.name} 
                                                            fill 
                                                            className="object-cover transition-all duration-700 group-hover/img:scale-105" 
                                                            loading={isLCP ? "eager" : "lazy"} 
                                                            priority={isLCP}
                                                            unoptimized={currentMedia.startsWith("http") || currentMedia.startsWith("data:")} 
                                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                        />
                                                    );
                                                })()}
                                            </Link>
                                            {product.status === "Pre-order" && (
                                            <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                                                <span className="text-[9px] sm:text-[11px] px-2 sm:px-3 py-0.5 sm:py-1 rounded-md font-semibold bg-[#FDF2E3] text-[#A66E38] border border-[#F5E1C4] shadow-sm">Pre-order</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative mb-4 hidden sm:block">
                                        <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth active:cursor-grabbing pb-1">
                                            {product.media.map((med, idx) => {
                                                const defaultIdx = product.mainMediaIndex ?? 0;
                                                const isActive = (activeImages[product.code] ?? defaultIdx) === idx;
                                                const isVideo = med.match(/\.(mp4|webm|ogg|quicktime)$/i) || med.includes("video");
                                                return (
                                                    <div
                                                        key={idx}
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={() => updateActiveImage(product.code, idx)}
                                                        onMouseEnter={() => updateActiveImage(product.code, idx)}
                                                        onKeyDown={(e) => e.key === "Enter" && updateActiveImage(product.code, idx)}
                                                        className={`relative flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${isActive ? "border-zinc-900 ring-2 ring-zinc-900/10" : "border-transparent opacity-60 hover:opacity-100"}`}
                                                    >
                                                        {isVideo
                                                            ? <div className="flex w-full h-full bg-zinc-100 items-center justify-center"><Play className="h-3 w-3 text-zinc-400" /></div>
                                                            : <Image src={med} alt={`${product.name} ${idx + 1}`} fill className="object-cover" unoptimized={med.startsWith("http") || med.startsWith("data:")} sizes="40px" />
                                                        }
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="mb-2 sm:mb-4">
                                        <h3 className="text-sm sm:text-lg font-semibold text-zinc-900 group-hover:text-sky-500 transition-colors leading-snug line-clamp-1 mb-1">
                                            <Link href={detailHref}>{product.name}</Link>
                                        </h3>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                            <p className="text-sm sm:text-base font-bold text-zinc-900 leading-tight">Rp {(product.memberPrice || product.price).toLocaleString("id-ID")}</p>
                                            {discountPercentage > 0 && <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-700 w-fit">-{discountPercentage}%</span>}
                                        </div>
                                    </div>

                                    <p className="text-base text-zinc-400 font-medium mb-4 hidden sm:block">{product.code} | {product.category} | {product.label}</p>
                                    <p className="text-base text-zinc-500 mb-6 leading-relaxed font-normal hidden sm:line-clamp-3">{product.description.replace(/<[^>]*>/g, '')}</p>

                                    <div className="mt-auto pt-4 border-t border-zinc-100 hidden sm:flex flex-col">
                                        <div className="flex items-center justify-between gap-1 mb-2 bg-zinc-50 border border-zinc-100 rounded-lg px-2 py-1 w-full">
                                            <button onClick={() => updateQty(product.code, Math.max(0, getQty(product.code) - 1))} className="h-7 w-7 flex items-center justify-center rounded-md bg-white border border-zinc-300 text-zinc-900 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" disabled={getQty(product.code) <= 0}><Minus className="h-4 w-4" /></button>
                                            <span className="text-[14px] font-bold text-zinc-900 w-8 text-center">{getQty(product.code)}</span>
                                            <button onClick={() => updateQty(product.code, Math.min(getMaxLimit(product), getQty(product.code) + 1))} className="h-7 w-7 flex items-center justify-center rounded-md bg-white border border-zinc-300 text-zinc-900 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" disabled={getQty(product.code) >= getMaxLimit(product)}><Plus className="h-4 w-4" /></button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={detailHref} className="text-sm font-semibold text-sky-500 underline underline-offset-4 decoration-sky-100 hover:decoration-sky-500 transition-all px-1 py-2">Quickview</Link>
                                            <button 
                                                onClick={() => { 
                                                    const qty = getQty(product.code);
                                                    if (qty > 0) { 
                                                        addToCart(product, qty); 
                                                        updateQty(product.code, 0); 
                                                        toast.success(`${product.name} ${t("home.products.added_to_cart")}`, {
                                                            description: t("home.products.added_to_cart_desc").replace("{count}", qty.toString()),
                                                            duration: 3000,
                                                        });
                                                    } 
                                                }} 
                                                disabled={!isMounted || getQty(product.code) === 0} 
                                                className="flex-1 bg-sky-500 text-white rounded-xl py-2 text-base font-semibold hover:bg-sky-600 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-sky-100 active:scale-95"
                                            >
                                                <ShoppingCart className="h-4 w-4" />
                                                <span>{t("home.products.add_to_cart")}</span>
                                                {isMounted && cartItems.filter(item => item.productCode === product.code).reduce((acc, curr) => acc + curr.quantity, 0) > 0 && <span className="bg-white text-sky-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">{cartItems.filter(item => item.productCode === product.code).reduce((acc, curr) => acc + curr.quantity, 0)}</span>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
