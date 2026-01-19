import { HeroSection } from "@/components/hero-section";
import { InfoSection } from "@/components/info-section";
import { SponsorsSection } from "@/components/sponsors-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <InfoSection />
      <SponsorsSection />
      <Footer />
    </main>
  );
}
