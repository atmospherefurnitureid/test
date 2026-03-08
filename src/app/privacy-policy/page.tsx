import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Atmosphere Furniture Indonesia",
    alternates: { canonical: "/privacy-policy" }
};

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-white font-poppins">
            <Navbar />

            <article className="mx-auto w-full max-w-4xl px-6 pt-32 pb-24">
                <header className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-semibold text-zinc-900 tracking-tight leading-tight mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-zinc-500 text-sm md:text-base font-medium">
                        Last Updated: March 3, 2026
                    </p>
                </header>

                <div className="prose prose-zinc max-w-none space-y-8 text-zinc-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">1. Information We Collect</h2>
                        <p>
                            Atmosphere Furniture Indonesia collects information that you provide directly to us through our contact forms,
                            WhatsApp consultations, and when you make a purchase. This may include your name, email address, phone number,
                            and physical address for delivery purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to provide, maintain, and improve our services, including processing your orders,
                            responding to your inquiries, and sending you updates regarding your furniture production and delivery status.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">3. Data Protection</h2>
                        <p>
                            We implement a variety of security measures to maintain the safety of your personal information. Your personal data
                            is contained behind secured networks and is only accessible by a limited number of persons who have special access
                            rights to such systems and are required to keep the information confidential.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">4. Third-Party Disclosure</h2>
                        <p>
                            We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information unless we
                            provide users with advance notice. This does not include website hosting partners and other parties who assist us
                            in operating our website or conducting our business, so long as those parties agree to keep this information confidential.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">5. Your Consent</h2>
                        <p>
                            By using our site, you consent to our website's privacy policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">6. Contacting Us</h2>
                        <p>
                            If there are any questions regarding this privacy policy, you may contact us using the information on our contact page.
                        </p>
                    </section>
                </div>
            </article>

            <Footer />
        </main>
    );
}
