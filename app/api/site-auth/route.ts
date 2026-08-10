import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  isSiteGateConfigured,
  passwordMatches,
  SITE_SESSION_COOKIE,
  SITE_SESSION_MAX_AGE
} from "@/lib/site-auth";
import {
  clearFailedAttempts,
  getClientIdentifier,
  getRateLimitStatus,
  recordFailedAttempt
} from "@/lib/site-auth-rate-limit";

const MAX_BODY_BYTES = 2048;
const MAX_PASSWORD_LENGTH = 256;
const MAX_DESTINATION_LENGTH = 1024;

function noStoreHeaders(additional?: HeadersInit) {
  const headers = new Headers(additional);
  headers.set("Cache-Control", "no-store");
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return headers;
}

function safeDestination(value: string | null, expectedOrigin: string): string {
  if (!value || value.length > MAX_DESTINATION_LENGTH) return "/";
  if (/\\|[\u0000-\u001f\u007f]|%5c|%(?:0[0-9a-f]|1[0-9a-f]|7f)/i.test(value)) return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";

  try {
    const destination = new URL(value, expectedOrigin);
    if (destination.origin !== expectedOrigin) return "/";
    return `${destination.pathname}${destination.search}`;
  } catch {
    return "/";
  }
}

export async function POST(request: NextRequest) {
  const expectedOrigin = request.nextUrl.origin;
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (origin !== expectedOrigin || (fetchSite && fetchSite !== "same-origin")) {
    return new NextResponse("Forbidden", { status: 403, headers: noStoreHeaders() });
  }

  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim();
  const contentLength = Number(request.headers.get("content-length"));
  if (contentType !== "application/x-www-form-urlencoded" || !Number.isSafeInteger(contentLength) || contentLength < 0) {
    return new NextResponse("Invalid request", { status: 400, headers: noStoreHeaders() });
  }
  if (contentLength > MAX_BODY_BYTES) {
    return new NextResponse("Request too large", { status: 413, headers: noStoreHeaders() });
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) {
    return new NextResponse("Request too large", { status: 413, headers: noStoreHeaders() });
  }

  const formData = new URLSearchParams(body);
  const destination = safeDestination(formData.get("next"), expectedOrigin);
  const password = formData.get("password");
  const clientIdentifier = getClientIdentifier(request.headers);
  const rateLimit = getRateLimitStatus(clientIdentifier);
  if (rateLimit.limited) {
    return new NextResponse("Too many attempts. Please try again later.", {
      status: 429,
      headers: noStoreHeaders({ "Retry-After": String(rateLimit.retryAfter) })
    });
  }

  if (!isSiteGateConfigured()) {
    return new NextResponse("Site gate is not fully configured.", {
      status: 503,
      headers: noStoreHeaders()
    });
  }

  if (!password || password.length > MAX_PASSWORD_LENGTH || !(await passwordMatches(password))) {
    recordFailedAttempt(clientIdentifier);
    const gateUrl = new URL("/gate", request.url);
    gateUrl.searchParams.set("error", "1");
    gateUrl.searchParams.set("next", destination);
    return NextResponse.redirect(gateUrl, 303);
  }

  clearFailedAttempts(clientIdentifier);
  const response = NextResponse.redirect(new URL(destination, request.url), 303);
  response.cookies.set(SITE_SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SITE_SESSION_MAX_AGE
  });
  noStoreHeaders().forEach((value, key) => response.headers.set(key, value));
  return response;
}
