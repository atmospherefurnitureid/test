"use client";

import { useState, useEffect } from "react";
import {
    Users, Activity, TrendingUp, Calendar,
    ArrowUpRight, ArrowDownRight, Clock,
    AlertCircle
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, LineChart, Line
} from "recharts";

export default function VisitorsPage() {
    const [mounted, setMounted] = useState(false);
    const [visibleCount, setVisibleCount] = useState(10);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/visitors');
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch visitor stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchStats();
    }, []);

    if (!mounted || isLoading) return <div className="animate-pulse bg-zinc-50 h-[80vh] rounded-3xl flex items-center justify-center text-zinc-400">Loading analytics...</div>;

    const calculateTrend = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? "+100%" : "0%";
        const trend = ((current - previous) / previous) * 100;
        return `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`;
    };

    const displayRecentVisitors = stats?.recentVisitors || [];
    const dailyChartData = stats?.dailyStats || [];
    const monthlyChartData = stats?.monthlyStats || [];
    const yearlyChartData = stats?.yearlyStats || [];

    const EmptyChart = ({ message }: { message: string }) => (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-50/50 backdrop-blur-[1px] rounded-xl z-10">
            <AlertCircle className="h-8 w-8 text-zinc-300 mb-2" />
            <p className="text-sm font-medium text-zinc-400">{message}</p>
        </div>
    );

    return (
        <div className="animate-fade-in-up space-y-8 sm:space-y-12 pb-20">
            {/* Header Area - Following qwen.md Page Header Pattern */}
            <div className="mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-4xl font-semibold text-zinc-900 tracking-tight font-poppins">Analitik Pengunjung</h2>
                <p className="text-sm sm:text-base text-zinc-500 font-normal mt-1">Pantau lalu lintas dan aktivitas pengunjung website Anda.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm flex items-start justify-between group hover:border-sky-200 transition-colors">
                    <div>
                        <p className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-2">HARI INI</p>
                        <h4 className="text-2xl sm:text-3xl font-bold text-zinc-900">{stats?.today || 0}</h4>
                        <div className={`flex items-center gap-1 mt-2 text-xs sm:text-sm font-bold ${stats?.today >= stats?.yesterday ? 'text-emerald-600' : 'text-red-600'}`}>
                            {stats?.today >= stats?.yesterday ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            <span>{calculateTrend(stats?.today || 0, stats?.yesterday || 0)} vs Kemarin</span>
                        </div>
                    </div>
                    <div className="p-3 bg-sky-50 text-sky-600 rounded-xl group-hover:scale-110 transition-transform">
                        <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm flex items-start justify-between group hover:border-indigo-200 transition-colors">
                    <div>
                        <p className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-2">BULAN INI</p>
                        <h4 className="text-2xl sm:text-3xl font-bold text-zinc-900">{(stats?.month || 0).toLocaleString()}</h4>
                        <div className={`flex items-center gap-1 mt-2 text-xs sm:text-sm font-bold ${stats?.month >= stats?.lastMonth ? 'text-emerald-600' : 'text-red-600'}`}>
                            {stats?.month >= stats?.lastMonth ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            <span>{calculateTrend(stats?.month || 0, stats?.lastMonth || 0)} vs Bulan Lalu</span>
                        </div>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                        <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm flex items-start justify-between group hover:border-amber-200 transition-colors">
                    <div>
                        <p className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-2">TOTAL HITS</p>
                        <h4 className="text-2xl sm:text-3xl font-bold text-zinc-900">{(stats?.total || 0).toLocaleString()}</h4>
                        <div className="flex items-center gap-1 mt-2 text-zinc-400 text-xs sm:text-sm font-medium">
                            <TrendingUp className="h-4 w-4" />
                            <span>Tahun Ini: {(stats?.year || 0).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

                {/* Daily Chart */}
                <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm lg:col-span-2 relative">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-zinc-900 tracking-tight font-poppins">Pengunjung Harian (30 Hari Terakhir)</h3>
                            <p className="text-xs text-zinc-500 mt-1 font-normal">Tren lalu lintas harian.</p>
                        </div>
                        <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                            <Clock className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="h-72 w-full relative">
                        {dailyChartData.length === 0 && <EmptyChart message="Belum ada data pengunjung harian." />}
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 500 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 500 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                    cursor={{ stroke: '#bae6fd', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    active={true}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="visitors"
                                    stroke="#0ea5e9"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#colorDaily)"
                                    activeDot={{ r: 5, strokeWidth: 0, fill: '#0369a1' }}
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Chart */}
                <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm relative">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-zinc-900 tracking-tight font-poppins">Pengunjung Bulanan</h3>
                            <p className="text-xs text-zinc-500 mt-1 font-normal">Pergerakan pengunjung setiap bulan.</p>
                        </div>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Calendar className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="h-64 w-full relative">
                        {monthlyChartData.length === 0 && <EmptyChart message="Belum ada data bulanan." />}
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 500 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 500 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                />
                                <Bar dataKey="visitors" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Yearly Chart */}
                <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm relative">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-zinc-900 tracking-tight font-poppins">Pengunjung Tahunan</h3>
                            <p className="text-xs text-zinc-500 mt-1 font-normal">Pertumbuhan jangka panjang pengunjung.</p>
                        </div>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="h-64 w-full relative">
                        {yearlyChartData.length === 0 && <EmptyChart message="Belum ada data tahunan." />}
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={yearlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 500 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa', fontWeight: 500 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="visitors"
                                    stroke="#f59e0b"
                                    strokeWidth={3}
                                    dot={{ stroke: '#f59e0b', strokeWidth: 2, r: 4, fill: '#fff' }}
                                    activeDot={{ r: 6, fill: '#d97706', strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Visitor History List - Following qwen.md Table Pattern */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-zinc-100 bg-zinc-50/30">
                    <h3 className="text-base sm:text-lg font-semibold text-zinc-900 tracking-tight font-poppins">Riwayat Pengunjung Terbaru</h3>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-normal">Daftar pengunjung yang mengakses website baru-baru ini.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 border-b border-zinc-200">
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest w-10">No</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Waktu</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">IP / ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Halaman</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Browser / OS</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {displayRecentVisitors.length > 0 ? (
                                displayRecentVisitors.slice(0, visibleCount).map((visitor: any, index: number) => (
                                    <tr key={visitor._id || index} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-zinc-500 font-normal">{index + 1}</td>
                                        <td className="px-6 py-4 min-w-[140px]">
                                            <p className="text-sm font-semibold text-zinc-900">
                                                {new Date(visitor.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <p className="text-[11px] text-zinc-400 font-medium">
                                                {new Date(visitor.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-sky-600 font-mono tracking-tight">{visitor.ip}</p>
                                            <p className="text-[10px] text-zinc-400 font-bold tracking-wider">{visitor._id?.substring(0, 8)}...</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-xs font-medium font-mono border border-zinc-200/50">
                                                {visitor.page}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-[10px] text-zinc-700 font-medium tracking-tight line-clamp-1 max-w-[220px]" title={visitor.userAgent}>{visitor.userAgent || 'Unknown Device'}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-zinc-600 text-center">
                                            -
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-400 italic text-sm font-normal">
                                        Belum ada riwayat pengunjung.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {visibleCount < displayRecentVisitors.length && (
                    <div className="p-6 flex justify-center bg-zinc-50/30 border-t border-zinc-100">
                        <button
                            onClick={() => setVisibleCount(prev => Math.min(prev + 10, displayRecentVisitors.length))}
                            className="px-6 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-sm font-semibold rounded-xl hover:bg-zinc-50 hover:text-zinc-900 transition-all shadow-sm active:scale-95"
                        >
                            Muat Lebih Banyak ({displayRecentVisitors.length - visibleCount} lagi)
                        </button>
                    </div>
                )}
            </div>

            <style jsx global>{`
                /* Menghilangkan outline border biru saat elemen grafik/tooltip diklik */
                .recharts-wrapper *:focus {
                    outline: none !important;
                }
                .recharts-surface {
                    outline: none !important;
                }
            `}</style>
        </div>
    );
}
