import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { ClientProviders } from "@/components/ClientProviders";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atmospherefurnitureid.com"),
  title: {
    default: "Atmosphere Furniture Indonesia - Produsen Furniture Besi & Kayu Premium",
    template: "%s | Atmosphere Furniture Indonesia",
  },
  description: "Produsen furniture besi berkualitas tinggi sejak 2015. Melayani custom design, proyek besar, dan ekspor ke mancanegara. Bersertifikat SVLK/FSC, harga pabrik, terpercaya.",
  keywords: [
    "furniture besi", "furniture kayu", "furniture besi kayu", "furniture industrial",
    "furniture custom", "produsen furniture besi", "pabrik furniture besi kayu",
    "supplier furniture industrial", "manufacturer furniture Indonesia",
    "meja besi kayu", "kursi besi kayu", "rak besi kayu", "meja makan kayu solid",
    "furniture kayu jati", "rangka besi hollow", "kombinasi kayu solid dan besi",
    "furniture ekspor", "export furniture Indonesia", "SVLK certified furniture",
    "FSC certified furniture", "wholesale furniture export", "OEM furniture manufacturer",
    "furniture untuk hotel dan cafe", "furniture handmade Indonesia",
    "furniture custom design", "jasa pembuatan furniture besi kayu",
    "pabrik furniture besi kayu murah dan berkualitas",
    "produsen furniture industrial untuk cafe dan restoran",
    "wholesale furniture Indonesia harga pabrik",
    "atmosphere furniture indonesia", "atmosphere furniture",
  ],
  authors: [{ name: "Atmosphere Furniture Indonesia", url: "https://atmospherefurnitureid.com" }],
  creator: "Atmosphere Furniture Indonesia",
  publisher: "Atmosphere Furniture Indonesia",
  openGraph: {
    title: "Atmosphere Furniture Indonesia - Produsen Furniture Besi & Kayu Premium",
    description: "Furniture besi kayu custom berkualitas ekspor. Pabrik legal bersertifikat SVLK/FSC, melayani proyek hotel, cafe, restoran. Harga pabrik kompetitif.",
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
  },
  alternates: {
    canonical: "https://atmospherefurnitureid.com",
    languages: {
      "id-ID": "https://atmospherefurnitureid.com",
      "en-US": "https://atmospherefurnitureid.com",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Atmosphere Furniture Indonesia",
              "description": "Produsen furniture besi berkualitas tinggi sejak 2015. Melayani custom design, proyek besar, dan ekspor.",
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
              },
              "makesOffer": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Furniture Besi Kayu",
                    "description": "Furniture kombinasi besi dan kayu untuk interior industrial",
                    "category": "Furniture Industrial",
                    "material": ["Kayu Solid", "Besi Hollow"],
                    "manufacturer": "Atmosphere Furniture Indonesia"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${poppins.variable} font-poppins antialiased`} suppressHydrationWarning>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}