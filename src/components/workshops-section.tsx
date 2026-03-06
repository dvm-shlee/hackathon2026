import { BookOpen, Brain, Microscope, NotebookPen } from "lucide-react";

type WorkshopItem = {
  title: string;
  format: string;
  description: string;
  icon: typeof BookOpen;
};

const workshops: WorkshopItem[] = [
  {
    title: "Neuroimaging Statistics Workshop",
    format: "2x half-day",
    description:
      "The Neuroimaging Statistics Workshop will showcase emerging methods in brain image modeling and analysis. It combines lectures by leaders in neuroimaging statistics with opportunities to network among students and researchers.",
    icon: NotebookPen,
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
  },
  {
    title: "hMRI Workshop",
    format: "half-day",
    description:
      "The hMRI workshop will introduce quantitative MRI methods and their analysis via the hMRI-toolbox embedded in SPM. It allows the estimation of high-quality multi-parameter qMRI maps (R1, R2*, PD and MT) followed by spatial registration for statistical analysis.",
    icon: Microscope,
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
