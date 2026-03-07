"use client";

import { useState, useEffect } from "react";
import {
    Plus, Trash2, Package, Save, Play, ArrowLeft, Info
} from "lucide-react";
import { Product, ProductSpec } from "@/types";
import { generateSKU, CATEGORY_MAP } from "@/lib/utils";
import { useProductStore } from "@/lib/productStore";
import dynamic from "next/dynamic";

const SunEditor = dynamic(() => import("suneditor-react"), {
    ssr: false,
});
import "suneditor/dist/css/suneditor.min.css";
import React, { memo } from "react";

// ── SunEditor isolated component to prevent re-render loops ──────────────────
const MemoizedSunEditor = memo(({ contents, onChange }: { contents: string, onChange: (content: string) => void }) => {
    return (
        <SunEditor
            setContents={contents}
            onChange={content => {
                const normalizedContent = content === "<p><br></p>" ? "" : content;
                const normalizedFormDesc = contents === "<p><br></p>" ? "" : contents;
                if (normalizedContent !== normalizedFormDesc) {
                    onChange(content);
                }
            }}
            setOptions={{
                buttonList: [
                    ["undo", "redo"], ["font", "fontSize", "formatBlock"],
                    ["bold", "underline", "italic", "strike"],
                    ["fontColor", "hiliteColor"],
                    ["outdent", "indent", "align", "list", "table"],
                    ["link", "image", "video"], ["fullScreen", "codeView"]
                ],
                minHeight: "350px",
                height: "auto",
                iframe: false,
                font: ["Poppins", "Arial", "sans-serif"],
                defaultStyle: "font-family: 'Poppins', sans-serif; font-size: 16px; padding: 12px 0; color: #18181b;"
            }}
        />
    );
});
MemoizedSunEditor.displayName = "MemoizedSunEditor";

// ── Category taxonomy (furniture industry standard) ──────────────────────────
const PRODUCT_CATEGORIES = [
    { label: "Meja", value: "Meja" },
    { label: "Kursi", value: "Kursi" },
    { label: "Bangku / Bench", value: "Bench" },
    { label: "Stool", value: "Stool" },
    { label: "Lemari", value: "Lemari" },
    { label: "Rak", value: "Rak" },
    { label: "Kabinet", value: "Kabinet" },
    { label: "Credenza", value: "Credenza" },
    { label: "Nakas", value: "Nakas" },
    { label: "Bed Frame", value: "Bed Frame" },
    { label: "Sofa", value: "Sofa" },
    { label: "Konsol", value: "Konsol" },
];

const COLLECTION_PRESETS = [
    "Dining Room", "Living Room", "Bedroom", "Workspace",
    "Outdoor", "Rest Room", "Kids Room", "Custom",
];

