"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useContentStore, GlobalArticle } from "@/lib/contentStore";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Save,
    X,
    Upload,
    Plus,
    Trash2,
    Tag,
    Package,
    Play,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

interface ArticleFormProps {
    initialData?: GlobalArticle | null;
    isEditing?: boolean;
}

export default function ArticleForm({ initialData, isEditing = false }: ArticleFormProps) {
    const router = useRouter();
    const { addArticle, updateArticle, categories, addCategory, deleteCategory, uploadMedia } = useContentStore();

    // Form states
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.content || initialData?.description || "");
    const [image, setImage] = useState(initialData?.image || "");
    const [category, setCategory] = useState(initialData?.category || "");
    const [status, setStatus] = useState<GlobalArticle["status"]>(initialData?.status || "Draft");
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [tagInput, setTagInput] = useState("");
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Category CRUD state
    const [newCategory, setNewCategory] = useState("");
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!category && categories.length > 0) {
            setCategory(categories[0].name);
        }
    }, [categories, category]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4'];
        if (!allowedTypes.includes(file.type)) {
            alert("Format file harus PNG, JPG, JPEG, atau MP4.");
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            alert("Ukuran file maksimal 4MB.");
            return;
        }

        let isTimedOut = false;
        setUploading(true);

        const timeout = setTimeout(() => {
            isTimedOut = true;
            setUploading(prev => {
                if (prev) {
                    alert("Gagal mengunggah media (Timeout 30 detik). Silakan coba lagi atau gunakan URL alternatif.");
                    return false;
                }
                return prev;
            });
        }, 30000);

        try {
            const localUrl = URL.createObjectURL(file);
            setImage(localUrl);

            const url = await uploadMedia(file);

            if (isTimedOut) {
                return;
            }

            setImage(url);
            clearTimeout(timeout);
        } catch (error: any) {
            clearTimeout(timeout);
            if (!isTimedOut) {
                alert(`Gagal upload: ${error.message || 'Gagal menyimpan file ke server.'}`);
                setImage(initialData?.image || "");
            }
        } finally {
            setUploading(false);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        await addCategory(newCategory.trim());
        setCategory(newCategory.trim());
        setNewCategory("");
        setIsAddingCategory(false);
    };

    const handleDeleteCategory = async (id: string, name: string) => {
        if (confirm(`Hapus kategori "${name}"?`)) {
            const deleted = await deleteCategory(id, name);
            if (deleted && category === name) {
                setCategory(categories[0]?.name || "");
            }
        }
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!title.trim()) newErrors.title = "Judul artikel wajib diisi";

        const strippedContent = description ? description.replace(/<[^>]*>?/gm, '').trim() : '';
        if (!strippedContent) {
            newErrors.description = "Deskripsi artikel wajib diisi";
        }

        if (status === "Scheduled") {
            if (!scheduleDate) newErrors.scheduleDate = "Tanggal wajib diisi untuk penjadwalan";
            if (!scheduleTime) newErrors.scheduleTime = "Waktu wajib diisi untuk penjadwalan";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        setIsSubmitting(true);

        const previewText = description ? description.replace(/<[^>]*>?/gm, '').substring(0, 150) : '';

        try {
            const articleData = {
                title,
                description: previewText || "No content",
                content: description,
                image: image || "/images/hero-workspace.png",
                category,
                tags,
                author: "Admin Atmosphere",
                date: status === "Scheduled"
                    ? `${scheduleDate}, ${scheduleTime}`
                    : (isEditing && initialData?.date) ? initialData.date : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ", " + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                status: status as any
            };

            if (isEditing && initialData?._id) {
                await updateArticle(initialData._id, articleData);
            } else {
                await addArticle(articleData);
            }
            router.push("/dashboard/articles");
        } catch (error) {
            console.error("Error saving article:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="animate-fade-in-up pb-24">
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 -mx-3 sm:-mx-4 px-3 sm:px-4 py-4 sm:py-5 bg-white/80 backdrop-blur-md border-b border-zinc-100 mb-8 sm:mb-12">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => router.back()}
                            className="cursor-pointer p-2.5 sm:p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 shadow-sm transition-all"
                        >
                            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight font-poppins">
                                {isEditing ? "Edit Artikel" : "Tulis Artikel Baru"}
                            </h2>
                            <p className="text-sm sm:text-base text-zinc-500 font-normal mt-0.5 sm:mt-1">
                                Lengkapi detail artikel Anda di bawah ini.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => router.push("/dashboard/articles")}
                            className="hidden sm:block cursor-pointer px-5 sm:px-6 py-2.5 sm:py-3 text-zinc-600 text-sm sm:text-base font-semibold hover:text-zinc-900 transition border border-zinc-200 rounded-xl bg-white hover:bg-zinc-50"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSubmitting || uploading}
                            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer px-5 sm:px-7 py-2.5 sm:py-3 bg-zinc-900 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-sky-600 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="hidden sm:inline">{isEditing ? "Update Artikel" : "Simpan Artikel"}</span>
                            <span className="sm:hidden">{isEditing ? "Update" : "Simpan"}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-8 space-y-8 sm:space-y-12">
                    
                    {/* Basic Info Section */}
                    <section className="space-y-8">
                        <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight font-poppins">Informasi Artikel</h3>

                        <div className="space-y-6">
                            {/* Title */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-zinc-700">Judul Artikel <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Masukkan judul artikel..."
                                    className={`w-full bg-transparent border-b ${errors.title ? 'border-red-500' : 'border-zinc-300'} py-3 text-base text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium`}
                                />
                                {errors.title && <p className="text-sm text-red-500 font-medium">{errors.title}</p>}
                            </div>

                            {/* Description / Content */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-zinc-700">Konten Artikel <span className="text-red-500">*</span></label>
                                <div className={`bg-white border ${errors.description ? 'border-red-500' : 'border-zinc-300'} rounded-xl overflow-hidden focus-within:border-zinc-900 transition-colors`}>
                                    <Editor
                                        data={description}
                                        onChange={(data: string) => setDescription(data)}
                                        placeholder="Mulai menulis konten..."
                                    />
                                </div>
                                {errors.description && <p className="text-sm text-red-500 font-medium">{errors.description}</p>}
                            </div>
                        </div>
                    </section>

                    {/* Media Section */}
                    <section className="space-y-8">
                        <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight font-poppins">Media & Galeri</h3>

                        <div className="space-y-6">
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-zinc-700">Sampul Artikel (Gambar/Video)</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div
                                        onClick={() => !uploading && fileInputRef.current?.click()}
                                        className={`relative aspect-video rounded-xl border-2 ${uploading ? 'border-zinc-300 cursor-not-allowed opacity-70' : 'border-zinc-200 hover:border-zinc-400 cursor-pointer'} bg-white flex flex-col items-center justify-center overflow-hidden transition-all group`}
                                    >
                                        {image ? (
                                            image.toLowerCase().endsWith('.mp4') ? (
                                                <video src={image} className="w-full h-full object-cover" />
                                            ) : (
                                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                            )
                                        ) : (
                                            <div className="text-center p-4">
                                                <Upload className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
                                                <p className="text-sm text-zinc-500">Klik untuk upload</p>
                                            </div>
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 mb-2"></div>
                                                <p className="text-xs font-semibold text-zinc-900">UPLOADING...</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center gap-3">
                                        <div className="flex flex-col gap-3">
                                            <label className="text-sm font-semibold text-zinc-700">URL Alternatif</label>
                                            <input
                                                type="text"
                                                value={image}
                                                onChange={(e) => setImage(e.target.value)}
                                                placeholder="Paste URL gambar..."
                                                className="w-full bg-transparent border-b border-zinc-300 py-3 text-base text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                                            />
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            accept=".png,.jpg,.jpeg,.mp4"
                                            className="hidden"
                                        />
                                        <p className="text-sm text-zinc-500 italic">Format: PNG, JPG, JPEG, MP4. Max 4MB.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Category & Tags Section */}
                    <section className="space-y-8">
                        <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight font-poppins">Kategori & Tag</h3>

                        <div className="space-y-8">
                            {/* Category */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-zinc-700">Kategori Artikel <span className="text-red-500">*</span></label>
                                    <button
                                        onClick={() => setIsAddingCategory(!isAddingCategory)}
                                        className="cursor-pointer px-4 py-2 bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white rounded-lg text-sm font-medium tracking-wide transition-all flex items-center gap-2 border border-sky-200 hover:border-sky-600"
                                    >
                                        <Plus className="h-4 w-4" /> Tambah Baru
                                    </button>
                                </div>

                                {isAddingCategory && (
                                    <div className="flex gap-2 animate-in fade-in slide-in-from-top-1">
                                        <input
                                            type="text"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            placeholder="Nama kategori..."
                                            className="flex-1 bg-transparent border-b border-zinc-300 py-3 text-base text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                                        />
                                        <button
                                            onClick={handleAddCategory}
                                            className="cursor-pointer px-5 py-3 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition"
                                        >
                                            Simpan
                                        </button>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="relative group">
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full appearance-none bg-transparent border-b border-zinc-300 py-3 text-base text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all pr-10 cursor-pointer font-medium"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-hover:text-zinc-600 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {categories.map(cat => (
                                            <div key={cat._id} className="flex items-center gap-2 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg">
                                                <span className="text-sm text-zinc-600">{cat.name}</span>
                                                <button
                                                    onClick={() => cat._id && handleDeleteCategory(cat._id, cat.name)}
                                                    className="p-1 text-zinc-400 hover:text-red-500 transition"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                                    <Tag className="h-4 w-4" />
                                    Tags & Kata Kunci
                                </label>
                                <div className="flex flex-wrap gap-2 p-4 bg-white border-b border-zinc-300 min-h-[56px] focus-within:border-zinc-900 transition-colors">
                                    {tags.map(tag => (
                                        <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-700 text-sm rounded-lg">
                                            {tag}
                                            <button onClick={() => removeTag(tag)} className="hover:text-red-600 transition">
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        placeholder="Ketik tag & Enter..."
                                        className="flex-1 bg-transparent outline-none text-base min-w-[150px] font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column (Meta & Publication) */}
                <div className="lg:col-span-4 space-y-8 sm:space-y-12">
                    
                    {/* Publication Status */}
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-lg font-semibold text-zinc-900 tracking-tight mb-6 font-poppins">Status Publikasi</h4>
                            <div className="space-y-4">
                                {["Draft", "Scheduled", "Published"].map(s => (
                                    <label key={s} className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${status === s ? 'bg-white border-zinc-900' : 'bg-transparent border-zinc-200 hover:border-zinc-300'}`}>
                                        <input
                                            type="radio"
                                            name="status"
                                            value={s}
                                            checked={status === s}
                                            onChange={(e) => setStatus(e.target.value as any)}
                                            className="w-4 h-4 text-zinc-900 border-zinc-300 focus:ring-zinc-900"
                                        />
                                        <span className="text-sm font-semibold text-zinc-700">
                                            {s === "Published" ? "Terbitkan Sekarang" : s === "Scheduled" ? "Jadwalkan" : "Simpan sebagai Draft"}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Schedule */}
                        {status === "Scheduled" && (
                            <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-2">
                                <h4 className="text-lg font-semibold text-zinc-900 tracking-tight font-poppins">Waktu Publikasi</h4>
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                                            <Calendar className="h-4 w-4" /> Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            value={scheduleDate}
                                            onChange={(e) => setScheduleDate(e.target.value)}
                                            className="w-full bg-transparent border-b border-zinc-300 py-3 text-base text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                                            <Clock className="h-4 w-4" /> Waktu
                                        </label>
                                        <input
                                            type="time"
                                            value={scheduleTime}
                                            onChange={(e) => setScheduleTime(e.target.value)}
                                            className="w-full bg-transparent border-b border-zinc-300 py-3 text-base text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Sticky Save Button */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-zinc-100 lg:hidden z-20">
                        <div className="max-w-7xl mx-auto flex gap-3">
                            <button
                                onClick={() => router.push("/dashboard/articles")}
                                className="flex-1 cursor-pointer px-5 py-3 text-zinc-600 text-sm font-semibold border border-zinc-200 rounded-xl bg-white hover:bg-zinc-50 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSubmitting || uploading}
                                className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-5 py-3 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-sky-600 transition-all shadow-lg disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" /> {isEditing ? "Update" : "Simpan"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
