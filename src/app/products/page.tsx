import { Metadata } from "next";
import ProductsPageClient from "./ProductsPageClient";

export const metadata: Metadata = {
    title: "Katalog Furniture Kayu & Besi Terlengkap | Atmosphere Furniture Indonesia",
    description: "Jelajahi berbagai pilihan kursi, meja, dan lemari bergaya minimalis maupun industrial. Harga kompetitif, kualitas ekspor, dan garansi resmi dari pengrajin profesional Jepara - Atmosphere Furniture Indonesia.",
    keywords: ["katalog furniture", "mebel jepara", "kursi minimalis", "meja industrial", "furniture besi kayu"],
    alternates: {
        canonical: "/products"
    }
};

export default function ProductsPage() {
    return <ProductsPageClient />;
}