// ── Stock / Availability status ───────────────────────────────────────────────
const STATUS_OPTIONS: { value: Product["status"]; label: string; color: string }[] = [
    { value: "In Stock", label: "In Stock — Tersedia", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { value: "Low Stock", label: "Low Stock — Hampir Habis", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { value: "Out of Stock", label: "Out of Stock — Habis", color: "bg-red-50 text-red-700 border-red-200" },
    { value: "Pre-order", label: "Pre-order — Inden", color: "bg-sky-50 text-sky-700 border-sky-200" },
];

const SUN_EDITOR_OPTIONS = {
    buttonList: [
        ["undo", "redo"], ["font", "fontSize", "formatBlock"],
        ["bold", "underline", "italic", "strike"],
        ["fontColor", "hiliteColor"],
        ["outdent", "indent", "align", "list", "table"],
        ["link", "image", "video"], ["fullScreen", "codeView"]
    ],
    minHeight: "350px",
    font: ["Poppins", "Arial", "sans-serif"],
    defaultStyle: "font-family: 'Poppins', sans-serif; font-size: 16px; padding: 12px 0; color: #18181b;"
};

const InputField = ({ label, required, hint, children }: {
    label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) => (
    <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-zinc-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {hint && (
                <span className="text-xs text-zinc-400 flex items-center gap-1 italic">
                    <Info className="h-3 w-3" /> {hint}
                </span>
            )}
        </div>
        {children}
    </div>
);

interface ProductFormProps {
    initialData?: Product;
    onSave: (data: Omit<Product, "code" | "rating">) => void;
    onCancel: () => void;
    title: string;
    subtitle?: string;
}

const emptyForm = (): Omit<Product, "code" | "rating"> => ({
    name: "",
    label: "Kayu",
    category: "",
    collection: "",
    price: 0,
    memberPrice: 0,
    stock: 0,
    status: "In Stock",
    delivery: "Pengiriman 2-3 minggu setelah produksi selesai",
    media: [],
    mainMediaIndex: 0,
    description: "",
    specifications: [
        { key: "Material Utama", value: "" },
        { key: "Material Detail", value: "" },
        { key: "Finishing", value: "" },
        { key: "Warna Tersedia", value: "" },
    ],
    dimensions: { product: "", weight: "", packaged: "" },
    fabric: "",
    returns: "",
    additionalInfo: {
        warranty: "1 tahun garansi kerusakan produksi",
        production: "14-30 hari kerja",
        shipping: "",
        care: "Lap dengan kain kering, hindari paparan sinar matahari langsung.",
    },
});

export default function ProductForm({ initialData, onSave, onCancel, title, subtitle }: ProductFormProps) {
    const [form, setForm] = useState<Omit<Product, "code" | "rating">>(emptyForm());
    const [previewSKU, setPreviewSKU] = useState<string>("");
    const { products } = useProductStore();

    useEffect(() => {
        if (initialData) {
            setForm(prev => {
                if (prev.name === initialData.name &&
                    prev.price === initialData.price &&
                    prev.description === initialData.description) return prev;
                return { ...initialData };
            });
        }
    }, [initialData]);

    // Preview SKU Logic
    useEffect(() => {
        if (initialData?.code) {
            setPreviewSKU(initialData.code);
        } else {
            const existingCodes = products.map(p => p.code);
            const generated = generateSKU(form.label, form.category, existingCodes);
            setPreviewSKU(generated);
        }
    }, [form.label, form.category, products, initialData]);

    const handleSave = () => {
        if (!form.name.trim()) { alert("Nama produk tidak boleh kosong."); return; }
        if (!form.label) { alert("Label material harus dipilih."); return; }
        if (!form.category.trim()) { alert("Kategori harus dipilih atau diisi."); return; }
        if (!form.collection.trim()) { alert("Koleksi / ruangan harus diisi."); return; }
        if (!form.price || form.price <= 0) { alert("Harga normal harus lebih dari 0."); return; }
        if (form.memberPrice > 0 && form.memberPrice > form.price) { alert("Harga spesial tidak boleh lebih besar dari harga normal."); return; }
        if (!form.status) { alert("Status ketersediaan harus dipilih."); return; }
        if (form.status !== "Pre-order" && form.stock < 0) { alert("Stok harus 0 atau lebih."); return; }
        if (!form.description.trim()) { alert("Deskripsi produk tidak boleh kosong."); return; }
        if (!form.delivery.trim()) { alert("Informasi pengiriman tidak boleh kosong."); return; }

        for (let i = 0; i < Math.min(4, form.specifications.length); i++) {
            if (!form.specifications[i].value.trim()) {
                alert(`Spesifikasi "${form.specifications[i].key}" tidak boleh kosong.`);
                return;
            }
        }

        if (!form.dimensions.product.trim()) { alert("Dimensi produk tidak boleh kosong."); return; }
        if (!form.dimensions.weight.trim()) { alert("Berat bersih tidak boleh kosong."); return; }
        if (!form.dimensions.packaged.trim()) { alert("Berat & dimensi kemas tidak boleh kosong."); return; }
        if (!form.fabric.trim()) { alert("Detail material / bahan tidak boleh kosong."); return; }
        if (!form.additionalInfo.warranty.trim()) { alert("Informasi garansi tidak boleh kosong."); return; }

        const validMedia = form.media.filter((m: string) => m.trim() !== "");
        const formToSave = {
            ...form,
            code: previewSKU,
            media: validMedia,
            mainMediaIndex: form.mainMediaIndex ?? 0,
            specifications: form.specifications.filter((s) => s.key.trim() !== ""),
        };
        onSave(formToSave as any);
    };

    const updateSpec = (index: number, field: keyof ProductSpec, value: string) => {
        const specs = [...form.specifications];
        specs[index] = { ...specs[index], [field]: value };
        setForm(f => ({ ...f, specifications: specs }));
    };

    return (
        <div className="animate-fade-in-up pb-24 font-poppins">
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 -mx-3 sm:-mx-4 px-3 sm:px-4 py-4 sm:py-5 bg-white/90 backdrop-blur-md border-b border-zinc-100 mb-8 sm:mb-12">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">{title}</h2>
                        {subtitle && <p className="text-sm sm:text-base text-zinc-500 font-normal mt-0.5 sm:mt-1">{subtitle}</p>}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1.5 sm:gap-2 px-5 sm:px-7 py-2.5 sm:py-3 bg-zinc-900 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-sky-600 transition-all shadow-lg active:scale-[0.98]"
                        >
                            <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="hidden sm:inline">Simpan Produk</span>
                            <span className="sm:hidden">Simpan</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">

                {/* ── LEFT COLUMN ─────────────────────────────────────── */}
                <div className="lg:col-span-8 space-y-12">

                    {/* SECTION 1: Identitas Produk */}
                    <section className="space-y-8">
                        <div className="border-b border-zinc-100 pb-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight">Identitas Produk</h3>
                            <p className="text-sm text-zinc-400 mt-1">Informasi dasar yang ditampilkan kepada pelanggan.</p>
                        </div>

                        <div className="space-y-6">
                            <InputField label="Nama Produk" required hint="Tampil sebagai judul utama di halaman produk">
                                <input
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Contoh: Kursi Makan Kayu Jati Minimalis"
                                    className="w-full bg-transparent border-b border-zinc-300 py-3 text-base text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                                />
                            </InputField>

                            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Product Code (SKU) {initialData ? "" : "Preview"}</p>
                                    <p className="text-xl font-mono font-bold text-zinc-900 mt-0.5">{previewSKU || "---"}</p>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] text-zinc-400 italic">Otomatis dihitung berdasarkan material & kategori</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                <InputField label="Jenis Material" required hint="Menentukan kode produk (W-, I-, WI-)">
                                    <div className="relative group">
                                        <select
                                            value={form.label}
                                            onChange={e => setForm(f => ({ ...f, label: e.target.value as Product["label"] }))}
                                            className="w-full appearance-none bg-transparent border-b border-zinc-300 py-3 text-base text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all pr-10 cursor-pointer font-medium"
                                        >
                                            <option value="Kayu">Kayu — Produk berbahan kayu solid</option>
                                            <option value="Besi">Besi — Produk berbahan besi / metal</option>
                                            <option value="Mixed">Mixed — Kombinasi kayu &amp; besi</option>
                                        </select>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                </InputField>

                                <InputField label="Koleksi / Ruangan" required hint="Kategori ruangan untuk filter produk">
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            {COLLECTION_PRESETS.map(col => (
                                                <button
                                                    key={col} type="button"
                                                    onClick={() => setForm(f => ({ ...f, collection: col }))}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${form.collection === col ? 'bg-sky-600 text-white border-sky-600' : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400'}`}
                                                >
                                                    {col}
                                                </button>
                                            ))}
                                        </div>
                                        <input
                                            value={form.collection}
                                            onChange={e => setForm(f => ({ ...f, collection: e.target.value }))}
                                            placeholder="Atau ketik nama koleksi kustom..."
                                            className="w-full bg-transparent border-b border-zinc-300 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                                        />
                                    </div>
                                </InputField>
                            </div>

                            <InputField label="Kategori (Macam Produk)" required hint="Menentukan segmen harga & kode SKU">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                        {PRODUCT_CATEGORIES.map(cat => (
                                            <button
                                                key={cat.value} type="button"
                                                onClick={() => setForm(f => ({ ...f, category: cat.value }))}
                                                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${form.category === cat.value ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:bg-white'}`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        value={form.category}
                                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                        placeholder="Atau ketik kategori kustom (Contoh: Credenza, Mirror, Partition)..."
                                        className="w-full bg-transparent border-b border-zinc-200 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                                    />
                                </div>
                            </InputField>
                        </div>
                    </section>

                    {/* SECTION 2: Harga & Ketersediaan */}
                    <section className="space-y-8">
                        <div className="border-b border-zinc-100 pb-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight">Harga &amp; Ketersediaan</h3>
                            <p className="text-sm text-zinc-400 mt-1">Tetapkan harga dan atur ketersediaan stok produk.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                            <InputField label="Harga Normal (Coret)" required hint="Harga sebelum diskon, ditampilkan dicoret">
                                <div className="relative">
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500 font-semibold text-sm">Rp</span>
                                    <input type="number" min={0}
                                        value={form.price || ""}
                                        onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                                        placeholder="5.000.000"
                                        className="w-full bg-transparent border-b border-zinc-300 py-3 pl-8 text-base text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                                    />
                                </div>
                            </InputField>

                            <InputField label="Harga Spesial (Jual)" hint="Opsional — Kosongkan jika tidak ada promo">
                                <div className="relative">
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500 font-semibold text-sm">Rp</span>
                                    <input type="number" min={0}
                                        value={form.memberPrice || ""}
                                        onChange={e => setForm(f => ({ ...f, memberPrice: Number(e.target.value) }))}
                                        placeholder="3.500.000"
                                        className="w-full bg-transparent border-b border-zinc-300 py-3 pl-8 text-base text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                                    />
                                </div>
                                {form.price > 0 && form.memberPrice > 0 && form.memberPrice < form.price && (
                                    <p className="text-xs text-emerald-600 font-semibold mt-1">
                                        Hemat Rp {(form.price - form.memberPrice).toLocaleString("id-ID")} ({Math.round((1 - form.memberPrice / form.price) * 100)}% diskon)
                                    </p>
                                )}
                            </InputField>

                            <InputField label="Status Ketersediaan" required>
                                <div className="grid grid-cols-2 gap-2">
                                    {STATUS_OPTIONS.map(opt => (
                                        <button key={opt.value} type="button"
                                            onClick={() => setForm(f => ({ ...f, status: opt.value }))}
                                            className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${form.status === opt.value ? opt.color + " ring-2 ring-offset-1 ring-current shadow-md" : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-300"}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </InputField>

                            {form.status !== "Pre-order" && (
                                <InputField label="Jumlah Stok" required hint="Ubah otomatis ke Low Stock jika ≤ 5">
                                    <input type="number" min={0}
                                        value={form.stock ?? ""}
                                        onChange={e => {
                                            const val = Number(e.target.value);
                                            setForm(f => ({
                                                ...f,
                                                stock: val,
                                                status: val === 0 ? "Out of Stock" : val <= 5 ? "Low Stock" : "In Stock"
                                            }));
                                        }}
                                        placeholder="Contoh: 10"
                                        className="w-full bg-transparent border-b border-zinc-300 py-3 text-base text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                                    />
                                </InputField>
                            )}
                        </div>
                    </section>

                    {/* SECTION 3: Media & Deskripsi */}
                    <section className="space-y-8">
                        <div className="border-b border-zinc-100 pb-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight">Galeri &amp; Deskripsi</h3>
                            <p className="text-sm text-zinc-400 mt-1">Upload foto/video produk dan tulis narasi lengkap.</p>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-zinc-500" />
                                        <span className="text-sm font-semibold text-zinc-800">Foto / Video Produk <span className="text-zinc-400 font-normal">(Maks. 8 file, maks. 4 MB/file)</span></span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                    {form.media.map((med, idx) => {
                                        const isVideo = med.match(/\.(mp4|webm|ogg|quicktime)$/i) || med.includes("video") || med.startsWith("data:video");
                                        const isMain = idx === form.mainMediaIndex;
                                        return (
                                            <div key={idx} className={`relative group aspect-square rounded-xl border-2 overflow-hidden transition-all ${isMain ? "border-zinc-900 ring-4 ring-zinc-900/10 scale-105 z-10" : "border-zinc-200 hover:border-zinc-400"}`}>
                                                {isVideo ? <video src={med} className="w-full h-full object-cover" /> : <img src={med} alt="" className="w-full h-full object-cover" />}
                                                <div className="absolute inset-0 bg-zinc-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                    {!isMain && (
                                                        <button onClick={() => setForm(f => ({ ...f, mainMediaIndex: idx }))} className="px-3 py-1.5 bg-white text-zinc-900 text-xs font-semibold rounded-lg">
                                                            Set Utama
                                                        </button>
                                                    )}
                                                    <button onClick={() => {
                                                        const newMedia = form.media.filter((_, i) => i !== idx);
                                                        let newMainIdx = form.mainMediaIndex;
                                                        if (idx === form.mainMediaIndex) newMainIdx = 0;
                                                        else if (idx < form.mainMediaIndex) newMainIdx--;
                                                        setForm(f => ({ ...f, media: newMedia, mainMediaIndex: Math.max(0, newMainIdx) }));
                                                    }} className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                {isMain && <div className="absolute top-2 left-2 px-2 py-0.5 bg-zinc-900 text-white text-[10px] font-bold rounded-md">Utama</div>}
                                                {isVideo && <div className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full"><Play className="h-2.5 w-2.5 fill-current" /></div>}
                                            </div>
                                        );
                                    })}
                                    {form.media.length < 8 && (
                                        <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 rounded-xl hover:border-zinc-500 hover:bg-zinc-50 transition-all cursor-pointer group">
                                            <input type="file" className="hidden" accept="image/*,video/*" onChange={async (e) => {
                                                const file = e.target.files?.[0]; if (!file) return;
                                                if (file.size > 4 * 1024 * 1024) { alert("Ukuran file maksimal 4 MB!"); return; }
                                                try {
                                                    const formData = new FormData();
                                                    formData.append('file', file);
                                                    if (previewSKU) {
                                                        formData.append('productCode', previewSKU);
                                                    }
                                                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                                    if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Gagal upload"); }
                                                    const { url } = await res.json();
                                                    setForm(f => ({ ...f, media: [...f.media, url] }));
                                                } catch (err: any) { alert(err.message); }
                                            }} />
                                            <div className="p-3 bg-zinc-100 rounded-xl group-hover:bg-zinc-200 transition-colors">
                                                <Plus className="h-6 w-6 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                                            </div>
                                            <span className="text-xs font-medium text-zinc-400 mt-2">Upload</span>
                                        </label>
                                    )}
                                </div>
                            </div>

                            <InputField label="Deskripsi Produk Lengkap" required hint="Tulis detail fitur, keunggulan, dan kegunaan produk">
                                <div className="border-b border-zinc-300 overflow-hidden focus-within:border-zinc-900 transition-colors">
                                    <MemoizedSunEditor
                                        contents={form.description}
                                        onChange={content => setForm(f => ({ ...f, description: content }))}
                                    />
                                </div>
                            </InputField>
                        </div>
                    </section>

                    {/* SECTION 4: Spesifikasi Teknis */}
                    <section className="space-y-8">
                        <div className="border-b border-zinc-100 pb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight">Spesifikasi Teknis</h3>
                                <p className="text-sm text-zinc-400 mt-1">4 baris pertama wajib diisi. Tambah baris untuk info tambahan.</p>
                            </div>
                            <button
                                onClick={() => setForm(f => ({ ...f, specifications: [...f.specifications, { key: "", value: "" }] }))}
                                className="px-4 py-2.5 bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white rounded-lg text-sm font-medium tracking-wide transition-all flex items-center gap-2 border border-sky-200 hover:border-sky-600"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Tambah Baris</span>
                            </button>
                        </div>

                        <div className="space-y-5">
                            {form.specifications.map((spec, idx) => {
                                const isMandatory = idx < 4;
                                const placeholders: Record<number, string> = {
                                    0: "Contoh: Kayu Jati Grade A",
                                    1: "Contoh: Besi Hollow 4x4 cm",
                                    2: "Contoh: Natural Polish / Wax",
                                    3: "Contoh: Natural Oak, Walnut, Ebony",
                                };
                                return (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-end group/spec">
                                        <div className="flex-1">
                                            {idx === 0 && <label className="text-sm font-semibold text-slate-600 mb-2 block">Parameter <span className="text-red-500">*</span></label>}
                                            <input
                                                value={spec.key}
                                                onChange={e => updateSpec(idx, "key", e.target.value)}
                                                disabled={isMandatory}
                                                placeholder="Contoh: Kapasitas Duduk"
                                                className={`w-full bg-transparent border-b py-3 text-base font-medium outline-none transition-all ${isMandatory ? 'border-slate-100 text-slate-500 bg-slate-50/50 cursor-not-allowed' : 'border-slate-300 text-slate-900 focus:border-sky-600 placeholder:text-slate-400 placeholder:font-normal'}`}
                                            />
                                        </div>
                                        <div className="flex-[2]">
                                            {idx === 0 && <label className="text-sm font-semibold text-slate-600 mb-2 block">Nilai <span className="text-red-500">*</span></label>}
                                            <input
                                                value={spec.value}
                                                onChange={e => updateSpec(idx, "value", e.target.value)}
                                                placeholder={placeholders[idx] || `Nilai untuk "${spec.key || 'aspek ini'}"...`}
                                                className="w-full bg-transparent border-b border-slate-300 py-3 text-base font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-sky-600 transition-all"
                                            />
                                        </div>
                                        {!isMandatory && (
                                            <button
                                                onClick={() => setForm(f => ({ ...f, specifications: f.specifications.filter((_, i) => i !== idx) }))}
                                                className="p-2.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover/spec:opacity-100 self-start sm:self-auto"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* ── RIGHT COLUMN ─────────────────────────────────────── */}
                <div className="lg:col-span-4 space-y-8 sm:space-y-12">
                    <div className="space-y-8">
                        <div className="border-b border-zinc-100 pb-4">
                            <h4 className="text-lg font-semibold text-zinc-900 tracking-tight">Logistik &amp; Dimensi</h4>
                            <p className="text-sm text-zinc-400 mt-1">Data ini digunakan untuk estimasi ongkos kirim.</p>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: "Dimensi Produk", field: "product" as const, placeholder: "Contoh: 120 x 60 x 75 cm (P×L×T)", required: true },
                                { label: "Berat Bersih", field: "weight" as const, placeholder: "Contoh: 15 kg", required: true },
                                { label: "Berat & Dimensi Kemas", field: "packaged" as const, placeholder: "Contoh: 18 kg / 130×70×20 cm", required: true },
                            ].map(({ label, field, placeholder, required }) => (
                                <InputField key={field} label={label} required={required}>
                                    <input
                                        value={form.dimensions[field]}
                                        onChange={e => setForm(f => ({ ...f, dimensions: { ...f.dimensions, [field]: e.target.value } }))}
                                        placeholder={placeholder}
                                        className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                                    />
                                </InputField>
                            ))}

                            <InputField label="Info Estimasi Pengiriman" required hint="Ditampilkan di halaman produk">
                                <input
                                    value={form.delivery}
                                    onChange={e => setForm(f => ({ ...f, delivery: e.target.value }))}
                                    placeholder="Contoh: Pengiriman 2-3 minggu setelah produksi selesai"
                                    className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                                />
                            </InputField>
                        </div>
                    </div>

                    <div className="space-y-6 pt-4 border-t border-zinc-100">
                        <div className="pb-2">
                            <h4 className="text-base font-semibold text-zinc-900 tracking-tight">Garansi &amp; Layanan</h4>
                        </div>
                        <InputField label="Garansi" required hint="Contoh: 1 tahun garansi struktur">
                            <input
                                value={form.additionalInfo.warranty}
                                onChange={e => setForm(f => ({ ...f, additionalInfo: { ...f.additionalInfo, warranty: e.target.value } }))}
                                placeholder="1 tahun garansi kerusakan produksi"
                                className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                            />
                        </InputField>
                        <InputField label="Estimasi Produksi" hint="Dalam hari kerja">
                            <input
                                value={form.additionalInfo.production}
                                onChange={e => setForm(f => ({ ...f, additionalInfo: { ...f.additionalInfo, production: e.target.value } }))}
                                placeholder="Contoh: 14-30 hari kerja"
                                className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                            />
                        </InputField>
                        <InputField label="Info Pengiriman Khusus" hint="Opsional — kosongkan jika tidak ada">
                            <input
                                value={form.additionalInfo.shipping}
                                onChange={e => setForm(f => ({ ...f, additionalInfo: { ...f.additionalInfo, shipping: e.target.value } }))}
                                placeholder="Contoh: Tidak bisa dikirim ke luar Pulau Jawa"
                                className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                            />
                        </InputField>
                        <InputField label="Panduan Perawatan" hint="Cara membersihkan atau merawat produk">
                            <input
                                value={form.additionalInfo.care}
                                onChange={e => setForm(f => ({ ...f, additionalInfo: { ...f.additionalInfo, care: e.target.value } }))}
                                placeholder="Contoh: Lap dengan kain kering, hindari paparan langsung"
                                className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all font-medium"
                            />
                        </InputField>
                    </div>

                    <div className="space-y-6 pt-4 border-t border-zinc-100">
                        <div className="pb-2">
                            <h4 className="text-base font-semibold text-zinc-900 tracking-tight">Detail Material &amp; Kebijakan</h4>
                        </div>
                        <InputField label="Detail Bahan / Material" required hint="Jelaskan jenis bahan, kayu, logam, finishing">
                            <textarea
                                value={form.fabric}
                                onChange={e => setForm(f => ({ ...f, fabric: e.target.value }))}
                                rows={4}
                                placeholder="Contoh: Kayu Jati solid Grade A, finishing dengan natural wax water-based. Rangka besi hollow 4×4 cm, powder coat hitam matte."
                                className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all resize-none font-medium"
                            />
                        </InputField>
                        <InputField label="Kebijakan Pengembalian" hint="Opsional">
                            <textarea
                                value={form.returns}
                                onChange={e => setForm(f => ({ ...f, returns: e.target.value }))}
                                rows={3}
                                placeholder="Contoh: Dapat dikembalikan dalam 7 hari jika produk tidak sesuai deskripsi atau terdapat cacat produksi."
                                className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-zinc-900 transition-all resize-none font-medium"
                            />
                        </InputField>
                    </div>

                    {/* Mobile Save Button */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-zinc-100 lg:hidden z-20">
                        <div className="max-w-7xl mx-auto flex gap-3">
                            <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-sky-600 transition-all shadow-lg">
                                <Save className="h-4 w-4" /> Simpan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
