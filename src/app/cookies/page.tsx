import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cookie Policy | Atmosphere Furniture Indonesia",
    alternates: { canonical: "/cookies" }
};

export default function CookiesPage() {
    return (
        <main className="min-h-screen bg-white font-poppins">
            <Navbar />

            <article className="mx-auto w-full max-w-4xl px-6 pt-32 pb-24">
                <header className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-semibold text-zinc-900 tracking-tight leading-tight mb-6">
                        Cookie Policy
                    </h1>
                    <p className="text-zinc-500 text-sm md:text-base font-medium">
                        Last Updated: March 3, 2026
                    </p>
                </header>

                <div className="prose prose-zinc max-w-none space-y-8 text-zinc-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">1. What Are Cookies</h2>
                        <p>
                            Cookies are small text files that are stored on your computer or mobile device when you visit a website.
                            They are widely used to make websites work, or work more efficiently, as well as to provide information
                            to the owners of the site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">2. How We Use Cookies</h2>
                        <p>
                            Atmosphere Furniture Indonesia uses cookies to improve your browsing experience by remembering your
                            preferences, analyzing site traffic, and understanding where our visitors are coming from.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">3. Types of Cookies We Use</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
                            <li><strong>Analytical Cookies:</strong> Help us understand how visitors interact with the website.</li>
                            <li><strong>Functional Cookies:</strong> Remember choices you make to provide enhanced features.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">4. Managing Cookies</h2>
                        <p>
                            Most web browsers allow you to control cookies through their settings preferences. However, if you limit
                            the ability of websites to set cookies, you may worsen your overall user experience.
                        </p>
                    </section>
                </div>
            </article>

            <Footer />
        </main>
    );
}
