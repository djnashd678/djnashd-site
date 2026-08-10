import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { isEventPublishable, type EventItem } from "@/data/events";
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
            <h2 id="next-show-title">
              {isEventPublishable(event) ? <Link href={`/events/${event.id}`}>{event.venue}</Link> : event.venue}
            </h2>
            <div className="event-meta">
              <span><CalendarDays size={17} /> {event.day}</span>
              <span><Clock3 size={17} /> {event.time}</span>
              <span><MapPin size={17} /> {event.location}</span>
            </div>
          </div>
          <div className="event-actions">
            <a className="button primary" href={event.guestlistUrl || "#"}>Join Guestlist</a>
            <a className="button secondary" href={event.ticketUrl || "#"}>Buy Tickets</a>
          </div>
        </div>
      </div>
    </section>
  );
}
