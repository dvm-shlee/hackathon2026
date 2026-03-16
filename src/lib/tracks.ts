import trackData from "@/data/tracks.generated.json";

export type TrackKind = "hacktrack" | "traintrack";

export type TrackEntry = {
  id: string;
  kind: TrackKind;
  title: string;
  issueNumber: number;
  issueUrl: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  labels: string[];
  categories: string[];
  imageUrl: string | null;
  summary: string | null;
  teaser: string | null;
  primaryLink: string | null;
  leads: string[];
  hub: string | null;
  otherHubs: string[];
  skills: string[];
  recommendedTutorials: string[];
  goodFirstIssues: string[];
  pitchLink: string | null;
  shortName: string;
  recordingConsent: string | null;
  duration: string | null;
  skillLevel: string | null;
  programmingLanguage: string | null;
  tags: string[];
  reviewed: boolean;
};

type TrackData = {
  meta: {
    generatedAt: string;
    repository: string;
  };
  hacktrack: TrackEntry[];
  traintrack: TrackEntry[];
};

const data = trackData as TrackData;

export function getTrackEntries(kind: TrackKind) {
  return [...data[kind]].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export function getRecentTrackEntries(limit = 6) {
  return [...data.hacktrack, ...data.traintrack]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, limit);
}

export function getTrackSubmitUrl(kind: TrackKind) {
  const repository = data.meta.repository || "ohbm/hackathon2026";
  const template =
    kind === "hacktrack"
      ? "brainhack-hacktrack-project.yml"
      : "brainhack-traintrack-project.yml";
  const label = kind === "hacktrack" ? "HackTrack Project" : "TrainTrack Tutorial";
  const title = kind === "hacktrack" ? "<My Project Name>" : "<My Tutorial Title>";

  return `https://github.com/${repository}/issues/new?labels=${encodeURIComponent(label)}&template=${template}&title=${encodeURIComponent(title)}`;
}

export function getTrackRepository() {
  return data.meta.repository;
}

export function getTracksGeneratedAt() {
  return data.meta.generatedAt;
}

export function formatTrackDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
