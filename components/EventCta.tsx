type EventCtaProps = {
  href: string;
  label: string;
  className?: string;
};

export default function EventCta({ href, label, className = "" }: EventCtaProps) {
  return (
    <a className={`event-cta ${className}`.trim()} href={href}>
      <span>{label}</span>
      <span className="event-cta-arrow" aria-hidden="true">{"\u2197\uFE0E"}</span>
    </a>
  );
}
