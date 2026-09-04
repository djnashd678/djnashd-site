import assert from "node:assert/strict";
import test from "node:test";
import {
  formatShowReminderMessage,
  handleShowReminderRequest,
  runShowReminder,
  selectQuirkyPhrase,
  type ReminderDeliveryStatus
} from "../lib/show-reminder.ts";
import { sendTelegramChannelMessage, type TelegramMessage } from "../lib/telegram.ts";
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
  const messages: TelegramMessage[] = [];
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
  assert.match(messages[0].text, /KOSSA\n10:00 PM — LATE\nHip-Hop \/ R&amp;B/);
});

test("formats a same-day event with its actual start and end times", async () => {
  const { messages } = await captureReminder([
    show({ startDate: "2026-09-02T12:00:00.000Z", endDate: "2026-09-02T15:30:00.000Z" })
  ]);
  assert.match(messages[0].text, /8:00 PM — 11:30 PM/);
  assert.doesNotMatch(messages[0].text, /8:00 PM — LATE/);
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
  assert.ok(messages[0].text.indexOf("SUNSET SESSION") < messages[0].text.indexOf("KOSSA"));
  assert.match(messages[0].text, /─{10}/);
});

test("puts an unchanged Google Form URL only in the guestlist button", async () => {
  const url = "https://docs.google.com/forms/d/e/example/viewform?usp=sharing&entry.123=R%26B";
  const { messages } = await captureReminder([show({ guestlistUrl: url })]);
  assert.ok(!messages[0].text.includes(url));
  assert.doesNotMatch(messages[0].text, /docs\.google\.com|Guestlist →/);
  assert.deepEqual(messages[0].reply_markup, {
    inline_keyboard: [[{ text: "JOIN GUESTLIST", url }]]
  });
});

test("puts a ticket URL only in the BUY TICKETS button", async () => {
  const url = "https://example.com/tickets?show=baes&source=telegram";
  const { messages } = await captureReminder([show({ ticketUrl: url })]);
  assert.ok(!messages[0].text.includes(url));
  assert.deepEqual(messages[0].reply_markup, {
    inline_keyboard: [[{ text: "BUY TICKETS", url }]]
  });
});

test("puts a reservation URL only in the RESERVE A TABLE button", async () => {
  const url = "https://example.com/reserve";
  const { messages } = await captureReminder([show({ reservationsUrl: url })]);
  assert.ok(!messages[0].text.includes(url));
  assert.deepEqual(messages[0].reply_markup, {
    inline_keyboard: [[{ text: "RESERVE A TABLE", url }]]
  });
});

test("puts guestlist and tickets together in one row", async () => {
  const guestlistUrl = "https://example.com/guestlist";
  const ticketUrl = "https://example.com/tickets";
  const { messages } = await captureReminder([show({ guestlistUrl, ticketUrl })]);
  assert.ok(!messages[0].text.includes(guestlistUrl));
  assert.ok(!messages[0].text.includes(ticketUrl));
  assert.deepEqual(messages[0].reply_markup, {
    inline_keyboard: [[{ text: "GUESTLIST", url: guestlistUrl }, { text: "TICKETS", url: ticketUrl }]]
  });
});

test("omits the keyboard when an event has no CTA", async () => {
  const { messages } = await captureReminder([show()]);
  assert.equal(messages[0].reply_markup, undefined);
  assert.doesNotMatch(messages[0].text, /Guestlist →|Tickets →|Reserve a Table →/);
});

test("ends with a clean HTML More info link", () => {
  const message = formatShowReminderMessage([show()], DATE);
  assert.ok(message.text.endsWith('More info → <a href="https://djnashd.com">djnashd.com</a>'));
  assert.doesNotMatch(message.text, /More info → https:/);
});

test("escapes dynamic HTML text while keeping keyboard labels as plain text", () => {
  const event = show({
    name: 'Baes & <Friends> "Live"',
    venue: '<b>Venue & Friends</b>',
    genre: 'R&B <House> > Pop',
    guestlistUrl: 'https://example.com/guestlist?a=1&b=2'
  });
  const message = formatShowReminderMessage([event, show()], DATE);
  assert.ok(message.text.includes('BAES &amp; &lt;FRIENDS&gt; "LIVE"'));
  assert.ok(message.text.includes('R&amp;B &lt;House&gt; &gt; Pop'));
  assert.doesNotMatch(message.text, /<Friends>|<House>|<b>|<\/b>/i);
  assert.deepEqual(message.reply_markup?.inline_keyboard, [[{
    text: 'BAES & <FRIENDS> "LIVE" · GUESTLIST', url: event.guestlistUrl
  }]]);
});

test("associates multi-show buttons with named events in chronological order, skipping empty rows", async () => {
  const later = show({ name: "Baes", guestlistUrl: "https://example.com/baes/guestlist", ticketUrl: "https://example.com/baes/tickets" });
  const earlier = show({
    id: "earlier", name: "Sunset Session", reservationsUrl: "https://example.com/sunset/reserve",
    startDate: "2026-09-02T12:00:00.000Z", endDate: "2026-09-02T15:00:00.000Z"
  });
  const noCta = show({ id: "no-cta", name: "Open Decks", startDate: "2026-09-02T13:00:00.000Z" });
  const { messages } = await captureReminder([later, noCta, earlier]);
  assert.equal(messages.length, 1);
  assert.deepEqual(messages[0].reply_markup?.inline_keyboard, [
    [{ text: "SUNSET SESSION · RESERVE A TABLE", url: earlier.reservationsUrl }],
    [{ text: "BAES · GUESTLIST", url: later.guestlistUrl }, { text: "BAES · TICKETS", url: later.ticketUrl }]
  ]);
  assert.ok(messages[0].text.indexOf("SUNSET SESSION") < messages[0].text.indexOf("OPEN DECKS"));
  assert.ok(messages[0].text.indexOf("OPEN DECKS") < messages[0].text.indexOf("BAES"));
  assert.doesNotMatch(messages[0].text, /example\.com/);
});

test("sends HTML and the inline keyboard to the configured channel with previews enabled by default", async () => {
  const message = formatShowReminderMessage([show({ guestlistUrl: "https://example.com/guestlist" })], DATE);
  let calls = 0;
  const captureFetch: typeof fetch = async (url, init) => {
    calls += 1;
    assert.equal(url, "https://api.telegram.org/bottest-token/sendMessage");
    assert.equal(init?.method, "POST");
    assert.deepEqual(JSON.parse(String(init?.body)), {
      chat_id: "test-channel", text: message.text, parse_mode: "HTML", reply_markup: message.reply_markup
    });
    return new Response('{"ok":true}', { status: 200 });
  };
  await sendTelegramChannelMessage(message, captureFetch, {
    TELEGRAM_BOT_TOKEN: " test-token ", TELEGRAM_CHANNEL_ID: " test-channel "
  });
  assert.equal(calls, 1);
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
    sendTelegramChannelMessage({ text: "Test" }, failingFetch, {
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
  assert.deepEqual(formatShowReminderMessage(events, DATE), formatShowReminderMessage(events, DATE));
});
