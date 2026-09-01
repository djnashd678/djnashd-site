import type { EventItem } from "@/lib/events/types";
import EventCta from "@/components/EventCta";

export default function EventActions({ event, compact = false }: { event: EventItem; compact?: boolean }) {
  const primary = compact ? "" : "button primary";
  const secondary = compact ? "" : "button secondary";

  return (
    <>
      {event.ticketUrl ? <EventCta className={primary} href={event.ticketUrl} label={compact ? "Tickets" : "Buy Tickets"} /> : null}
      {event.guestlistUrl ? <EventCta className={event.ticketUrl ? secondary : primary} href={event.guestlistUrl} label={compact ? "Guestlist" : "Join Guestlist"} /> : null}
      {event.reservationsUrl ? <EventCta className={event.ticketUrl || event.guestlistUrl ? secondary : primary} href={event.reservationsUrl} label="Reserve a Table" /> : null}
    </>
  );
}
