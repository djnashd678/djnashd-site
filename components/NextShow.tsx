import { CalendarDays, Clock3, MapPin } from "lucide-react";
import type { EventItem } from "@/lib/events/types";
import { shouldShowSecondaryVenue } from "@/lib/events/display";
import EventActions from "@/components/EventActions";
import EventLocation from "@/components/EventLocation";
import Link from "next/link";

// Local artwork is keyed by the stable calendar event ID; dates and CTAs stay calendar-owned.
const octoberArtwork: Record<string, { src: string; width: number; height: number }> = {
  "show-0061242eeab89e3078cb": { src: "/events/2026-10-anyma.webp", width: 604, height: 603 },
  "show-f15c637b6ee5ac4f02c1": { src: "/events/2026-10-astrolab-square.webp", width: 1000, height: 1000 }
};

export default function NextShow({ events }: { events: EventItem[] }) {
  return (
    <section className="section shell featured-shows" id="next-show" aria-labelledby="featured-shows-title">
      <div className="featured-shows-heading">
        <h2 className="eyebrow" id="featured-shows-title">FEATURED SHOWS</h2>
      </div>
      <div className="featured-shows-track">
        {events.map((event, index) => {
          const artwork = octoberArtwork[event.id];
          const image = artwork?.src || event.image;
          return (
            <article className="featured-show-card" key={event.id} aria-labelledby={`featured-show-title-${event.id}`}>
              <div className="featured-show-card-top">
                <span className="live-dot">FEATURED</span>
                <span className="featured-show-count" aria-label={`Featured show ${index + 1} of ${events.length}`}>{index + 1} / {events.length}</span>
              </div>
              {image ? (
                <picture className={`featured-event-artwork${artwork ? " featured-event-artwork-full" : ""}`}>
                  <source media="(max-width: 760px)" srcSet={artwork?.src || event.imageMobile || image} />
                  <img src={image} width={artwork?.width} height={artwork?.height} alt={`${event.name} event artwork`} />
                </picture>
              ) : null}
              <div className="featured-show-content">
                <div>
                  <time className="event-date" dateTime={event.startDate}>{event.date}</time>
                  <h3 id={`featured-show-title-${event.id}`}><Link href={`/events/${event.id}`}>{event.name}</Link></h3>
                  <div className="featured-show-venue-row">
                    {shouldShowSecondaryVenue(event.name, event.venue) ? <p className="event-venue">{event.venue}</p> : null}
                  </div>
                  <div className="featured-show-meta">
                    <span><CalendarDays size={17} /> {event.day}</span>
                    <span><Clock3 size={17} /> {event.time}</span>
                    <span className="featured-show-genre">{event.genre}</span>
                  </div>
                  {event.location ? <div className="featured-show-address"><MapPin size={17} /><EventLocation location={event.location} /></div> : null}
                </div>
                {event.admission === "free" || event.ticketUrl || event.guestlistUrl || event.reservationsUrl ? (
                  <div className="event-actions"><EventActions event={event} /></div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
