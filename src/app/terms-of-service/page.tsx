import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Atmosphere Furniture Indonesia",
    alternates: { canonical: "/terms-of-service" }
};

export default function TermsOfService() {
    return (
        <main className="min-h-screen bg-white font-poppins">
            <Navbar />

            <article className="mx-auto w-full max-w-4xl px-6 pt-32 pb-24">
                <header className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-semibold text-zinc-900 tracking-tight leading-tight mb-6">
                        Terms of Service
                    </h1>
                    <p className="text-zinc-500 text-sm md:text-base font-medium">
                        Last Updated: March 3, 2026
                    </p>
                </header>

                <div className="prose prose-zinc max-w-none space-y-8 text-zinc-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">1. Agreement to Terms</h2>
                        <p>
                            By accessing or using the Atmosphere Furniture Indonesia website, you agree to be bound by these Terms of Service
                            and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from
                            using or accessing this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">2. Use License</h2>
                        <p>
                            Permission is granted to temporarily download one copy of the materials (information or software) on Atmosphere
                            Furniture Indonesia's website for personal, non-commercial transitory viewing only.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">3. Custom Orders & Production</h2>
                        <p>
                            All custom furniture orders require a 50% Down Payment (DP) to begin production. Lead times are estimates and
                            may vary based on material availability and design complexity. Final payment is required before delivery.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">4. Warranty & Returns</h2>
                        <p>
                            We provide a 1-year structural warranty for our products. Due to the custom nature of our furniture, returns are
                            only accepted for items that arrive damaged or significantly deviate from the agreed-upon design specifications.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">5. Governing Law</h2>
                        <p>
                            These terms and conditions are governed by and construed in accordance with the laws of Indonesia and you
                            irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                        </p>
                    </section>
                </div>
            </article>

            <Footer />
        </main>
    );
}
