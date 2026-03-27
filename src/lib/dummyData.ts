import { Product, Article } from "@/types";

export const DUMMY_CATEGORIES = [
  { _id: "cat1", name: "Kursi" },
  { _id: "cat2", name: "Meja" },
  { _id: "cat3", name: "Lemari" },
  { _id: "cat4", name: "Rak" },
  { _id: "cat5", name: "Bangku" },
  { _id: "cat6", name: "Stool" },
];

export const DUMMY_PRODUCTS: Product[] = [
  {
    _id: "p1",
    code: "CHR-001",
    name: "Classic Oak Dining Chair",
    label: "Kayu",
    category: "Kursi",
    collection: "Atmosphere Heritage",
    price: 1250000,
    memberPrice: 1100000,
    stock: 15,
    status: "In Stock",
    rating: 4.8,
    media: [
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800"
    ],
    mainMediaIndex: 0,
    delivery: "1-3 days",
    description: "Kursi makan kayu oak klasik dengan sentuhan modern yang elegan.",
    specifications: [
      { key: "Material", value: "Oak Wood" },
      { key: "Finish", value: "Natural Oil" }
    ],
    dimensions: {
      product: "45 x 50 x 85 cm",
      weight: "6 kg",
      packaged: "50 x 55 x 90 cm"
    },
    fabric: "N/A",
    additionalInfo: {
      warranty: "2 Years",
      production: "In Stock",
      care: "Clean with dry cloth"
    }
  },
  {
    _id: "p2",
    code: "TBL-002",
    name: "Industrial Iron Desk",
    label: "Besi",
    category: "Meja",
    collection: "Atmosphere Industrial",
    price: 3500000,
    memberPrice: 3200000,
    stock: 8,
    status: "In Stock",
    rating: 4.9,
    media: [
      "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800"
    ],
    mainMediaIndex: 0,
    delivery: "3-5 days",
    description: "Meja kerja industrial tangguh dari besi tempa berkualitas tinggi.",
    specifications: [
      { key: "Material", value: "Wrought Iron" },
      { key: "Coating", value: "Powder Matte Black" }
    ],
    dimensions: {
      product: "120 x 60 x 75 cm",
      weight: "25 kg",
      packaged: "125 x 65 x 15 cm"
    },
    fabric: "N/A",
    additionalInfo: {
      warranty: "5 Years",
      production: "Made to order",
      care: "Wipe with soft damp cloth"
    }
  },
  {
    _id: "p3",
    code: "MIX-003",
    name: "Scandinavian Hybrid Shelf",
    label: "Mixed",
    category: "Rak",
    collection: "Atmosphere Fusion",
    price: 2750000,
    memberPrice: 2500000,
    stock: 5,
    status: "Low Stock",
    rating: 4.7,
    media: [
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800"
    ],
    mainMediaIndex: 0,
    delivery: "2-4 days",
    description: "Perpaduan sempurna antara kayu jati dan besi dalam desain rak minimalis.",
    specifications: [
      { key: "Wood", value: "Teak" },
      { key: "Frame", value: "Stainless Steel" }
    ],
    dimensions: {
      product: "80 x 30 x 180 cm",
      weight: "18 kg",
      packaged: "85 x 35 x 185 cm"
    },
    fabric: "N/A",
    additionalInfo: {
      warranty: "3 Years",
      care: "Use wood polish occasionally"
    }
  },
  {
    _id: "p4",
    code: "STL-004",
    name: "Minimalist Bar Stool",
    label: "Besi",
    category: "Stool",
    collection: "Atmosphere Cafe",
    price: 850000,
    memberPrice: 750000,
    stock: 20,
    status: "In Stock",
    media: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800"
    ],
    mainMediaIndex: 0,
    delivery: "1-2 days",
    description: "Stool bar minimalis yang nyaman dan kokoh untuk area bar atau dapur.",
    specifications: [
      { key: "Material", value: "Steel" },
      { key: "Seat", value: "Ergonomic Molded" }
    ],
    dimensions: {
      product: "40 x 40 x 75 cm",
      weight: "4 kg",
      packaged: "42 x 42 x 78 cm"
    },
    fabric: "N/A",
    additionalInfo: {
      warranty: "1 Year",
      care: "Wipe clean"
    }
  },
  {
      _id: "p5",
      code: "LMR-005",
      name: "Modern Living Wardrobe",
      label: "Kayu",
      category: "Lemari",
      collection: "Atmosphere Living",
      price: 5800000,
      memberPrice: 5300000,
      stock: 3,
      status: "Low Stock",
      media: [
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1200"
      ],
      mainMediaIndex: 0,
      delivery: "5-7 days",
      description: "Lemari pakaian dengan desain modern yang memaksimalkan ruang penyimpanan.",
      specifications: [
        { key: "Material", value: "Teak Wood" },
        { key: "Storage", value: "Double Hanging" }
      ],
      dimensions: {
        product: "120 x 60 x 200 cm",
        weight: "65 kg",
        packaged: "125 x 65 x 210 cm"
      },
      fabric: "N/A",
      additionalInfo: {
        warranty: "5 Years",
        care: "Dust regularly"
      }
    },
    {
        _id: "p6",
        code: "BNK-006",
        name: "Eco-Friendly Garden Bench",
        label: "Kayu",
        category: "Bangku",
        collection: "Atmosphere Outdoor",
        price: 2100000,
        memberPrice: 1900000,
        stock: 12,
        status: "In Stock",
        media: [
          "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800"
        ],
        mainMediaIndex: 0,
        delivery: "2-4 days",
        description: "Bangku taman tahan cuaca yang terbuat dari kayu yang dikelola secara berkelanjutan.",
        specifications: [
          { key: "Material", value: "Recycled Teak" },
          { key: "Weatherproof", value: "Yes" }
        ],
        dimensions: {
          product: "150 x 60 x 90 cm",
          weight: "22 kg",
          packaged: "155 x 65 x 95 cm"
        },
        fabric: "N/A",
        additionalInfo: {
          warranty: "3 Years",
          care: "Oil once a year"
        }
      },
      {
          _id: "p7",
          code: "STL-007",
          name: "Rustic Accent Stool",
          label: "Kayu",
          category: "Stool",
          collection: "Atmosphere Heritage",
          price: 950000,
          memberPrice: 850000,
          stock: 6,
          status: "In Stock",
          media: [
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200"
          ],
          mainMediaIndex: 0,
          delivery: "1-3 days",
          description: "Stool unik dengan karakter kayu alami yang menonjol.",
          specifications: [
            { key: "Material", value: "Acacia Wood" },
            { key: "Style", value: "Rustic" }
          ],
          dimensions: {
            product: "35 x 35 x 45 cm",
            weight: "5 kg",
            packaged: "38 x 38 x 48 cm"
          },
          fabric: "N/A",
          additionalInfo: {
            warranty: "1 Year",
            care: "Wipe with dry cloth"
          }
        }
];

