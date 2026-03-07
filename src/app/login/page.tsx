"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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
        <main className="min-h-screen bg-[#F9FAF9] flex items-center justify-center p-6 bg-[url('/grid-pattern.svg')] bg-fixed">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="flex justify-center mb-10">
                    <Link href="/" className="inline-block relative w-48 h-12">
                        <Image
                            src="/logo-atmosphere.png"
                            alt="Atmosphere Logo"
                            fill
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Login Card */}
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-zinc-100 backdrop-blur-sm bg-white/90">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Welcome Back</h1>
                        <p className="text-zinc-500 text-sm">Please enter your details to sign in</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl animate-pulse">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/5 outline-none transition-all text-zinc-900 font-medium"
                                placeholder="Enter your username"
                                required
                                suppressHydrationWarning
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/5 outline-none transition-all text-zinc-900 font-medium"
                                placeholder="••••••••"
                                required
                                suppressHydrationWarning
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-zinc-200 text-sky-600 focus:ring-sky-500" />
                                <span className="text-zinc-500 group-hover:text-zinc-700 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-sky-600 font-bold hover:underline">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg hover:shadow-zinc-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-zinc-500 text-sm">
                            Don't have an account? <span className="text-zinc-400 italic">Contact admin for access</span>
                        </p>
                    </div>
                </div>

                {/* Footer Link */}
                <div className="text-center mt-8">
                    <a
                        href={process.env.NODE_ENV === 'production' ? `https://${process.env.NEXT_PUBLIC_MAIN_DOMAIN}` : "/"}
                        className="text-zinc-400 text-xs hover:text-sky-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        Back to Homepage
                    </a>
                </div>
            </div>
        </main>
    );
}
