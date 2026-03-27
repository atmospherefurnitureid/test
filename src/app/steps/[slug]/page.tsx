import { Metadata } from "next";
import StepDetailClient from "./client-page";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: `${title} | Langkah Pemesanan Atmosphere Furniture`,
    alternates: {
      canonical: `/steps/${slug}`
    }
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <StepDetailClient slug={slug} />;
}
