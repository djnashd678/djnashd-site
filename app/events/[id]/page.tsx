import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCalendarEvents, getUpcomingEvents } from "@/lib/events/calendar";
import { shouldShowSecondaryVenue } from "@/lib/events/display";
import { eventJsonLd, serializeJsonLd } from "@/lib/structured-data";
import EventCta from "@/components/EventCta";

type EventPageProps = {
  params: Promise<{ id: string }>;
};

export const revalidate = 900;

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const events = getUpcomingEvents(await getCalendarEvents());
  const event = events.find((item) => item.id === id);

  if (!event) return {};

  const title = `${event.name} — ${event.venue}`;
  const description = `${event.date} at ${event.time} — NASH.D at ${event.venue}. ${event.genre}.`;
  const url = `/events/${event.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${title} | NASH.D`,
      description,
      images: [{ url: "/hero.jpg", width: 2048, height: 1280, alt: "NASH.D performing in front of a nightclub crowd" }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | NASH.D`,
      description,
      images: ["/hero.jpg"]
    }
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const events = getUpcomingEvents(await getCalendarEvents());
  const event = events.find((item) => item.id === id);

  if (!event) notFound();

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(eventJsonLd(event)) }}
      />
      <section className="section shell" aria-labelledby="event-title">
        <div className="event-pass">
          <div className="event-pass-top">
            <span className="eyebrow">NASH.D EVENT</span>
          </div>
          <div className="event-pass-main">
            <div>
              <time className="event-date" dateTime={event.startDate}>{event.date}</time>
              <h1 id="event-title">{event.name}</h1>
              {shouldShowSecondaryVenue(event.name, event.venue) ? <p className="event-venue">{event.venue}</p> : null}
              <p>{event.day} · {event.time} · {event.genre}</p>
              {event.location ? <p>{event.location}</p> : null}
            </div>
            <div className="event-actions">
              {event.guestlistUrl ? (
                <EventCta className="button primary" href={event.guestlistUrl} label="Join Guestlist" />
              ) : null}
              {event.ticketUrl ? (
                <EventCta className="button secondary" href={event.ticketUrl} label="Buy Tickets" />
              ) : null}
              <Link className="button secondary" href="/#next-show">All events</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
