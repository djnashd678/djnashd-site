import { NextRequest, NextResponse } from "next/server";
import {
  isSiteGateConfigured,
  isSiteGateEnabled,
  isValidSessionToken,
  SITE_SESSION_COOKIE
} from "@/lib/site-auth";

const PUBLIC_PATHS = new Set(["/gate", "/api/site-auth", "/robots.txt"]);

function withNoIndex(response: NextResponse): NextResponse {
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export async function middleware(request: NextRequest) {
  if (!isSiteGateEnabled()) return NextResponse.next();

  if (PUBLIC_PATHS.has(request.nextUrl.pathname)) {
    return withNoIndex(NextResponse.next());
  }

  const token = request.cookies.get(SITE_SESSION_COOKIE)?.value;
  if (isSiteGateConfigured() && (await isValidSessionToken(token))) {
    return withNoIndex(NextResponse.next());
  }

  const gateUrl = new URL("/gate", request.url);
  gateUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return withNoIndex(NextResponse.redirect(gateUrl));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|hero.jpg).*)"]
};
