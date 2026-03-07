"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useContentStore, GlobalArticle } from "@/lib/contentStore";
import {
    PenLine,
    Trash2,
    ExternalLink,
    Edit3,
    ArrowLeft
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function ArticlesAdminPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const { articles, updateArticle, deleteArticle, fetchArticles } = useContentStore();

    useEffect(() => {
        setMounted(true);
        fetchArticles();
    }, [fetchArticles]);

    if (!mounted) return (
        <div className="animate-fade-in-up pb-24">
            <div className="sticky top-0 z-30 -mx-3 sm:-mx-4 px-3 sm:px-4 py-4 sm:py-5 bg-white/80 backdrop-blur-md border-b border-zinc-100 mb-8 sm:mb-12">
                <div className="flex flex-col gap-1.5">
                    <div className="h-6 w-40 bg-zinc-200 rounded" />
                    <div className="h-4 w-24 bg-zinc-200 rounded" />
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
                <div className="animate-pulse bg-zinc-50 rounded-xl h-[400px]" />
            </div>
        </div>
    );

    const toggleArticleStatus = (article: GlobalArticle) => {
        if (article._id === undefined) return;
        const newStatus = article.status === "Published" ? "Draft" : "Published";
        updateArticle(article._id, { status: newStatus });
    };

    return (
        <div className="animate-fade-in-up pb-24">
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 -mx-3 sm:-mx-4 px-3 sm:px-4 py-4 sm:py-5 bg-white/80 backdrop-blur-md border-b border-zinc-100 mb-8 sm:mb-12">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight font-poppins">Artikel</h2>
                        <p className="text-sm sm:text-base text-zinc-500 font-normal mt-0.5 sm:mt-1">Kelola konten artikel blog Anda.</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href="/dashboard/articles/add"
                            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer px-5 sm:px-7 py-2.5 sm:py-3 bg-zinc-900 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-sky-600 transition-all shadow-lg"
                        >
                            <PenLine className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="hidden sm:inline">Tulis Artikel</span>
                            <span className="sm:hidden">Tulis</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
                <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-200">
                                    <th className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-left py-3 px-4">No</th>
                                    <th className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-left py-3 px-4">Artikel</th>
                                    <th className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-left py-3 px-4">Kategori</th>
                                    <th className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-left py-3 px-4">Tanggal</th>
                                    <th className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-left py-3 px-4">Status</th>
                                    <th className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-left py-3 px-4">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(articles || []).map((article, index) => (
                                    <tr key={article._id || index} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors group">
                                        <td className="text-sm text-zinc-900 py-3 px-4">{index + 1}</td>
                                        <td className="text-sm text-zinc-900 py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden shrink-0 border border-zinc-200 shadow-sm">
                                                    <img src={article.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm sm:text-base font-semibold text-zinc-900 line-clamp-1">{article.title}</p>
                                                    <p className="text-xs sm:text-sm text-zinc-500 line-clamp-1 mt-0.5">{article.description.substring(0, 60)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-sm text-zinc-900 py-3 px-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100">
                                                {article.category}
                                            </span>
                                        </td>
                                        <td className="text-sm text-zinc-900 py-3 px-4 whitespace-nowrap">{article.date}</td>
                                        <td className="text-sm text-zinc-900 py-3 px-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {/* Toggle Switch */}
                                                <button
                                                    onClick={() => toggleArticleStatus(article)}
                                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 ${article.status === 'Published' ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                                                >
                                                    <span className="sr-only">Toggle status</span>
                                                    <span aria-hidden="true" className={`pointer-events-none absolute left-0 inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${article.status === 'Published' ? 'translate-x-4' : 'translate-x-1'}`} />
                                                </button>

                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
                                                    ${article.status === "Published" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                                        article.status === "Scheduled" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                                                            "bg-zinc-100 text-zinc-700 border border-zinc-200"}
                                                `}>
                                                    <span className={`w-1.5 h-1.5 rounded-full
                                                        ${article.status === "Published" ? "bg-emerald-500" :
                                                            article.status === "Scheduled" ? "bg-amber-500" :
                                                                "bg-zinc-500"}
                                                    `}></span>
                                                    {article.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-sm text-zinc-900 py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => router.push(`/dashboard/articles/edit/${article._id}`)}
                                                    className="p-2 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors border border-sky-100"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                {article.status === "Published" && (
                                                    <Link
                                                        href={`/articles/${article._id}/${slugify(article.title)}`}
                                                        target="_blank"
                                                        className="p-2 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors border border-zinc-200"
                                                        title="Lihat di Website"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        if (article._id !== undefined && confirm('Hapus artikel ini secara permanen?')) {
                                                            deleteArticle(article._id);
                                                        }
                                                    }}
                                                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
