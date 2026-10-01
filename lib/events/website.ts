import type { EventItem } from "./types.ts";

// October website corrections; the source calendar and non-website consumers stay intact.
const hiddenOctoberShows = new Set([
  "show-ef38862e95685f650a05", // Lulu's Lounge, 15 October
  "show-ae11741888859822fe89", // Lulu's Lounge, 29 October
  "show-aa1670279374be5ddb26" // Lulu's Lounge, 31 October
]);

export function applyWebsiteEventCorrections(events: EventItem[]): EventItem[] {
  return events
    .filter(event => !hiddenOctoberShows.has(event.id))
    .map(event => event.id === "show-c7942b5942698d80a027"
      ? { ...event, name: "Baes", time: "11 PM till late" }
      : event);
}
