import assert from "node:assert/strict";
import test from "node:test";
import { handleManualTelegramPostRequest } from "../lib/telegram-post.ts";
import type { TelegramMessage, TelegramSendResult } from "../lib/telegram.ts";

const SECRET = "expected-secret";

function request(body: string, authorized = true): Request {
  return new Request("https://example.com/api/telegram/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authorized ? { Authorization: `Bearer ${SECRET}` } : {})
    },
    body
  });
}

async function handle(
  body: string,
  deliver: (message: TelegramMessage) => Promise<TelegramSendResult> = async () => ({ messageId: 123 }),
  authorized = true
): Promise<Response> {
  return handleManualTelegramPostRequest(request(body, authorized), {
    cronSecret: SECRET,
    telegramConfigured: true,
    deliver
  });
}

test("rejects an unauthorized request before reading or delivering it", async () => {
  let deliveries = 0;
  const response = await handle(JSON.stringify({ text: "Hello" }), async () => {
    deliveries += 1;
    return {};
  }, false);

  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { ok: false, error: "unauthorized" });
  assert.equal(deliveries, 0);
});

test("sends a valid text-only HTML post and returns the Telegram message ID", async () => {
  let sent: TelegramMessage | undefined;
  const response = await handle(JSON.stringify({ text: "Hello <b>NASH.D</b> & friends" }), async (message) => {
    sent = message;
    return { messageId: 456 };
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, message_id: 456 });
  assert.deepEqual(sent, { text: "Hello <b>NASH.D</b> &amp; friends" });
});

test("constructs one inline-keyboard button in the same row", async () => {
  let sent: TelegramMessage | undefined;
  const response = await handle(JSON.stringify({
    text: "Tickets are live",
    buttons: [{ label: "BUY TICKETS", url: "https://example.com/tickets" }]
  }), async (message) => {
    sent = message;
    return {};
  });

  assert.equal(response.status, 200);
  assert.deepEqual(sent?.reply_markup, {
    inline_keyboard: [[{ text: "BUY TICKETS", url: "https://example.com/tickets" }]]
  });
});

test("constructs multiple buttons together in one inline-keyboard row", async () => {
  let sent: TelegramMessage | undefined;
  const buttons = [
    { label: "GUESTLIST", url: "https://example.com/guestlist" },
    { label: "TICKETS", url: "http://example.com/tickets" },
    { label: "INFO", url: "https://example.com/info" }
  ];
  const response = await handle(JSON.stringify({ text: "Choose an option", buttons }), async (message) => {
    sent = message;
    return {};
  });

  assert.equal(response.status, 200);
  assert.deepEqual(sent?.reply_markup?.inline_keyboard, [[
    { text: "GUESTLIST", url: buttons[0].url },
    { text: "TICKETS", url: buttons[1].url },
    { text: "INFO", url: buttons[2].url }
  ]]);
});

test("rejects a button URL that is not HTTP or HTTPS", async () => {
  const response = await handle(JSON.stringify({
    text: "Unsafe link",
    buttons: [{ label: "OPEN", url: "javascript:alert(1)" }]
  }));

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: "invalid_request",
    message: "button URLs must be valid http:// or https:// URLs"
  });
});

test("rejects more than four buttons", async () => {
  const response = await handle(JSON.stringify({
    text: "Too many",
    buttons: Array.from({ length: 5 }, (_, index) => ({
      label: `BUTTON ${index + 1}`,
      url: `https://example.com/${index + 1}`
    }))
  }));

  assert.equal(response.status, 400);
  assert.match((await response.json()).message, /at most 4/);
});

test("rejects empty text", async () => {
  const response = await handle(JSON.stringify({ text: "  \n  " }));
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: "invalid_request",
    message: "text must not be empty"
  });
});

test("rejects malformed JSON", async () => {
  const response = await handle('{"text":');
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { ok: false, error: "invalid_json" });
});

test("rejects malformed Telegram HTML before delivery", async () => {
  let deliveries = 0;
  const response = await handle(JSON.stringify({ text: "Hello <b>world" }), async () => {
    deliveries += 1;
    return {};
  });

  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, "invalid_request");
  assert.equal(deliveries, 0);
});

test("returns a safe error when Telegram delivery fails", async () => {
  const logged: string[] = [];
  const response = await handleManualTelegramPostRequest(request(JSON.stringify({ text: "Hello" })), {
    cronSecret: SECRET,
    telegramConfigured: true,
    deliver: async () => { throw new Error("sensitive Telegram response"); },
    logError: (status) => logged.push(status)
  });

  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { ok: false, error: "telegram_error" });
  assert.deepEqual(logged, ["telegram-error"]);
});
