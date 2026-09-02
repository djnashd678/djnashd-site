import { formatEventTimeRange } from "./events/display.ts";
import { getUpcomingEvents } from "./events/selection.ts";
import type { EventItem } from "./events/types.ts";

const WEBSITE_URL = "https://djnashd.com";
const GENERIC_PHRASES = [
  "Another excuse to leave the house.",
  "Sleep is a tomorrow problem.",
  "I have been summoned.",
  "You know where to find me.",
  "Your plans have been updated.",
  "See you on the other side of midnight.",
  "Same DJ. Different bad decisions.",
  "Tonight seems like a good idea.",
  "We can sleep after.",
  "Consider this your warning."
] as const;

const EVENT_PHRASE_OVERRIDES = [
  { pattern: /\bastrolab\b/i, phrase: "Tonight we leave Earth." },
  { pattern: /\bsunday\s+reset\b/i, phrase: "Sunday plans, corrected." }
] as const;

const singaporeDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Singapore",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

export type ReminderDeliveryStatus = "sent" | "already-sent";

export type ShowReminderResult = {
  status: "no-shows" | ReminderDeliveryStatus;
  showCount: number;
  date: string;
  message?: string;
};

export type ShowReminderHandlerDependencies = {
  cronSecret?: string;
  telegramConfigured: boolean;
  loadEvents: () => Promise<EventItem[]>;
  deliver: (message: string, date: string) => Promise<ReminderDeliveryStatus>;
  now?: () => Date;
  logError?: (status: "calendar-error" | "telegram-error" | "configuration-error") => void;
};

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Type": "application/json; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    }
  });
}

export function singaporeDateKey(date: Date): string {
  const parts = singaporeDateFormatter.formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function selectTodaysShows(events: EventItem[], now = new Date()): EventItem[] {
  const today = singaporeDateKey(now);
  return getUpcomingEvents(events, now).filter((event) => singaporeDateKey(new Date(event.startDate)) === today);
}

export function selectQuirkyPhrase(date: string, events: EventItem[]): string {
  if (events.length === 1) {
    const eventConcept = `${events[0].name}\n${events[0].venue}`;
    const override = EVENT_PHRASE_OVERRIDES.find(({ pattern }) => pattern.test(eventConcept));
    if (override) return override.phrase;
  }

  const [year, month, day] = date.split("-").map(Number);
  const dayNumber = Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
  const index = ((dayNumber % GENERIC_PHRASES.length) + GENERIC_PHRASES.length) % GENERIC_PHRASES.length;
  return GENERIC_PHRASES[index];
}

function formatShow(event: EventItem): string {
  const ctas = [
    event.guestlistUrl ? `Guestlist \u2192 ${event.guestlistUrl}` : undefined,
    event.ticketUrl ? `Tickets \u2192 ${event.ticketUrl}` : undefined,
    event.reservationsUrl ? `Reserve a Table \u2192 ${event.reservationsUrl}` : undefined
  ].filter((line): line is string => Boolean(line));

  const details = [
    event.name.trim().toLocaleUpperCase("en-SG"),
    formatEventTimeRange(new Date(event.startDate), new Date(event.endDate)),
    event.genre.trim()
  ].join("\n");

  return ctas.length ? `${details}\n\n${ctas.join("\n")}` : details;
}

export function formatShowReminderMessage(events: EventItem[], date: string): string {
  const phrase = selectQuirkyPhrase(date, events);
  const shows = events.map(formatShow).join("\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n");
  return `TONIGHT \ud83d\ude80\n${phrase}\n\n${shows}\n\nMore info \u2192 ${WEBSITE_URL}`;
}

export async function runShowReminder(
  events: EventItem[],
  deliver: (message: string, date: string) => Promise<ReminderDeliveryStatus>,
  now = new Date()
): Promise<ShowReminderResult> {
  const date = singaporeDateKey(now);
  const shows = selectTodaysShows(events, now);
  if (!shows.length) return { status: "no-shows", showCount: 0, date };

  const message = formatShowReminderMessage(shows, date);
  const status = await deliver(message, date);
  return { status, showCount: shows.length, date, message };
}

export async function handleShowReminderRequest(
  request: Pick<Request, "headers">,
  dependencies: ShowReminderHandlerDependencies
): Promise<Response> {
  const authorization = request.headers.get("authorization");
  if (!dependencies.cronSecret || authorization !== `Bearer ${dependencies.cronSecret}`) {
    return jsonResponse({ ok: false, status: "unauthorized" }, 401);
  }

  if (!dependencies.telegramConfigured) {
    dependencies.logError?.("configuration-error");
    return jsonResponse({ ok: false, status: "configuration-error" }, 503);
  }

  let events: EventItem[];
  try {
    events = await dependencies.loadEvents();
  } catch {
    dependencies.logError?.("calendar-error");
    return jsonResponse({ ok: false, status: "calendar-error" }, 502);
  }

  try {
    const result = await runShowReminder(events, dependencies.deliver, dependencies.now?.() ?? new Date());
    return jsonResponse({ ok: true, status: result.status, showCount: result.showCount, date: result.date }, 200);
  } catch {
    dependencies.logError?.("telegram-error");
    return jsonResponse({ ok: false, status: "telegram-error" }, 502);
  }
}
