import { Metadata } from "next";
import HomePageClient from "./HomePageClient";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: {
      "id-ID": "/",
      "en-US": "/?lang=en",
    },
  },
};

export default async function Home() {
  let products: any[] = [];
  let articles: any[] = [];

  try {
    await dbConnect();
    const db = mongoose.connection.db!;
    
    // Fetch products and articles in parallel
    const [rawProducts, rawArticles] = await Promise.all([
      db.collection('products')
        .find({})
        .sort({ createdAt: -1 })
        .limit(20)
        .toArray(),
      db.collection('articles')
        .find({ status: "Published" })
        .sort({ date: -1 })
        .limit(4)
        .toArray()
    ]);
      
    products = rawProducts.map(p => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString(),
    }));

    articles = rawArticles.map(a => ({
        ...a,
        _id: a._id.toString(),
        createdAt: a.createdAt?.toISOString(),
        updatedAt: a.updatedAt?.toISOString(),
    }));

  } catch (err) {
    console.error("Home SSR Data Fetch Error:", err);
  }

  return <HomePageClient initialProducts={products} initialArticles={articles} />;
}
