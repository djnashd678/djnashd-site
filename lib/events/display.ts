export function shouldShowSecondaryVenue(eventName: string, venue: string): boolean {
  return eventName.trim().toLocaleLowerCase() !== venue.trim().toLocaleLowerCase();
}

const singaporeDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Singapore", year: "numeric", month: "2-digit", day: "2-digit"
});

const singaporeTime = new Intl.DateTimeFormat("en-SG", {
  timeZone: "Asia/Singapore", hour: "numeric", minute: "2-digit", hour12: true
});

function formatTime(date: Date): string {
  return singaporeTime.format(date).replace(/\s/g, " ").toUpperCase();
}

export function formatEventTimeRange(start: Date, end: Date): string {
  const endLabel = singaporeDate.format(start) === singaporeDate.format(end) ? formatTime(end) : "LATE";
  return `${formatTime(start)} \u2014 ${endLabel}`;
}

export function googleMapsUrl(location: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}
