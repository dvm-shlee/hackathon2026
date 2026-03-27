import { BookOpen, Brain, ExternalLink, Microscope, NotebookPen } from "lucide-react";

type WorkshopItem = {
  title: string;
  format: string;
  description: string;
  icon: typeof BookOpen;
  links?: Array<{
    label: string;
    href: string;
  }>;
};

const workshops: WorkshopItem[] = [
  {
    title: "Neuroimaging Statistics Workshop",
    format: "2x half-day",
    description:
      "The Neuroimaging Statistics Workshop will showcase emerging methods in brain image modeling and analysis. It combines lectures by leaders in neuroimaging statistics with opportunities to network among students and researchers.",
    icon: NotebookPen,
    links: [{ label: "Workshop Site", href: "https://sites.google.com/view/nsw2026" }],
  },
  {
    title: "EEG101 Workshop",
    format: "2x half-day",
    description:
      "The INDoS and EEG101 EU COST actions are bringing together the EEG and wider neuroimaging community to develop and collaborate on standardized tools and protocols for analysis and reporting, curate and harmonise large datasets to establish centralized platforms for resource sharing and collaboration. ",
    icon: Brain,
  },
  {
    title: "BIDS Workshop",
    format: "half-day",
    description:
      "The BIDS workshop will educate and discuss standards for prescribing a formal way to organize various imaging data types and metadata. It simplifies communication and collaboration between users and enables easier data validation and software development.",
    icon: BookOpen,
    links: [{ label: "BIDS", href: "https://bids.neuroimaging.io" }],
  },
  {
    title: "hMRI Workshop",
    format: "half-day",
    description:
      "The hMRI workshop will introduce quantitative MRI methods and their analysis via the hMRI-toolbox embedded in SPM. It allows the estimation of high-quality multi-parameter qMRI maps (R1, R2*, PD and MT) followed by spatial registration for statistical analysis.",
    icon: Microscope,
    links: [{ label: "hMRI Toolbox", href: "https://hmri-group.github.io/hMRI-toolbox/" }],
  },
];

export function WorkshopsSection() {
  return (
    <section id="workshop" className="py-24 px-6 border-t border-border bg-muted/20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Workshops</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {workshops.map((workshop) => (
            <article key={workshop.title} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
                <workshop.icon className="w-4 h-4 text-muted-foreground" />
                Workshop
              </div>
              <h3 className="text-xl font-semibold mb-2">{workshop.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">Format: {workshop.format}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{workshop.description}</p>
              {workshop.links?.length ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  {workshop.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-background"
                    >
                      {link.label}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
