import { CalendarDays, Clock3, MapPin } from "lucide-react";
import type { EventItem } from "@/lib/events/types";
import { shouldShowSecondaryVenue } from "@/lib/events/display";
import EventCta from "@/components/EventCta";
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
            {shouldShowSecondaryVenue(event.name, event.venue) ? <p className="event-venue">{event.venue}</p> : null}
            <div className="event-meta">
              <span><CalendarDays size={17} /> {event.day}</span>
              <span><Clock3 size={17} /> {event.time}</span>
              <span>{event.genre}</span>
              {event.location ? <span><MapPin size={17} /> {event.location}</span> : null}
            </div>
          </div>
          <div className="event-actions">
            {event.guestlistUrl ? <EventCta className="button primary" href={event.guestlistUrl} label="Join Guestlist" /> : null}
            {event.ticketUrl ? <EventCta className="button secondary" href={event.ticketUrl} label="Buy Tickets" /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
