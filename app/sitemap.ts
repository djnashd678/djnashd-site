import type { MetadataRoute } from "next";
import { getCalendarEvents, getUpcomingEvents } from "@/lib/events/calendar";

const siteUrl = "https://djnashd.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = getUpcomingEvents(await getCalendarEvents());
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1
    },
    ...events.map((event) => ({
      url: `${siteUrl}/events/${event.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
