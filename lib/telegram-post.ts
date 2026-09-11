import type { TelegramMessage, TelegramSendResult } from "./telegram.ts";

const MAX_BODY_BYTES = 32_768;
const MAX_MESSAGE_LENGTH = 4_096;
const MAX_BUTTONS = 4;
const MAX_BUTTON_LABEL_LENGTH = 128;
const MAX_URL_LENGTH = 2_048;
const SIMPLE_HTML_TAGS = new Set([
  "b", "strong", "i", "em", "u", "ins", "s", "strike", "del", "code", "pre", "tg-spoiler"
]);

type ManualPostDependencies = {
  cronSecret?: string;
  telegramConfigured: boolean;
  deliver: (message: TelegramMessage) => Promise<TelegramSendResult>;
  logError?: (status: "telegram-error" | "configuration-error") => void;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isHttpUrl(value: string): boolean {
  if (!value || value.length > MAX_URL_LENGTH || /[\s\u0000-\u001f\u007f]/.test(value)) return false;
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function isValidOpeningTag(name: string, attributes: string): boolean {
  if (SIMPLE_HTML_TAGS.has(name)) return !attributes.trim();
  if (name === "a") {
    const href = attributes.match(/^\s+href\s*=\s*(["'])(.*?)\1\s*$/i)?.[2];
    return href !== undefined && isHttpUrl(href);
  }
  if (name === "span") return /^\s+class\s*=\s*(["'])tg-spoiler\1\s*$/i.test(attributes);
  if (name === "blockquote") return /^(?:\s+expandable\s*)?$/.test(attributes);
  return false;
}

function normalizeTelegramHtml(value: string): string | null {
  // Telegram HTML requires bare ampersands to be escaped. This keeps ordinary copy such as "R&B" usable.
  const normalized = value.replace(/&(?!(?:amp|lt|gt|quot);)/g, "&amp;");
  const tags = /<(\/?)([a-z][\w-]*)([^<>]*)>/gi;
  const openTags: string[] = [];
  let position = 0;

  for (let match = tags.exec(normalized); match; match = tags.exec(normalized)) {
    if (/[<>]/.test(normalized.slice(position, match.index))) return null;

    const closing = Boolean(match[1]);
    const name = match[2].toLowerCase();
    const attributes = match[3];
    if (closing) {
      if (attributes.trim() || openTags.at(-1) !== name) return null;
      openTags.pop();
    } else {
      if (!isValidOpeningTag(name, attributes)) return null;
      openTags.push(name);
    }
    position = match.index + match[0].length;
  }

  if (openTags.length || /[<>]/.test(normalized.slice(position))) return null;
  const visibleText = normalized
    .replace(/<\/?[a-z][\w-]*[^<>]*>/gi, "")
    .replace(/&(amp|lt|gt|quot);/g, "x");
  if (!visibleText.length || visibleText.length > MAX_MESSAGE_LENGTH) return null;
  return normalized;
}

function validatePayload(payload: unknown):
  | { ok: true; message: TelegramMessage }
  | { ok: false; message: string } {
  if (!isRecord(payload) || typeof payload.text !== "string") {
    return { ok: false, message: "text must be a string" };
  }

  const text = payload.text.trim();
  if (!text) return { ok: false, message: "text must not be empty" };
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) {
    return { ok: false, message: "text contains unsupported control characters" };
  }

  const normalizedText = normalizeTelegramHtml(text);
  if (!normalizedText) {
    return { ok: false, message: `text must contain valid Telegram HTML and be at most ${MAX_MESSAGE_LENGTH} characters` };
  }

  const rawButtons = payload.buttons ?? [];
  if (!Array.isArray(rawButtons)) return { ok: false, message: "buttons must be an array" };
  if (rawButtons.length > MAX_BUTTONS) {
    return { ok: false, message: `buttons must contain at most ${MAX_BUTTONS} items` };
  }

  const buttons: { text: string; url: string }[] = [];
  for (const button of rawButtons) {
    if (!isRecord(button) || typeof button.label !== "string" || typeof button.url !== "string") {
      return { ok: false, message: "each button must have string label and url fields" };
    }

    const label = button.label.trim();
    const url = button.url.trim();
    if (!label || label.length > MAX_BUTTON_LABEL_LENGTH || /[\u0000-\u001f\u007f]/.test(label)) {
      return { ok: false, message: `button labels must be 1-${MAX_BUTTON_LABEL_LENGTH} plain-text characters` };
    }
    if (!isHttpUrl(url)) {
      return { ok: false, message: "button URLs must be valid http:// or https:// URLs" };
    }
    buttons.push({ text: label, url });
  }

  return {
    ok: true,
    message: {
      text: normalizedText,
      ...(buttons.length ? { reply_markup: { inline_keyboard: [buttons] } } : {})
    }
  };
}

export async function handleManualTelegramPostRequest(
  request: Pick<Request, "headers" | "text">,
  dependencies: ManualPostDependencies
): Promise<Response> {
  const authorization = request.headers.get("authorization");
  if (!dependencies.cronSecret || authorization !== `Bearer ${dependencies.cronSecret}`) {
    return jsonResponse({ ok: false, error: "unauthorized" }, 401);
  }

  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return jsonResponse({ ok: false, error: "unsupported_media_type" }, 415);
  }

  const declaredLength = request.headers.get("content-length");
  if (declaredLength !== null && Number(declaredLength) > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, error: "request_too_large" }, 413);
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, error: "request_too_large" }, 413);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ ok: false, error: "invalid_json" }, 400);
  }

  const validation = validatePayload(payload);
  if (!validation.ok) {
    return jsonResponse({ ok: false, error: "invalid_request", message: validation.message }, 400);
  }

  if (!dependencies.telegramConfigured) {
    dependencies.logError?.("configuration-error");
    return jsonResponse({ ok: false, error: "configuration_error" }, 503);
  }

  try {
    const result = await dependencies.deliver(validation.message);
    return jsonResponse({ ok: true, ...(result.messageId !== undefined ? { message_id: result.messageId } : {}) }, 200);
  } catch {
    dependencies.logError?.("telegram-error");
    return jsonResponse({ ok: false, error: "telegram_error" }, 502);
  }
}
