"use client";

import { User, Shield, Bell, Database, Save } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const [emailNotif, setEmailNotif] = useState(true);
    const [autoBackup, setAutoBackup] = useState(false);
    const [publicProfile, setPublicProfile] = useState(true);

    return (
        <div className="animate-fade-in-up space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
                <p className="text-sm text-gray-500 mt-0.5">Configure your dashboard and account preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Account Settings */}
                    <div className="bg-white rounded-[var(--radius)] border border-gray-200 shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <h3 className="text-base font-semibold text-gray-900">Account Settings</h3>
                        </div>
                        <div className="p-6">
                            <form className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Username</label>
                                        <input type="text" defaultValue="admin" className="w-full px-4 py-2.5 rounded-[var(--radius)] bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-900" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                                        <input type="email" defaultValue="admin@atmosphere.id" className="w-full px-4 py-2.5 rounded-[var(--radius)] bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-900" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-[var(--radius)] bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" />
                                </div>
                                <button type="button" className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-[var(--radius)] text-sm font-medium hover:opacity-90 transition-all shadow-sm">
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white rounded-[var(--radius)] border border-gray-200 shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-gray-500" />
                            <h3 className="text-base font-semibold text-gray-900">Security</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security</p>
                                </div>
                                <button className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-[var(--radius)] text-gray-700 hover:bg-gray-50 transition-colors">
                                    Enable
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Active Sessions</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Manage your logged-in devices</p>
                                </div>
                                <span className="text-xs text-gray-500">1 device</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Preferences */}
                    <div className="bg-white rounded-[var(--radius)] border border-gray-200 shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                            <Bell className="h-4 w-4 text-gray-500" />
                            <h3 className="text-base font-semibold text-gray-900">Preferences</h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                                <button onClick={() => setEmailNotif(!emailNotif)} className={`w-10 h-5 rounded-full relative transition-colors ${emailNotif ? "bg-blue-600" : "bg-gray-200"}`}>
                                    <span className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${emailNotif ? "right-0.5" : "left-0.5"}`}></span>
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Auto-backup Data</span>
                                <button onClick={() => setAutoBackup(!autoBackup)} className={`w-10 h-5 rounded-full relative transition-colors ${autoBackup ? "bg-blue-600" : "bg-gray-200"}`}>
                                    <span className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${autoBackup ? "right-0.5" : "left-0.5"}`}></span>
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Public Profile</span>
                                <button onClick={() => setPublicProfile(!publicProfile)} className={`w-10 h-5 rounded-full relative transition-colors ${publicProfile ? "bg-blue-600" : "bg-gray-200"}`}>
                                    <span className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${publicProfile ? "right-0.5" : "left-0.5"}`}></span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Storage */}
                    <div className="bg-white rounded-[var(--radius)] border border-gray-200 shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                            <Database className="h-4 w-4 text-gray-500" />
                            <h3 className="text-base font-semibold text-gray-900">Storage</h3>
                        </div>
                        <div className="p-6">
                            <div className="mb-3">
                                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                                    <span>Used</span>
                                    <span>2.4 GB / 10 GB</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: "24%" }}></div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400">24% of your storage is being used.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
