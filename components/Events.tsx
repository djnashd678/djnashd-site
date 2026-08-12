import type { EventItem } from "@/lib/events/types";
import { shouldShowSecondaryVenue } from "@/lib/events/display";
import EventCta from "@/components/EventCta";
import Link from "next/link";

export default function Events({ events, anchor = false }: { events: EventItem[]; anchor?: boolean }) {
  return (
    <section className="section shell" id={anchor ? "next-show" : undefined} aria-labelledby="events-title">
      <div className="section-title">
        <div><span className="eyebrow">EVENTS</span><h2 id="events-title">Catch me here</h2></div>
        <p>Event information, guestlists and venue details.</p>
      </div>
      {events.length ? <div className="events-row">
        {events.map((event) => (
          <article className="event-card" key={event.id}>
            <time className="event-card-date" dateTime={event.startDate}>{event.date}</time>
            <div>
              <h3><Link href={`/events/${event.id}`}>{event.name}</Link></h3>
              {shouldShowSecondaryVenue(event.name, event.venue) ? <p className="event-card-venue">{event.venue}</p> : null}
              <p>{event.day} · {event.time}</p>
              <p>{event.genre}</p>
            </div>
            <div className="event-card-footer">
              <span className="event-location">{event.location || event.venue}</span>
              <span className="event-card-actions">
                {event.guestlistUrl ? <EventCta href={event.guestlistUrl} label="Guestlist" /> : null}
                {event.ticketUrl ? <EventCta href={event.ticketUrl} label="Tickets" /> : null}
              </span>
            </div>
          </article>
        ))}
      </div> : <div className="events-empty"><p>New dates coming soon.</p></div>}
    </section>
  );
}
