# DJNASHD.COM — Emergency Handover & Next-Session Checkpoint

Updated: 02 Oct 2026 (Singapore time)

## Why this file exists

The website should remain maintainable without ChatGPT, Codex or another AI. Keep this with the repository-root `WEBSITE_SOP.md`, and do not put passwords or tokens in either document.

## Current handover — do not assume production is updated

- October website event, artwork and CTA changes: implemented and verified locally; initial October commit `5678a309b35bc0ebffb2fd90a98e8468c2269ccc` reached GitHub but failed Vercel build in `next/font/google`.
- Font and build remedy: bundled local Inter and Space Grotesk; `pnpm@10.34.6` pinned. Commit `ae697d1bed71b374cb9f5c2078fa9d26671d2bb7`; Codex reported 44 passing tests, TypeScript, relevant lint, clean production build and mobile/desktop review.
- Vercel Production environment variable `ENABLE_EXPERIMENTAL_COREPACK` = `1` (type Config) was saved by the user. Check it persists on the project; do not add duplicates.
- Latest local commit `6fe0302985413e6b2dde061035937feb9f81e51b`: supplied updated `WEBSITE_SOP.md` replaced the previous version. Codex reported only SOP changed, working tree clean; no push/deployment attempted for this commit.
- NEXT ACTION: In GitHub Desktop, select `djnashd-site` and **Push origin** for any outstanding local commits. Then manually deploy/verify the most recent pushed commit in Vercel. Never assume that a local commit, successful GitHub push or saved environment variable means production is live.
- Existing unrelated `components/Hero.tsx` full-repository lint issue was intentionally left untouched.

## Core systems and access

1. Local Next.js source: `~/Developer/djnashd-site` on Mac.
2. Remote backup/history: https://github.com/djnashd678/djnashd-site (main).
3. Hosting: https://vercel.com/dashboard — user manually controls production deployment.
4. Live site: https://djnashd.com/.
5. Events source: only the **NASH.D Shows public gig calendar**. Do not use personal/private calendars for site work.
6. Google Form dropdown and its event-specific prefilled links provide guestlist destinations; preserve old submissions in the Master Guestlist when rolling to a new month.

## Non-AI workflow: change an event

1. In the existing October (or current month) Google Form, add exactly the intended event title to its dropdown, e.g. `Baes — 05 Oct 2026` (same casing, abbreviated month and spacing); generate and test its event-specific prefilled link.
2. Open the matching event in the NASH.D Shows public Google Calendar. Keep `[NASHD]` metadata accurate: `venue`, `genre`, guestlist or tickets URL, admission and other applicable fields. Use the existing events as examples and consult repository-root `WEBSITE_SOP.md`.
3. Save the calendar event and allow for the public ICS/website cache (approximately 15-minute revalidation). Refresh site or preview when reviewing.
4. Check display title, date/time, venue, genre and all CTA destinations. Ticket-only events must not get a guestlist button; free-entry events should not acquire ticket/guestlist CTAs without explicit intent.
5. Featured shows should also occur once each in All Events; featured and All Events artwork should have a consistent container aspect ratio. Source official event artwork from the venue where possible.

## Non-AI workflow: modify code and publish

1. Open the local `djnashd-site` folder in Visual Studio Code. In its terminal: `pnpm install` (if needed), `pnpm dev`; review the localhost URL shown.
2. Change only the relevant code/assets, follow repository-root `WEBSITE_SOP.md`, and review mobile and desktop.
3. Run TypeScript, relevant lint/tests and `pnpm run build`. **Do not push/deploy a failed build.**
4. GitHub Desktop: review changed files, commit to main, then click **Push origin**. A local commit is not a remote push.
5. Manually open Vercel; trigger or confirm a new Production deployment of the **latest pushed commit**. Check commit hash and wait for **Ready**. Do not redeploy a prior failed commit by accident.
6. Inspect https://djnashd.com/ and directly click guestlist and ticket buttons. Record production commit.

## Production build recovery record

- Failed October build on `5678a30`: `app/layout.tsx` → `next/font` → `TypeError: Cannot read properties of null (reading '1')` in Google's font loader, with Inter shown in generated loader output.
- Next.js version in that log: `15.5.23`. Vercel automatically selected pnpm `10.28.0` before it was pinned (difference observed; not proven as root cause).
- Fix bundled Inter and Space Grotesk locally so the build need not fetch them at build time, pinned pnpm `10.34.6`, and set Vercel Production **Config** variable `ENABLE_EXPERIMENTAL_COREPACK=1` to honour pin.
- If a new build fails, inspect its **first red error and the preceding log lines** and make sure its deployment references the newest pushed hash before doing anything else. Keep October content untouched while fixing unrelated infrastructure errors.

## Known October rules at checkpoint

- Baes, 05 Oct: display heading `Baes` (not `Baes — 11PM Till Late`); 11 PM till late; event-specific guestlist URL saved and verified in public calendar.
- Anyma, 10 Oct: full event title `Race Weekend: Anyma — Closing Set by NASH.D`; exact genre **`Melodic Techno / Techno / Progressive`**; tickets only. Featured and All Events once each.
- Astrolab, 17 Oct: approved square artwork; tickets and event-specific guestlist. Featured and All Events once each.
- Kossa: show **FREE ENTRY**; no ticket or guestlist CTA unless deliberately configured.
- Halloween Marquee, 31 Oct: tickets only, no guestlist. https://marquee.bigtix.io/en/events/halloween-hotel-delirium/MQ261X31
- Remove old month's active dropdown/listings each month, but retain historical guestlist responses. No incorrect Lulu's Lounge listing.

## AI reliability protocol if you use an assistant again

AI may lose conversation context, forget prior decisions, invent missing links, repeat completed tasks or make overconfident time estimates. These are NOT permissions to rewrite the established process. Before every change, the assistant/developer must: (1) read `WEBSITE_SOP.md` and the current handover; (2) distinguish verified done vs pending vs merely claimed; (3) inspect source-of-truth calendar/event data before writing code or constructing a URL; (4) get consent before deployments and unrelated changes; (5) retain exact approved labels/casing and venue rules; (6) give one consolidated change request, not repeated prompts; and (7) report actual commit, push and deployment statuses separately. The human operator remains in charge of GitHub Desktop and Vercel.

Keep backups of the repo and SOP in GitHub and independently on another storage device; store account credentials in a password manager, not plaintext here.
