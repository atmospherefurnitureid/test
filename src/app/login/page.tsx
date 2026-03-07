"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Zap } from "lucide-react";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login success, navigating...");

                // Get redirection path from URL or default to dashboard
                const params = new URLSearchParams(window.location.search);
                const redirectPath = params.get("from") || "/dashboard";

                console.log(`Redirecting to: ${redirectPath}`);

                // Small delay to ensure browser saves cookie before navigation
                setTimeout(() => {
                    window.location.href = redirectPath;
                    setIsLoading(false);
                }, 500);
            } else {
                // Display error from API
                setError(data.error || "Authentication failed. Please check your credentials.");
                setIsLoading(false);
            }
        } catch (err) {
            setError("Server connection failed. Please try again later.");
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white flex items-center justify-center p-6 antialiased">
            <div className="w-full max-w-[400px]">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <Link href="/" className="inline-block relative w-48 h-16">
                            <Image
                                src="/logo-atmosphere.png"
                                alt="Atmosphere Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 mb-2">Welcome back!</h1>
                    <p className="text-zinc-500 font-medium text-sm">Enter your credentials to jump back in.</p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-900 ml-1">
                            Email
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-white border border-zinc-200 focus:border-violet-500 focus:ring-[3px] focus:ring-violet-500/10 outline-none transition-all text-zinc-900 text-[15px] placeholder:text-zinc-400"
                            placeholder="example@mail.com"
                            required
                        />
                    </div>

                    <div className="space-y-2 relative">
                        <label className="text-sm font-semibold text-zinc-900 ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl bg-white border border-zinc-200 focus:border-violet-500 focus:ring-[3px] focus:ring-violet-500/10 outline-none transition-all text-zinc-900 text-[15px] placeholder:text-zinc-400"
                                placeholder="••••••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-[14px] px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                            />
                            <span className="text-zinc-500 font-medium group-hover:text-zinc-700 transition-colors select-none">Remember me</span>
                        </label>
                        <Link href="/forgot-password" title="Lupa Password / Hubungi Admin" className="text-zinc-700 font-semibold hover:text-violet-600 transition-colors">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full py-4 bg-violet-600 text-white rounded-xl font-bold text-[16px] hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/20 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden"
                    >
                        <div className="relative z-10 flex items-center gap-2">
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Sign In"
                            )}
                        </div>
                    </button>
                </form>

                {/* Footer Section */}
                <div className="mt-10 text-center space-y-4">
                    <p className="text-zinc-500 text-[14px] font-medium">
                        Don't have an account? <span className="text-zinc-400 italic">Contact admin for access</span>
                    </p>
                    <div className="pt-6">
                        <Link
                            href={process.env.NODE_ENV === 'production' ? `https://${process.env.NEXT_PUBLIC_MAIN_DOMAIN}` : "/"}
                            className="text-zinc-400 text-sm hover:text-zinc-900 transition-colors inline-flex items-center gap-2 font-medium"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            Back to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
