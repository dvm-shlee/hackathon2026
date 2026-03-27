"use client";

import { CalendarDays, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ScheduleTrack = "General" | "Hack Track" | "Train Track" | "Workshop";

type ScheduleItem = {
  event: string;
  track: ScheduleTrack;
  location: string;
};

type ScheduleBlock =
  | {
      time: string;
      columns: 1;
      item: ScheduleItem;
    }
  | {
      time: string;
      columns: 2;
      left: ScheduleItem;
      right: ScheduleItem;
    };

type TimeRange = {
  start: number;
  end: number;
};

const SLOT_MINUTES = 30;
const SLOT_HEIGHT_PX = 42;
const TIMELINE_BOTTOM_PADDING_PX = 18;

const parseClock = (value: string) => {
  const [hour, minute] = value.trim().split(":").map(Number);
  return hour * 60 + minute;
};

const parseTimeRange = (value: string): TimeRange => {
  const [startRaw, endRaw] = value.split("-").map((part) => part.trim());
  return {
    start: parseClock(startRaw),
    end: parseClock(endRaw),
  };
};

const formatClock = (minuteOfDay: number) => {
  const hour = Math.floor(minuteOfDay / 60)
    .toString()
    .padStart(2, "0");
  const minute = (minuteOfDay % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
};

const toPixels = (minutes: number) => (minutes / SLOT_MINUTES) * SLOT_HEIGHT_PX;

const schedule = {
  day1: [
    {
      time: "07:30 - 09:00",
      columns: 1,
      item: { event: "Soft Launch", track: "General", location: "Venue Open" },
    },
    {
      time: "09:00 - 09:30",
      columns: 1,
      item: { event: "Registration & Soft Opening", track: "General", location: "Main Hall" },
    },
    {
      time: "09:30 - 12:00",
      columns: 2,
      left: { event: "Brainstorming + Last Project Submissions", track: "Hack Track", location: "Hack Room" },
      right: { event: "Introductions: Brainhacking (10+5 min talks)", track: "Train Track", location: "Train Room" },
    },
    {
      time: "12:00 - 13:00",
      columns: 1,
      item: { event: "Lunch", track: "General", location: "Cafeteria" },
    },
    {
      time: "13:00 - 14:30",
      columns: 1,
      item: { event: "Project Pitches", track: "General", location: "Main Stage" },
    },
    {
      time: "14:30 - 16:00",
      columns: 1,
      item: { event: "Working On Projects", track: "Hack Track", location: "Hack Room" },
    },
    {
      time: "16:00 - 16:30",
      columns: 1,
      item: { event: "Coffee Break", track: "General", location: "Common Area" },
    },
    {
      time: "16:30 - 17:30",
      columns: 1,
      item: { event: "Un-conference", track: "General", location: "Main Stage" },
    },
    {
      time: "17:30 - 19:00",
      columns: 2,
      left: { event: "Working On Projects", track: "Hack Track", location: "Hack Room" },
      right: { event: "People's Choice Session (30 min)", track: "Train Track", location: "Train Room" },
    },
    {
      time: "19:00 - 19:30",
      columns: 1,
      item: { event: "Building Almost Closes", track: "General", location: "Venue" },
    },
    {
      time: "19:30 - 20:00",
      columns: 1,
      item: { event: "Building Closes", track: "General", location: "Venue" },
    },
  ],
  day2: [
    {
      time: "07:30 - 09:00",
      columns: 1,
      item: { event: "Soft Launch", track: "General", location: "Venue Open" },
    },
    {
      time: "09:00 - 12:00",
      columns: 2,
      left: { event: "Working On Projects", track: "Hack Track", location: "Hack Room" },
      right: { event: "Deeper Traintracks (45min): Toolboxes, Datasets, Workflows...", track: "Train Track", location: "Train Room" },
    },
    {
      time: "12:00 - 13:30",
      columns: 1,
      item: { event: "Lunch", track: "General", location: "Cafeteria" },
    },
    {
      time: "13:30 - 16:00",
      columns: 2,
      left: { event: "Working On Projects", track: "Hack Track", location: "Hack Room" },
      right: { event: "NSW / BIDS / hMRI / EEG101", track: "Workshop", location: "Workshop Room" },
    },
    {
      time: "16:00 - 16:30",
      columns: 1,
      item: { event: "Coffee Break", track: "General", location: "Common Area" },
    },
    {
      time: "16:30 - 17:30",
      columns: 1,
      item: { event: "Un-conference", track: "General", location: "Main Stage" },
    },
    {
      time: "17:30 - 19:00",
      columns: 2,
      left: { event: "Working On Projects", track: "Hack Track", location: "Hack Room" },
      right: { event: "NSW / BIDS / hMRI / EEG101", track: "Workshop", location: "Workshop Room" },
    },
    {
      time: "19:00 - 19:30",
      columns: 1,
      item: { event: "Building Almost Closes", track: "General", location: "Venue" },
    },
    {
      time: "19:30 - 20:00",
      columns: 1,
      item: { event: "Building Closes", track: "General", location: "Venue" },
    },
  ],
  day3: [
    {
      time: "07:30 - 09:00",
      columns: 1,
      item: { event: "Soft Launch", track: "General", location: "Venue Open" },
    },
    {
      time: "09:00 - 12:00",
      columns: 2,
      left: { event: "Working On Projects", track: "Hack Track", location: "Hack Room" },
      right: { event: "NSW / EEG101", track: "Workshop", location: "Workshop Room" },
    },
    {
      time: "12:00 - 13:30",
      columns: 1,
      item: { event: "Lunch", track: "General", location: "Cafeteria" },
    },
    {
      time: "13:30 - 14:00",
      columns: 1,
      item: { event: "Un-conference", track: "General", location: "Main Stage" },
    },
    {
      time: "14:00 - 16:00",
      columns: 1,
      item: { event: "Working On Projects", track: "Hack Track", location: "Hack Room" },
    },
    {
      time: "16:00 - 16:30",
      columns: 1,
      item: { event: "Coffee Break", track: "General", location: "Common Area" },
    },
    {
      time: "16:30 - 17:30",
      columns: 1,
      item: { event: "Wrapping Up Projects", track: "Hack Track", location: "Hack Room" },
    },
    {
      time: "17:30 - 19:00",
      columns: 1,
      item: { event: "Closing Ceremony + Project Updates", track: "General", location: "Main Stage" },
    },
    {
      time: "19:00 - 19:30",
      columns: 1,
      item: { event: "Building Almost Closes", track: "General", location: "Venue" },
    },
    {
      time: "19:30 - 20:00",
      columns: 1,
      item: { event: "Building Closes", track: "General", location: "Venue" },
    },
  ],
} satisfies Record<string, ScheduleBlock[]>;

const getTrackBadgeClass = (track: ScheduleTrack) => {
  if (track === "Hack Track") return "bg-blue-500/10 text-blue-500";
  if (track === "Train Track") return "bg-emerald-500/10 text-emerald-600";
  if (track === "Workshop") return "bg-amber-500/10 text-amber-600";
  return "bg-muted text-muted-foreground";
};

const getTrackCardClass = (track: ScheduleTrack) => {
  if (track === "Hack Track") return "bg-blue-500/5 border-blue-500/40";
  if (track === "Train Track") return "bg-emerald-500/5 border-emerald-500/40";
  if (track === "Workshop") return "bg-amber-500/5 border-amber-500/40";
  return "bg-card border-border";
};

function TimelineEvent({ item, compact = false }: { item: ScheduleItem; compact?: boolean }) {
  return (
    <div
      className={`h-full rounded-md border overflow-hidden ${compact ? "p-2" : "p-3"} ${getTrackCardClass(item.track)}`}
    >
      <div className={`flex items-center gap-2 ${compact ? "" : "mb-2"}`}>
        <span
          className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getTrackBadgeClass(item.track)}`}
        >
          {item.track}
        </span>
        {compact ? (
          <h4 className="min-w-0 truncate text-xs font-semibold leading-tight">{item.event}</h4>
        ) : null}
      </div>

      {!compact ? <h4 className="font-semibold text-sm leading-tight">{item.event}</h4> : null}
    </div>
  );
}

export function ScheduleSection() {
  return (
    <section id="schedule" className="py-24 px-6 border-t border-border bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Schedule</h2>
        </div>

        <div className="mb-10 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold mb-2">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            Schedule status
          </div>
          <p className="text-sm text-muted-foreground">
            Version v1.0 published. Daily activities begin at 07:30 and the building closes at
            20:00.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-5">
            <h3 className="font-semibold text-base mb-1">Train Track / Workshop</h3>
            <p className="text-sm text-muted-foreground">
              Train Track starts with onboarding and deeper topic sessions for practical project
              participation. Workshop-specific details are provided later in the Workshop Guide.
            </p>
          </div>
          <div className="rounded-xl border border-blue-500/40 bg-blue-500/5 p-5">
            <h3 className="font-semibold text-base mb-1">Hack Track</h3>
            <p className="text-sm text-muted-foreground">
              Project-first track with extended build blocks, unconference slots, and final closing
              updates.
            </p>
          </div>
        </div>

        <Tabs defaultValue="day1" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="day1" className="py-3">
              Day 1 (June 11)
            </TabsTrigger>
            <TabsTrigger value="day2" className="py-3">
              Day 2 (June 12)
            </TabsTrigger>
            <TabsTrigger value="day3" className="py-3">
              Day 3 (June 13)
            </TabsTrigger>
          </TabsList>

          {Object.entries(schedule).map(([day, events]) => (
            <TabsContent key={day} value={day}>
              {(() => {
                const parsed = events.map((block, index) => ({
                  block,
                  index,
                  range: parseTimeRange(block.time),
                }));

                const dayStart = Math.min(...parsed.map(({ range }) => range.start));
                const dayEnd = Math.max(...parsed.map(({ range }) => range.end));
                const totalHeight = toPixels(dayEnd - dayStart);
                const timelineHeight = totalHeight + TIMELINE_BOTTOM_PADDING_PX;

                const markers: number[] = [];
                for (let minute = dayStart; minute <= dayEnd; minute += SLOT_MINUTES) {
                  markers.push(minute);
                }

                return (
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="grid grid-cols-[82px_minmax(0,1fr)] border-b border-border bg-muted/30">
                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Time
                      </div>
                      <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Sessions
                      </div>
                    </div>

                    <div className="grid grid-cols-[82px_minmax(0,1fr)]">
                      <div className="relative border-r border-border bg-muted/20" style={{ height: timelineHeight }}>
                        {markers.map((minute) => {
                          const top = toPixels(minute - dayStart);
                          return (
                            <div
                              key={minute}
                              className="absolute left-0 right-0 -translate-y-1/2 px-3 text-[11px] text-muted-foreground"
                              style={{ top }}
                            >
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                <span>{formatClock(minute)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="relative overflow-hidden" style={{ height: timelineHeight }}>
                        {markers.map((minute) => {
                          const top = toPixels(minute - dayStart);
                          const hourLine = minute % 60 === 0;
                          return (
                            <div
                              key={minute}
                              className={`absolute left-0 right-0 border-t ${hourLine ? "border-border" : "border-border/40"}`}
                              style={{ top }}
                            />
                          );
                        })}

                        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border/60" />

                        {parsed.map(({ block, index, range }) => {
                          const top = toPixels(range.start - dayStart);
                          const height = Math.max(toPixels(range.end - range.start), SLOT_HEIGHT_PX * 0.9);

                          const durationMinutes = range.end - range.start;
                          const compact = durationMinutes <= SLOT_MINUTES;

                          if (block.columns === 1) {
                            return (
                              <div key={index} className="absolute px-2" style={{ top, height, left: 0, right: 0 }}>
                                <TimelineEvent item={block.item} compact={compact} />
                              </div>
                            );
                          }

                          return (
                            <div key={index} className="contents">
                              <div
                                className="absolute pl-2 pr-1"
                                style={{
                                  top,
                                  height,
                                  left: 0,
                                  width: "50%",
                                }}
                              >
                                <TimelineEvent item={block.left} compact={compact} />
                              </div>
                              <div
                                key={`${index}-right`}
                                className="absolute pl-1 pr-2"
                                style={{
                                  top,
                                  height,
                                  left: "50%",
                                  width: "50%",
                                }}
                              >
                                <TimelineEvent item={block.right} compact={compact} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-16 p-8 rounded-2xl bg-muted/50 border border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h4 className="text-xl font-semibold mb-1">Detailed Program (PDF)</h4>
            <p className="text-muted-foreground">
              More detailed session information will be provided in the official PDF booklet. Please
              refer to the PDF for finalized room assignments, workshop notes, and practical details.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="px-6 py-2 rounded-lg bg-primary/50 text-primary-foreground/80 font-medium cursor-not-allowed"
            >
              Download PDF (Placeholder)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