export const DUMMY_ARTICLES: (Article & { status: "Published" | "Draft" | "Scheduled" })[] = [
  {
    _id: "a1",
    title: "Mengenal Keunggulan Furnitur Besi Tempa untuk Hunian Modern",
    description: "Furnitur besi tempa bukan sekadar pilihan gaya — ia adalah investasi jangka panjang.",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=1200",
    category: "Material & Teknik",
    author: "Tim Atmosphere",
    date: "Maret 5, 2026",
    featured: true,
    status: "Published",
    tags: ["besi tempa", "furnitur industrial", "desain interior", "material"],
    content: "<h2>Mengapa Besi Tempa Menjadi Pilihan Utama?</h2><p>Besi tempa (wrought iron) telah digunakan selama berabad-abad dalam pembuatan furnitur dan dekorasi.</p>"
  },
  {
    _id: "a2",
    title: "Panduan Lengkap Memilih Kayu untuk Furnitur Custom Anda",
    description: "Tidak semua kayu diciptakan sama. Panduan ini membantu Anda memahami perbedaan jenis kayu.",
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=1200",
    category: "Panduan Pembelian",
    author: "Tim Atmosphere",
    date: "Februari 28, 2026",
    featured: true,
    status: "Published",
    tags: ["kayu jati", "kayu mahoni", "kayu akasia", "panduan", "furnitur kayu"],
    content: "<h2>Mengenal Jenis Kayu untuk Furnitur</h2><p>Pemilihan kayu yang tepat adalah fondasi dari furnitur berkualitas.</p>"
  },
  {
    _id: "a3",
    title: "7 Tren Desain Interior 2026 yang Wajib Anda Ketahui",
    description: "Dunia desain interior terus berevolusi. Inilah 7 tren dominan di 2026.",
    image: "https://images.unsplash.com/photo-1492656975733-cfd6a6a0f70a?auto=format&fit=crop&q=80&w=1200",
    category: "Tren Desain",
    author: "Tim Atmosphere",
    date: "Februari 20, 2026",
    featured: false,
    status: "Published",
    tags: ["tren desain", "interior 2026", "desain rumah", "inspirasi"],
    content: "<h2>Tren Interior 2026: Humanistic Design Bertemu Teknologi</h2><p>Tahun 2026 ditandai kebangkitan material alami berpadu estetika yang lebih manusiawi.</p>"
  },
  {
    _id: "a4",
    title: "Cara Merawat Furnitur Kayu Agar Tahan Puluhan Tahun",
    description: "Pelajari teknik perawatan yang tepat dari para ahli Atmosphere.",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1200",
    category: "Perawatan & Tips",
    author: "Tim Atmosphere",
    date: "Februari 12, 2026",
    featured: false,
    status: "Published",
    tags: ["perawatan furnitur", "kayu", "tips", "maintenance"],
    content: "<h2>Investasi yang Tepat Butuh Perawatan yang Tepat</h2><p>Furnitur kayu solid bukan seperti elektronik yang usang setelah beberapa tahun.</p>"
  }
];

export const DUMMY_FOUNDER = {
  name: "Will Jones",
  role: "Founder & Master Artisan",
  image: "/images/team-1.png",
  bio: "Will Jones memulai Atmosphere dari sebuah bengkel kecil di Jawa, menggabungkan kecintaannya pada material besi dengan keahlian pengrajin lokal.",
  quote: "Furnitur bukan hanya benda pengisi ruangan, tapi ia adalah pembentuk 'Atmosphere' dalam kehidupan Anda.",
  whatsapp: "+62 882-0058-24231",
  facebook: "atmosphere.furnitureid",
  instagram: "@atmosphere.furnitureid"
};
