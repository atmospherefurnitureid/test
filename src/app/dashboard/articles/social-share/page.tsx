"use client";

import { useContentStore } from "@/lib/contentStore";
import { Share2, MessageCircle, Facebook, Instagram, Link2, Save, Layout } from "lucide-react";
import { useState } from "react";

export default function SocialSharePage() {
    const { socialShare, updateSocialShare } = useContentStore();
    const [isSaving, setIsSaving] = useState(false);

    const handleToggle = (key: keyof typeof socialShare) => {
        updateSocialShare({ [key]: !socialShare[key] });
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
        }, 800);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-zinc-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Share2 className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Social Media Share Settings</h2>
                            <p className="text-xs text-gray-500">Configure which platforms appear in the article share section</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* WhatsApp */}
                        <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${socialShare.enableWhatsapp ? 'border-green-500 bg-green-50/30' : 'border-gray-100 bg-white opacity-60'}`}
                            onClick={() => handleToggle('enableWhatsapp')}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${socialShare.enableWhatsapp ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <MessageCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">WhatsApp</p>
                                    <p className="text-xs text-gray-500">Share to personal or group chats</p>
                                </div>
                            </div>
                            <div className={`w-12 h-6 rounded-full relative transition-colors ${socialShare.enableWhatsapp ? 'bg-green-500' : 'bg-gray-200'}`}>
                                <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${socialShare.enableWhatsapp ? 'right-1' : 'left-1'}`} />
                            </div>
                        </div>

                        {/* Facebook */}
                        <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${socialShare.enableFacebook ? 'border-blue-600 bg-blue-50/30' : 'border-gray-100 bg-white opacity-60'}`}
                            onClick={() => handleToggle('enableFacebook')}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${socialShare.enableFacebook ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <Facebook className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Facebook</p>
                                    <p className="text-xs text-gray-500">Share to Facebook Feed or Groups</p>
                                </div>
                            </div>
                            <div className={`w-12 h-6 rounded-full relative transition-colors ${socialShare.enableFacebook ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${socialShare.enableFacebook ? 'right-1' : 'left-1'}`} />
                            </div>
                        </div>

                        {/* Instagram */}
                        <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${socialShare.enableInstagram ? 'border-pink-600 bg-pink-50/30' : 'border-gray-100 bg-white opacity-60'}`}
                            onClick={() => handleToggle('enableInstagram')}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${socialShare.enableInstagram ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <Instagram className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Instagram</p>
                                    <p className="text-xs text-gray-500">Link to Instagram Stories</p>
                                </div>
                            </div>
                            <div className={`w-12 h-6 rounded-full relative transition-colors ${socialShare.enableInstagram ? 'bg-pink-600' : 'bg-gray-200'}`}>
                                <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${socialShare.enableInstagram ? 'right-1' : 'left-1'}`} />
                            </div>
                        </div>

                        {/* Copy Link */}
                        <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${socialShare.enableCopyLink ? 'border-zinc-900 bg-zinc-50' : 'border-gray-100 bg-white opacity-60'}`}
                            onClick={() => handleToggle('enableCopyLink')}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${socialShare.enableCopyLink ? 'bg-zinc-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <Link2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Copy Link</p>
                                    <p className="text-xs text-gray-500">Allow users to copy URL to clipboard</p>
                                </div>
                            </div>
                            <div className={`w-12 h-6 rounded-full relative transition-colors ${socialShare.enableCopyLink ? 'bg-zinc-900' : 'bg-gray-200'}`}>
                                <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${socialShare.enableCopyLink ? 'right-1' : 'left-1'}`} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Layout className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-blue-900">Preview Mode</p>
                            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                Settings applied here will immediately affect the article detail page for all visitors.
                                Make sure to verify the appearance after making changes.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-zinc-50/50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-8 py-2.5 rounded-full font-bold text-sm transition-all ${isSaving ? 'bg-green-500 text-white' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
                    >
                        {isSaving ? (
                            <>Saved Successfully!</>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
