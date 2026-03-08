import { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
    title: "Hubungi Kami | Atmosphere Furniture Indonesia",
    description: "Punya pertanyaan atau ingin melakukan pemesanan custom? Hubungi tim Atmosphere Furniture Indonesia melalui WhatsApp, Email, atau kunjungi workshop kami di Jepara.",
    alternates: {
        canonical: "/contact"
    }
};

export default function Contact() {
    return <ContactPageClient />;
}
