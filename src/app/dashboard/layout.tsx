"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
    LayoutDashboard, Package, FileText, DollarSign,
    Clock, MessageSquare, Settings, LogOut,
    ChevronDown, ChevronRight, Menu, X, Bell,
    Search, Building2, Users, CreditCard, Play
} from "lucide-react";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: number;
    children?: { label: string; href: string; icon?: React.ReactNode }[];
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>(["Articles"]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch {
            // Proceed with redirect even if call fails
        }
        router.push("/login");
    };

    const toggleMenu = (label: string) => {
        setExpandedMenus((prev) =>
            prev.includes(label)
                ? prev.filter((m) => m !== label)
                : [...prev, label]
        );
    };

    const navItems: NavItem[] = [
        { label: "Overview", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
        { label: "Inventory", href: "/dashboard/inventory", icon: <Package className="h-4 w-4" />, badge: 3 },
        {
            label: "Articles", href: "/dashboard/articles", icon: <FileText className="h-4 w-4" />,
            children: [
                { label: "Buat Artikel", href: "/dashboard/articles" },
                { label: "Komentar", href: "/dashboard/articles/comments" },
                { label: "Social Media Share", href: "/dashboard/articles/social-share" },
            ]
        },
        { label: "Pengunjung", href: "/dashboard/visitors", icon: <Users className="h-4 w-4" /> },
        { label: "Settings", href: "/dashboard/settings", icon: <Settings className="h-4 w-4" /> },
    ];

    const isActive = (href: string) => pathname === href;
    const isChildActive = (item: NavItem) =>
        item.children?.some((c) => pathname === c.href) || pathname === item.href;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ============ TOPBAR (fixed, z-40, h-16) ============ */}
            <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 sm:px-6">
                {/* Left: Toggle + Logo + Company */}
                <div className="flex items-center gap-3">
                    {/* Mobile toggle */}
                    <button
                        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>

                    {/* Desktop sidebar toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="hidden md:flex p-2 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                        <Menu className="h-4 w-4 text-gray-600" />
                    </button>

                    {/* Logo + Company Name */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-base font-semibold text-gray-900 leading-tight">
                                Atmosphere Furniture
                            </h1>
                            <p className="text-xs text-gray-500">
                                Wood & Iron Furniture
                            </p>
                        </div>
                        <a
                            href={process.env.NODE_ENV === 'production' ? `https://${process.env.NEXT_PUBLIC_MAIN_DOMAIN}` : "/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-xs font-bold transition-colors"
                        >
                            View Site
                            <Play className="h-2.5 w-2.5 rotate-[-45deg]" />
                        </a>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Notification */}
                    <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Bell className="h-5 w-5 text-gray-600" />
                        <span className="bg-red-500 rounded-full w-2 h-2 absolute top-2 right-2"></span>
                    </button>

                    {/* User avatar */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                            AD
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">Admin</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                        <ChevronDown className="h-3 w-3 text-gray-400 hidden sm:block" />
                    </div>
                </div>
            </header>

            {/* ============ SIDEBAR (w-64, fixed, z-30) ============ */}
            {/* Mobile overlay */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 md:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-30 pt-16 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out
                    ${mobileSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"}
                    ${sidebarOpen ? "md:w-64" : "md:w-0 md:overflow-hidden md:border-0"}
                `}
            >
                {/* Search */}
                <div className="p-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-grow p-3 space-y-1 overflow-y-auto sidebar-scroll">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        const childActive = isChildActive(item);
                        const hasChildren = item.children && item.children.length > 0;
                        const isExpanded = expandedMenus.includes(item.label);

                        return (
                            <div key={item.label}>
                                {/* Main menu item */}
                                {hasChildren ? (
                                    <button
                                        onClick={() => toggleMenu(item.label)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                                            ${childActive
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
                                            }`}
                                    >
                                        <span className="text-gray-500 group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </span>
                                        <span className="flex-grow text-left">{item.label}</span>
                                        {item.badge && (
                                            <span className="bg-red-500 text-white text-xs font-semibold rounded-full py-0.5 px-2">
                                                {item.badge}
                                            </span>
                                        )}
                                        <ChevronDown
                                            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href}
                                        onClick={() => setMobileSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                                            ${active
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
                                            }`}
                                    >
                                        <span className={`transition-transform group-hover:scale-110 ${active ? "text-gray-900" : "text-gray-500"}`}>
                                            {item.icon}
                                        </span>
                                        <span className="flex-grow">{item.label}</span>
                                        {item.badge && (
                                            <span className="bg-red-500 text-white text-xs font-semibold rounded-full py-0.5 px-2">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                )}

                                {/* Submenu with accordion animation */}
                                {hasChildren && isExpanded && (
                                    <div className="border-l-2 border-gray-200 ml-4 pl-3 mt-1 space-y-0.5">
                                        {item.children!.map((child, childIndex) => (
                                            <Link
                                                key={child.label}
                                                href={child.href}
                                                onClick={() => setMobileSidebarOpen(false)}
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all animate-slide-down"
                                                style={{ animationDelay: `${childIndex * 50}ms` }}
                                            >
                                                {child.icon && (
                                                    <span className="h-3 w-3">{child.icon}</span>
                                                )}
                                                <span>{child.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Footer user section */}
                <div className="p-3 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all group"
                    >
                        <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* ============ MAIN CONTENT ============ */}
            <div
                className={`min-h-screen pt-16 transition-all duration-300 ease-in-out
                    ${sidebarOpen ? "md:ml-64" : "md:ml-0"}
                `}
            >
                {/* Page Header */}
                <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {pathname === "/dashboard"
                                    ? "Dashboard"
                                    : navItems.find(item => item.href === pathname)?.label || "Overview"}
                            </h1>
                            {/* Breadcrumb */}
                            <nav className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                                <Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
                                {pathname !== "/dashboard" && (
                                    <>
                                        <ChevronRight className="h-3 w-3" />
                                        <span className="text-gray-900 font-medium">
                                            {navItems.find(item => item.href === pathname)?.label || "Page"}
                                        </span>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Main padding zone */}
                <main className="px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
