import { Metadata } from "next";
import LoginPageClient from "./LoginPageClient";

export const metadata: Metadata = {
    title: "Login | Atmosphere Furniture Indonesia",
    description: "Masuk ke dashboard Atmosphere Furniture Indonesia untuk mengelola katalog, artikel, dan pesanan pelanggan.",
    robots: {
        index: false,
        follow: false,
    },
    alternates: {
        canonical: "/login"
    }
};

export default function Login() {
    return <LoginPageClient />;
}
