import { Metadata } from "next";
import CheckoutPageClient from "./CheckoutPageClient";

export const metadata: Metadata = {
    title: "Checkout | Atmosphere Furniture Indonesia",
    description: "Selesaikan pesanan Anda di Atmosphere Furniture Indonesia. Kami melayani pengiriman ke seluruh Indonesia dan mancanegara.",
    robots: {
        index: false,
        follow: false,
    },
    alternates: {
        canonical: "/products/checkout"
    }
};

export default function Checkout() {
    return <CheckoutPageClient />;
}
