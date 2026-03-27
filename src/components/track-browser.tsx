"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ExternalLink, Filter, Search } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatTrackDate, type TrackEntry, type TrackKind } from "@/lib/tracks";

const basePath = process.env.NODE_ENV === "production" ? "/hackathon2026" : "";

type TrackBrowserProps = {
  sectionId?: string;
  kind: TrackKind;
  eyebrow?: string;
  title: string;
  description: string;
  repository: string;
  submitUrl: string;
  entries: TrackEntry[];
  headingLevel?: "h1" | "h2";
};

function trackLabel(kind: TrackKind) {
  return kind === "hacktrack" ? "HackTrack" : "TrainTrack";
}

function fallbackImage() {
  return `${basePath}/ossig_logo.svg`;
}

function filterText(entry: TrackEntry) {
  return [
    entry.title,
    entry.summary,
    entry.hub,
    ...entry.categories,
    ...entry.leads,
    ...entry.tags,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function TrackBrowser({
  sectionId,
  kind,
  eyebrow = "OHBM Brainhack 2026",
  title,
  description,
  repository,
  submitUrl,
  entries,
  headingLevel = "h1",
}: TrackBrowserProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<TrackEntry | null>(null);
  const HeadingTag = headingLevel;

  const tags = useMemo(
    () => [...new Set(entries.flatMap((entry) => entry.categories))].sort((left, right) => left.localeCompare(right)),
    [entries],
  );

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesQuery = !query || filterText(entry).includes(query.toLowerCase());
      const matchesTag = !activeTag || entry.categories.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [activeTag, entries, query]);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) {
        return;
      }

      const match = entries.find((entry) => entry.id === hash);
      if (match) {
        setSelectedEntry(match);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [entries]);

  const updateHash = (entry: TrackEntry | null) => {
    if (typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);
    url.hash = entry ? entry.id : "";
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <>
      <section id={sectionId} className="border-t border-border bg-muted/20 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm uppercase tracking-[0.25em] text-muted-foreground">{eyebrow}</p>
              <HeadingTag className="text-4xl font-bold tracking-tight md:text-5xl">{title}</HeadingTag>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={submitUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85"
              >
                Register via GitHub Issue
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={`https://github.com/${repository}/labels/${encodeURIComponent(
                  kind === "hacktrack" ? "HackTrack Project" : "TrainTrack Tutorial",
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-background"
              >
                View Label On GitHub
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="mb-8 rounded-3xl border border-border bg-background/80 p-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(20rem,1fr)_auto]">
              <label className="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={`Search ${trackLabel(kind)} by title, summary, tag, or lead`}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>
              <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>
                  {filteredEntries.length} visible / {entries.length} total
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  !activeTag ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:bg-card",
                )}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag((current) => (current === tag ? null : tag))}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    activeTag === tag
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:bg-card",
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              {kind === "hacktrack" ? "Current registered projects" : "Current registered tutorials"}
            </p>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
              <p className="text-lg font-medium">No entries match the current filter.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another search term, clear the active tag, or use the register button above to add a new entry.
              </p>
            </div>
          ) : (
            <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
              {filteredEntries.map((entry) => (
                <article
                  key={entry.id}
                  id={entry.id}
                  className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-accent/12 via-card to-card p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={entry.imageUrl || fallbackImage()}
                      alt={entry.title}
                      className="max-h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold leading-snug">{entry.title}</h2>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {entry.categories.slice(0, 4).map((tag) => (
                        <span key={tag} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEntry(entry);
                          updateHash(entry);
                        }}
                        className="inline-flex max-w-full items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog
        open={Boolean(selectedEntry)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEntry(null);
            updateHash(null);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="left-0 top-0 h-dvh max-h-dvh w-screen max-w-[100vw] translate-x-0 translate-y-0 overflow-hidden rounded-none border-0 border-border bg-card p-0 sm:left-[50%] sm:top-[50%] sm:h-auto sm:max-h-[90vh] sm:w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-2rem)] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl sm:border lg:w-[min(66vw,72rem)] lg:max-w-[min(66vw,72rem)]"
        >
          {selectedEntry ? (
            <div className="flex min-h-full min-w-0 flex-col overflow-x-hidden">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur sm:hidden">
                <p className="min-w-0 pr-4 text-sm font-medium text-foreground/80">{trackLabel(selectedEntry.kind)} details</p>
                <DialogClose className="rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-background">
                  Close
                </DialogClose>
              </div>
              <div className="relative flex min-h-[13rem] items-center justify-center bg-gradient-to-br from-accent/20 via-background to-card px-6 py-6 sm:min-h-[16rem] sm:px-10 md:px-14">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <DialogClose className="absolute right-4 top-4 hidden rounded-full border border-border/80 bg-card/85 px-3 py-1.5 text-sm font-medium text-foreground/80 shadow-sm backdrop-blur transition-colors hover:bg-background sm:inline-flex">
                  Close
                </DialogClose>
                <img
                  src={selectedEntry.imageUrl || fallbackImage()}
                  alt={selectedEntry.title}
                  className="mx-auto max-h-[8rem] w-auto max-w-full object-contain sm:max-h-[10rem] md:max-h-[12rem]"
                />
              </div>
              <div className="themed-scrollbar flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8">
                <DialogHeader>
                  <DialogTitle className="pr-12 text-2xl sm:text-3xl">{selectedEntry.title}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {trackLabel(selectedEntry.kind)} issue #{selectedEntry.issueNumber} opened on {formatTrackDate(selectedEntry.createdAt)}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-5 flex flex-wrap gap-2">
                  {selectedEntry.categories.map((tag) => (
                    <span key={tag} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                {selectedEntry.summary ? (
                  <div className="mt-8">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Summary</h3>
                    <p className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed text-foreground/90">
                      {selectedEntry.summary}
                    </p>
                  </div>
                ) : null}

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {selectedEntry.leads.length > 0 ? (
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {selectedEntry.kind === "hacktrack" ? "Project Leads" : "Tutors"}
                      </h3>
                      <ul className="mt-3 space-y-2 break-words text-sm text-foreground/90">
                        {selectedEntry.leads.map((lead) => (
                          <li key={lead}>{lead}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Details</h3>
                    <ul className="mt-3 space-y-2 break-words text-sm text-foreground/90">
                      {selectedEntry.hub ? <li>Main hub: {selectedEntry.hub}</li> : null}
                      {selectedEntry.otherHubs.length > 0 ? <li>Other hubs: {selectedEntry.otherHubs.join(", ")}</li> : null}
                      {selectedEntry.duration ? <li>Duration: {selectedEntry.duration}</li> : null}
                      {selectedEntry.skillLevel ? <li>Level: {selectedEntry.skillLevel}</li> : null}
                      {selectedEntry.programmingLanguage ? <li>Language: {selectedEntry.programmingLanguage}</li> : null}
                      {selectedEntry.recordingConsent ? <li>Recording: {selectedEntry.recordingConsent}</li> : null}
                      {selectedEntry.reviewed ? <li>Reviewed by organizers</li> : null}
                    </ul>
                  </div>
                </div>

                {selectedEntry.skills.length > 0 ? (
                  <div className="mt-8">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Skills</h3>
                    <ul className="mt-3 space-y-2 break-words text-sm text-foreground/90">
                      {selectedEntry.skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {selectedEntry.recommendedTutorials.length > 0 ? (
                  <div className="mt-8">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Recommended Tutorials</h3>
                    <ul className="mt-3 space-y-2 break-words text-sm text-foreground/90">
                      {selectedEntry.recommendedTutorials.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {selectedEntry.goodFirstIssues.length > 0 ? (
                  <div className="mt-8">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Good First Issues</h3>
                    <ul className="mt-3 space-y-2 break-words text-sm text-foreground/90">
                      {selectedEntry.goodFirstIssues.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={selectedEntry.issueUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex max-w-full items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85"
                  >
                    Open GitHub Issue
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  {selectedEntry.primaryLink ? (
                    <a
                      href={selectedEntry.primaryLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex max-w-full items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-background"
                    >
                      Open Main Link
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : null}
                  {selectedEntry.pitchLink ? (
                    <a
                      href={selectedEntry.pitchLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex max-w-full items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-background"
                    >
                      Open Pitch
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
