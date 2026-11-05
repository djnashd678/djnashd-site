import type { EventItem } from "./types.ts";

// October website corrections; the source calendar and non-website consumers stay intact.
const hiddenOctoberShows = new Set([
  "show-ef38862e95685f650a05", // Lulu's Lounge, 15 October
  "show-ae11741888859822fe89", // Lulu's Lounge, 29 October
  "show-aa1670279374be5ddb26" // Lulu's Lounge, 31 October
]);

const guestlistBase = "https://docs.google.com/forms/d/e/1FAIpQLSeb5jU48ichO1phHj0hmM9Kzqi7f7JVtz1uo2TvbIhMAC2y3Q/viewform?usp=pp_url&entry.483686131=";
const novemberChoices: Record<string, string> = {
  "show-91d4e23b940b1cdb90db": "Avenue — 11 Nov 2026",
  "show-35735d7f4c992ab6c749": "Astrolab — 14 Nov 2026",
  "show-0202b810f1d557ed3593": "Avenue — 25 Nov 2026"
};
const novemberArtwork: Record<string, string> = {
  "show-35735d7f4c992ab6c749": "/events/2026-11-astrolab.webp",
  "show-625cbcdf664a21ad4ed1": "/events/2026-11-sunday-reset.jpg"
};

export function applyWebsiteEventCorrections(events: EventItem[]): EventItem[] {
  return events
    .filter(event => !hiddenOctoberShows.has(event.id))
    .map(event => event.id === "show-c7942b5942698d80a027"
      ? { ...event, name: "Baes", time: "11 PM till late" }
      : !novemberArtwork[event.id] && !novemberChoices[event.id] ? event : {
          ...event,
          ...(event.guestlistUrl && novemberChoices[event.id] ? { guestlistUrl: guestlistBase + encodeURIComponent(novemberChoices[event.id]) } : {}),
          ...(novemberArtwork[event.id] ? { image: novemberArtwork[event.id] } : {})
        });
}
