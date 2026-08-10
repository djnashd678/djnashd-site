import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  isSiteGateConfigured,
  passwordMatches,
  SITE_SESSION_COOKIE,
  SITE_SESSION_MAX_AGE
} from "@/lib/site-auth";

function safeDestination(value: FormDataEntryValue | null): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const destination = safeDestination(formData.get("next"));
  const password = formData.get("password");

  if (!isSiteGateConfigured()) {
    return new NextResponse("Site gate is not fully configured.", {
      status: 503,
      headers: { "X-Robots-Tag": "noindex, nofollow, noarchive" }
    });
  }

  if (typeof password !== "string" || !(await passwordMatches(password))) {
    const gateUrl = new URL("/gate", request.url);
    gateUrl.searchParams.set("error", "1");
    gateUrl.searchParams.set("next", destination);
    return NextResponse.redirect(gateUrl, 303);
  }

  const response = NextResponse.redirect(new URL(destination, request.url), 303);
  response.cookies.set(SITE_SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SITE_SESSION_MAX_AGE
  });
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}
