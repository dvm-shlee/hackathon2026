import { Code, Users, Trophy, Lightbulb } from "lucide-react";
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

      {/* Location Preview */}
      <div className="border-t border-border p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Experience the heart of French wine country
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Bordeaux combines world-class culture, stunning architecture, and a
            thriving tech scene. The perfect backdrop for your next breakthrough
            idea.
          </p>
          <div className="relative aspect-[21/9] rounded-xl overflow-hidden border border-border">
            <Image
              src={`${basePath}/bordeaux.jpeg`}
              alt="Bordeaux cityscape"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-6 left-6 text-left">
              <p className="text-sm text-muted-foreground">Venue location</p>
              <p className="text-xl font-semibold">
                Campus Victoire, University of Bordeaux
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
