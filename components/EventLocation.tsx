import { googleMapsUrl } from "@/lib/events/display";

export default function EventLocation({ location, fallback, label }: { location: string; fallback?: string; label?: string }) {
  const visibleLabel = label || location || fallback;
  if (!visibleLabel) return null;
  if (!location) return <span className="event-location">{visibleLabel}</span>;

  return (
    <a className="event-location" href={googleMapsUrl(location)} target="_blank" rel="noopener noreferrer">
      {visibleLabel}
    </a>
  );
}
