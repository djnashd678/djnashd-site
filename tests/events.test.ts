import assert from "node:assert/strict";
import test from "node:test";
import { parseCalendarIcs } from "../lib/events/ics.ts";
import { parseEventMetadata } from "../lib/events/metadata.ts";
import { getUpcomingEvents, selectFeaturedEvent, selectFeaturedEvents } from "../lib/events/selection.ts";
import { formatEventTimeRange, googleMapsUrl, shouldShowSecondaryVenue } from "../lib/events/display.ts";
import type { EventItem } from "../lib/events/types.ts";
import { applyWebsiteEventCorrections } from "../lib/events/website.ts";
import { decodeHtmlEntities } from "../lib/events/text.ts";

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

test("decodes common named and numeric HTML entities in event text", () => {
  assert.equal(decodeHtmlEntities("Top 40&#x27;s &amp; R&amp;B &#39;night&#39;"), "Top 40's & R&B 'night'");
  const metadata = parseEventMetadata("[NASHD]\ngenre: Top 40&#x27;s / R&amp;B\nvenue: Test Venue\n[/NASHD]");
  assert.equal(metadata?.genre, "Top 40's / R&B");
});

test("validates artwork, reservations, and scheduled publication metadata", () => {
  const metadata = parseEventMetadata(
    "[NASHD]\ngenre: House\nvenue: Test Venue\nreservations: https://inline.app/booking/test\nimage: /events/show.webp\nimage-mobile: /events/show-mobile.webp\npublish-from: 2026-10-01T00:00:00+08:00\n[/NASHD]"
  );
  assert.equal(metadata?.reservationsUrl, "https://inline.app/booking/test");
  assert.equal(metadata?.image, "/events/show.webp");
  assert.equal(metadata?.imageMobile, "/events/show-mobile.webp");
  assert.equal(metadata?.publishFrom, "2026-09-30T16:00:00.000Z");

  const unsafe = parseEventMetadata(
    "[NASHD]\ngenre: House\nvenue: Test Venue\nreservations: javascript:alert(1)\nimage: https://example.com/show.webp\nimage-mobile: /events/../secret.webp\npublish-from: October 1\n[/NASHD]"
  );
  assert.equal(unsafe?.reservationsUrl, undefined);
  assert.equal(unsafe?.image, undefined);
  assert.equal(unsafe?.imageMobile, undefined);
  assert.equal(unsafe?.publishFrom, undefined);
});

