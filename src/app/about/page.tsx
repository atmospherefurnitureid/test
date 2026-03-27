import { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
    title: "Tentang Kami | Atmosphere Furniture Indonesia",
    description: "Spesialis Custom Design Furniture Jepara kualitas ekspor sejak 2015. Atmosphere Furniture Indonesia menjembatani keahlian tradisional dengan desain besi modern.",
};

export default function AboutPage() {
    return <AboutPageClient />;
}
