const basePath = process.env.NODE_ENV === "production" ? "/hackathon2026" : "";

const sponsors = [
  {
    name: "Brain Innovation",
    logo: `${basePath}/sponsor_BrainInnovation.png`,
    href: "https://brainvoyager.com/",
    panelClassName: "bg-white",
  },
  {
    name: "Cortical Labs",
    logo: `${basePath}/sponsor_CorticalLabs.png`,
    href: "https://corticallabs.com/",
    panelClassName: "bg-white",
  },
];

export function SponsorsSection() {
  return (
    <section className="bg-muted/30 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm uppercase tracking-widest text-muted-foreground">Supported By</p>
          <h2 className="text-3xl font-bold md:text-4xl">Our Sponsors</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            We are grateful to our sponsors who make OHBM Brainhack Bordeaux possible
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center"
              aria-label={sponsor.name}
            >
              <div
                className={`flex h-32 w-full max-w-[380px] items-center justify-center rounded-2xl border border-border/60 shadow-sm transition-opacity hover:opacity-90 ${sponsor.panelClassName}`}
              >
                <div className="flex h-[calc(100%-10px)] w-[calc(100%-10px)] items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-4 text-muted-foreground">Interested in sponsoring OHBM Brainhack in Bordeaux?</p>
          <a
            href="mailto:ohbmopenscience@gmail.com"
            className="inline-flex items-center gap-2 border-b border-foreground pb-1 text-sm font-medium transition-opacity hover:opacity-70"
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
