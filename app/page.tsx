import Hero from "@/components/Hero";
import NextShow from "@/components/NextShow";
import Events from "@/components/Events";
import Follow from "@/components/Follow";
import Bookings from "@/components/Bookings";
import Listen from "@/components/Listen";
import Footer from "@/components/Footer";
import { events } from "@/data/events";
import { artistWebsiteJsonLd, serializeJsonLd } from "@/lib/structured-data";

export default function Home() {
  const featuredEvent = events.find((event) => event.featured) ?? events[0];
  const remainingEvents = events.filter((event) => event.id !== featuredEvent.id);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(artistWebsiteJsonLd) }}
      />
      <main>
        <Hero />
        <NextShow event={featuredEvent} />
        <Events events={remainingEvents} />
        <Follow />
        <Bookings />
        <Listen />
      </main>
      <Footer />
    </>
  );
}
