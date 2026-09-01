import type { EventItem } from "./types.ts";

export function getUpcomingEvents(events: EventItem[], now = new Date()): EventItem[] {
  return events
    .filter((event) =>
      new Date(event.endDate).getTime() > now.getTime()
      && (!event.publishFrom || new Date(event.publishFrom).getTime() <= now.getTime())
    )
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

export function selectFeaturedEvent(events: EventItem[], now = new Date()): EventItem | undefined {
  return selectFeaturedEvents(events, now)[0];
}

export function selectFeaturedEvents(events: EventItem[], now = new Date()): EventItem[] {
  const timestamp = now.getTime();
  return events
    .filter((event) =>
      event.featured
      && (!event.publishFrom || new Date(event.publishFrom).getTime() <= timestamp)
      && (!event.featureFrom || new Date(event.featureFrom).getTime() <= timestamp)
    )
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}
