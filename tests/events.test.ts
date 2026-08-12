import assert from "node:assert/strict";
import test from "node:test";
import { parseCalendarIcs } from "../lib/events/ics.ts";
import { parseEventMetadata } from "../lib/events/metadata.ts";
import { getUpcomingEvents, selectFeaturedEvent } from "../lib/events/selection.ts";
import { shouldShowSecondaryVenue } from "../lib/events/display.ts";
import type { EventItem } from "../lib/events/types.ts";

function calendar(eventLines: string[]): string {
  return ["BEGIN:VCALENDAR", "VERSION:2.0", ...eventLines, "END:VCALENDAR"].join("\r\n");
}

function event(overrides: string[] = []): string[] {
  return [
    "BEGIN:VEVENT",
    "UID:stable-show@example.com",
    "SUMMARY:Friday Night Live",
    "LOCATION:10 Bayfront Avenue\\, Singapore",
    "DTSTART;TZID=Asia/Singapore:20260828T220000",
    "DTEND;TZID=Asia/Singapore:20260829T020000",
    "DESCRIPTION:[NASHD]\\ngenre: Hip-Hop / R&B\\nvenue: Marquee Singapore\\nfeatured: true\\nfeature-from: 2026-08-27T09:00:00+08:00\\nguestlist: https://example.com/guestlist\\ntickets: javascript:alert(1)\\n[/NASHD]",
    ...overrides,
    "END:VEVENT"
  ];
}

test("parses the supported event subset and validates optional URLs", () => {
  const [show] = parseCalendarIcs(calendar(event()));
  assert.equal(show.name, "Friday Night Live");
  assert.equal(show.venue, "Marquee Singapore");
  assert.equal(show.location, "10 Bayfront Avenue, Singapore");
  assert.equal(show.startDate, "2026-08-28T14:00:00.000Z");
  assert.equal(show.endDate, "2026-08-28T18:00:00.000Z");
  assert.equal(show.guestlistUrl, "https://example.com/guestlist");
  assert.equal(show.ticketUrl, undefined);
  assert.equal(show.featureFrom, "2026-08-27T01:00:00.000Z");
});

test("parses Google Calendar rich-text descriptions without retaining HTML", () => {
  const metadata = parseEventMetadata(
    '[NASHD]<br>genre: Hip-Hop / R&amp;B<br>venue: Marquee Singapore<br>guestlist: <a href="https://example.com/guestlist">https://example.com/guestlist</a><br>[/NASHD]'
  );
  assert.equal(metadata?.genre, "Hip-Hop / R&B");
  assert.equal(metadata?.venue, "Marquee Singapore");
  assert.equal(metadata?.guestlistUrl, "https://example.com/guestlist");
});

test("suppresses only effectively identical secondary venue names", () => {
  assert.equal(shouldShowSecondaryVenue("Avenue", " Avenue "), false);
  assert.equal(shouldShowSecondaryVenue("BAES", "baes"), false);
  assert.equal(shouldShowSecondaryVenue("Marquee Presents Nash.D & Zippy", "Marquee Singapore"), true);
});

test("rejects all-day, recurring, cancelled, private, and incomplete events", () => {
  const allDay = event().map((line) => {
    if (line.startsWith("DTSTART")) return "DTSTART;VALUE=DATE:20260828";
    if (line.startsWith("DTEND")) return "DTEND;VALUE=DATE:20260829";
    return line;
  });
  const variants = [
    ["RRULE:FREQ=WEEKLY"],
    ["STATUS:CANCELLED"],
    ["CLASS:PRIVATE"]
  ];
  assert.equal(parseCalendarIcs(calendar(allDay)).length, 0);
  for (const extra of variants) assert.equal(parseCalendarIcs(calendar(event(extra))).length, 0);
  assert.equal(parseEventMetadata("[NASHD]\ngenre: House\n[/NASHD]"), null);
});

test("keeps IDs stable when editable event content changes", () => {
  const first = parseCalendarIcs(calendar(event()))[0];
  const changed = event().map((line) => line.startsWith("SUMMARY:") ? "SUMMARY:Renamed Show" : line);
  const second = parseCalendarIcs(calendar(changed))[0];
  assert.match(first.id, /^show-[a-f0-9]{20}$/);
  assert.equal(first.id, second.id);
});

function item(id: string, startDate: string, endDate: string, featured = false, featureFrom?: string): EventItem {
  return {
    id, name: id, venue: "Venue", location: "Singapore", genre: "House", startDate, endDate,
    date: "", day: "", time: "", featured, ...(featureFrom ? { featureFrom } : {})
  };
}

test("filters by end time, sorts by start time, and selects the earliest eligible feature", () => {
  const now = new Date("2026-08-28T12:00:00.000Z");
  const events = getUpcomingEvents([
    item("later", "2026-08-28T15:00:00.000Z", "2026-08-28T18:00:00.000Z", true),
    item("past", "2026-08-28T08:00:00.000Z", "2026-08-28T11:59:59.000Z", true),
    item("active", "2026-08-28T10:00:00.000Z", "2026-08-28T13:00:00.000Z", true),
    item("not-yet-featured", "2026-08-28T13:00:00.000Z", "2026-08-28T17:00:00.000Z", true, "2026-08-29T00:00:00.000Z")
  ], now);
  assert.deepEqual(events.map(({ id }) => id), ["active", "not-yet-featured", "later"]);
  assert.equal(selectFeaturedEvent(events, now)?.id, "active");
});

test("throws for a structurally invalid source and accepts an empty calendar", () => {
  assert.throws(() => parseCalendarIcs("not a calendar"));
  assert.deepEqual(parseCalendarIcs(calendar([])), []);
});
