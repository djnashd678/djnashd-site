import type { EventItem } from "@/lib/events/types";
import EventActions from "@/components/EventActions";
import EventLocation from "@/components/EventLocation";
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
            <div className="event-card-details">
              <h3><Link href={`/events/${event.id}`}>{event.name}</Link></h3>
              <p className="event-card-time">{event.day} · {event.time}</p>
              <p className="event-card-genre">{event.genre}</p>
            </div>
            <div className="event-card-footer">
              <EventLocation location={event.location} fallback={event.venue} label={event.venue} />
              {event.ticketUrl || event.guestlistUrl || event.reservationsUrl ? (
                <span className="event-card-actions"><EventActions event={event} compact /></span>
              ) : null}
            </div>
          </article>
        ))}
      </div> : <div className="events-empty"><p>New dates coming soon.</p></div>}
    </section>
  );
}
