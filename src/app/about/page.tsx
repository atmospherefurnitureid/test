import { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
    title: "Tentang Kami | Atmosphere Furniture Indonesia",
    description: "Kenali lebih dekat Atmosphere Furniture Indonesia, produsen furnitur kustom kualitas ekspor yang menggabungkan keahlian tradisional dengan desain modern sejak 2015.",
};

export default function AboutPage() {
    return <AboutPageClient />;
}
