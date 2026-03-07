"use client";

import { User as UserIcon, Shield, Bell, Database, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
    const [emailNotif, setEmailNotif] = useState(true);
    const [autoBackup, setAutoBackup] = useState(false);
    const [publicProfile, setPublicProfile] = useState(true);

    // Profile state
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // UI state
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/auth/profile');
                if (res.ok) {
                    const data = await res.json();
                    setUsername(data.username || "");
                    setEmail(data.email || "");
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus("idle");
        setMessage("");

        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    email,
                    currentPassword: currentPassword || undefined,
                    newPassword: newPassword || undefined
                })
            });

            const data = await res.json();
            if (res.ok) {
                setStatus("success");
                setMessage("Profile updated successfully!");
                setCurrentPassword("");
                setNewPassword("");
            } else {
                setStatus("error");
                setMessage(data.error || "Failed to update profile.");
            }
        } catch (error) {
            console.error("Update failed:", error);
            setStatus("error");
            setMessage("An error occurred. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Configure your dashboard and account preferences.</p>
                </div>

                {status !== "idle" && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border animate-slide-down ${status === "success" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                        }`}>
                        {status === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        {message}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Account Settings */}
                    <div className="bg-white rounded-[var(--radius)] border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50/50">
                            <UserIcon className="h-4 w-4 text-gray-500" />
                            <h3 className="text-base font-semibold text-gray-900">Account Settings</h3>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSaveProfile} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Username</label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-[var(--radius)] bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-900 font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-[var(--radius)] bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-900 font-medium"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-5">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Change Password</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Current Password</label>
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="Required to change password"
                                                className="w-full px-4 py-2.5 rounded-[var(--radius)] bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">New Password</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Leave blank to keep current"
                                                className="w-full px-4 py-2.5 rounded-[var(--radius)] bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end border-t border-gray-100 pt-5 mt-2">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-95 disabled:bg-gray-400"
                                    >
                                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        {saving ? "Saving Changes..." : "Save Profile"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white rounded-[var(--radius)] border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50/50">
                            <Shield className="h-4 w-4 text-gray-500" />
                            <h3 className="text-base font-semibold text-gray-900">Security</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Two-Factor Authentication</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security</p>
                                </div>
                                <button className="px-4 py-2 text-xs font-bold border border-zinc-300 rounded-lg text-zinc-700 hover:bg-white transition-all bg-white shadow-sm cursor-not-allowed opacity-50">
                                    Coming Soon
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Preferences */}
                    <div className="bg-white rounded-[var(--radius)] border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50/50">
                            <Bell className="h-4 w-4 text-gray-500" />
                            <h3 className="text-base font-semibold text-gray-900">Preferences</h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="flex justify-between items-center group">
                                <span className="text-sm font-bold text-gray-700 group-hover:text-zinc-900 transition-colors cursor-default">Email Notifications</span>
                                <button onClick={() => setEmailNotif(!emailNotif)} className={`w-10 h-5 rounded-full relative transition-all duration-300 shadow-inner ${emailNotif ? "bg-sky-500" : "bg-zinc-200"}`}>
                                    <span className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-md transition-all duration-300 ${emailNotif ? "right-0.5" : "left-0.5"}`}></span>
                                </button>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-sm font-bold text-gray-700 group-hover:text-zinc-900 transition-colors cursor-default">Auto-backup Data</span>
                                <button onClick={() => setAutoBackup(!autoBackup)} className={`w-10 h-5 rounded-full relative transition-all duration-300 shadow-inner ${autoBackup ? "bg-sky-500" : "bg-zinc-200"}`}>
                                    <span className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-md transition-all duration-300 ${autoBackup ? "right-0.5" : "left-0.5"}`}></span>
                                </button>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-sm font-bold text-gray-700 group-hover:text-zinc-900 transition-colors cursor-default">Public Profile</span>
                                <button onClick={() => setPublicProfile(!publicProfile)} className={`w-10 h-5 rounded-full relative transition-all duration-300 shadow-inner ${publicProfile ? "bg-sky-500" : "bg-zinc-200"}`}>
                                    <span className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-md transition-all duration-300 ${publicProfile ? "right-0.5" : "left-0.5"}`}></span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Storage */}
                    <div className="bg-white rounded-[var(--radius)] border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50/50">
                            <Database className="h-4 w-4 text-gray-500" />
                            <h3 className="text-base font-semibold text-gray-900">Storage</h3>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                                    <span>Cloud Usage</span>
                                    <span>240 MB / 1 GB</span>
                                </div>
                                <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-gradient-to-r from-sky-400 to-sky-600 h-2.5 rounded-full transition-all duration-1000" style={{ width: "24%" }}></div>
                                </div>
                            </div>
                            <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">24% of your personal storage is being used by media assets.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
