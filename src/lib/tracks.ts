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

function isImageLikeUrl(url: string) {
  return (
    /\.(png|jpe?g|gif|webp|svg)(?:$|[?#])/i.test(url) ||
    url.includes("/user-attachments/assets/") ||
    url.includes("drive.google.com/")
  );
}

function extractEmbeddedImageUrl(value: string | null) {
  if (!value) {
    return null;
  }

  const htmlImageMatch = value.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (htmlImageMatch) {
    return htmlImageMatch[1];
  }

  const markdownImageMatch = value.match(/!\[[^\]]*]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/i);
  if (markdownImageMatch) {
    return markdownImageMatch[1];
  }

  const urls = value.match(/https?:\/\/[^\s"'<>]+/gi) ?? [];
  return urls.find((url) => isImageLikeUrl(url)) ?? null;
}

function stripEmbeddedImages(value: string | null) {
  if (!value) {
    return null;
  }

  const withoutImageTags = value
    .replace(/<img[^>]*>/gi, " ")
    .replace(/!\[[^\]]*]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/gi, " ");

  const withoutImageUrls = withoutImageTags.replace(/https?:\/\/[^\s"'<>]+/gi, (url) =>
    isImageLikeUrl(url) ? " " : url,
  );

  const cleaned = withoutImageUrls
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .trim();

  return cleaned || null;
}

function summarize(value: string | null, maxLength = 180) {
  if (!value) {
    return null;
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

function normalizeTrackEntry(entry: TrackEntry): TrackEntry {
  const summary = stripEmbeddedImages(entry.summary);
  return {
    ...entry,
    imageUrl: entry.imageUrl || extractEmbeddedImageUrl(entry.summary),
    summary,
    teaser: summarize(stripEmbeddedImages(entry.teaser) || summary),
  };
}

export function getTrackEntries(kind: TrackKind) {
  return [...data[kind]]
    .map(normalizeTrackEntry)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

export function getRecentTrackEntries(limit = 6) {
  return [...data.hacktrack, ...data.traintrack]
    .map(normalizeTrackEntry)
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
