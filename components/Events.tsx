import { isEventPublishable, type EventItem } from "@/data/events";
import Link from "next/link";

export default function Events({ events }: { events: EventItem[] }) {
  return (
    <section className="section shell" aria-labelledby="events-title">
      <div className="section-title">
        <div><span className="eyebrow">EVENTS</span><h2 id="events-title">Catch me here</h2></div>
        <p>Event information, guestlists and venue details.</p>
      </div>
      <div className="events-row">
        {events.map((event) => (
          <article className="event-card" key={event.id}>
            <time className="event-card-date" dateTime={event.startDate}>{event.date}</time>
            <div>
              <h3>
                {isEventPublishable(event) ? <Link href={`/events/${event.id}`}>{event.venue}</Link> : event.venue}
              </h3>
              <p>{event.location}</p>
            </div>
            <div className="event-card-footer">
              <span>{event.day} · {event.time}</span>
              <a href={event.guestlistUrl || "#"}>Guestlist ↗</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