test("formats Singapore nightlife times and Google Maps links for display", () => {
  assert.equal(formatEventTimeRange(new Date("2026-09-12T13:00:00Z"), new Date("2026-09-12T22:00:00Z")), "9:00 PM \u2014 LATE");
  assert.equal(formatEventTimeRange(new Date("2026-09-27T08:00:00Z"), new Date("2026-09-27T14:00:00Z")), "4:00 PM \u2014 10:00 PM");
  assert.equal(googleMapsUrl("10 Bayfront Avenue, Singapore"), "https://www.google.com/maps/search/?api=1&query=10%20Bayfront%20Avenue%2C%20Singapore");
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

test("keeps events private until publish-from is reached", () => {
  const hidden = { ...item("scheduled", "2026-10-02T12:00:00.000Z", "2026-10-02T15:00:00.000Z", true), publishFrom: "2026-10-01T00:00:00.000Z" };
  assert.deepEqual(getUpcomingEvents([hidden], new Date("2026-09-30T23:59:59.000Z")), []);
  assert.equal(selectFeaturedEvent([hidden], new Date("2026-09-30T23:59:59.000Z")), undefined);
  assert.equal(getUpcomingEvents([hidden], new Date("2026-10-01T00:00:00.000Z"))[0]?.id, "scheduled");
});

test("selects every eligible featured event in chronological order", () => {
  const now = new Date("2026-09-01T00:00:00.000Z");
  const events = [
    item("second", "2026-09-27T08:00:00.000Z", "2026-09-27T14:00:00.000Z", true),
    item("regular", "2026-09-10T12:00:00.000Z", "2026-09-10T14:00:00.000Z"),
    item("first", "2026-09-12T13:00:00.000Z", "2026-09-12T22:00:00.000Z", true),
    item("scheduled", "2026-09-20T12:00:00.000Z", "2026-09-20T14:00:00.000Z", true, "2026-09-02T00:00:00.000Z")
  ];
  assert.deepEqual(selectFeaturedEvents(events, now).map(({ id }) => id), ["first", "second"]);
  assert.equal(selectFeaturedEvent(events, now)?.id, "first");
});

test("throws for a structurally invalid source and accepts an empty calendar", () => {
  assert.throws(() => parseCalendarIcs("not a calendar"));
  assert.deepEqual(parseCalendarIcs(calendar([])), []);
});

test("reads inline and wrapped October calendar metadata without changing URLs", () => {
  const halloween = parseEventMetadata("<p>[NASHD] genre: Open Format / Hip-Hop / R&amp;B / Top 40&#x27;s / EDM venue: Marquee\nSingapore tickets: https://marquee.bigtix.io/en/events/halloween-hotel-delirium/MQ261X31 publish-from:\n2026-10-01T00:00:00+08:00 [/NASHD]</p>");
  assert.equal(halloween?.venue, "Marquee Singapore");
  assert.equal(halloween?.ticketUrl, "https://marquee.bigtix.io/en/events/halloween-hotel-delirium/MQ261X31");
  assert.equal(halloween?.guestlistUrl, undefined);
  assert.equal(halloween?.publishFrom, "2026-09-30T16:00:00.000Z");
  const guestlist = "https://docs.google.com/forms/d/e/example/viewform?usp=pp_url&entry.483686131=Astrolab%20-%2017%20Oct%202026";
  const astrolab = parseEventMetadata(`[NASHD]\ngenre: Mainstage EDM\nvenue: Marquee Singapore\nguestlist: ${guestlist}\ntickets: https://marquee.bigtix.io/en/events/MQ261X17\nfeatured: true\n[/NASHD]`);
  assert.equal(astrolab?.guestlistUrl, guestlist);
  assert.equal(astrolab?.ticketUrl, "https://marquee.bigtix.io/en/events/MQ261X17");
});

test("retains featured events once in upcoming listings and expires September features", () => {
  const october = item("october", "2026-10-10T14:00:00Z", "2026-10-10T19:00:00Z", true);
  const september = item("september", "2026-09-12T14:00:00Z", "2026-09-12T19:00:00Z", true);
  const events = [october, september, october];
  const now = new Date("2026-10-02T00:00:00+08:00");
  assert.deepEqual(getUpcomingEvents(events, now).map(e => e.id), ["october"]);
  assert.deepEqual(selectFeaturedEvents(events, now).map(e => e.id), ["october"]);
});

test("keeps a calendar guestlist URL when it starts on a continuation line", () => {
  const guestlist = "https://docs.google.com/forms/d/e/example/viewform?usp=pp_url&entry.483686131=Baes%20%E2%80%94%2005%20Oct%202026";
  const metadata = parseEventMetadata(`<p>[NASHD]\ngenre: Hip-Hop / R&amp;B\nvenue: Baes\nguestlist:\n${guestlist}\npublish-from: 2026-10-01T00:00:00+08:00\n[/NASHD]</p>`);
  assert.equal(metadata?.guestlistUrl, guestlist);
  assert.equal(new URL(metadata!.guestlistUrl!).searchParams.get("entry.483686131"), "Baes — 05 Oct 2026");
});

test("retains free admission from calendar metadata through ICS parsing", () => {
  const lines = event().map(line => line.startsWith("DESCRIPTION:")
    ? "DESCRIPTION:[NASHD]\\ngenre: Hip-Hop / R&B\\nvenue: Kossa\\nadmission: free\\n[/NASHD]"
    : line);
  const [show] = parseCalendarIcs(calendar(lines));
  assert.equal(show.admission, "free");
  assert.equal(show.ticketUrl, undefined);
  assert.equal(show.guestlistUrl, undefined);
});


test("applies only the requested October website corrections without mutating calendar records", () => {
  const baes = { ...item("show-c7942b5942698d80a027", "2026-10-05T15:00:00Z", "2026-10-05T19:00:00Z"), name: "Baes — 11PM Till Late", time: "11:00 PM — LATE", guestlistUrl: "https://example.com/october-5" };
  const lulu = item("show-ef38862e95685f650a05", "2026-10-15T14:00:00Z", "2026-10-15T19:00:00Z");
  const other = { ...item("other", "2026-11-15T14:00:00Z", "2026-11-15T19:00:00Z"), name: "Lulu's Lounge" };
  const shows = applyWebsiteEventCorrections([baes, lulu, other]);
  assert.deepEqual(shows.map(show => show.id), [baes.id, other.id]);
  assert.equal(shows[0].name, "Baes");
  assert.equal(shows[0].time, "11 PM till late");
  assert.equal(shows[0].guestlistUrl, baes.guestlistUrl);
  assert.equal(baes.name, "Baes — 11PM Till Late");
  assert.equal(baes.time, "11:00 PM — LATE");
  assert.equal(shows[1], other);
});
