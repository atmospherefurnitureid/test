import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import { Product, Article } from '@/models/Schemas';
import { toSlug, slugify } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://atmospherefurnitureid.com';

    await dbConnect();

    // Fetch dynamic products
    const products = await Product.find({}).lean() as any[];
    const productUrls = products.map((p) => ({
        url: `${baseUrl}/products/${p.code}/${toSlug(p.name)}`,
        lastModified: new Date(p.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Fetch dynamic articles
    const articles = await Article.find({ status: 'Published' }).lean() as any[];
    const articleUrls = articles.map((a) => ({
        url: `${baseUrl}/articles/${a._id}/${slugify(a.title)}`,
        lastModified: new Date(a.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/articles`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...productUrls,
        ...articleUrls,
    ];
}
