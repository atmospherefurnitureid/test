import { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: {
      "id-ID": "/",
      "en-US": "/?lang=en", // Assuming this is how en is handled, if at all. 
    },
  },
};

export default function Home() {
  return <HomePageClient />;
}
