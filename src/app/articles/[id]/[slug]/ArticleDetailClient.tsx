"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import { useContentStore } from "@/lib/contentStore";
import { useToast } from "@/components/ui/Toast";
import { Turnstile } from "@marsidev/react-turnstile";
import {
    Calendar,
    User,
    Eye,
    ChevronLeft,
    Facebook,
    Instagram,
    Twitter,
    Send,
    MessageCircle,
    Link2,
    TrendingUp,
    RefreshCw,
    Reply,
    ArrowUpRight
} from "lucide-react";
import dynamic from "next/dynamic";
const AdUnit = dynamic(() => import("@/components/AdUnit"), { ssr: false });

export default function ArticleDetail() {
    const params = useParams();
    const id = params?.id as string; // MongoDB ID is string

    const [mounted, setMounted] = useState(false);
    const { articles, socialShare, fetchArticles, fetchComments } = useContentStore();

    useEffect(() => {
        setMounted(true);
        fetchArticles();
        fetchComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!mounted) return null;

    const publishedArticles = articles.filter(a => a.status === "Published");
    const article = publishedArticles.find(a => a._id === id);

    // Get 5 other articles for the sidebar
    const otherArticles = publishedArticles
        .filter(a => a._id !== id)
        .slice(0, 5);

    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center text-zinc-500">
                <h2>Article not found or not published.</h2>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white text-zinc-900">
            <Navbar />

            <article className="pt-20 pb-20">
                <div className="mx-auto w-full max-w-7xl px-6">
                    {/* Top Back Link */}
                    <Link href="/articles" className="inline-flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-8 group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        Kembali ke Berita
                    </Link>

                    {/* Left Aligned Header */}
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-zinc-900 leading-[1.2] mb-6 max-w-4xl tracking-tight">
                            {article.title}
                        </h1>

                        {/* Metadata Row with Icons */}
                        <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-400 font-medium">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{article.date.split(',')[0]}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="bg-zinc-50 text-zinc-600 px-2.5 py-1 rounded text-sm font-medium border border-zinc-100">
                                    {article.category}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 border-l border-zinc-200 pl-4 ml-1">
                                <User className="w-3.5 h-3.5" />
                                <span>{article.author}</span>
                            </div>
                            <div className="flex items-center gap-1.5 border-l border-zinc-200 pl-4 ml-1">
                                <Eye className="w-3.5 h-3.5" />
                                <span>380 dilihat</span>
                            </div>
                        </div>
                    </header>
                </div>

                {/* Main Image - Full Width */}
                <section className="w-full mb-12">
                    <div className="relative h-[400px] md:h-[70vh] w-full overflow-hidden">
                        <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                            unoptimized={article.image.startsWith("http") || article.image.startsWith("data:")}
                        />
                    </div>
                </section>
                
                {/* Main Content Area */}
                <div className="mx-auto w-full max-w-4xl px-6 pb-24">
                    <div className="w-full">
                        <div className="prose prose-zinc max-w-none mb-12
                                prose-p:text-zinc-500 prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6 prose-p:font-normal
                                prose-strong:text-zinc-900 prose-strong:font-bold
                                "
                        >
                            <p className="font-semibold text-zinc-900 text-base md:text-lg">
                                {article.category} — {article.description.split('.')[0]}.
                            </p>
                            
                            {/* Content with Auto-Injected Ads */}
                            {(() => {
                                const content = article.content || '<p>Content coming soon...</p>';
                                const paragraphs = content.split('</p>');
                                
                                // Only inject if we have enough paragraphs (e.g., more than 2)
                                if (paragraphs.length > 2) {
                                    const midPoint = Math.ceil(paragraphs.length / 2);
                                    const part1 = paragraphs.slice(0, midPoint).join('</p>') + '</p>';
                                    const part2 = paragraphs.slice(midPoint).join('</p>');
                                    
                                    return (
                                        <>
                                            <div dangerouslySetInnerHTML={{ __html: part1 }} />
                                            <div className="my-10 py-4 border-y border-zinc-50 bg-zinc-50/20">
                                                <AdUnit 
                                                    slot="3017348131" 
                                                    layout="in-article" 
                                                    format="fluid" 
                                                    style={{ display: 'block', textAlign: 'center' }} 
                                                />
                                            </div>
                                            <div dangerouslySetInnerHTML={{ __html: part2 }} />
                                        </>
                                    );
                                }
                                
                                return <div dangerouslySetInnerHTML={{ __html: content }} />;
                            })()}
                        </div>

                        {/* Share Section */}
                        {(socialShare.enableFacebook || socialShare.enableWhatsapp || socialShare.enableInstagram || socialShare.enableCopyLink) && (
                            <div className="mb-16">
                                <h4 className="text-sm font-semibold text-zinc-900 mb-6">Bagikan Artikel:</h4>
                                <div className="flex items-center gap-3">
                                    {socialShare.enableFacebook && (
                                        <button
                                            title="Share on Facebook"
                                            aria-label="Bagikan ke Facebook"
                                            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                                            className="w-10 h-10 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                                        >
                                            <Facebook className="w-5 h-5 fill-current" />
                                        </button>
                                    )}
                                    {socialShare.enableWhatsapp && (
                                        <button
                                            title="Share on WhatsApp"
                                            aria-label="Bagikan ke WhatsApp"
                                            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + window.location.href)}`, '_blank')}
                                            className="w-10 h-10 rounded-full bg-[#25d366] text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                                        >
                                            <MessageCircle className="w-5 h-5 fill-current" />
                                        </button>
                                    )}
                                    {socialShare.enableInstagram && (
                                        <button
                                            title="Share on Instagram"
                                            aria-label="Bagikan ke Instagram"
                                            onClick={() => window.open(`https://instagram.com`, '_blank')}
                                            className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                                        >
                                            <Instagram className="w-5 h-5" />
                                        </button>
                                    )}
                                    {socialShare.enableCopyLink && (
                                        <button
                                            title="Copy Link"
                                            aria-label="Salin Link Artikel"
                                            onClick={() => {
                                                navigator.clipboard.writeText(window.location.href);
                                                alert("Link disalin ke clipboard!");
                                            }}
                                            className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center hover:bg-zinc-200 transition-colors cursor-pointer shadow-sm border border-zinc-200"
                                        >
                                            <Link2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Comments Section */}
                        <CommentsSection articleId={article._id!} />
                    </div>
                </div>
            </article>

            <Footer />
        </main>
    );
}

function CommentsSection({ articleId }: { articleId: string }) {
    const { comments, addComment } = useContentStore();
    const { toast } = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [text, setText] = useState("");
    const [token, setToken] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const articleComments = comments.filter(c => c.articleId === articleId && c.status === "Approved");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast({
                title: "Verifikasi Diperlukan",
                description: "Silakan selesaikan verifikasi keamanan sebelum mengirim komentar.",
                type: "warning"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            await addComment({
                articleId,
                author: name,
                email,
                whatsapp, // Still pass it, though schema might need update or it goes to metadata
                content: text,
                status: "Pending",
                timestamp: new Date().toISOString()
            });

            setSuccess(true);
            setName("");
            setEmail("");
            setWhatsapp("");
            setText("");
            setToken(null);

            toast({
                title: "Komentar Terkirim",
                description: "Terima kasih! Komentar Anda sedang menunggu moderasi.",
                type: "success"
            });

            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            toast({
                title: "Gagal Mengirim",
                description: "Terjadi kesalahan saat mengirim komentar. Silakan coba lagi.",
                type: "error"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-12">
            <div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-6 font-poppins">Diskusi ({articleComments.length})</h3>
                <div className="space-y-8">
                    {articleComments.length === 0 ? (
                        <div className="flex flex-col items-center gap-4 py-12 bg-zinc-50 rounded-2xl border border-zinc-100/50 border-dashed">
                            <MessageCircle className="h-10 w-10 text-zinc-300" />
                            <p className="text-zinc-500 italic text-sm font-normal">Belum ada diskusi. Jadilah yang pertama memberikan masukan!</p>
                        </div>
                    ) : (
                        articleComments.map((c: any) => (
                            <div key={c._id || c.id} className="flex gap-5 group animate-fade-in">
                                <div className="w-11 h-11 rounded-2xl bg-zinc-900 flex items-center justify-center text-white font-black shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                                    {c.author.charAt(0).toUpperCase()}
                                </div>
                                <div className="space-y-3 flex-1 pt-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-base text-zinc-900 leading-tight">{c.author}</span>
                                            <span className="text-[11px] font-semibold text-zinc-400 mt-0.5">
                                                {c.timestamp ? new Date(c.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : c.date}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-zinc-600 text-[15px] leading-relaxed font-medium italic">
                                        "{c.content}"
                                    </p>
                                    {c.adminReply && (
                                        <div className="mt-6 p-5 bg-sky-50 rounded-2xl border border-sky-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                                <Reply className="h-12 w-12" />
                                            </div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center text-[10px] text-white font-black">A</div>
                                                <span className="text-[11px] font-black tracking-[0.2em] text-zinc-900">Atmosphere Official</span>
                                            </div>
                                            <p className="text-zinc-700 text-[14px] leading-relaxed font-semibold italic">"{c.adminReply}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Comment Form Card */}
            <div className="bg-zinc-50/30 p-8 md:p-10 rounded-2xl border border-zinc-100">
                <h4 className="text-lg font-semibold text-zinc-900 mb-8 border-b border-zinc-100 pb-4">Tinggalkan Komentar</h4>

                {success ? (
                    <div className="bg-zinc-900 text-white p-6 rounded-xl text-center">
                        <p className="font-bold">Terima kasih atas komentar Anda!</p>
                        <p className="text-xs mt-1 opacity-70">Komentar Anda sedang menunggu moderasi.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-900">Nama Lengkap <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-base text-zinc-900 focus:border-zinc-900 outline-none transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-900">Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-base text-zinc-900 focus:border-zinc-900 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-900">No. WhatsApp / HP <span className="text-red-500">*</span></label>
                            <input
                                type="tel"
                                required
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-base text-zinc-900 focus:border-zinc-900 outline-none transition-all font-medium"
                            />
                            <p className="text-sm text-gray-500 italic">Nomor tidak akan dipublikasikan.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-900">Komentar <span className="text-red-500">*</span></label>
                            <textarea
                                required
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={5}
                                className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-base text-zinc-900 focus:border-zinc-900 outline-none resize-none transition-all font-medium"
                            ></textarea>
                        </div>

                        {/* Turnstile Captcha */}
                        <div className="pt-2">
                            <Turnstile
                                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                                onSuccess={(t) => setToken(t)}
                                onExpire={() => setToken(null)}
                                onError={() => setToken(null)}
                                options={{
                                    theme: 'light',
                                    size: 'normal'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-8 py-3.5 bg-zinc-900 text-white font-semibold text-base rounded-full hover:bg-zinc-800 transition active:scale-95 flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    MENGIRIM...
                                </>
                            ) : (
                                "Kirim Komentar"
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
