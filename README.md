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

## Replace placeholders
Search for:
- hello@djnashd.com
- https://www.mixcloud.com/
- https://open.spotify.com/
- https://www.tiktok.com/
- #
