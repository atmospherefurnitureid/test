"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";

// Data services yang sesuai dengan card di homepage
const servicesData = {
  'desain-yang-dipersonalisasi-sepenuhnya': {
    title: 'Desain yang Dipersonalisasi Sepenuhnya',
    description: 'Kami menyediakan furnitur dan solusi interior yang dirancang khusus sesuai kebutuhan, gaya, dan preferensi Anda. Setiap detail dibuat untuk mencerminkan visi pribadi Anda.',
    longDescription: 'Layanan desain personalisasi kami memungkinkan Anda untuk menciptakan furnitur yang benar-benar unik dan sesuai dengan karakter ruangan Anda. Tim desainer profesional kami akan bekerja sama dengan Anda mulai dari konsep awal hingga eksekusi akhir, memastikan setiap detail mencerminkan kepribadian dan gaya hidup Anda.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a2 2 0 0 1 2.83 0l.3.3a2 2 0 0 1 0 2.83l-3.77 3.77a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a2 2 0 0 1 2.83 0l.3.3a2 2 0 0 1 0 2.83l-3.77 3.77a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0" />
        <path d="m2 22 5-5" />
        <path d="M9.5 14.5 16 8" />
        <path d="m17 2 5 5" />
        <path d="m7 14.5-5 5L4.5 22l5-5-2.5-2.5Z" />
      </svg>
    ),
    color: 'bg-sky-600',
    borderColor: 'border-sky-500',
    textColor: 'text-white',
    image: 'https://images.unsplash.com/photo-1540638340003-f3689408010f?auto=format&fit=crop&q=80&w=800',
    features: [
      'Konsultasi desain gratis',
      'Material pilihan berkualitas tinggi',
      'Proses pengerjaan yang teliti',
      'Garansi kepuasan 100%',
      'Tim profesional berpengalaman'
    ]
  },
  'kualitas-dan-ketelitian-pengerjaan': {
    title: 'Kualitas dan Ketelitian Pengerjaan',
    description: 'Setiap produk dibuat dengan material pilihan dan proses pengerjaan yang teliti. Kami memastikan setiap sudut dan finishing memenuhi standar kualitas tinggi.',
    longDescription: 'Kualitas adalah prioritas utama kami. Setiap furnitur yang kami buat melalui proses kontrol kualitas yang ketat, mulai dari pemilihan material, proses produksi, hingga finishing akhir. Kami menggunakan teknologi modern dan teknik tradisional untuk memastikan produk yang tahan lama dan estetis.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    color: 'bg-[#F0F9FF]',
    borderColor: 'border-sky-100/50',
    textColor: 'text-zinc-900',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=800',
    features: [
      'Material kayu pilihan grade A',
      'Finishing halus dan tahan lama',
      'Konstruksi kokoh dan stabil',
      'Detail craftsmanship yang presisi',
      'Standar kualitas internasional'
    ]
  },
  'solusi-fungsional-dan-estetis': {
    title: 'Solusi Fungsional dan Estetis',
    description: 'Kami menggabungkan fungsi dan estetika dalam setiap desain, memastikan setiap furnitur memberikan kenyamanan serta efisiensi ruang yang optimal.',
    longDescription: 'Kami memahami bahwa furnitur yang baik tidak hanya tentang tampilan, tetapi juga tentang fungsi. Tim desainer kami menciptakan solusi yang mengoptimalkan ruang, meningkatkan kenyamanan, dan memperindah interior Anda secara bersamaan.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a9 9 0 0 0-9 9l7 7 2 2 2-2 7-7a9 9 0 0 0-9-9Z" />
        <path d="M12 14v4" />
      </svg>
    ),
    color: 'bg-[#F0F9FF]',
    borderColor: 'border-sky-100/50',
    textColor: 'text-zinc-900',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800',
    features: [
      'Desain ergonomis untuk kenyamanan',
      'Optimasi ruang yang maksimal',
      'Kombinasi estetika dan fungsi',
      'Solusi penyimpanan kreatif',
      'Adaptif untuk berbagai kebutuhan'
    ]
  },
  'kolaborasi-untuk-hasil-terbaik': {
    title: 'Kolaborasi untuk Hasil Terbaik',
    description: 'Kami bekerja sama dengan Anda dari tahap konsep hingga pemasangan akhir dengan komunikasi terbuka untuk memastikan hasil melampaui ekspektasi.',
    longDescription: 'Kolaborasi adalah kunci kesuksesan proyek furnitur Anda. Kami melibatkan Anda dalam setiap tahap proses, dari brainstorming ide, review desain, hingga implementasi. Pendekatan kolaboratif ini memastikan hasil akhir sesuai dengan visi Anda.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4v16" />
        <path d="M4 12h16" />
        <path d="M6 18l12-12" />
        <path d="M6 6l12 12" />
      </svg>
    ),
    color: 'bg-[#F0F9FF]',
    borderColor: 'border-sky-100/50',
    textColor: 'text-zinc-900',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800',
    features: [
      'Konsultasi berkelanjutan',
      'Update progress reguler',
      'Flexibilitas dalam perubahan desain',
      'Tim support yang responsif',
      'Komitmen terhadap kepuasan klien'
    ]
  }
};

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const service = servicesData[slug as keyof typeof servicesData];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-4">Service tidak ditemukan</h1>
          <Link href="/" className="text-sky-500 hover:text-sky-600 underline">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Header - Aligned with Products Style */}
      <section className="mx-auto w-full max-w-7xl px-6 pt-16 pb-4">
        <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-semibold text-zinc-900 leading-[1.15] tracking-tight max-w-5xl">
          {service.title}
        </h1>
        <p className="text-zinc-500 text-[13px] leading-relaxed max-w-2xl font-medium">
          {service.description}
        </p>
      </section>

      {/* Content Section - Two Columns with Media and Sidebar */}
      <div className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Description */}
          <div>
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Tentang Layanan</h2>
              <p className="text-zinc-600 leading-relaxed mb-6">
                {service.longDescription}
              </p>

              <h3 className="text-xl font-semibold text-zinc-900 mb-4">Mengapa Memilih Layanan Ini?</h3>
              <ul className="space-y-3">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-sky-100 rounded-full flex items-center justify-center mt-1 shrink-0">
                      <svg className="w-3 h-3 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-zinc-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar - Contact and Action */}
          <div className="space-y-8">
            {/* Contact Card */}
            <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-100">
              <h3 className="text-xl font-semibold text-zinc-900 mb-4">Mulai Proyek Anda</h3>
              <p className="text-zinc-600 mb-6">
                Tertarik dengan layanan kami? Hubungi tim kami untuk konsultasi gratis dan penawaran khusus.
              </p>

              <div className="space-y-4">
                <Link
                  href="/contact"
                  className="w-full bg-sky-600 text-white py-3 px-6 rounded-xl font-semibold text-center block hover:bg-sky-700 transition-colors"
                >
                  Konsultasi Gratis
                </Link>

                <a
                  href="tel:+62882005824231"
                  className="w-full border border-zinc-300 text-zinc-700 py-3 px-6 rounded-xl font-semibold text-center block hover:bg-zinc-50 transition-colors"
                >
                  +62 882-0058-24231
                </a>
              </div>
            </div>

            {/* Related Services */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-100">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Layanan Lainnya</h3>
              <div className="space-y-3">
                {Object.entries(servicesData)
                  .filter(([s]) => s !== slug)
                  .slice(0, 3)
                  .map(([s, serv]) => (
                    <Link
                      key={s}
                      href={`/services/${s}`}
                      className="block p-3 rounded-xl border border-zinc-100 hover:border-sky-200 hover:bg-sky-50 transition-colors"
                    >
                      <h4 className="font-medium text-zinc-900 mb-1">{serv.title}</h4>
                      <p className="text-sm text-zinc-500 line-clamp-2">{serv.description}</p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Services */}
      <div className="mx-auto w-full max-w-7xl px-6 pb-16">
        <Link
          href="/#services"
          className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Semua Layanan
        </Link>
      </div>
      <Footer />
    </main>
  );
}
