import { Metadata } from "next";
import ArticleDetailClient from "./ArticleDetailClient";
import dbConnect from "@/lib/db";
import { Article } from "@/models/Schemas";

type Props = {
    params: Promise<{ id: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    try {
        await dbConnect();
        const article = await Article.findById(id).lean();

        if (!article) {
            return {
                title: "Article Not Found | Atmosphere Furniture Indonesia",
            };
        }

        return {
            title: `${article.title} | Blog Atmosphere Furniture Indonesia`,
            description: article.description,
            openGraph: {
                title: article.title,
                description: article.description,
                images: article.image ? [{ url: article.image }] : [],
            },
        };
    } catch (e) {
        return {
            title: "Atmosphere Furniture Indonesia",
        };
    }
}

export default function Page() {
    return <ArticleDetailClient />;
}
