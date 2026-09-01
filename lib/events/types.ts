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
  reservationsUrl?: string;
  featured: boolean;
  featureFrom?: string;
  publishFrom?: string;
  image?: string;
  imageMobile?: string;
};

export type EventMetadata = {
  venue: string;
  genre: string;
  ticketUrl?: string;
  guestlistUrl?: string;
  reservationsUrl?: string;
  featured: boolean;
  featureFrom?: string;
  publishFrom?: string;
  image?: string;
  imageMobile?: string;
};
