import { Code, ExternalLink, Lightbulb, MapPin, TramFront, Trophy, Users } from "lucide-react";
import Image from "next/image";

const basePath = process.env.NODE_ENV === "production" ? "/hackathon2026" : "";

const highlights = [
  {
    icon: Code,
    title: "Build",
    description: "3 days of coding and innovation",
  },
  {
    icon: Users,
    title: "Connect",
    description: "Meet talented researchers from around the world",
  },
  {
    icon: Trophy,
    title: "Share",
    description: "Share your work",
  },
  {
    icon: Lightbulb,
    title: "Learn",
    description: "Workshops from neuroimaging experts",
  },
];

export function InfoSection() {
  return (
    <section id="about" className="border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item, index) => (
          <div
            key={item.title}
            className={`p-8 md:p-12 ${index < highlights.length - 1 ? "border-b md:border-b-0 md:border-r" : ""} border-border`}
          >
            <item.icon className="w-8 h-8 text-muted-foreground mb-6" />
            <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-8 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Plan Your Stay Around The Venue
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
              OHBM Brainhack is the open collaboration event organized by OHBM OSSIG, bringing
              together researchers, developers, and trainees to build and learn around open
              neuroimaging tools. The 2026 edition runs from Thursday, June 11 to Saturday, June
              13 at Campus Victoire, University of Bordeaux.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border">
              <Image
                src={`${basePath}/bordeaux.jpeg`}
                alt="Bordeaux cityscape near the event venue"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-6 left-6 text-left">
                <p className="text-sm text-muted-foreground">Location photo</p>
                <p className="text-xl font-semibold">Campus Victoire Area</p>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-card">
              <iframe
                title="Satellite map around Campus Victoire, Bordeaux"
                src="https://www.google.com/maps?q=Campus+Victoire+University+of+Bordeaux&hl=en&t=k&z=15&output=embed"
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-6 text-left">
                <p className="text-sm text-muted-foreground">Satellite view</p>
                <p className="text-xl font-semibold">Transit And Lodging Context</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Venue
              </div>
              <p className="text-sm text-muted-foreground">
                Campus Victoire, University of Bordeaux. We recommend staying in central Bordeaux
                with reliable tram access.
              </p>
              <a
                href="https://www.u-bordeaux.fr/campus/decouvrir-les-campus/campus-victoire"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-background"
              >
                Campus Victoire
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                <TramFront className="w-4 h-4 text-muted-foreground" />
                Daily Timing
              </div>
              <p className="text-sm text-muted-foreground">
                Doors open as early as 07:30 on all three days. Plan your morning commute before
                the first sessions.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                <Users className="w-4 h-4 text-muted-foreground" />
                Lodging Tip
              </div>
              <p className="text-sm text-muted-foreground">
                Book through Saturday night if you want to join late sessions and closing updates
                comfortably.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
