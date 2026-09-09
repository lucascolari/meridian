import { Hero } from "@/components/sections/Hero";
import { Blueprint } from "@/components/sections/Blueprint";
import { Showcase } from "@/components/sections/Showcase";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Statement } from "@/components/sections/Statement";
import { Welcome } from "@/components/sections/Welcome";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
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
