import "server-only";
import { unstable_cache } from "next/cache";
import { applyWebsiteEventCorrections } from "./website.ts";
import { parseCalendarIcs } from "./ics.ts";
export { getUpcomingEvents, selectFeaturedEvent, selectFeaturedEvents } from "./selection.ts";
import type { EventItem } from "./types.ts";

const REVALIDATE_SECONDS = 15 * 60;
const FETCH_TIMEOUT_MS = 5_000;

const loadCachedEvents = unstable_cache(
  async (calendarUrl: string): Promise<EventItem[]> => {

    const url = new URL(calendarUrl);
    if (url.protocol !== "https:") throw new Error("Calendar URL must use HTTPS");

    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { Accept: "text/calendar" }
    });
    if (!response.ok) throw new Error(`Calendar request failed with status ${response.status}`);
    return parseCalendarIcs(await response.text());
  },
  ["nashd-shows-calendar-v4"],
  { revalidate: REVALIDATE_SECONDS }
);

export async function getCalendarEvents(): Promise<EventItem[]> {
  const publicFeed = "https://calendar.google.com/calendar/ical/5e1935f84a5e721272576df9982ca333495823831936481c80d3a631234ec36d%40group.calendar.google.com/public/basic.ics";
  try {
    if (process.env.NASHD_SHOWS_ICS_URL) {
      try {
        const configured = await getCalendarEventsStrict();
        if (configured.some(event => Date.parse(event.endDate) > Date.now())) {
          return applyWebsiteEventCorrections(configured);
        }
      } catch {
        console.warn("Using the public NASH.D Shows feed for the website.");
      }
    }
    return applyWebsiteEventCorrections(await loadCachedEvents(publicFeed));
  } catch (error) {
    console.warn("Unable to refresh the NASH.D Shows calendar.", error instanceof Error ? error.message : "Unknown error");
    return [];
  }
}

export async function getCalendarEventsStrict(): Promise<EventItem[]> {
  if (!process.env.NASHD_SHOWS_ICS_URL) throw new Error("NASH.D Shows calendar is not configured");
  return loadCachedEvents(process.env.NASHD_SHOWS_ICS_URL);
}
