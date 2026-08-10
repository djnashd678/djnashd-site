export type EventItem = {
  id: string;
  startDate: string;
  date: string;
  day: string;
  venue: string;
  location: string;
  time: string;
  ticketUrl?: string;
  guestlistUrl?: string;
  featured?: boolean;
  placeholder?: boolean;
};

export function isEventPublishable(event: EventItem, now = new Date()) {
  return !event.placeholder && new Date(event.startDate).getTime() > now.getTime();
}

export const events: EventItem[] = [
  {
    id: "another-bar-aug-1",
    startDate: "2026-08-01T22:00:00+08:00",
    date: "01 AUG 2026",
    day: "Saturday",
    venue: "Another Bar",
    location: "Singapore",
    time: "10 PM",
    ticketUrl: "#",
    guestlistUrl: "#",
    featured: true,
    placeholder: true
  },
  {
    id: "marquee-ftw-aug-5",
    startDate: "2026-08-05T22:00:00+08:00",
    date: "05 AUG 2026",
    day: "Wednesday",
    venue: "Marquee — FTW",
    location: "Marina Bay Sands",
    time: "10 PM",
    ticketUrl: "#",
    guestlistUrl: "#",
    placeholder: true
  },
  {
    id: "lulus-aug-8",
    startDate: "2026-08-08T22:00:00+08:00",
    date: "08 AUG 2026",
    day: "Saturday",
    venue: "Lulu's Lounge",
    location: "Singapore",
    time: "10 PM",
    ticketUrl: "#",
    guestlistUrl: "#",
    placeholder: true
  }
];
