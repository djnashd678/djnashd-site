import { ArrowUpRight } from "lucide-react";

export default function Bookings() {
  return (
    <section className="section shell">
      <div className="booking-card">
        <div>
          <span className="eyebrow">WORK WITH ME</span>
          <h2>Bring the right energy to your event.</h2>
          <p>Clubs, festivals, brand events, corporate functions and private celebrations.</p>
        </div>
        <a
          className="button light"
          href="mailto:hello@djnashd.com?subject=Booking%20Enquiry%20%E2%80%94%20NASH.D"
        >
          Book NASH.D <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}
