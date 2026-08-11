import { createHash } from "node:crypto";
import { parseEventMetadata } from "./metadata.ts";
import type { EventItem } from "./types.ts";

const MAX_ICS_BYTES = 1_000_000;
const MAX_EVENTS = 200;
const MAX_PROPERTY_LENGTH = 10_000;
const SINGAPORE_OFFSET_MS = 8 * 60 * 60 * 1000;

type Property = { name: string; params: Map<string, string>; value: string };

function unfoldLines(input: string): string[] {
  const normalized = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines: string[] = [];
  for (const line of normalized.split("\n")) {
    if (/^[ \t]/.test(line) && lines.length) lines[lines.length - 1] += line.slice(1);
    else lines.push(line);
  }
  return lines;
}

function parseProperty(line: string): Property | null {
  const separator = line.indexOf(":");
  if (separator <= 0 || line.length > MAX_PROPERTY_LENGTH) return null;
  const parts = line.slice(0, separator).split(";");
  const name = parts.shift()?.toUpperCase();
  if (!name) return null;
  const params = new Map<string, string>();
  for (const part of parts) {
    const equals = part.indexOf("=");
    if (equals > 0) params.set(part.slice(0, equals).toUpperCase(), part.slice(equals + 1).replace(/^"|"$/g, ""));
  }
  return { name, params, value: line.slice(separator + 1) };
}

function decodeText(value: string): string {
  return value.replace(/\\([nN,;\\])/g, (_, escaped: string) => {
    if (escaped === "n" || escaped === "N") return "\n";
    return escaped;
  }).trim();
}

function parseDate(property: Property): Date | null {
  if (property.params.get("VALUE")?.toUpperCase() === "DATE" || /^\d{8}$/.test(property.value)) return null;
  const match = property.value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/);
  if (!match) return null;

  const [, year, month, day, hour, minute, second, utc] = match;
  const values = [year, month, day, hour, minute, second].map(Number);
  const [y, mo, d, h, mi, s] = values;
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || mi > 59 || s > 59) return null;

  const timezone = property.params.get("TZID");
  if (!utc && timezone && timezone !== "Asia/Singapore") return null;
  const timestamp = Date.UTC(y, mo - 1, d, h, mi, s) - (utc ? 0 : SINGAPORE_OFFSET_MS);
  const date = new Date(timestamp);
  const check = new Date(timestamp + (utc ? 0 : SINGAPORE_OFFSET_MS));
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== mo - 1 || check.getUTCDate() !== d) return null;
  return date;
}

function eventId(uid: string): string {
  return `show-${createHash("sha256").update(uid).digest("hex").slice(0, 20)}`;
}

function formatEvent(uid: string, properties: Map<string, Property>): EventItem | null {
  if (properties.has("RRULE") || properties.has("RECURRENCE-ID")) return null;
  if (properties.get("STATUS")?.value.toUpperCase() === "CANCELLED") return null;
  const classification = properties.get("CLASS")?.value.toUpperCase();
  if (classification === "PRIVATE" || classification === "CONFIDENTIAL") return null;

  const summary = decodeText(properties.get("SUMMARY")?.value ?? "");
  const location = decodeText(properties.get("LOCATION")?.value ?? "");
  const description = decodeText(properties.get("DESCRIPTION")?.value ?? "");
  const startProperty = properties.get("DTSTART");
  const endProperty = properties.get("DTEND");
  if (!summary || !startProperty || !endProperty) return null;

  const start = parseDate(startProperty);
  const end = parseDate(endProperty);
  const metadata = parseEventMetadata(description);
  if (!start || !end || end <= start || !metadata) return null;

  const dateFormatter = new Intl.DateTimeFormat("en-SG", {
    timeZone: "Asia/Singapore", day: "2-digit", month: "short", year: "numeric"
  });
  const dayFormatter = new Intl.DateTimeFormat("en-SG", { timeZone: "Asia/Singapore", weekday: "long" });
  const timeFormatter = new Intl.DateTimeFormat("en-SG", {
    timeZone: "Asia/Singapore", hour: "numeric", minute: "2-digit", hour12: true
  });

  return {
    id: eventId(uid),
    name: summary,
    venue: metadata.venue,
    location,
    genre: metadata.genre,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    date: dateFormatter.format(start).toUpperCase(),
    day: dayFormatter.format(start),
    time: timeFormatter.format(start).replace(/\s/g, " ").toUpperCase(),
    featured: metadata.featured,
    ...(metadata.featureFrom ? { featureFrom: metadata.featureFrom } : {}),
    ...(metadata.guestlistUrl ? { guestlistUrl: metadata.guestlistUrl } : {}),
    ...(metadata.ticketUrl ? { ticketUrl: metadata.ticketUrl } : {})
  };
}

export function parseCalendarIcs(input: string): EventItem[] {
  if (new TextEncoder().encode(input).byteLength > MAX_ICS_BYTES) throw new Error("Calendar response is too large");
  const lines = unfoldLines(input);
  if (!lines.includes("BEGIN:VCALENDAR") || !lines.includes("END:VCALENDAR")) throw new Error("Invalid calendar response");

  const events: EventItem[] = [];
  let current: Map<string, Property> | null = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = new Map();
      continue;
    }
    if (line === "END:VEVENT" && current) {
      const uid = decodeText(current.get("UID")?.value ?? "");
      const event = uid ? formatEvent(uid, current) : null;
      if (event) events.push(event);
      current = null;
      if (events.length >= MAX_EVENTS) break;
      continue;
    }
    if (!current) continue;
    const property = parseProperty(line);
    if (property && !current.has(property.name)) current.set(property.name, property);
  }
  return events;
}
