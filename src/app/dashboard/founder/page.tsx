"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Save,
    User,
    Quote,
    Facebook,
    Instagram,
    Phone,
    Upload,
    RefreshCcw,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { useContentStore } from "@/lib/contentStore";

interface FounderProfile {
    _id?: string;
    name: string;
    image: string;
    role: string;
    bio: string;
    quote: string;
    facebook: string;
    instagram: string;
    whatsapp: string;
}

export default function FounderAdminPage() {
    const { uploadMedia } = useContentStore();
    const [profile, setProfile] = useState<FounderProfile>({
        name: "",
        image: "",
        role: "",
        bio: "",
        quote: "",
        facebook: "",
        instagram: "",
        whatsapp: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchFounder = async () => {
            try {
                const res = await fetch('/api/founder');
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                }
            } catch (error) {
                console.error("Failed to fetch founder profile:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFounder();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
        // Reset status when user typing
        if (saveStatus !== "idle") setSaveStatus("idle");
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const imageUrl = await uploadMedia(file);
            setProfile(prev => ({ ...prev, image: imageUrl }));
            setSaveStatus("idle");
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Gagal mengunggah gambar. Silakan coba lagi.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveStatus("idle");

        try {
            const res = await fetch('/api/founder', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });

            if (res.ok) {
                setSaveStatus("success");
            } else {
                setSaveStatus("error");
            }
        } catch (error) {
            console.error("Failed to save founder profile:", error);
            setSaveStatus("error");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCcw className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Founder Profile</h2>
                    <p className="text-sm text-gray-500">Edit informasi founder yang ditampilkan di homepage.</p>
                </div>

                {saveStatus === "success" && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100 animate-slide-down">
                        <CheckCircle2 className="h-4 w-4" />
                        Perubahan disimpan!
                    </div>
                )}

                {saveStatus === "error" && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-100 animate-slide-down">
                        <AlertCircle className="h-4 w-4" />
                        Gagal menyimpan perubahan.
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Image Upload */}
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <label className="text-sm font-bold text-gray-700 mb-4 self-start">Foto Profile</label>

                        <div className="relative w-full aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 group">
                            {profile.image ? (
                                <Image
                                    src={profile.image}
                                    alt="Founder Preview"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                    <User className="h-12 w-12 mb-2" />
                                    <span className="text-xs">No image uploaded</span>
                                </div>
                            )}

                            {uploading && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                                    <RefreshCcw className="h-6 w-6 text-blue-500 animate-spin" />
                                </div>
                            )}

                            <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="flex items-center gap-2 text-white font-semibold text-sm">
                                    <Upload className="h-4 w-4" />
                                    Ganti Foto
                                </span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </label>
                        </div>

                        <p className="mt-4 text-[10px] text-gray-400 text-center">
                            Gunakan rasio 3:4 (Portrait) untuk hasil terbaik.
                        </p>
                    </div>
                </div>

                {/* Right Column: Bio and Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Nama Lengkap</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    placeholder="Contoh: Will Jones"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Jabatan/Role</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={profile.role}
                                    onChange={handleChange}
                                    placeholder="Contoh: CEO & Founder"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700">Bio Singkat</label>
                            <textarea
                                name="bio"
                                value={profile.bio}
                                onChange={handleChange}
                                placeholder="Tuliskan bio singkat founder..."
                                rows={4}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium resize-none"
                                required
                            />
                        </div>

                        <div className="space-y-1.5 relative">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Quote className="h-3 w-3 text-blue-500" />
                                Founder's Quote
                            </label>
                            <textarea
                                name="quote"
                                value={profile.quote}
                                onChange={handleChange}
                                placeholder="Kutipan inspiratif dari founder..."
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold italic resize-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-[13px] font-black uppercase tracking-wider text-gray-400">Media Sosial</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 flex items-center gap-2 uppercase tracking-wide">
                                    <Facebook className="h-3 w-3" />
                                    Facebook
                                </label>
                                <input
                                    type="text"
                                    name="facebook"
                                    value={profile.facebook}
                                    onChange={handleChange}
                                    placeholder="URL Facebook"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 flex items-center gap-2 uppercase tracking-wide">
                                    <Instagram className="h-3 w-3" />
                                    Instagram
                                </label>
                                <input
                                    type="text"
                                    name="instagram"
                                    value={profile.instagram}
                                    onChange={handleChange}
                                    placeholder="Username Instagram"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 flex items-center gap-2 uppercase tracking-wide">
                                    <Phone className="h-3 w-3" />
                                    WhatsApp
                                </label>
                                <input
                                    type="text"
                                    name="whatsapp"
                                    value={profile.whatsapp}
                                    onChange={handleChange}
                                    placeholder="Contoh: 628123..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isSaving || uploading}
                            className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-gray-200 drop-shadow-lg transition-all active:scale-95 flex items-center gap-2 disabled:bg-gray-400 disabled:shadow-none"
                        >
                            {isSaving ? (
                                <>
                                    <RefreshCcw className="h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Simpan Perubahan
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
