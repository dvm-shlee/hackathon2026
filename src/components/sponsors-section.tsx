import Image from "next/image";

const sponsors = [
  {
    name: "Sponsor 1",
    logo: "/openneuro.jpg",
    tier: "platinum",
  },
];

export function SponsorsSection() {
  const platinumSponsors = sponsors.filter((s) => s.tier === "platinum");
  const goldSponsors = sponsors.filter((s) => s.tier === "gold");
  const silverSponsors = sponsors.filter((s) => s.tier === "silver");

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Supported By
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">Our Sponsors</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            We are grateful to our sponsors who make Hackathon Bordeaux possible
          </p>
        </div>

        {/* Platinum Tier */}
        {/* <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-center text-muted-foreground mb-6">
            Platinum Partners
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {platinumSponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className="grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={sponsor.logo || "/placeholder.svg"}
                  alt={sponsor.name}
                  width={180}
                  height={60}
                  className="h-14 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div> */}

        {/* Become a Sponsor CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Interested in sponsoring OHBM Hackathon in Bordeaux?
          </p>
          <a
            href="mailto:ohbmopenscience@gmail.com"
            className="inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-1 hover:opacity-70 transition-opacity"
          >
            Become a Sponsor
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
