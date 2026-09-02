# DJNASHD.com

## Run locally
npm install
npm run dev

## Publish
1. Create an empty GitHub repo named `djnashd-site`
2. Upload these files
3. Import the repo into Vercel
4. Add `djnashd.com` in Vercel Project Settings → Domains

## Upcoming shows

Shows are loaded server-side from the dedicated public **NASH.D Shows** Google Calendar. Set its
public iCal URL as the server-only `NASHD_SHOWS_ICS_URL` environment variable. When the variable is
not configured, or no valid future shows are available, the site displays “New dates coming soon.”

Calendar requirements:

- Calendar timezone: `Asia/Singapore`
- Enter each show individually with a start and end time; recurring and all-day events are ignored.
- Event title: public show name
- Event location: physical address/location
- Do not add guests, conferencing links, attachments, or private production notes.
- A show remains upcoming until its end time.

Add this block to the event description:

```text
[NASHD]
genre: Hip-Hop / R&B
venue: Marquee Singapore
guestlist: https://example.com/guestlist
tickets: https://example.com/tickets
featured: true
feature-from: 2026-08-27T09:00:00+08:00
[/NASHD]
```

`venue` and `genre` are required. The other fields are optional. `featured` defaults to false;
without `feature-from`, a featured show is eligible immediately. Guestlist and ticket links must
use HTTP or HTTPS. Invalid or missing links are not displayed.

The feed is revalidated approximately every 15 minutes. Keep the variable server-only—do not use a
`NEXT_PUBLIC_` prefix.

## Telegram show posts

Vercel calls `/api/cron/show-reminder` once per day at `0 10 * * *` (10:00 UTC, or during the
6 PM hour in Singapore on Vercel Hobby). The protected route checks the existing public NASH.D
Shows feed and sends one combined Telegram channel post when an eligible show starts that Singapore
calendar day. It sends nothing when there are no eligible shows.

Configure these server-only Vercel environment variables:

- `TELEGRAM_BOT_TOKEN`: token for the Telegram bot that can post to the channel
- `TELEGRAM_CHANNEL_ID`: destination channel ID
- `CRON_SECRET`: random secret used by Vercel as the cron request bearer token

The route uses only the standard Telegram Bot API. Do not use `NEXT_PUBLIC_` prefixes for any of
these values. Duplicate protection is intentionally limited to concurrent and repeated requests on
the same warm server instance; it is not durable across cold starts, deployments, or parallel
instances.

## Replace placeholders
Search for:
- hello@djnashd.com
- https://www.mixcloud.com/
- https://open.spotify.com/
- https://www.tiktok.com/
- #
