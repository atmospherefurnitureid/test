"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronUp, Plus, Minus, Truck, ArrowLeft, ShoppingCart, ChevronRight, Play } from "lucide-react";
import { useProductStore } from "@/lib/productStore";
import { useCartStore } from "@/lib/cartStore";
import { useToast } from "@/components/ui/Toast";
import { Product } from "@/types";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { getProductByCode, fetchProductByCode } = useProductStore();
    const { addToCart } = useCartStore();
    const { toast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollNext = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 240, behavior: "smooth" });
        }
    };

    const code = params.code as string;

    // Fetch from API if the global store is empty (direct URL access)
    useEffect(() => {
        setIsMounted(true);
        const inStore = getProductByCode(code);
        if (!inStore) {
            setIsFetching(true);
            fetchProductByCode(code)
                .then((result) => {
                    if (!result) setNotFound(true);
                })
                .finally(() => setIsFetching(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);

    const [openSections, setOpenSections] = useState<Set<string>>(
        new Set(["description", "dimensions", "specs"])
    );

    const product = getProductByCode(code);

    const toggle = (section: string) => {
        setOpenSections(prev => {
            const next = new Set(prev);
            next.has(section) ? next.delete(section) : next.add(section);
            return next;
        });
    };
    const isOpen = (section: string) => openSections.has(section);

    useEffect(() => {
        if (product) {
            setCurrentMediaIndex(0);
        }
    }, [product]);

    // Show skeleton while fetching from API
    if (!isMounted || isFetching) {
        return (
            <main className="min-h-screen bg-white">
                <Navbar />
                <div className="mx-auto w-full max-w-7xl px-6 pt-8 pb-24">
                    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-7 aspect-[4/5] bg-zinc-100 rounded-2xl" />
                        <div className="lg:col-span-5 space-y-4 pt-4">
                            <div className="h-4 bg-zinc-100 rounded w-1/3" />
                            <div className="h-10 bg-zinc-100 rounded w-3/4" />
                            <div className="h-8 bg-zinc-100 rounded w-1/2" />
                            <div className="h-12 bg-zinc-100 rounded-xl w-full mt-6" />
                            <div className="h-12 bg-zinc-100 rounded-xl w-full" />
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    if (notFound || !product) {
        return (
            <main className="min-h-screen bg-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                    <h1 className="text-xl font-bold text-zinc-900 mb-2 tracking-tight">Product not found</h1>
                    <button onClick={() => router.push("/products")} className="px-6 py-2.5 bg-zinc-900 text-white rounded-full font-bold text-[10px] uppercase tracking-widest">
                        Back to Products
                    </button>
                </div>
                <Footer />
            </main>
        );
    }

    const formattedPrice = `Rp ${product.price.toLocaleString("id-ID")}`;
    const formattedMember = `Rp ${product.memberPrice.toLocaleString("id-ID")}`;
    const savingsAmount = product.price - product.memberPrice;

    return (
        <main className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
            <Navbar />

            <div className="mx-auto w-full max-w-7xl px-6 pt-8 pb-24">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm md:text-[15px] font-bold text-zinc-400 mb-8 tracking-tight hover:text-zinc-600 transition"
                >
                    <ArrowLeft className="h-5 w-5" /> Back to Products
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* ── LEFT: Images ───────────────────────────────────── */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="aspect-[4/5] bg-zinc-50 rounded-2xl overflow-hidden relative border border-zinc-100 shadow-sm">
                            {(() => {
                                const med = product.media[currentMediaIndex];
                                const isVideo = med.match(/\.(mp4|webm|ogg|quicktime)$/i) || med.includes("video") || med.startsWith("data:video");

                                if (isVideo) {
                                    return (
                                        <video
                                            src={med}
                                            className="w-full h-full object-cover"
                                            controls
                                            autoPlay
                                            muted
                                            loop
                                        />
                                    );
                                }

                                return (
                                    <Image
                                        src={med}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        priority
                                        unoptimized={med.startsWith("http") || med.startsWith("data:")}
                                    />
                                );
                            })()}
                            {/* Pre-order Badge — Neutral/Black */}
                            {product.status === "Pre-order" && (
                                <div className="absolute top-4 left-4">
                                    <span className="text-sm px-3 py-1.5 rounded-lg font-bold tracking-tight bg-zinc-900 text-white shadow-lg">
                                        Pre-order
                                    </span>
                                </div>
                            )}
                        </div>
                        {/* Thumbnails Slider — horizontal scroll with integrated arrow */}
                        {product.media.length > 1 && (
                            <div className="relative">
                                <div
                                    ref={scrollRef}
                                    className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-1"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    {product.media.map((med, idx) => {
                                        const isVideo = med.match(/\.(mp4|webm|ogg|quicktime)$/i) || med.includes("video") || med.startsWith("data:video");
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentMediaIndex(idx)}
                                                className={`aspect-square w-20 flex-shrink-0 bg-zinc-50 rounded-xl overflow-hidden relative border-2 transition-all ${currentMediaIndex === idx ? "border-zinc-900" : "border-zinc-50 opacity-60 hover:opacity-100"}`}
                                            >
                                                {isVideo ? (
                                                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                                                        <Play className="h-6 w-6 text-zinc-400" />
                                                    </div>
                                                ) : (
                                                    <Image
                                                        src={med}
                                                        alt=""
                                                        fill
                                                        className="object-cover"
                                                        loading="lazy"
                                                        unoptimized={med.startsWith("http") || med.startsWith("data:")}
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                    {/* Spacer to allow scrolling past the arrow */}
                                    <div className="w-12 shrink-0 md:hidden"></div>
                                </div>

                                {/* Pagination Arrow — Fixed Inside Overlay */}
                                <button
                                    onClick={scrollNext}
                                    className="absolute right-0 top-0 bottom-1 w-12 bg-gradient-to-l from-white via-white/80 to-transparent flex items-center justify-end pr-2 text-zinc-400 hover:text-zinc-900 transition-all z-10"
                                    aria-label="Next images"
                                >
                                    <div className="h-8 w-8 bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-zinc-100 flex items-center justify-center">
                                        <ChevronRight className="h-4 w-4" />
                                    </div>
                                </button>
                            </div>
                        )}

                    </div>

                    {/* ── RIGHT: Info Panel ──────────────────────────────── */}
                    <div className="lg:col-span-5 space-y-3 sticky top-32 h-fit">

                        {/* Title Block */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-medium text-zinc-400 capitalize">
                                    {(product.collection || product.category).toLowerCase()}
                                </p>
                                <span className="text-sm font-medium text-zinc-500 bg-zinc-50 border border-zinc-100 px-2 py-0.5 rounded-md">
                                    {product.code}
                                </span>
                                {product.status === "Pre-order" && (
                                    <span className="text-sm px-2 py-0.5 rounded-md font-bold bg-amber-50 text-amber-600 border border-amber-100">
                                        Pre-order
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-zinc-900 leading-[1.15] tracking-tight">
                                {product.name}
                            </h1>
                        </div>

                        {/* Pricing — Tight Column Layout */}
                        <div className="space-y-3 py-1">
                            <div className="flex flex-col gap-3">
                                {product.memberPrice > 0 ? (
                                    <>
                                        <div className="space-y-0.5">
                                            <p className="text-sm text-zinc-900 tracking-tight inline-block">Special Price</p>
                                            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tighter">{formattedMember}</p>
                                        </div>

                                        <div className="space-y-0.5 pt-1.5 border-t border-zinc-200/60">
                                            <p className="text-sm text-zinc-400 tracking-tight">Normal Price</p>
                                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-zinc-400 line-through tracking-tight">{formattedPrice}</p>
                                        </div>

                                        <div className="pt-0.5">
                                            <p className="text-sm text-zinc-500 tracking-tight">
                                                You save <span className="text-zinc-900 font-bold">Rp {savingsAmount.toLocaleString("id-ID")}</span>
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-0.5">
                                        <p className="text-sm text-zinc-400 tracking-tight">Price</p>
                                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tighter">{formattedPrice}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Qty & Add to Cart */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border border-zinc-200 rounded-xl h-12 bg-white px-2">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="h-8 w-8 flex items-center justify-center hover:bg-zinc-50 rounded-lg transition cursor-pointer"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="h-8 w-8 flex items-center justify-center hover:bg-zinc-50 rounded-lg transition cursor-pointer"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        addToCart(product, quantity);
                                        toast({
                                            title: "Berhasil!",
                                            description: `${product.name} telah ditambahkan ke keranjang.`,
                                            type: "success"
                                        });
                                    }}
                                    className="flex-1 h-12 bg-zinc-900 text-white text-base font-semibold tracking-tight hover:bg-zinc-800 transition-all rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-zinc-100 cursor-pointer"
                                >
                                    <ShoppingCart className="h-4 w-4" /> {product.status === "Pre-order" ? "Pre-order Now" : "Add to cart"}
                                </button>
                            </div>
                            {(() => {
                                const sellingPrice = product.memberPrice > 0 ? product.memberPrice : product.price;
                                const totalEstimasi = sellingPrice * quantity;
                                const promoText = product.memberPrice > 0 ? `%0A- *Harga Promo*: Rp ${product.memberPrice.toLocaleString("id-ID")}` : "";

                                return (
                                    <Link
                                        href={`https://wa.me/62882005824231?text=Halo Atmosphere Furniture,%0A%0ASaya ingin berkonsultasi mengenai produk berikut:%0A%0A- *Produk*: ${product.name}%0A- *Kode*: ${product.code}%0A- *Kategori*: ${product.category}%0A- *Koleksi*: ${product.collection}%0A- *Status*: ${product.status}%0A- *Deskripsi*: ${(product.description || "").replace(/<[^>]*>?/gm, "").slice(0, 100)}...%0A- *Jumlah*: ${quantity} unit%0A- *Harga*: Rp ${product.price.toLocaleString("id-ID")}${promoText}%0A- *Total Estimasi*: Rp ${totalEstimasi.toLocaleString("id-ID")}%0A%0A*Link Produk*: ${typeof window !== 'undefined' ? window.location.href : ''}`}
                                        target="_blank"
                                        className="h-12 border-2 border-zinc-900 text-zinc-900 text-base font-semibold tracking-tight hover:bg-zinc-900 hover:text-white transition-all rounded-xl cursor-pointer flex items-center justify-center font-poppins"
                                    >
                                        Consult Now
                                    </Link>
                                );
                            })()}
                        </div>



                        {/* Content Accordions */}
                        <div className="pt-2 divide-y divide-zinc-100">
                            {/* Description */}
                            <div className="overflow-hidden">
                                <button onClick={() => toggle("description")} className="w-full py-4 flex justify-between items-center transition-colors group">
                                    <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-900 tracking-tight">Description</span>
                                    {isOpen("description") ? <ChevronUp className="h-4 w-4 text-zinc-300" /> : <ChevronDown className="h-4 w-4 text-zinc-300" />}
                                </button>
                                {isOpen("description") && (
                                    <div className="pb-6">
                                        <div
                                            className="text-base md:text-lg text-zinc-500 leading-relaxed prose-zinc font-normal"
                                            dangerouslySetInnerHTML={{ __html: product.description || "<p>No description available.</p>" }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Dimensions */}
                            <div className="overflow-hidden">
                                <button onClick={() => toggle("dimensions")} className="w-full py-4 flex justify-between items-center transition-colors group">
                                    <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-900 tracking-tight">Dimensions</span>
                                    {isOpen("dimensions") ? <ChevronUp className="h-4 w-4 text-zinc-300" /> : <ChevronDown className="h-4 w-4 text-zinc-300" />}
                                </button>
                                {isOpen("dimensions") && (
                                    <div className="pb-6 space-y-3">
                                        {[
                                            ["Product", product.dimensions.product],
                                            ["Weight", product.dimensions.weight],
                                            ["Packaged", product.dimensions.packaged]
                                        ].filter(([, v]) => v).map(([k, v]) => (
                                            <div key={k} className="flex justify-between text-sm">
                                                <span className="text-zinc-400 tracking-tight font-normal">{k}:</span>
                                                <span className="text-zinc-900 font-bold">{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Specifications */}
                            {product.specifications?.length > 0 && (
                                <div className="overflow-hidden">
                                    <button onClick={() => toggle("specs")} className="w-full py-4 flex justify-between items-center transition-colors group">
                                        <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-900 tracking-tight">Specifications</span>
                                        {isOpen("specs") ? <ChevronUp className="h-4 w-4 text-zinc-300" /> : <ChevronDown className="h-4 w-4 text-zinc-300" />}
                                    </button>
                                    {isOpen("specs") && (
                                        <div className="pb-6 space-y-2">
                                            {product.specifications.map((spec, idx) => (
                                                <div key={idx} className="flex justify-between text-sm border-b border-zinc-50 pb-2">
                                                    <span className="text-zinc-400 tracking-tight font-normal">{spec.key}</span>
                                                    <span className="text-zinc-900 font-bold">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Material & Finish */}
                            {product.fabric && (
                                <div className="overflow-hidden">
                                    <button onClick={() => toggle("material")} className="w-full py-4 flex justify-between items-center transition-colors group">
                                        <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-900 tracking-tight">Material Detail</span>
                                        {isOpen("material") ? <ChevronUp className="h-4 w-4 text-zinc-300" /> : <ChevronDown className="h-4 w-4 text-zinc-300" />}
                                    </button>
                                    {isOpen("material") && (
                                        <div className="pb-6">
                                            <p className="text-sm text-zinc-500 leading-relaxed font-normal">{product.fabric}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Service & Guarantee */}
                            <div className="overflow-hidden">
                                <button onClick={() => toggle("service")} className="w-full py-4 flex justify-between items-center transition-colors group">
                                    <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-900 tracking-tight">Service & Guarantee</span>
                                    {isOpen("service") ? <ChevronUp className="h-4 w-4 text-zinc-300" /> : <ChevronDown className="h-4 w-4 text-zinc-300" />}
                                </button>
                                {isOpen("service") && (
                                    <div className="pb-6 space-y-4">
                                        {product.additionalInfo?.warranty && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Garansi</span>
                                                <p className="text-sm text-zinc-900 font-medium">{product.additionalInfo.warranty}</p>
                                            </div>
                                        )}
                                        {product.additionalInfo?.production && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Estimasi Produksi</span>
                                                <p className="text-sm text-zinc-900 font-medium">{product.additionalInfo.production}</p>
                                            </div>
                                        )}
                                        {product.additionalInfo?.care && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Panduan Perawatan</span>
                                                <p className="text-sm text-zinc-500 font-normal leading-relaxed">{product.additionalInfo.care}</p>
                                            </div>
                                        )}
                                        {product.returns && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Kebijakan Return</span>
                                                <p className="text-sm text-zinc-500 font-normal leading-relaxed">{product.returns}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Delivery Info — Relocated here */}
                            <div className="pt-6 border-t border-zinc-50">
                                <div className="flex items-center gap-2 text-sm text-zinc-500 tracking-tight bg-zinc-50 w-full px-4 py-3 rounded-xl font-normal">
                                    <Truck className="h-5 w-5 text-zinc-400" />
                                    <span>{product.delivery}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
