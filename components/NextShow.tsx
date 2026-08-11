import { CalendarDays, Clock3, MapPin } from "lucide-react";
import type { EventItem } from "@/lib/events/types";
import Link from "next/link";

export default function NextShow({ event }: { event: EventItem }) {
  return (
    <section className="section shell" id="next-show" aria-labelledby="next-show-title">
      <div className="event-pass">
        <div className="event-pass-top">
          <span className="eyebrow">FEATURED EVENT</span>
          <span className="live-dot">FEATURED</span>
        </div>
        <div className="event-pass-main">
          <div>
            <time className="event-date" dateTime={event.startDate}>{event.date}</time>
            <h2 id="next-show-title"><Link href={`/events/${event.id}`}>{event.name}</Link></h2>
            <p className="event-venue">{event.venue}</p>
            <div className="event-meta">
              <span><CalendarDays size={17} /> {event.day}</span>
              <span><Clock3 size={17} /> {event.time}</span>
              <span>{event.genre}</span>
              {event.location ? <span><MapPin size={17} /> {event.location}</span> : null}
            </div>
          </div>
          <div className="event-actions">
            {event.guestlistUrl ? <a className="button primary" href={event.guestlistUrl}>Join Guestlist</a> : null}
            {event.ticketUrl ? <a className="button secondary" href={event.ticketUrl}>Buy Tickets</a> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
