"use client";

import { useState, useEffect } from "react";

import {
    LineChart, Line, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
    PieChart, Pie, AreaChart, Area, CartesianGrid
} from "recharts";
import {
    TrendingUp, DollarSign, Package, Users,
    ShoppingCart, ArrowUpRight, ArrowDownRight,
    LayoutDashboard
} from "lucide-react";
import { useProductStore } from "@/lib/productStore";

const sparklineData1 = [
    { v: 35 }, { v: 40 }, { v: 28 }, { v: 32 }, { v: 45 }, { v: 38 }, { v: 50 }
];
const sparklineData2 = [
    { v: 10 }, { v: 15 }, { v: 35 }, { v: 22 }, { v: 25 }, { v: 30 }, { v: 28 }
];
const sparklineData3 = [
    { v: 38 }, { v: 42 }, { v: 35 }, { v: 48 }, { v: 52 }, { v: 46 }, { v: 55 }
];
const sparklineData4 = [
    { v: 20 }, { v: 22 }, { v: 18 }, { v: 25 }, { v: 30 }, { v: 28 }, { v: 35 }
];

const barData = [
    { m: "Jan", v: 60 },
    { m: "Feb", v: 40 },
    { m: "Mar", v: 50 },
    { m: "Apr", v: 75 },
    { m: "May", v: 55 },
    { m: "Jun", v: 45 },
    { m: "Jul", v: 65 },
    { m: "Aug", v: 70 },
    { m: "Sep", v: 50 },
    { m: "Oct", v: 85 },
    { m: "Nov", v: 65 },
    { m: "Dec", v: 60 }
];

const areaData = [
    { month: "Jan", pemasukan: 4200, pengeluaran: 2400 },
    { month: "Feb", pemasukan: 3800, pengeluaran: 2800 },
    { month: "Mar", pemasukan: 5100, pengeluaran: 2200 },
    { month: "Apr", pemasukan: 4600, pengeluaran: 3100 },
    { month: "May", pemasukan: 5500, pengeluaran: 2700 },
    { month: "Jun", pemasukan: 4900, pengeluaran: 3300 },
];

const gaugeData = [
    { name: "Filled", value: 72, fill: "#22c55e" },
    { name: "Empty", value: 28, fill: "#e5e7eb" },
];

const stats = [
    {
        title: "Total Inventory",
        value: "380",
        unit: "items",
        trend: "-5%",
        trendUp: false,
        color: "text-purple-600",
        bg: "bg-purple-100",
        icon: <Package className="h-6 w-6 text-purple-600" />,
        sparkData: sparklineData3,
        sparkColor: "#9333ea",
    },
    {
        title: "Total Visitors",
        value: "1,120",
        unit: "",
        trend: "+18%",
        trendUp: true,
        color: "text-orange-600",
        bg: "bg-orange-100",
        icon: <Users className="h-6 w-6 text-orange-600" />,
        sparkData: sparklineData4,
        sparkColor: "#ea580c",
    },
];

const quickActions = [
    { title: "Add Product", desc: "Add to inventory catalog", bg: "bg-green-50", hover: "hover:bg-green-100", iconColor: "text-green-600", titleColor: "text-green-900", descColor: "text-green-600", icon: <Package className="h-8 w-8" /> },
    { title: "Manage Articles", desc: "Create or edit website content", bg: "bg-blue-50", hover: "hover:bg-blue-100", iconColor: "text-blue-600", titleColor: "text-blue-900", descColor: "text-blue-600", icon: <Users className="h-8 w-8" /> },
];

export default function OverviewPage() {
    const { products, error: productError } = useProductStore();
    const [mounted, setMounted] = useState(false);
    const [visitorStats, setVisitorStats] = useState<any>(null);

    useEffect(() => {
        setMounted(true);
        const fetchVisitorStats = async () => {
            try {
                const res = await fetch('/api/visitors');
                const data = await res.json();
                setVisitorStats(data);
            } catch (err) {
                console.error("Failed to fetch visitor stats:", err);
            }
        };
        fetchVisitorStats();
    }, []);

    const kpiData = [
        {
            title: "Total Inventory",
            value: products.length.toString(),
            unit: "items",
            trend: "+0%",
            trendUp: true,
            color: "text-purple-600",
            bg: "bg-purple-100",
            icon: <Package className="h-6 w-6 text-purple-600" />,
            sparkData: sparklineData3,
            sparkColor: "#9333ea",
        },
        {
            title: "Total Visitors",
            value: (visitorStats?.total || 0).toLocaleString(),
            unit: "",
            trend: visitorStats ? `${visitorStats.today >= visitorStats.yesterday ? '+' : ''}${((visitorStats.today - visitorStats.yesterday) / (visitorStats.yesterday || 1) * 100).toFixed(0)}%` : "0%",
            trendUp: visitorStats ? visitorStats.today >= visitorStats.yesterday : true,
            color: "text-orange-600",
            bg: "bg-orange-100",
            icon: <Users className="h-6 w-6 text-orange-600" />,
            sparkData: visitorStats?.dailyStats?.slice(-7).map((d: any) => ({ v: d.visitors })) || sparklineData4,
            sparkColor: "#ea580c",
        },
    ];

    return (
        <div className="animate-fade-in-up space-y-6">
            {(productError) && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                    Error: {productError}
                </div>
            )}
            {/* ===== KPI Stat Cards ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {kpiData.map((stat, i) => (
                    <div key={i} className="bg-white rounded-[var(--radius)] border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            <div className={`p-3 rounded-full ${stat.bg}`}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stat.value}
                                    {stat.unit && <span className="text-sm text-gray-500 ml-1">{stat.unit}</span>}
                                </p>
                                <p className={`text-sm font-medium mt-1 flex items-center gap-1 ${stat.color}`}>
                                    {stat.trendUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                    {stat.trend}
                                    <span className="text-gray-500 font-normal ml-1">vs yesterday</span>
                                </p>
                            </div>
                            <div className="w-24 h-12">
                                {mounted && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={stat.sparkData}>
                                            <Line type="monotone" dataKey="v" stroke={stat.sparkColor} strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ===== Quick Action Cards ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, i) => (
                    <div key={i} className={`${action.bg} ${action.hover} rounded-[var(--radius)] p-6 transition-colors cursor-pointer text-center`}>
                        <div className={`${action.iconColor} mb-3 flex justify-center`}>{action.icon}</div>
                        <h3 className={`text-sm font-semibold ${action.titleColor}`}>{action.title}</h3>
                        <p className={`text-xs mt-1 ${action.descColor}`}>{action.desc}</p>
                    </div>
                ))}
            </div>

            {/* Empty State / placeholder for main content area */}
            <div className="bg-white rounded-[var(--radius)] border border-gray-200 p-12 shadow-sm text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LayoutDashboard className="h-8 w-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Welcome to Admin Dashboard</h2>
                    <p className="text-sm text-gray-500 mt-2">
                        Gunakan menu di samping untuk mengelola inventaris produk dan artikel berita.
                    </p>
                </div>
            </div>
        </div>
    );
}
