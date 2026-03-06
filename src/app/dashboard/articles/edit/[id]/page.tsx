"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import ArticleForm from "@/components/ArticleForm";
import { useContentStore, GlobalArticle } from "@/lib/contentStore";

export default function EditArticlePage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { articles, isLoading } = useContentStore();
    const [article, setArticle] = useState<GlobalArticle | null>(null);

    useEffect(() => {
        if (!isLoading && articles.length > 0) {
            const found = articles.find(a => a._id === id);
            if (found) {
                setArticle(found);
            } else {
                console.error("Article not found with id:", id);
            }
        }
    }, [id, articles, isLoading]);

    if (isLoading || !article) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                <p className="font-medium">Loading Article Data...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up space-y-6 w-full max-w-5xl mx-auto p-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/articles"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Edit Article</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Update your article content and status.</p>
                </div>
            </div>

            <ArticleForm initialData={article} isEditing={true} />
        </div>
    );
}
