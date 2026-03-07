"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    ShoppingCart, Plus, Minus,
    Package, Play, Search
} from "lucide-react";
import { useProductStore } from "@/lib/productStore";
import { useCartStore } from "@/lib/cartStore";
import { toSlug } from "@/lib/utils";
import { useState, useEffect, useCallback, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Preset order used for sorting category buttons
const CATEGORY_ORDER = ["All", "Kursi", "Meja", "Lemari", "Rak", "Bangku", "Stool", "Kabinet", "Credenza", "Nakas", "Bed Frame", "Sofa", "Konsol"];

export default function ProductsPage() {
    const { products, fetchProducts } = useProductStore();
    const { addToCart, items: cartItems } = useCartStore();
    const [isMounted, setIsMounted] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeLabel, setActiveLabel] = useState("All Labels");
    const [searchQuery, setSearchQuery] = useState("");
    const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});
    const [activeImages, setActiveImages] = useState<Record<string, number>>({});
    const containerRef = useRef<HTMLDivElement>(null);

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

    const filteredProducts = (products || []).filter((p) => {
        const matchesCategory = activeCategory === "All" || p.category === activeCategory;
        const matchesLabel = activeLabel === "All Labels" || p.label === activeLabel;
        const matchesSearch = searchQuery.length < 3 ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.code.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesLabel && matchesSearch;
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

    // GSAP Scroll Animations
    useEffect(() => {
        if (!isMounted) return;

        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();

        const ctx = gsap.context(() => {
            // Header Animation
            gsap.from(".products-header > *", {
                y: 30,
                autoAlpha: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
                immediateRender: false,
            });

            // Mobile-first reveal for product cards
            mm.add("(min-width: 0px)", () => {
                const cards = document.querySelectorAll(".product-card");
                if (cards.length > 0) {
                    gsap.from(cards, {
                        scrollTrigger: {
                            trigger: ".product-grid",
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

            // Desktop enhancements
            mm.add("(min-width: 1024px)", () => {
                gsap.from(".filter-section", {
                    x: -20,
                    autoAlpha: 0,
                    duration: 0.8,
                    delay: 0.4,
                    ease: "power2.out",
                    immediateRender: false,
                });
            });

        }, containerRef);

        return () => {
            ctx.revert();
            mm.revert();
        };
    }, [isMounted, filteredProducts.length]);

    return (
        <main ref={containerRef} className="min-h-screen bg-white text-zinc-900">
            <Navbar />

            {/* Header */}
            <section className="mx-auto w-full max-w-7xl px-6 pt-16 pb-4 products-header">
                <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-semibold text-zinc-900 leading-[1.15] tracking-tight max-w-5xl">
                    Explore Our Furniture Pieces
                </h1>
                <p className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
                    Discover a curated selection of wood and iron furniture designed to blend natural art with modern elegance for your premium living spaces.
                </p>
            </section>

            {/* Filter Units */}
            <section className="mx-auto w-full max-w-7xl px-6 py-8 space-y-2 filter-section">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center w-full sm:w-auto h-10 gap-3">
                        <span className="text-sm font-bold text-zinc-900 whitespace-nowrap w-14">Jenis</span>
                        <div className="h-4 w-px bg-zinc-200 hidden sm:block"></div>
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
                            {labels.map((label) => (
                                <button
                                    key={label}
                                    onClick={() => setActiveLabel(label)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-normal whitespace-nowrap transition-all cursor-pointer ${activeLabel === label ? "bg-zinc-900 text-white shadow-md shadow-zinc-200" : "text-zinc-400 hover:text-zinc-900"}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center w-full sm:w-auto h-10 gap-3">
                        <span className="text-sm font-bold text-zinc-900 whitespace-nowrap w-14">Macam</span>
                        <div className="h-4 w-px bg-zinc-200 hidden sm:block"></div>
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-normal whitespace-nowrap transition-all cursor-pointer ${activeCategory === cat ? "bg-zinc-900 text-white shadow-md shadow-zinc-200" : "text-zinc-400 hover:text-zinc-900"}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <span className="text-sm text-zinc-400 font-normal whitespace-nowrap hidden sm:block">
                        {filteredProducts.length} items
                    </span>
                </div>

                <div className="pt-8">
                    <div className="relative w-full">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Cari Judul atau Kode Produk... (min. 3 karakter)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-200 pl-9 pb-4 pt-2 text-base text-zinc-900 focus:border-zinc-900 outline-none transition-all font-normal placeholder:text-zinc-300 rounded-none"
                        />
                        {searchQuery.length > 0 && searchQuery.length < 3 && (
                            <p className="text-[11px] text-zinc-400 mt-2 animate-pulse italic">
                                Ketik {3 - searchQuery.length} karakter lagi untuk mencari...
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Product Grid Area */}
            <section className="mx-auto w-full max-w-7xl px-6 pb-20 product-grid">
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
                        <p className="text-lg font-bold">No products available.</p>
                        <p className="text-sm mt-1">Check back soon or contact us for more.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-l border-zinc-100">
                        {filteredProducts.map((product) => {
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
                                                return (
                                                    <Image src={currentMedia} alt={product.name} fill className="object-cover transition-all duration-700 group-hover/img:scale-105" loading="lazy" unoptimized={currentMedia.startsWith("http") || currentMedia.startsWith("data:")} />
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
                                                    <button key={idx} onClick={() => updateActiveImage(product.code, idx)} onMouseEnter={() => updateActiveImage(product.code, idx)} className={`relative flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${isActive ? "border-zinc-900 ring-2 ring-zinc-900/10" : "border-transparent opacity-60 hover:opacity-100"}`}>
                                                        {isVideo ? <div className="w-full h-full bg-zinc-100 flex items-center justify-center"><Play className="h-3 w-3 text-zinc-400" /></div> : <Image src={med} alt={`${product.name} ${idx + 1}`} fill className="object-cover" unoptimized={med.startsWith("http") || med.startsWith("data:")} />}
                                                    </button>
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

                                    <p className="text-sm text-zinc-400 font-medium mb-4 hidden sm:block">{product.code} | {product.category} | {product.label}</p>
                                    <p className="text-sm text-zinc-500 mb-6 leading-relaxed font-normal hidden sm:line-clamp-3">{product.description.replace(/<[^>]*>/g, '')}</p>

                                    <div className="mt-auto pt-4 border-t border-zinc-100 hidden sm:flex flex-col">
                                        <div className="flex items-center justify-between gap-1 mb-2 bg-zinc-50 border border-zinc-100 rounded-lg px-2 py-1 w-full">
                                            <button onClick={() => updateQty(product.code, Math.max(0, getQty(product.code) - 1))} className="h-6 w-6 flex items-center justify-center rounded-md bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" disabled={getQty(product.code) <= 0}><Minus className="h-3 w-3" /></button>
                                            <span className="text-[14px] font-bold text-zinc-900 w-6 text-center">{getQty(product.code)}</span>
                                            <button onClick={() => updateQty(product.code, Math.min(getMaxLimit(product), getQty(product.code) + 1))} className="h-6 w-6 flex items-center justify-center rounded-md bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" disabled={getQty(product.code) >= getMaxLimit(product)}><Plus className="h-3 w-3" /></button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={detailHref} className="text-[14px] font-semibold text-sky-500 underline underline-offset-4 decoration-sky-100 hover:decoration-sky-500 transition-all px-1 py-2">Quickview</Link>
                                            <button onClick={() => { if (getQty(product.code) > 0) { addToCart(product, getQty(product.code)); updateQty(product.code, 0); } }} disabled={!isMounted || getQty(product.code) === 0} className="flex-1 bg-white border-2 border-zinc-200 rounded-xl py-2 text-base font-semibold text-zinc-900 hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
                                                <ShoppingCart className="h-4 w-4" />
                                                <span>Add to cart</span>
                                                {isMounted && cartItems.filter(item => item.productCode === product.code).reduce((acc, curr) => acc + curr.quantity, 0) > 0 && <span className="bg-zinc-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">{cartItems.filter(item => item.productCode === product.code).reduce((acc, curr) => acc + curr.quantity, 0)}</span>}
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
