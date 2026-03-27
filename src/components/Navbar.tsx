"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    ShoppingCart,
    Menu,
    X,
    ChevronDown,
    Globe,
    Check
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCartStore } from "@/lib/cartStore";

const IDFlag = () => (
    <svg viewBox="0 0 640 480" className="w-5 h-4 rounded-sm shadow-sm flex-shrink-0 border border-zinc-100">
        <rect width="640" height="240" fill="#FF0000" />
        <rect width="640" height="240" y="240" fill="#ffffff" />
    </svg>
);

const USFlag = () => (
    <svg viewBox="0 0 741 390" className="w-5 h-4 rounded-sm shadow-sm flex-shrink-0 border border-zinc-100">
        <rect width="741" height="390" fill="#ffffff"/>
        <path d="M0 0h741v30H0zm0 60h741v30H0zm0 60h741v30H0zm0 60h741v30H0zm0 60h741v30H0zm0 60h741v30H0zm0 60h741v30H0z" fill="#BF0A30"/>
        <path d="M0 0h296.4v210H0z" fill="#002868"/>
        <g fill="#ffffff">
            <g id="s5">
                <g id="s1">
                    <path id="s" d="M30 42l5.5 16.5h17.5l-14 10 5.5 16.5-14-10-14 10 5.5-16.5-14-10h17.5z" transform="scale(.3)"/>
                    <use href="#s" y="84"/><use href="#s" y="168"/><use href="#s" y="252"/><use href="#s" y="336"/>
                </g>
                <use href="#s1" x="52" y="42"/>
            </g>
            <use href="#s5" x="104"/><use href="#s5" x="208"/>
            <use href="#s1" x="260"/>
        </g>
    </svg>
);

