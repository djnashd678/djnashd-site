import "server-only";
import { unstable_cache } from "next/cache";
import { parseCalendarIcs } from "./ics.ts";
export { getUpcomingEvents, selectFeaturedEvent } from "./selection.ts";
import type { EventItem } from "./types.ts";

const REVALIDATE_SECONDS = 15 * 60;
const FETCH_TIMEOUT_MS = 5_000;

const loadCachedEvents = unstable_cache(
  async (): Promise<EventItem[]> => {
    const calendarUrl = process.env.NASHD_SHOWS_ICS_URL;
    if (!calendarUrl) return [];

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
  ["nashd-shows-calendar-v1"],
  { revalidate: REVALIDATE_SECONDS }
);

export async function getCalendarEvents(): Promise<EventItem[]> {
  try {
    return await loadCachedEvents();
  } catch (error) {
    console.warn("Unable to refresh the NASH.D Shows calendar.", error instanceof Error ? error.message : "Unknown error");
    return [];
  }
}
