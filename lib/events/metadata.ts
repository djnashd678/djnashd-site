import type { EventMetadata } from "./types.ts";
import { decodeHtmlEntities } from "./text.ts";

const BLOCK_PATTERN = /(?:^|\n)\[NASHD\]\s*([\s\S]*?)\s*\[\/NASHD\](?:\n|$)/i;
const MAX_FIELD_LENGTH = 500;

function normalizeGoogleDescription(value: string): string {
  return decodeHtmlEntities(value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
  );
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

function validRootRelativePath(value: string): string | undefined {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[?#\u0000-\u001f]/.test(value)) return undefined;
  const segments = value.split("/");
  return segments.some((segment) => segment === "." || segment === "..") ? undefined : value;
}

export function parseEventMetadata(description: string): EventMetadata | null {
  const block = normalizeGoogleDescription(description).match(BLOCK_PATTERN)?.[1];
  if (!block) return null;

  const values = new Map<string, string>();
  // Calendar descriptions may place fields inline or wrap values onto another line.
  const fields = block.replace(/\s+(?=(?:genre|venue|guestlist|tickets|reservations|featured|feature-from|publish-from|image-mobile|image|notice|admission):)/gi, "\n");
  for (const line of fields.split(/\n(?=\s*[a-z][a-z-]*:(?!\/\/))/i)) {
    const separator = line.indexOf(":");
    if (separator <= 0) continue;
    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).replace(/\s+/g, " ").trim();
    if (value && value.length <= MAX_FIELD_LENGTH && !values.has(key)) values.set(key, value);
  }

  const venue = values.get("venue")?.trim();
  const genre = values.get("genre")?.trim();
  if (!venue || !genre) return null;

  const featured = values.get("featured")?.toLowerCase() === "true";
  const featureFrom = values.get("feature-from");
  const publishFrom = values.get("publish-from");
  const image = validRootRelativePath(values.get("image") ?? "");
  const imageMobile = validRootRelativePath(values.get("image-mobile") ?? "");

  return {
    venue,
    genre,
    featured,
    ...(values.get("admission")?.toLowerCase() === "free" ? { admission: "free" as const } : {}),
    ...(validHttpUrl(values.get("guestlist") ?? "") ? { guestlistUrl: validHttpUrl(values.get("guestlist") ?? "") } : {}),
    ...(validHttpUrl(values.get("tickets") ?? "") ? { ticketUrl: validHttpUrl(values.get("tickets") ?? "") } : {}),
    ...(validHttpUrl(values.get("reservations") ?? "") ? { reservationsUrl: validHttpUrl(values.get("reservations") ?? "") } : {}),
    ...(featured && featureFrom && validIsoDate(featureFrom) ? { featureFrom: validIsoDate(featureFrom) } : {}),
    ...(publishFrom && validIsoDate(publishFrom) ? { publishFrom: validIsoDate(publishFrom) } : {}),
    ...(image ? { image } : {}),
    ...(imageMobile ? { imageMobile } : {})
  };
}
