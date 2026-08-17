import { ArrowUpRight } from "lucide-react";

export default function Bookings() {
  return (
    <section className="section shell" id="book">
      <div className="booking-card">
        <div>
          <span className="eyebrow">WORK WITH ME</span>
          <h2>Bring the right energy to your event.</h2>
          <p>
            NASH.D is a Singapore-based DJ and performing artist known for high-energy, genre-fluid
            sets spanning hip-hop, R&amp;B and electronic music. From clubs and festivals to private
            events and brand experiences, no two NASH.D sets are ever quite the same. Bookings also
            include corporate functions and private celebrations.
          </p>
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
