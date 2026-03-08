import { Metadata } from "next";
import ArticlesPageClient from "./ArticlesPageClient";

export const metadata: Metadata = {
    title: "Inspirasi & Tips Furniture Indonesia | Blog Atmosphere Furniture",
    description: "Dapatkan tips merawat mebel jati, tren desain interior minimalis, dan panduan memilih furniture berkualitas dari ahlinya di Indonesia.",
    keywords: ["tips furniture", "mebel jati", "interior minimalis", "perawatan kayu", "furniture indonesia"],
    alternates: {
        canonical: "/articles"
    }
};

export default function ArticlesPage() {
    return <ArticlesPageClient />;
}
