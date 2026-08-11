export type EventItem = {
  id: string;
  name: string;
  venue: string;
  location: string;
  genre: string;
  startDate: string;
  endDate: string;
  date: string;
  day: string;
  time: string;
  ticketUrl?: string;
  guestlistUrl?: string;
  featured: boolean;
  featureFrom?: string;
};

export type EventMetadata = {
  venue: string;
  genre: string;
  ticketUrl?: string;
  guestlistUrl?: string;
  featured: boolean;
  featureFrom?: string;
};
