import Hero from "@/components/Hero";
import NextShow from "@/components/NextShow";
import Events from "@/components/Events";
import Follow from "@/components/Follow";
import Bookings from "@/components/Bookings";
import Footer from "@/components/Footer";
import { getCalendarEvents, getUpcomingEvents, selectFeaturedEvents } from "@/lib/events/calendar";
import { artistWebsiteJsonLd, serializeJsonLd } from "@/lib/structured-data";

export default async function Home() {
  const events = getUpcomingEvents(await getCalendarEvents());
  const featuredEvents = selectFeaturedEvents(events);
  const featuredIds = new Set(featuredEvents.map((event) => event.id));
  const remainingEvents = events.filter((event) => !featuredIds.has(event.id));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(artistWebsiteJsonLd) }}
      />
      <main>
        <Hero />
        {featuredEvents.length ? <NextShow events={featuredEvents} /> : null}
        <Events events={remainingEvents} anchor={!featuredEvents.length} />
        <Follow />
        <Bookings />
      </main>
      <Footer />
    </>
  );
}
