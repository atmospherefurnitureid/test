import { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";
import dbConnect from "@/lib/db";
import { Product } from "@/models/Schemas";
import { slugify } from "@/lib/utils";

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
            alternates: {
                canonical: `/products/${product.code}/${slugify(product.name)}`
            }
        };
    } catch (e) {
        return {
            title: "Atmosphere Furniture Indonesia",
        };
    }
}

export default async function Page({ params }: Props) {
    const { code } = await params;

    let product = null;
    try {
        await dbConnect();
        product = await Product.findOne({ code }).lean();
    } catch (e) {
        console.error("Error fetching product for JSON-LD:", e);
    }

    const jsonLd = product ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.media,
        "description": product.description ? product.description.replace(/<[^>]*>?/gm, "").slice(0, 160) : "",
        "sku": product.code,
        "mpn": product.code,
        "brand": {
            "@type": "Brand",
            "name": "Atmosphere Furniture Indonesia"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": 5,
            "bestRating": 5,
            "worstRating": 1,
            "ratingCount": 18,
            "reviewCount": 18
        },
        "review": [
            {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": "Pelanggan Atmosphere"
                },
                "datePublished": "2024-01-01",
                "reviewBody": "Produk sangat berkualitas, pengerjaan rapi, dan desainnya sangat elegan. Sangat puas dengan layanan Atmosphere Furniture.",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": 5
                }
            }
        ],
        "offers": {
            "@type": "Offer",
            "url": `https://atmospherefurnitureid.com/products/${product.code}/${slugify(product.name)}`,
            "priceCurrency": "IDR",
            "price": product.memberPrice > 0 ? product.memberPrice : product.price,
            "priceValidUntil": "2026-12-31",
            "availability": product.status === "Out of Stock" ? "https://schema.org/OutOfStock" :
                product.status === "Pre-order" ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
                "@type": "Organization",
                "name": "Atmosphere Furniture Indonesia"
            }
        }
    } : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <ProductDetailClient />
        </>
    );
}
