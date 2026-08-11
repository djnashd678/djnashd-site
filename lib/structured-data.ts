import type { EventItem } from "@/lib/events/types";

const siteUrl = "https://djnashd.com";
const artistId = `${siteUrl}/#artist`;

export const artistWebsiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": artistId,
      name: "NASH.D",
      url: siteUrl,
      image: `${siteUrl}/hero.jpg`,
      jobTitle: "DJ and performing artist",
      homeLocation: {
        "@type": "Place",
        name: "Singapore"
      },
      sameAs: ["https://instagram.com/djnashd"]
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "NASH.D",
      description: "Official website of Singapore-based DJ and performing artist NASH.D.",
      publisher: { "@id": artistId },
      inLanguage: "en"
    }
  ]
};

export function eventJsonLd(event: EventItem) {
  const eventUrl = `${siteUrl}/events/${event.id}`;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${eventUrl}/#event`,
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue,
      address: event.location
    },
    performer: { "@id": artistId },
    keywords: event.genre,
    url: eventUrl,
    image: `${siteUrl}/hero.jpg`,
    ...(event.ticketUrl ? { offers: { "@type": "Offer", url: event.ticketUrl } } : {})
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
