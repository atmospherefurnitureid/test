"use client";

import { useState, useEffect } from "react";
import {
    MessageCircle,
    CheckCircle2,
    XCircle,
    Trash2,
    Reply,
    Search,
    Clock,
    User,
    ArrowLeft,
    X,
    AlertCircle,
    ArrowUpRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useContentStore, GlobalComment } from "@/lib/contentStore";
import { slugify } from "@/lib/utils";

export default function CommentManagementPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const { comments, articles, updateComment, deleteComment, isLoading, fetchComments, fetchArticles } = useContentStore();
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state
    const [selectedComment, setSelectedComment] = useState<GlobalComment | any | null>(null);
    const [replyText, setReplyText] = useState("");

    useEffect(() => {
        setMounted(true);
        fetchComments();
        fetchArticles();
    }, [fetchComments, fetchArticles]);

    if (!mounted || isLoading) return (
        <div className="animate-pulse bg-zinc-50 h-[80vh] rounded-3xl flex items-center justify-center text-zinc-400">
            <div className="flex flex-col items-center gap-3">
                <MessageCircle className="h-10 w-10 animate-bounce" />
                <p className="text-sm font-medium">Memuat komentar...</p>
            </div>
        </div>
    );

    const filteredComments = comments.filter(c => {
        const matchesStatus = filterStatus === "All" || c.status === filterStatus;
        const matchesSearch = c.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const toggleApprove = async (comment: GlobalComment | any) => {
        const id = comment._id || comment.id;
        const newStatus = comment.status === "Approved" ? "Pending" : "Approved";
        await updateComment(id, { status: newStatus });
    };

    const handleDelete = async (comment: GlobalComment | any) => {
        const id = comment._id || comment.id;
        if (confirm("Hapus komentar ini secara permanen?")) {
            await deleteComment(id);
            if (selectedComment && (selectedComment._id === id || selectedComment.id === id)) {
                setSelectedComment(null);
            }
        }
    };

    const handleReply = async () => {
        if (!selectedComment || !replyText.trim()) return;
        const id = selectedComment._id || selectedComment.id;
        await updateComment(id, {
            status: "Approved",
            replied: true,
            adminReply: replyText
        });
        setSelectedComment(null);
        setReplyText("");
    };

    const getArticleInfo = (articleId: string | number | undefined) => {
        if (!articleId) return null;
        return articles.find(a => a.id === Number(articleId) || a._id === String(articleId));
    };

    return (
        <div className="animate-fade-in-up space-y-8 sm:space-y-12 pb-20">
            {/* Header Area following qwen.md Page Header Pattern */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-500 hover:text-zinc-900 transition-all active:scale-95"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h2 className="text-xl sm:text-2xl lg:text-4xl font-semibold text-zinc-900 tracking-tight font-poppins">Manajemen Komentar</h2>
                        <p className="text-sm sm:text-base text-zinc-500 font-normal mt-1">Moderasi masukan pengunjung dan interaksi artikel.</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4 group hover:border-sky-200 transition-colors">
                    <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <MessageCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-widest">TOTAL</p>
                        <p className="text-xl sm:text-2xl font-bold text-zinc-900">{comments.length}</p>
                    </div>
                </div>
                <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4 group hover:border-amber-200 transition-colors">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-widest">PENDING</p>
                        <p className="text-xl sm:text-2xl font-bold text-zinc-900">{comments.filter(c => c.status === "Pending").length}</p>
                    </div>
                </div>
                <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4 group hover:border-emerald-200 transition-colors">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-widest">APPROVED</p>
                        <p className="text-xl sm:text-2xl font-bold text-zinc-900">{comments.filter(c => c.status === "Approved").length}</p>
                    </div>
                </div>
            </div>

            {/* Toolbar: Search and Status Filter */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                <div className="relative w-full lg:max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari komentar, penulis, atau email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                    />
                </div>

                <div className="flex gap-1 bg-zinc-100/80 p-1 rounded-xl border border-zinc-200 w-full lg:w-auto overflow-x-auto no-scrollbar">
                    {["All", "Pending", "Approved", "Spam"].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`flex-1 lg:flex-none px-5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${filterStatus === status ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Comments Table following qwen.md Table Pattern */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-200">
                                <th className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-left py-3 px-4 w-12">No</th>
                                <th className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-left py-3 px-4">Penulis</th>
                                <th className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-left py-3 px-4 w-[35%]">Konten</th>
                                <th className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-left py-3 px-4">Artikel</th>
                                <th className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center py-3 px-4">Status</th>
                                <th className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center py-3 px-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComments.map((comment: any, index) => (
                                <tr key={comment._id || comment.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors group">
                                    <td className="text-sm text-zinc-900 py-3 px-4">{index + 1}</td>
                                    <td className="text-sm text-zinc-900 py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold shrink-0 border border-zinc-200">
                                                {comment.author.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-zinc-900 truncate">{comment.author}</p>
                                                <p className="text-xs text-zinc-500 truncate">{comment.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-sm text-zinc-900 py-3 px-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-zinc-700 leading-relaxed line-clamp-2 italic">
                                                "{comment.content}"
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium uppercase">
                                                <Clock className="h-3 w-3" />
                                                {comment.timestamp ? new Date(comment.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : comment.date}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-sm text-zinc-900 py-3 px-4">
                                        {(() => {
                                            const art = getArticleInfo(comment.articleId);
                                            return art ? (
                                                <Link
                                                    href={`/articles/${art._id || art.id}/${slugify(art.title)}`}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors max-w-[150px]"
                                                >
                                                    <span className="truncate">{art.title}</span>
                                                    <ArrowUpRight className="h-3 w-3 shrink-0" />
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-zinc-500 italic">Artikel dihapus</span>
                                            );
                                        })()}
                                    </td>
                                    <td className="text-sm text-zinc-900 py-3 px-4">
                                        <div className="flex flex-col items-center gap-2">
                                            {/* Status Badge */}
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border
                                                ${comment.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                    comment.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-100" :
                                                        "bg-red-50 text-red-700 border-red-100"}
                                            `}>
                                                {comment.status}
                                            </span>

                                            {/* Quick Toggle Approval */}
                                            <button
                                                onClick={() => toggleApprove(comment)}
                                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 ${comment.status === 'Approved' ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                                            >
                                                <span className="sr-only">Toggle status</span>
                                                <span aria-hidden="true" className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${comment.status === 'Approved' ? 'translate-x-4' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="text-sm text-zinc-900 py-3 px-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => setSelectedComment(comment)}
                                                className="p-2 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors border border-sky-100"
                                                title="Lihat Detail & Balas"
                                            >
                                                <Reply className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(comment)}
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
                    {filteredComments.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center text-zinc-400 bg-white">
                            <MessageCircle className="h-12 w-12 text-zinc-100 mb-4" />
                            <p className="text-sm font-medium">Tidak ada komentar dalam kategori ini.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Detail & Reply following qwen.md Alert/Notification & Card Pattern */}
            {selectedComment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md animate-fade-in px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-slide-up border border-zinc-100">
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
                                    <MessageCircle className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-zinc-900 font-poppins text-lg">Moderasi Komentar</h3>
                            </div>
                            <button
                                onClick={() => setSelectedComment(null)}
                                className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh] no-scrollbar">
                            {/* Author Info */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                                <div className="w-14 h-14 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-lg">
                                    {selectedComment.author.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <p className="font-bold text-zinc-900 text-lg leading-none">{selectedComment.author}</p>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border
                                            ${selectedComment.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                selectedComment.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                    "bg-red-50 text-red-700 border-red-200"}
                                        `}>
                                            {selectedComment.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-500 font-medium mb-1">{selectedComment.email}</p>
                                    {selectedComment.whatsapp && (
                                        <p className="text-xs text-sky-600 font-bold mb-3 flex items-center gap-1">
                                            WA: {selectedComment.whatsapp}
                                        </p>
                                    )}

                                    <div className="pt-3 border-t border-zinc-200/50">
                                        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-1">PADA ARTIKEL:</p>
                                        <p className="text-sm font-bold text-sky-600 line-clamp-1">{getArticleInfo(selectedComment.articleId)?.title || "Artikel dihapus"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Comment Bubble */}
                            <div className="relative group">
                                <div className="absolute -left-2 top-0 h-full w-1 bg-sky-500 rounded-full opacity-50" />
                                <p className="text-zinc-700 leading-relaxed font-medium italic text-base px-4">
                                    "{selectedComment.content}"
                                </p>
                                <p className="mt-4 px-4 text-xs font-bold text-zinc-400 flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    {selectedComment.timestamp ? new Date(selectedComment.timestamp).toLocaleString('id-ID') : selectedComment.date}
                                </p>
                            </div>

                            {/* Existing Admin Reply Area following Alert Pattern */}
                            {selectedComment.adminReply && (
                                <div className="flex items-start gap-3 p-4 bg-sky-50 border border-sky-100 rounded-xl ml-6">
                                    <Reply className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-xs font-black text-sky-900 uppercase tracking-widest">BALASAN ADMIN</p>
                                            <button
                                                onClick={() => setReplyText(selectedComment.adminReply)}
                                                className="text-[10px] font-bold text-sky-600 hover:underline"
                                            >
                                                Ubah
                                            </button>
                                        </div>
                                        <p className="text-sm text-sky-800 leading-relaxed font-medium">{selectedComment.adminReply}</p>
                                    </div>
                                </div>
                            )}

                            {/* Reply Input following Form-Specific Guidelines */}
                            <div className="space-y-4 pt-4 border-t border-zinc-100">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-zinc-900 font-poppins flex items-center gap-2">
                                        <Reply className="h-4 w-4" />
                                        {selectedComment.adminReply ? "Ubah Balasan" : "Balas Komentar"}
                                    </label>
                                    <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-thighter">Otomatis Terbit & Approve</p>
                                </div>
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Tulis balasan profesional Anda di sini..."
                                    className="w-full bg-zinc-50 border-b border-zinc-200 py-4 px-1 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-all resize-none min-h-[120px] font-medium"
                                />

                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button
                                        onClick={() => updateComment(selectedComment._id || selectedComment.id, { status: "Spam" })}
                                        className="flex-1 px-6 py-3 text-red-600 text-sm font-bold border border-red-100 bg-red-50/30 rounded-xl hover:bg-red-50 transition min-h-[44px]"
                                    >
                                        Tandai Spam
                                    </button>
                                    <button
                                        onClick={handleReply}
                                        disabled={!replyText.trim()}
                                        className="flex-[2] flex items-center justify-center gap-2 px-8 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-sky-600 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 min-h-[44px]"
                                    >
                                        <Reply className="h-4 w-4" />
                                        {selectedComment.adminReply ? "Update Balasan" : "Kirim Balasan"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
