import type { EventItem } from "./types.ts";

export function getUpcomingEvents(events: EventItem[], now = new Date()): EventItem[] {
  return events
    .filter((event) => new Date(event.endDate).getTime() > now.getTime())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

export function selectFeaturedEvent(events: EventItem[], now = new Date()): EventItem | undefined {
  const timestamp = now.getTime();
  return events.find((event) =>
    event.featured && (!event.featureFrom || new Date(event.featureFrom).getTime() <= timestamp)
  );
}
