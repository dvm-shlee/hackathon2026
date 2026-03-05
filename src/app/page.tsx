import { HeroSection } from "@/components/hero-section";
import { InfoSection } from "@/components/info-section";
import { ScheduleSection } from "@/components/schedule-section";
import { WorkshopsSection } from "@/components/workshops-section";
import { SponsorsSection } from "@/components/sponsors-section";
import { Footer } from "@/components/footer";
import { ScrollFade } from "@/components/scroll-fade";

export default function Home() {
  return (
    <main className="bg-background text-foreground overflow-x-hidden snap-y snap-proximity">
      <ScrollFade className="snap-start" enterScale={0.98} exitScale={1.03} travelY={16} blurPx={6}>
        <HeroSection />
      </ScrollFade>
      <ScrollFade className="snap-start">
        <InfoSection />
      </ScrollFade>
      <ScrollFade className="snap-start">
        <ScheduleSection />
      </ScrollFade>
      <ScrollFade className="snap-start">
        <WorkshopsSection />
      </ScrollFade>
      <ScrollFade className="snap-start" disableExit>
        <>
          <SponsorsSection />
          <Footer />
        </>
      </ScrollFade>
    </main>
  );
}
