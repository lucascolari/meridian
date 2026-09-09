import { Hero } from "@/components/sections/Hero";
import { Blueprint } from "@/components/sections/Blueprint";
import { Showcase } from "@/components/sections/Showcase";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Statement } from "@/components/sections/Statement";
import { Welcome } from "@/components/sections/Welcome";
import { Footer } from "@/components/sections/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/config";

export default function HomePage() {
  const site = getSiteSettings();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: SITE_URL,
    description: site.description,
    sameAs: site.social.map((item) => item.href),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: SITE_URL,
  };

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={website} />
      <Hero />
      <Blueprint />
      <Showcase />
      <FeaturedWork />
      <Statement />
      <Welcome />
      <Footer />
    </>
  );
}