export default function Navbar() {
    const { t, language, setLanguage } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const { items: cartItems } = useCartStore();

    const pathname = usePathname();
    const servicesRef = useRef<HTMLDivElement>(null);
    const languageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);

        const handleScroll = () => {
            if (isMobileMenuOpen) return;
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
            setIsScrolled(currentScrollY > 20);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY, isMobileMenuOpen]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
                setIsLanguageOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navLinks = [
        { name: t("navbar.home"), href: "/" },
        { name: t("navbar.about"), href: "/about" },
        { name: t("navbar.products"), href: "/products" },
        {
            name: t("navbar.services"),
            href: "#",
            isDropdown: true,
            subLinks: [
                { name: t("home.services.card1.title"), href: "/services/desain-yang-dipersonalisasi-sepenuhnya" },
                { name: t("home.services.card2.title"), href: "/services/kualitas-dan-ketelitian-pengerjaan" },
                { name: t("home.services.card3.title"), href: "/services/solusi-fungsional-dan-estetis" },
                { name: t("home.services.card4.title"), href: "/services/kolaborasi-untuk-hasil-terbaik" },
            ]
        },
        { name: t("navbar.articles"), href: "/articles" },
        { name: t("navbar.contact"), href: "/contact" },
    ];

    return (
        <>
            {/* ===== NAVBAR BAR ===== */}
            {/* ===== NAVBAR BAR ===== */}
            <nav
                className={`sticky top-0 z-[9999] w-full transition-all duration-500 ease-in-out border-b ${isScrolled ? "border-zinc-200/5 shadow-sm" : "border-transparent"} ${!isVisible ? "-translate-y-full" : "translate-y-0"}`}
                style={{
                    backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.1)" : "transparent",
                    backdropFilter: isScrolled ? "blur(12px)" : "none",
                    WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
                }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-4 group shrink-0">
                            <div className="relative w-14 h-14 transition-transform duration-500 group-hover:scale-105">
                                <Image 
                                    src="/logo-atmosphere.png" 
                                    alt="Atmosphere Logo" 
                                    fill 
                                    className="object-contain" 
                                    priority 
                                    sizes="56px"
                                />
                            </div>
                            <div className="hidden md:flex flex-col leading-none">
                                <span className="text-xl font-semibold tracking-tight text-zinc-900 leading-tight">ATMOSPHERE</span>
                                <span className="text-sm uppercase tracking-[0.2em] font-medium text-zinc-900">Furniture Indonesia</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1 lg:gap-2 h-full">
                            {navLinks.map((link) => {
                                if (link.isDropdown) {
                                    const isChildActive = link.subLinks?.some(sub => pathname === sub.href);
                                    return (
                                        <div
                                            key={link.name}
                                            className="relative group h-full flex items-center"
                                        >
                                            <button
                                                className={`flex items-center gap-1 text-base font-medium transition-all duration-300 cursor-pointer px-3 lg:px-4 py-2 relative z-20 ${isChildActive
                                                    ? "text-zinc-900 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-zinc-900"
                                                    : "text-zinc-900 hover:text-sky-600"
                                                    }`}
                                            >
                                                {link.name}
                                                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180 text-zinc-900" />
                                            </button>

                                            {/* Dropdown - CSS group-hover */}
                                            <div className="absolute top-full left-0 w-max bg-transparent pt-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 origin-top-left z-[9999]">
                                                <div className="bg-white/95 backdrop-blur-xl border border-zinc-100 rounded-2xl shadow-xl shadow-zinc-200/50 p-2">
                                                    {link.subLinks?.map((sub) => (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            className="block px-4 py-3 text-base font-medium rounded-xl transition-all text-zinc-900 hover:bg-zinc-50 hover:text-sky-600 whitespace-nowrap"
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                const isActive = pathname === link.href;

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`text-base font-medium transition-all duration-300 px-3 lg:px-4 py-2 relative ${isActive
                                            ? "text-zinc-900 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-zinc-900"
                                            : "text-zinc-900 hover:text-sky-600"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}

                            {/* Divider */}
                            <div className="h-6 w-px mx-2 bg-zinc-200" />

                            {/* Icons */}
                            <div className="flex items-center gap-1">
                                {/* Cart */}
                                <Link href="/products/checkout" className="relative p-2 text-zinc-900 hover:text-sky-600 transition-colors">
                                    <ShoppingCart className="h-5 w-5" />
                                    {isMounted && cartItems.length > 0 && (
                                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[9px] font-bold text-white leading-none ring-2 ring-white animate-in zoom-in duration-300">
                                            {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                                        </span>
                                    )}
                                </Link>

                                {/* Language */}
                                <div className="relative" ref={languageRef}>
                                    <button
                                        onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                                        className="flex items-center gap-2 px-3 py-2 text-zinc-900 hover:text-sky-600 transition-colors cursor-pointer rounded-xl hover:bg-zinc-50"
                                    >
                                        {!isMounted ? <div className="w-5 h-4 bg-zinc-100 rounded-sm" /> : (language === "ID" ? <IDFlag /> : <USFlag />)}
                                        <span className="text-sm font-bold uppercase tracking-tight">{isMounted ? language : "ID"}</span>
                                        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isLanguageOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    <div className={`absolute right-0 top-full mt-2 w-44 bg-white border border-zinc-100 rounded-2xl shadow-2xl p-1.5 transition-all duration-300 origin-top-right z-[9999] ${isLanguageOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"}`}>
                                        {[{ id: "ID", name: "Indonesia", Flag: IDFlag }, { id: "EN", name: "English", Flag: USFlag }].map((lang) => (
                                            <button
                                                key={lang.id}
                                                onClick={() => { setLanguage(lang.id as any); setIsLanguageOpen(false); }}
                                                className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${isMounted && language === lang.id ? "bg-zinc-50 text-sky-600" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"}`}
                                            >
                                                <lang.Flag />
                                                <span className="flex-1 text-left">{lang.name}</span>
                                                {isMounted && language === lang.id && <Check className="h-4 w-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile: Right Icons */}
                        <div className="flex md:hidden items-center gap-3">
                            <Link href="/products/checkout" className="relative p-2 text-zinc-900">
                                <ShoppingCart className="h-6 w-6" />
                                {isMounted && cartItems.length > 0 && (
                                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-sky-500 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-white animate-in zoom-in duration-300">
                                        {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                                    </span>
                                )}
                            </Link>
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-zinc-900">
                                {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                            </button>
                        </div>

                    </div>
                </div>
            </nav>

            {/* ===== MOBILE MENU =====
                MUST be OUTSIDE <nav> to avoid CSS transform stacking context bug.
                When nav uses transform (for hide/show on scroll), fixed children
                become positioned relative to the nav instead of the viewport.
            */}
            <div
                className={`fixed inset-x-0 bg-white z-[10000] transition-transform duration-500 ease-in-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
                style={{ top: "80px", bottom: 0 }}
            >
                <div className="flex flex-col p-4 h-full overflow-y-auto no-scrollbar">
                    {/* Nav Links */}
                    <div className="flex flex-col gap-1 pb-4">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            const isChildActive = link.subLinks?.some(sub => pathname === sub.href);
                            
                            return (
                                <div key={link.name} className="flex flex-col gap-0.5">
                                    {link.isDropdown ? (
                                        <>
                                            <button
                                                onClick={() => setExpandedMobileMenu(expandedMobileMenu === link.name ? null : link.name)}
                                                className="flex items-center justify-between w-full text-lg font-bold text-zinc-900 px-4 py-2 hover:bg-zinc-50 rounded-xl transition-colors group"
                                            >
                                                <span className={`transition-all ${isChildActive ? "border-b-2 border-zinc-900" : ""}`}>
                                                    {link.name}
                                                </span>
                                                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expandedMobileMenu === link.name ? "rotate-180" : ""}`} />
                                            </button>
                                            
                                            <div className={`flex flex-col gap-0.5 overflow-hidden transition-all duration-300 ${expandedMobileMenu === link.name ? "max-h-[500px] opacity-100 mt-1 mb-2" : "max-h-0 opacity-0"}`}>
                                                {link.subLinks?.map((sub) => {
                                                    const isSubActive = pathname === sub.href;
                                                    return (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className={`text-sm font-semibold px-8 py-2 block border-l-2 ml-6 transition-colors ${isSubActive ? "text-zinc-900 border-zinc-900" : "text-zinc-500 border-zinc-100 hover:border-sky-400 hover:text-zinc-900"}`}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="px-4 py-2 block hover:bg-zinc-50 rounded-xl transition-colors group"
                                        >
                                            <span className={`text-lg font-bold text-zinc-900 transition-all ${isActive ? "border-b-2 border-zinc-900" : ""}`}>
                                                {link.name}
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Language Selector & Footer */}
                    <div className="mt-auto border-t border-zinc-100 pt-4 flex flex-col gap-4 px-4 pb-6">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-[11px] font-medium text-zinc-400 tracking-wide leading-none px-1 pt-1">Language</span>
                            <div className="flex gap-2">
                                {["ID", "EN"].map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setLanguage(lang as any)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${language === lang ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 text-zinc-500"}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Social & Copyright */}
                        <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-50">
                            <p className="text-[10px] text-zinc-400 font-medium">
                                &copy; {isMounted ? new Date().getFullYear() : "2026"} Atmosphere Furniture
                            </p>
                            <div className="flex items-center gap-3">
                                <a href="https://instagram.com/atmosphere.furnitureid" target="_blank" className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                                </a>
                                <a href="https://wa.me/62882005824231" target="_blank" className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
