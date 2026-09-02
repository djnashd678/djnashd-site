import "server-only";
import { getCalendarEventsStrict } from "@/lib/events/calendar";
import { handleShowReminderRequest, type ReminderDeliveryStatus } from "@/lib/show-reminder";
import { hasTelegramConfiguration, sendTelegramChannelMessage } from "@/lib/telegram";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const deliveredDates = new Set<string>();
const deliveriesInFlight = new Map<string, Promise<void>>();

async function deliverOnce(message: string, date: string): Promise<ReminderDeliveryStatus> {
  if (deliveredDates.has(date)) return "already-sent";

  const existingDelivery = deliveriesInFlight.get(date);
  if (existingDelivery) {
    await existingDelivery;
    return "already-sent";
  }

  const delivery = sendTelegramChannelMessage(message).then(() => {
    deliveredDates.add(date);
  });
  deliveriesInFlight.set(date, delivery);

  try {
    await delivery;
    return "sent";
  } finally {
    deliveriesInFlight.delete(date);
  }
}

export async function GET(request: Request): Promise<Response> {
  return handleShowReminderRequest(request, {
    cronSecret: process.env.CRON_SECRET,
    telegramConfigured: hasTelegramConfiguration(),
    loadEvents: getCalendarEventsStrict,
    deliver: deliverOnce,
    logError: (status) => console.error(`[show-reminder] ${status}`)
  });
}
