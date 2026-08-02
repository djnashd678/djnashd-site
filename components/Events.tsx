import type { EventItem } from "@/data/events";

export default function Events({ events }: { events: EventItem[] }) {
  return (
    <section className="section shell">
      <div className="section-title">
        <div><span className="eyebrow">UPCOMING</span><h2>Catch me here</h2></div>
        <p>Tickets, guestlists and venue details for upcoming shows.</p>
      </div>
      <div className="events-row">
        {events.map((event) => (
          <article className="event-card" key={event.id}>
            <span className="event-card-date">{event.date}</span>
            <div><h3>{event.venue}</h3><p>{event.location}</p></div>
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
