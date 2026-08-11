import type { EventMetadata } from "./types.ts";

const BLOCK_PATTERN = /(?:^|\n)\[NASHD\]\s*\n([\s\S]*?)\n\[\/NASHD\](?:\n|$)/i;
const MAX_FIELD_LENGTH = 500;

function normalizeGoogleDescription(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&(?:amp|#38);/gi, "&")
    .replace(/&(?:quot|#34);/gi, '"')
    .replace(/&(?:apos|#39);/gi, "'")
    .replace(/&(?:lt|#60);/gi, "<")
    .replace(/&(?:gt|#62);/gi, ">")
    .replace(/&nbsp;/gi, " ");
}

function validHttpUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function validIsoDate(value: string): string | undefined {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function parseEventMetadata(description: string): EventMetadata | null {
  const block = normalizeGoogleDescription(description).match(BLOCK_PATTERN)?.[1];
  if (!block) return null;

  const values = new Map<string, string>();
  for (const line of block.split("\n")) {
    const separator = line.indexOf(":");
    if (separator <= 0) continue;
    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (value && value.length <= MAX_FIELD_LENGTH && !values.has(key)) values.set(key, value);
  }

  const venue = values.get("venue")?.trim();
  const genre = values.get("genre")?.trim();
  if (!venue || !genre) return null;

  const featured = values.get("featured")?.toLowerCase() === "true";
  const featureFrom = values.get("feature-from");

  return {
    venue,
    genre,
    featured,
    ...(validHttpUrl(values.get("guestlist") ?? "") ? { guestlistUrl: validHttpUrl(values.get("guestlist") ?? "") } : {}),
    ...(validHttpUrl(values.get("tickets") ?? "") ? { ticketUrl: validHttpUrl(values.get("tickets") ?? "") } : {}),
    ...(featured && featureFrom && validIsoDate(featureFrom) ? { featureFrom: validIsoDate(featureFrom) } : {})
  };
}
