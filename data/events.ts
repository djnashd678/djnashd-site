export type EventItem = {
  id: string;
  date: string;
  day: string;
  venue: string;
  location: string;
  time: string;
  ticketUrl?: string;
  guestlistUrl?: string;
  featured?: boolean;
};

export const events: EventItem[] = [
  {
    id: "another-bar-aug-1",
    date: "01 AUG 2026",
    day: "Saturday",
    venue: "Another Bar",
    location: "Singapore",
    time: "10 PM",
    ticketUrl: "#",
    guestlistUrl: "#",
    featured: true
  },
  {
    id: "marquee-ftw-aug-5",
    date: "05 AUG 2026",
    day: "Wednesday",
    venue: "Marquee — FTW",
    location: "Marina Bay Sands",
    time: "10 PM",
    ticketUrl: "#",
    guestlistUrl: "#"
  },
  {
    id: "lulus-aug-8",
    date: "08 AUG 2026",
    day: "Saturday",
    venue: "Lulu's Lounge",
    location: "Singapore",
    time: "10 PM",
    ticketUrl: "#",
    guestlistUrl: "#"
  }
];
