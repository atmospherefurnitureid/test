import { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";
import dbConnect from "@/lib/db";
import { Product } from "@/models/Schemas";

type Props = {
    params: Promise<{ code: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { code } = await params;

    try {
        await dbConnect();
        const product = await Product.findOne({ code }).lean();

        if (!product) {
            return {
                title: "Product Not Found | Atmosphere Furniture Indonesia",
            };
        }

        const description = product.description ? product.description.replace(/<[^>]*>?/gm, "").slice(0, 160) : "";

        return {
            title: `${product.name} - ${product.category} Berkualitas | Atmosphere Furniture Indonesia`,
            description: `${description}... Temukan furniture berkualitas dari Atmosphere Furniture Indonesia.`,
            openGraph: {
                title: product.name,
                description: description,
                images: product.media?.[0] ? [{ url: product.media[0] }] : [],
            },
        };
    } catch (e) {
        return {
            title: "Atmosphere Furniture Indonesia",
        };
    }
}

export default function Page() {
    return <ProductDetailClient />;
}
