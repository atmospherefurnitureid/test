import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { ClientProviders } from "@/components/ClientProviders";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atmospherefurnitureid.com"),
  title: {
    default: "Atmosphere Furniture Indonesia | Pusat Furniture Jepara Murah & Berkualitas",
    template: "%s | Atmosphere Furniture Indonesia",
  },
  description: "Spesialis Custom Design Furniture Jepara Jati & Besi kualitas ekspor sejak 2015. Wujudkan desain furnitur unik sesuai keinginan dengan harga pengrajin langsung. Melayani pengiriman global & proyek besar.",
  keywords: [
    "furniture jepara", "mebel indonesia", "pengrajin kayu jepara", "jepara furniture export",
    "mebel jawa tengah", "furniture murah berkualitas", "furniture jati awet",
    "mebel harga pabrik", "premium wooden furniture indonesia", "furniture kayu solid",
    "mebel kombinasi besi", "furniture industrial minimalis", "teak wood furniture",
    "meja makan jati murah", "kursi cafe minimalis", "lemari pakaian kayu jati",
    "custom furniture jepara", "atmosphere furniture indonesia", "atmosphere furniture",
  ],
  authors: [{ name: "Atmosphere Furniture Indonesia", url: "https://atmospherefurnitureid.com" }],
  creator: "Atmosphere Furniture Indonesia",
  publisher: "Atmosphere Furniture Indonesia",
  openGraph: {
    title: "Atmosphere Furniture Indonesia | Pusat Furniture Jepara Murah & Berkualitas",
    description: "Furniture jepara murah & berkualitas ekspor. Produsen mebel kayu jati dan besi Indonesia, melayani custom design proyek hotel, cafe, restoran.",
    url: "https://atmospherefurnitureid.com",
    siteName: "Atmosphere Furniture Indonesia",
    images: [
      {
        url: "/logo-atmosphere.png",
        width: 1200,
        height: 630,
        alt: "Atmosphere Furniture Indonesia - Produsen Furniture Besi & Kayu Premium",
        type: "image/png",
      }
    ],
    locale: "id_ID",
    type: "website",
    emails: ["atmosphere.furnitureid@gmail.com"],
    phoneNumbers: ["+62882005824231"],
    countryName: "Indonesia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atmosphere Furniture Indonesia - Furniture Besi & Kayu Custom",
    description: "Produsen furniture besi berkualitas tinggi sejak 2015. Custom design untuk hotel, cafe, restoran. Harga pabrik & legalitas lengkap.",
    images: [{ url: "/logo-atmosphere.png", alt: "Atmosphere Furniture Indonesia" }],
    creator: "@atmospherefurnitureid",
    site: "@atmospherefurnitureid",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    other: {
      "google-adsense-account": "ca-pub-5144148071107084",
    },
  },
  category: "furniture",
  referrer: "origin-when-cross-origin",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logo-atmosphere.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-atmosphere.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/logo-atmosphere.png",
    apple: [
      { url: "/logo-atmosphere.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/logo-atmosphere.png", color: "#18181b" },
    ],
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://ep1.adtrafficquality.google" />
        <link rel="preconnect" href="https://fundingchoicesmessages.google.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <script
          type="application/ld+json"
          id="organization-schema"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Atmosphere Furniture Indonesia",
              "description": "Pakar Custom Design furnitur yang menjembatani keindahan kayu jati Jepara dengan kekuatan besi modern. Sejak 2015, Atmosphere Furniture Indonesia telah menjadi mitra terpercaya dalam mewujudkan ide furnitur unik yang mencerminkan visi dan karakter eksklusif hunian Anda.",
              "url": "https://atmospherefurnitureid.com",
              "logo": "https://atmospherefurnitureid.com/logo-atmosphere.png",
              "image": "https://atmospherefurnitureid.com/logo-atmosphere.png",
              "telephone": "+62882005824231",
              "email": "atmosphere.furnitureid@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "ID",
                "addressRegion": "Jawa Tengah",
                "addressLocality": "Jepara",
                "address": "Jepara, Jawa Tengah, Indonesia"
              },
              "foundingDate": "2015",
              "founder": {
                "@type": "Person",
                "name": "Will Jones"
              },
              "sameAs": [
                "https://instagram.com/atmosphere.furnitureid",
                "https://wa.me/62882005824231"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Furniture Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Custom Furniture Design",
                      "description": "Desain furniture custom sesuai kebutuhan pelanggan"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Furniture Manufacturing",
                      "description": "Produksi furniture besi dan kayu berkualitas"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Export Furniture",
                      "description": "Ekspor furniture ke mancanegara dengan sertifikasi legal"
                    }
                  }
                ]
              }
            })
          }}
        />
        {/* AdSense loaded via next/script with afterInteractive to avoid render blocking */}
        <Script
          id="adsense-init"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5144148071107084"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`} suppressHydrationWarning>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}