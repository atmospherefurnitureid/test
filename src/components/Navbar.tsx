"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useState, useEffect, useRef } from "react";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useContentStore } from "@/lib/contentStore";
import gsap from "gsap";

export default function Navbar() {
    const pathname = usePathname();
    const { items: cartItems } = useCartStore();
    const { language, setLanguage, t } = useLanguage();
    const [isMounted, setIsMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const servicesRef = useRef<HTMLDivElement>(null);
    const langRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);

        const handleClickOutside = (event: MouseEvent) => {
            if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
                setIsServicesOpen(false);
            }
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Separate useEffect for animation to ensure DOM is ready with all isMounted items
    useEffect(() => {
        if (!isMounted) return;

        const ctx = gsap.context(() => {
            gsap.from(".nav-content > *", {
                y: -10,
                autoAlpha: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            });
        });

        return () => ctx.revert();
    }, [isMounted]);

    const navLinks = [
        { name: t("navbar.home"), href: "/" },
        { name: t("navbar.products"), href: "/products" },
        {
            name: t("navbar.services"),
            href: "#",
            isDropdown: true,
            subLinks: [
                { name: t("navbar.services_1") || "Desain yang Dipersonalisasi Sepenuhnya", href: "/services/desain-yang-dipersonalisasi-sepenuhnya" },
                { name: t("navbar.services_2") || "Kualitas dan Ketelitian Pengerjaan", href: "/services/kualitas-dan-ketelitian-pengerjaan" },
                { name: t("navbar.services_3") || "Solusi Fungsional dan Estetis", href: "/services/solusi-fungsional-dan-estetis" },
                { name: t("navbar.services_4") || "Kolaborasi untuk Hasil Terbaik", href: "/services/kolaborasi-untuk-hasil-terbaik" },
            ]
        },
        { name: t("navbar.artikel"), href: "/articles" },
        { name: t("navbar.contact"), href: "/contact" },
    ];

    return (
        <nav className="sticky top-0 z-[100] w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md overflow-x-clip transition-colors">

            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 nav-content">
                {/* Logo & Brand */}
                <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                    <div className="relative h-14 w-14 overflow-hidden">
                        <Image
                            src="/logo-atmosphere.png"
                            alt="Atmosphere Furniture Indonesia"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="hidden md:block h-8 w-[1px] bg-zinc-200"></div>
                    <div className="hidden md:flex flex-col -gap-1">
                        <span className="text-base font-bold tracking-tight text-zinc-900 leading-none">
                            Atmosphere Furniture
                        </span>
                        <span className="text-[11px] font-medium tracking-[0.2em] text-zinc-400 uppercase">
                            Indonesia
                        </span>
                    </div>
                </Link>

                {/* Navigation Links — Desktop */}
                <div className="hidden md:flex items-center gap-3">
                    {navLinks.map((link) => {
                        if (link.isDropdown) {
                            const isChildActive = link.subLinks?.some(sub => pathname === sub.href);
                            return (
                                <div key={link.name} className="relative group" ref={servicesRef}>
                                    <button
                                        onClick={() => setIsServicesOpen(!isServicesOpen)}
                                        onMouseEnter={() => setIsServicesOpen(true)}
                                        className={`flex items-center gap-1 text-[13px] font-medium transition-all duration-300 cursor-pointer px-4 py-2 relative ${isChildActive
                                            ? "text-zinc-900 after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-zinc-900"
                                            : "text-zinc-500 hover:text-zinc-900"
                                            }`}
                                    >
                                        {link.name}
                                        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isServicesOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div
                                        onMouseLeave={() => setIsServicesOpen(false)}
                                        className={`absolute top-full left-0 mt-2 w-64 bg-white border border-zinc-100 rounded-2xl shadow-xl shadow-zinc-200/50 p-2 transition-all duration-300 origin-top-left ${isServicesOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"}`}
                                    >
                                        {link.subLinks?.map((sub) => (
                                            <Link
                                                key={sub.href}
                                                href={sub.href}
                                                onClick={() => setIsServicesOpen(false)}
                                                className={`block px-4 py-3 text-[13px] font-medium rounded-xl transition-all ${pathname === sub.href
                                                    ? "bg-zinc-50 text-zinc-900"
                                                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                                    }`}
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-[13px] font-medium transition-all duration-300 px-4 py-2 relative ${isActive
                                    ? "text-zinc-900 after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-zinc-900"
                                    : "text-zinc-500 hover:text-zinc-900"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}

                    {/* Cart Indicator */}
                    <div className="h-6 w-[1px] bg-zinc-100 mx-2"></div>
                    <div className="flex items-center gap-1">
                        <Link href="/products/checkout" aria-label="Lihat Keranjang Belanja" className="relative p-2 text-zinc-500 hover:text-zinc-900 transition-colors">
                            <ShoppingCart className="h-5 w-5" />
                            {isMounted && cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white">
                                    {cartItems.reduce((q, item) => q + item.quantity, 0)}
                                </span>
                            )}
                        </Link>

                        {/* Language Selector — click-driven, closes via langRef mousedown listener */}
                        <div
                            className="relative"
                            ref={langRef}
                        >
                            <div
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-3 px-3 py-1.5 bg-zinc-50 rounded-full border border-zinc-100 hover:bg-zinc-100 transition-colors cursor-pointer select-none"
                            >
                                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-zinc-200 shadow-sm">
                                    {isMounted && (
                                        <Image
                                            src={language === "ID" ? "/images/flags/id.png" : "/images/flags/us.png"}
                                            alt={language === "ID" ? "Bahasa Indonesia" : "English"}
                                            fill
                                            sizes="24px"
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                                <span className="text-[12px] font-black text-zinc-900 tracking-tight">
                                    {isMounted ? language : "ID"}
                                </span>
                                {isMounted && (
                                    <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`} />
                                )}
                            </div>

                            {/* Language Dropdown */}
                            <div className={`absolute top-full right-0 pt-2 w-44 transition-all duration-200 origin-top-right z-[110] ${isLangOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"}`}>
                                <div className="bg-white border border-zinc-100 rounded-2xl shadow-xl shadow-zinc-200/50 p-2">
                                    <button
                                        onMouseDown={(e) => { e.preventDefault(); setLanguage("ID"); setIsLangOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${language === "ID" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"}`}
                                    >
                                        <div className="relative w-5 h-5 rounded-full overflow-hidden border border-zinc-200 shrink-0">
                                            <Image src="/images/flags/id.png" alt="Bahasa Indonesia" fill sizes="20px" className="object-cover" />
                                        </div>
                                        <span className="text-[13px] font-bold">Indonesia</span>
                                        {language === "ID" && <span className="ml-auto text-[10px] font-black">✓</span>}
                                    </button>
                                    <button
                                        onMouseDown={(e) => { e.preventDefault(); setLanguage("EN"); setIsLangOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${language === "EN" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"}`}
                                    >
                                        <div className="relative w-5 h-5 rounded-full overflow-hidden border border-zinc-200 shrink-0">
                                            <Image src="/images/flags/us.png" alt="English (US)" fill sizes="20px" className="object-cover" />
                                        </div>
                                        <span className="text-[13px] font-bold">English (US)</span>
                                        {language === "EN" && <span className="ml-auto text-[10px] font-black">✓</span>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Controls */}
                <div className="flex md:hidden items-center gap-2">
                    <Link href="/products/checkout" aria-label="Lihat Keranjang Belanja" className="relative p-2 text-zinc-500">
                        <ShoppingCart className="h-5 w-5" />
                        {isMounted && cartItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-zinc-900 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white">
                                {cartItems.reduce((q, item) => q + item.quantity, 0)}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Language Selector */}
                    <div className="relative" ref={langRef}>
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-50 rounded-full border border-zinc-100 shadow-sm active:bg-zinc-100 transition-colors"
                        >
                            <div className="relative w-5 h-5 rounded-full overflow-hidden border border-zinc-200">
                                {isMounted && (
                                    <Image
                                        src={language === "ID" ? "/images/flags/id.png" : "/images/flags/us.png"}
                                        alt={language === "ID" ? "Bahasa Indonesia" : "English"}
                                        fill
                                        sizes="20px"
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <span className="text-[11px] font-black text-zinc-900 tracking-tight">
                                {isMounted ? language : "ID"}
                            </span>
                        </button>

                        {/* Mobile Dropdown */}
                        <div className={`absolute top-full right-0 mt-2 w-36 bg-white border border-zinc-100 rounded-2xl shadow-xl p-1.5 transition-all duration-300 origin-top-right z-[110] ${isLangOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"}`}>
                            <button
                                onClick={() => { setLanguage("ID"); setIsLangOpen(false); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${language === "ID" ? "bg-zinc-50 text-zinc-900" : "text-zinc-500"}`}
                            >
                                <div className="relative w-4 h-4 rounded-full overflow-hidden border border-zinc-200 shrink-0">
                                    <Image src="/images/flags/id.png" alt="Bahasa Indonesia" fill sizes="16px" className="object-cover" />
                                </div>
                                <span className="text-[12px] font-bold">Indonesia</span>
                            </button>
                            <button
                                onClick={() => { setLanguage("EN"); setIsLangOpen(false); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${language === "EN" ? "bg-zinc-50 text-zinc-900" : "text-zinc-500"}`}
                            >
                                <div className="relative w-4 h-4 rounded-full overflow-hidden border border-zinc-200 shrink-0">
                                    <Image src="/images/flags/us.png" alt="English (US)" fill sizes="16px" className="object-cover" />
                                </div>
                                <span className="text-[12px] font-bold">English</span>
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? "Tutup Menu" : "Buka Menu"}
                        aria-expanded={isMenuOpen}
                        className="p-2 text-zinc-900"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>


            {/* Mobile Menu Overlay — Sidebar Animation */}
            {/* Backdrop */}
            {isMenuOpen && (
                <div
                    className="md:hidden absolute top-full left-0 right-0 h-screen bg-black/20 backdrop-blur-sm z-[90] transition-opacity duration-500"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
            <div className={`md:hidden absolute top-full right-0 w-full h-[calc(100dvh-80px)] bg-white border-l border-zinc-100 transition-transform duration-500 ease-in-out z-[95] shadow-2xl ${isMenuOpen
                ? "translate-x-0"
                : "translate-x-full"
                }`}>
                <div className="flex flex-col h-full bg-white">
                    {/* Sidebar Header with Close Button Removed as requested to stay below topbar */}
                    <div className="flex flex-col p-6 gap-2 overflow-y-auto no-scrollbar flex-grow">
                        {navLinks.map((link) => {
                            if (link.isDropdown) {
                                return (
                                    <div key={link.name} className="flex flex-col gap-1">
                                        <button
                                            onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                                            className="flex items-center justify-between w-full text-[15px] font-bold p-4 text-zinc-900 bg-zinc-50 rounded-2xl transition-all active:scale-[0.98]"
                                        >
                                            <span className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                                                {link.name}
                                            </span>
                                            <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${isMobileServicesOpen ? "rotate-180" : ""}`} />
                                        </button>

                                        <div className={`flex flex-col gap-1 pl-6 overflow-hidden transition-all duration-300 ${isMobileServicesOpen ? "max-h-[500px] opacity-100 mt-2 pb-2" : "max-h-0 opacity-0"}`}>
                                            {link.subLinks?.map((sub) => (
                                                <Link
                                                    key={sub.href}
                                                    href={sub.href}
                                                    onClick={() => {
                                                        setIsMenuOpen(false);
                                                        setIsMobileServicesOpen(false);
                                                    }}
                                                    className={`text-[14px] font-medium p-4 rounded-xl transition-all flex items-center gap-3 ${pathname === sub.href
                                                        ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200"
                                                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                                        }`}
                                                >
                                                    <span className={`w-1 h-1 rounded-full ${pathname === sub.href ? "bg-white" : "bg-zinc-300"}`}></span>
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }

                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`text-[14px] font-medium p-4 rounded-xl transition-all ${isActive
                                        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200"
                                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
