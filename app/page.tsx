import Hero from "@/components/Hero";
import NextShow from "@/components/NextShow";
import Events from "@/components/Events";
import Follow from "@/components/Follow";
import Bookings from "@/components/Bookings";
import Listen from "@/components/Listen";
import Footer from "@/components/Footer";
import { events } from "@/data/events";

export default function Home() {
  const featuredEvent = events.find((event) => event.featured) ?? events[0];
  const remainingEvents = events.filter((event) => event.id !== featuredEvent.id);

  return (
    <main>
      <Hero />
      <NextShow event={featuredEvent} />
      <Events events={remainingEvents} />
      <Follow />
      <Bookings />
      <Listen />
      <Footer />
    </main>
  );
}
