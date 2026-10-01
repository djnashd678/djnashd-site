# Website operating procedure

## Source of truth

- Work in the existing djnashd-site repository and preserve the Beta 1 design, branding, mobile responsiveness and existing functionality.
- Load shows through the public NASH.D Shows Google Calendar ICS feed configured by server-only NASHD_SHOWS_ICS_URL. The normal cache refresh interval is 15 minutes.
- Read event-specific genre, guestlist, ticket, reservation and admission information from the [NASHD] calendar description. Preserve the exact links, including Google Form prefill parameters. Never substitute links from an earlier month.
- Do not change Google Calendar or delete historical guestlist submissions as part of website maintenance unless explicitly requested.
- Website-only exceptions belong in lib/events/website.ts and must be scoped to the intended event IDs. Review these exceptions when updating the schedule.

## Artwork

- Source official artwork directly from the venue's official event page when needed. Prefer the user's latest approved artwork when available.
- Confirm the event name and date on each poster. Preserve branding and important text.
- Optimise artwork as WebP without stretching. Featured images use consistent square frames on desktop and mobile. Use an approved square image or a matching background extension; do not crop essential content.
- Preserve already approved artwork unless replacement is requested.

## Event checks

- Keep featured shows in All Events, once each; use the stable calendar event ID to avoid duplicates.
- Exclude expired shows from current/upcoming listings.
- Check every guestlist form opens with the correct event selected. Do not submit test guestlist requests.
- Check every ticket button reaches the correct official event, rather than merely returning HTTP 200.
- Free-entry events display FREE ENTRY without guestlist or ticket buttons.
- October 2026: Anyma on 10 October is tickets only, with genre Melodic Techno / Techno / Progressive; Astrolab on 17 October has tickets and guestlist; Marquee Halloween on 31 October is tickets only.

## Validation and release

1. Refresh the public ICS feed and the local calendar cache when reviewing a calendar update.
2. Verify desktop and mobile artwork, visibility, dates, time, genre and CTAs in the local preview.
3. Run the event tests, lint, TypeScript checks and production build. Report failures accurately; do not describe scoped lint as full-repository lint.
4. Report changed files, verification results and blockers before deployment. Stop if a required final check fails.
5. Obtain explicit approval before production deployment or exports. Use the existing Vercel project for djnashd.com; do not create a replacement hosting project or redesign the site.
6. After deployment, verify djnashd.com on desktop and mobile, test all current-month guestlist and ticket buttons, and confirm expired events are absent. Report the production URL, deployment status and remaining issues.

## Access boundaries

- Do not request Finder access or use Finder for this workflow.
- Keep credentials and server-only environment values out of source control, browser output and reports.
- Use the existing calendar integration and hosting configuration. Do not send guestlist submissions or trigger Telegram posts as deployment tests.
