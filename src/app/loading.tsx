import Image from "next/image";

export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      {/* Skeleton Navbar */}
      <nav className="h-20 w-full border-b border-zinc-100 flex items-center px-4 md:px-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-zinc-50 rounded-lg animate-pulse" />
          <div className="hidden md:flex flex-col gap-2">
            <div className="w-32 h-5 bg-zinc-50 rounded animate-pulse" />
            <div className="w-24 h-3 bg-zinc-50 rounded animate-pulse" />
          </div>
        </div>
      </nav>

      {/* Hero Section Skeleton */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-16 pb-12 text-center">
        <div className="h-4 w-48 bg-zinc-50 rounded animate-pulse mb-6" />
        <div className="h-24 w-full max-w-3xl bg-zinc-50 rounded mb-4 animate-pulse" />
        <div className="h-12 w-full max-w-2xl bg-zinc-50 rounded mb-8 animate-pulse" />
        <div className="flex gap-4">
          <div className="h-12 w-48 bg-zinc-50 rounded-full animate-pulse" />
          <div className="h-12 w-48 bg-zinc-50 rounded-full animate-pulse border border-zinc-100" />
        </div>
      </section>

      {/* Gallery Sidebar Skeleton */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`l1-${i}`} className={`bg-zinc-50 animate-pulse rounded-xl aspect-[4/5] sm:col-span-1 lg:col-span-2 ${i > 1 ? 'hidden sm:block' : ''}`} />
          ))}
        </div>
      </section>
    </main>
  );
}
