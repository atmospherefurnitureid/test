import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "404 — Halaman Tidak Ditemukan | Atmosphere Furniture Indonesia",
    description: "Halaman yang Anda cari tidak ditemukan.",
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#F9FAF9] flex flex-col items-center justify-center p-6 text-center">
            {/* Big Number */}
            <div className="relative mb-6 select-none">
                <span
                    className="text-[10rem] font-black leading-none text-zinc-100 pointer-events-none"
                    aria-hidden="true"
                >
                    404
                </span>
                <span className="absolute inset-0 flex items-center justify-center text-[10rem] font-black leading-none text-zinc-900/5 blur-sm pointer-events-none">
                    404
                </span>
            </div>

            {/* Icon */}
            <div className="mb-6 w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center shadow-xl">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            </div>

            {/* Text */}
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">
                Halaman Tidak Ditemukan
            </h1>
            <p className="text-zinc-500 text-sm max-w-sm mb-8">
                Halaman yang Anda cari tidak ada atau sudah dipindahkan.
                Pastikan URL yang Anda ketik sudah benar.
            </p>

            {/* Action */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-bold rounded-2xl hover:bg-zinc-700 transition-all shadow-lg"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m15 18-6-6 6-6" />
                </svg>
                Kembali ke Beranda
            </Link>
        </main>
    );
}
