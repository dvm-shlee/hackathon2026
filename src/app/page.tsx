import { HeroSection } from "@/components/hero-section";
import { InfoSection } from "@/components/info-section";
import { ScheduleSection } from "@/components/schedule-section";
import { WorkshopsSection } from "@/components/workshops-section";
import { TrackBrowser } from "@/components/track-browser";
import { SponsorsSection } from "@/components/sponsors-section";
import { Footer } from "@/components/footer";
import { ScrollFade } from "@/components/scroll-fade";
import { getTrackEntries, getTrackRepository, getTrackSubmitUrl } from "@/lib/tracks";

export default function Home() {
  const repository = getTrackRepository();

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
        <TrackBrowser
          sectionId="hacktrack"
          kind="hacktrack"
          eyebrow="OHBM Brainhack 2026"
          title="Hack Track"
          description="The Hack Track is the collaborative project stream of the Brainhack, where teams form around open problems, build tools together, and welcome new contributors throughout the event."
          repository={repository}
          submitUrl={getTrackSubmitUrl("hacktrack")}
          entries={getTrackEntries("hacktrack")}
          headingLevel="h2"
        />
      </ScrollFade>
      <ScrollFade className="snap-start">
        <TrackBrowser
          sectionId="traintrack"
          kind="traintrack"
          eyebrow="OHBM Brainhack 2026"
          title="Train Track"
          description="The Train Track is the learning stream of the Brainhack, where attendees can join tutorials, hands-on sessions, and guided introductions to tools, methods, and workflows."
          repository={repository}
          submitUrl={getTrackSubmitUrl("traintrack")}
          entries={getTrackEntries("traintrack")}
          headingLevel="h2"
        />
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
