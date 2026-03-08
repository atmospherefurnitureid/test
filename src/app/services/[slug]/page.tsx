import { Metadata } from "next";
import ServiceContent from "./ServiceContent";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: `${title} | Layanan Atmosphere Furniture Indonesia`,
    alternates: {
      canonical: `/services/${slug}`
    }
  };
}

export default function Page() {
  return <ServiceContent />;
}
