import Hero from "@/components/Hero";
import NextShow from "@/components/NextShow";
import Events from "@/components/Events";
import Follow from "@/components/Follow";
import Bookings from "@/components/Bookings";
import Listen from "@/components/Listen";
import Footer from "@/components/Footer";
import { getCalendarEvents, getUpcomingEvents, selectFeaturedEvent } from "@/lib/events/calendar";
import { artistWebsiteJsonLd, serializeJsonLd } from "@/lib/structured-data";

export default async function Home() {
  const events = getUpcomingEvents(await getCalendarEvents());
  const featuredEvent = selectFeaturedEvent(events);
  const remainingEvents = featuredEvent ? events.filter((event) => event.id !== featuredEvent.id) : events;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(artistWebsiteJsonLd) }}
      />
      <main>
        <Hero />
        {featuredEvent ? <NextShow event={featuredEvent} /> : null}
        <Events events={remainingEvents} anchor={!featuredEvent} />
        <Follow />
        <Bookings />
        <Listen />
      </main>
      <Footer />
    </>
  );
}
