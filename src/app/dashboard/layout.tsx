"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
    LayoutDashboard, Package, FileText, DollarSign,
    Clock, MessageSquare, Settings, LogOut,
    ChevronDown, ChevronRight, Menu, X, Bell,
    Search, Users, CreditCard, Play
} from "lucide-react";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: number;
    children?: { label: string; href: string; icon?: React.ReactNode; badge?: number }[];
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
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);
    const [counts, setCounts] = useState({ comments: 0, inventory: 0 });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/profile');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (err) {
                console.error("Dashboard failed to fetch user profile", err);
            }
        };

        const fetchCounts = async () => {
            try {
                // Fetch pending comments count
                const resComm = await fetch('/api/comments');
                if (resComm.ok) {
                    const comments = await resComm.json();
                    const pendingCount = comments.filter((c: any) => c.status === "Pending").length;

                    // Fetch low stock inventory count
                    const resProd = await fetch('/api/products');
                    if (resProd.ok) {
                        const products = await resProd.json();
                        const lowStockCount = products.filter((p: any) => p.status === "Low Stock" || (p.stock > 0 && p.stock <= 5)).length;

                        setCounts({ comments: pendingCount, inventory: lowStockCount });
                    }
                }
            } catch (err) {
                console.error("Failed to fetch notification counts", err);
            }
        };

        fetchUser();
        fetchCounts();
        // Refresh counts every 2 minutes
        const interval = setInterval(fetchCounts, 120000);
        return () => clearInterval(interval);
    }, []);

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
        { label: "Inventory", href: "/dashboard/inventory", icon: <Package className="h-4 w-4" />, badge: counts.inventory > 0 ? counts.inventory : undefined },
        {
            label: "Articles", href: "/dashboard/articles", icon: <FileText className="h-4 w-4" />,
            badge: counts.comments > 0 ? counts.comments : undefined,
            children: [
                { label: "Buat Artikel", href: "/dashboard/articles" },
                { label: "Komentar", href: "/dashboard/articles/comments", badge: counts.comments > 0 ? counts.comments : undefined },
                { label: "Social Media Share", href: "/dashboard/articles/social-share" },
            ]
        },
        { label: "Founder", href: "/dashboard/founder", icon: <Users className="h-4 w-4" /> },
        { label: "Pengunjung", href: "/dashboard/visitors", icon: <Clock className="h-4 w-4" /> },
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

                    <div className="flex items-center gap-6 ml-2 sm:ml-4">
                        <Link href="/dashboard" className="relative h-9 w-36 flex shrink-0 hover:opacity-80 transition-opacity">
                            <Image
                                src="/logo-atmosphere.png"
                                alt="Atmosphere Logo"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </Link>

                        <a
                            href={process.env.NODE_ENV === 'production' ? `https://${process.env.NEXT_PUBLIC_MAIN_DOMAIN}` : "/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95"
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
                            {user?.username ? user.username.substring(0, 2).toUpperCase() : "AD"}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">{user?.username || "Admin"}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold opacity-60">
                                {user?.role || "Administrator"}
                            </p>
                        </div>
                        <ChevronDown className="h-3 w-3 text-gray-400 hidden sm:block" />
                    </div>
                </div>
            </header>

            {/* ============ SIDEBAR (w-64, fixed, z-30) ============ */}
            {/* Mobile overlay */}
            {
                mobileSidebarOpen && (
                    <div
                        className="fixed inset-0 z-20 bg-black/50 md:hidden"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                )
            }

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
                                                {child.badge && (
                                                    <span className="bg-red-500 text-white text-[10px] font-bold rounded-full py-0.5 px-1.5 ml-auto">
                                                        {child.badge}
                                                    </span>
                                                )}
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
