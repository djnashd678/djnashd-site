import { CalendarDays, Clock3, MapPin } from "lucide-react";
import type { EventItem } from "@/data/events";

export default function NextShow({ event }: { event: EventItem }) {
  return (
    <section className="section shell" id="next-show">
      <div className="event-pass">
        <div className="event-pass-top">
          <span className="eyebrow">NEXT SHOW</span>
          <span className="live-dot">FEATURED</span>
        </div>
        <div className="event-pass-main">
          <div>
            <p className="event-date">{event.date}</p>
            <h2>{event.venue}</h2>
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
