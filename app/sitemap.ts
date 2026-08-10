import type { MetadataRoute } from "next";
import { events, isEventPublishable } from "@/data/events";

const siteUrl = "https://djnashd.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1
    },
    ...events.filter((event) => isEventPublishable(event)).map((event) => ({
      url: `${siteUrl}/events/${event.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
