import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { events, isEventPublishable } from "@/data/events";
import { eventJsonLd, serializeJsonLd } from "@/lib/structured-data";

type EventPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return events.filter((event) => isEventPublishable(event)).map((event) => ({ id: event.id }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = events.find((item) => item.id === id);

  if (!event || !isEventPublishable(event)) return {};

  const title = `NASH.D at ${event.venue}`;
  const description = `${event.date} at ${event.time} — NASH.D performing at ${event.venue}, ${event.location}.`;
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
  const event = events.find((item) => item.id === id);

  if (!event || !isEventPublishable(event)) notFound();

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
              <h1 id="event-title">{event.venue}</h1>
              <p>{event.day} · {event.time} · {event.location}</p>
            </div>
            <div className="event-actions">
              {event.guestlistUrl && event.guestlistUrl !== "#" ? (
                <a className="button primary" href={event.guestlistUrl}>Join Guestlist</a>
              ) : null}
              {event.ticketUrl && event.ticketUrl !== "#" ? (
                <a className="button secondary" href={event.ticketUrl}>Buy Tickets</a>
              ) : null}
              <Link className="button secondary" href="/#next-show">All events</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
