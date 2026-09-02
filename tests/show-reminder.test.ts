import assert from "node:assert/strict";
import test from "node:test";
import {
  formatShowReminderMessage,
  handleShowReminderRequest,
  runShowReminder,
  selectQuirkyPhrase,
  type ReminderDeliveryStatus
} from "../lib/show-reminder.ts";
import { sendTelegramChannelMessage } from "../lib/telegram.ts";
import type { EventItem } from "../lib/events/types.ts";

const NOW = new Date("2026-09-02T10:00:00.000Z");
const DATE = "2026-09-02";

function show(overrides: Partial<EventItem> = {}): EventItem {
  return {
    id: "show-kossa",
    name: "Kossa",
    venue: "Kossa",
    location: "Singapore",
    genre: "Hip-Hop / R&B",
    startDate: "2026-09-02T14:00:00.000Z",
    endDate: "2026-09-02T18:00:00.000Z",
    date: "02 SEP 2026",
    day: "Wednesday",
    time: "10:00 PM — LATE",
    featured: false,
    ...overrides
  };
}

async function captureReminder(events: EventItem[]) {
  const messages: string[] = [];
  const result = await runShowReminder(events, async (message): Promise<ReminderDeliveryStatus> => {
    messages.push(message);
    return "sent";
  }, NOW);
  return { messages, result };
}

test("does not call Telegram when there is no show today", async () => {
  const { messages, result } = await captureReminder([
    show({ startDate: "2026-09-03T14:00:00.000Z", endDate: "2026-09-03T18:00:00.000Z" })
  ]);
  assert.equal(result.status, "no-shows");
  assert.equal(result.showCount, 0);
  assert.deepEqual(messages, []);
});

test("formats one overnight event as START — LATE and sends once", async () => {
  const { messages, result } = await captureReminder([show()]);
  assert.equal(result.showCount, 1);
  assert.equal(messages.length, 1);
  assert.match(messages[0], /KOSSA\n10:00 PM — LATE\nHip-Hop \/ R&B/);
});

test("formats a same-day event with its actual start and end times", async () => {
  const { messages } = await captureReminder([
    show({ startDate: "2026-09-02T12:00:00.000Z", endDate: "2026-09-02T15:30:00.000Z" })
  ]);
  assert.match(messages[0], /8:00 PM — 11:30 PM/);
  assert.doesNotMatch(messages[0], /8:00 PM — LATE/);
});

test("combines multiple shows into one chronological message", async () => {
  const later = show({ id: "later", name: "Kossa" });
  const earlier = show({
    id: "earlier",
    name: "Sunset Session",
    venue: "Sunset Session",
    startDate: "2026-09-02T12:00:00.000Z",
    endDate: "2026-09-02T15:00:00.000Z"
  });
  const { messages, result } = await captureReminder([later, earlier]);
  assert.equal(messages.length, 1);
  assert.equal(result.showCount, 2);
  assert.ok(messages[0].indexOf("SUNSET SESSION") < messages[0].indexOf("KOSSA"));
  assert.match(messages[0], /─{10}/);
});

test("includes only the Guestlist CTA for a guestlist-only event", async () => {
  const { messages } = await captureReminder([show({ guestlistUrl: "https://example.com/guestlist" })]);
  assert.match(messages[0], /Guestlist → https:\/\/example\.com\/guestlist/);
  assert.doesNotMatch(messages[0], /Tickets →|Reserve a Table →/);
});

test("includes only the Tickets CTA for a tickets-only event", async () => {
  const { messages } = await captureReminder([show({ ticketUrl: "https://example.com/tickets" })]);
  assert.match(messages[0], /Tickets → https:\/\/example\.com\/tickets/);
  assert.doesNotMatch(messages[0], /Guestlist →|Reserve a Table →/);
});

test("includes only the Reserve a Table CTA for a reservations-only event", async () => {
  const { messages } = await captureReminder([show({ reservationsUrl: "https://example.com/reserve" })]);
  assert.match(messages[0], /Reserve a Table → https:\/\/example\.com\/reserve/);
  assert.doesNotMatch(messages[0], /Guestlist →|Tickets →/);
});

test("does not add an empty CTA section when an event has no CTA", async () => {
  const { messages } = await captureReminder([show()]);
  assert.doesNotMatch(messages[0], /Guestlist →|Tickets →|Reserve a Table →/);
  assert.match(messages[0], /More info → https:\/\/djnashd\.com$/);
});

test("rejects an unauthorized cron request before loading events", async () => {
  let loadCalls = 0;
  const response = await handleShowReminderRequest(new Request("https://example.com/api/cron/show-reminder"), {
    cronSecret: "expected-secret",
    telegramConfigured: true,
    loadEvents: async () => {
      loadCalls += 1;
      return [show()];
    },
    deliver: async () => "sent"
  });
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { ok: false, status: "unauthorized" });
  assert.equal(loadCalls, 0);
});

test("returns a safe Telegram error without leaking the bot token", async () => {
  const token = "test-token-that-must-not-leak";
  const failingFetch: typeof fetch = async () => new Response("failure", { status: 500 });
  await assert.rejects(
    sendTelegramChannelMessage("Test", failingFetch, {
      TELEGRAM_BOT_TOKEN: token,
      TELEGRAM_CHANNEL_ID: "test-channel"
    }),
    (error: Error) => {
      assert.doesNotMatch(error.message, new RegExp(token));
      return true;
    }
  );

  const logged: string[] = [];
  const response = await handleShowReminderRequest(new Request("https://example.com/api/cron/show-reminder", {
    headers: { Authorization: "Bearer expected-secret" }
  }), {
    cronSecret: "expected-secret",
    telegramConfigured: true,
    loadEvents: async () => [show()],
    deliver: async () => { throw new Error(token); },
    now: () => NOW,
    logError: (status) => logged.push(status)
  });
  const body = await response.text();
  assert.equal(response.status, 502);
  assert.doesNotMatch(body, new RegExp(token));
  assert.deepEqual(logged, ["telegram-error"]);
});

test("uses deterministic daily phrases and clean single-event overrides", () => {
  const genericEvent = show();
  const phrase = selectQuirkyPhrase(DATE, [genericEvent]);
  assert.equal(selectQuirkyPhrase(DATE, [genericEvent]), phrase);
  assert.notEqual(selectQuirkyPhrase("2026-09-03", [genericEvent]), phrase);
  assert.equal(selectQuirkyPhrase(DATE, [show({ name: "Astrolab" })]), "Tonight we leave Earth.");
  assert.equal(selectQuirkyPhrase(DATE, [show({ name: "Sunday Reset" })]), "Sunday plans, corrected.");
  assert.equal(selectQuirkyPhrase(DATE, [show({ name: "Astrolab" }), genericEvent]), phrase);
});

test("produces the same complete message for retries on the same Singapore date", () => {
  const events = [show({ ticketUrl: "https://example.com/tickets" })];
  assert.equal(formatShowReminderMessage(events, DATE), formatShowReminderMessage(events, DATE));
});
