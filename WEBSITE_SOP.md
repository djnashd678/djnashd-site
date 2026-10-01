# DJNASHD.COM — WEBSITE SOP

**Project:** NASH.D artist website (`djnashd-site`)  
**Purpose:** Repeatable monthly event/guestlist updates without redesigning or disrupting the working site.  
**Document status:** Updated 02 Oct 2026. Maintained as the canonical repository-root SOP; replace the previous copy after review.  
**Default rule:** Complete the data setup in Google Forms and the **NASH.D Shows public calendar** BEFORE asking Codex to update the website.

---

## 1. Non-negotiable operating rules

1. Work on the existing website. Treat each monthly update as **content and metadata maintenance**, not a redesign.
2. **Only access the `NASH.D Shows` public gig calendar** for website work. Never use or edit personal/private calendars unless explicitly requested.
3. The public calendar is the primary source for gig dates, times, venue and the event-specific links stored in each event's `[NASHD]` description block. The site's existing code/metadata determines presentation and any intentional featured overrides.
4. **Do not deploy automatically.** Update locally, test, show the preview and obtain explicit approval. Codex commits locally; NASH.D pushes via GitHub Desktop and manually handles Vercel. Verify live production after deployment.
5. Do not request Finder access, export unrelated files, or touch unrelated areas of the Mac. Do not overwrite approved designs or artwork.
6. Reuse known links and already-approved assets. Do not repeatedly ask NASH.D for material already in the calendar, repository or current conversation. If something genuinely cannot be verified, identify the precise missing item instead of inventing it.
7. Report what **actually changed** versus what is merely proposed or waiting for approval. Never imply local changes have been deployed.

## 2. Monthly sequence — follow this order

**Form dropdown → prefilled links → public calendar descriptions → calendar feed/site sync → artwork and event metadata → local verification → user approval → local commit → GitHub Desktop Push origin → manual Vercel deployment → live verification.**

### A. Roll over the Google Form

- At the start of a new month, remove **last month's event choices from the active guestlist dropdown**. Add only the new month's **guestlist-eligible** shows.
- Keep previous submissions in the Master Guestlist Sheet. Removing obsolete dropdown choices must **not** delete or overwrite historical responses.
- Match each option's spelling, case and date format exactly to the established form convention, e.g. `Baes — 05 Oct 2026` (not `OCT` or `October`). Use the date and venue associated with that specific show.
- Do **not** add an event that is tickets-only or free-entry-only to the guestlist dropdown unless NASH.D specifically changes its admission policy.
- Use the **existing master form**, not a newly created form, unless instructed. Its existing prefill field can be reused; the selected event value must be exact.

### B. Create and verify each event-specific URL

- Generate the prefilled Google Form link for each guestlist-eligible event, selecting that exact dropdown value.
- Open the link and confirm the correct event is already selected. A generic unfilled form URL is **not sufficient**.
- Ticket links must point to the particular official ticket page, not a venue homepage.
- Determine the actual CTA policy per event before writing links. Do not infer “guestlist” simply from the venue name.

### C. Update the **public gig calendar** before Codex

- In **`NASH.D Shows`**, find the specific event and update its description's existing `[NASHD] ... [/NASHD]` metadata with the verified `guestlist:` and/or `tickets:` URL and applicable `admission:` value.
- Keep existing dates, time, event IDs, notes, and unrelated description content intact. A provisional calendar end time should not become a misleading public showtime.
- Read the event back and verify the saved link and exact prefilled event value.
- **Only after this step** instruct Codex to refresh/read the website's public ICS feed and update its code/metadata if needed. Codex does not automatically know a new URL merely because a Google Form dropdown has changed.
- If a connector cannot edit the Form, report that limitation plainly. Complete the rest of the process using the user's confirmed Form change; do not claim to have edited the Form.

Example of the calendar description format (illustrative; preserve the format used by the actual parser):

```text
[NASHD]
genre: Hip-Hop / R&B
venue: Baes
guestlist: <verified prefilled Google Form URL>
publish-from: 2026-10-01T00:00:00+08:00
[/NASHD]
```

Do not paste `<verified prefilled Google Form URL>` literally; insert the real, checked link. Only set keys the event requires. For a tickets-only or free-entry show, follow the existing supported schema rather than adding a fake guestlist.

### D. Refresh website data and reconcile the event list

- Sync from the existing `NASHD_SHOWS_ICS_URL` feed. Allow for the site's existing calendar revalidation/cache interval (previously 15 minutes); use an appropriate local refresh when verifying new metadata.
- Compare the website against the **intended** public gig schedule. Investigate unexpected entries, omissions, stale feed data, publication windows and metadata overrides; do **not** quietly edit or delete the Google Calendar to make the website look right.
- Expired shows should stop appearing in active/upcoming listings according to the site's existing logic. Remove the previous month's active guestlist choices during rollover. Keep historical guestlist submissions.
- Display clean public titles: e.g. show `Baes`, not `Baes — 11PM Till Late` as a heading; render time in the time field. Fix title normalization where necessary instead of hardcoding a one-off visual patch.
- Keep calendar and website dates in **Asia/Singapore**. Check late-night events crossing midnight; do not treat the provisional calendar end as public-facing “till late” text.

### E. Admission and CTA rules

| Event/admission setting | Website CTA behavior |
| --- | --- |
| Guestlist only | Event-specific `GUESTLIST` button |
| Tickets only | Official `TICKETS` button; **no guestlist** |
| Both | Correct separate `TICKETS` and `GUESTLIST` buttons |
| Free entry | Show `FREE ENTRY`; no purchase/guestlist button unless specifically authorised |
| Neither confirmed | Do not invent links or misleading buttons; follow the site's existing empty-CTA treatment and flag the missing decision |

**October 2026 confirmed examples** (these are event-specific, not blanket rules for all future shows):

- **Anyma — 10 Oct:** `Race Weekend: Anyma — Closing Set by NASH.D` (calendar event ID `4ulgv7eb7vuaqo8g43eegu6d5k`); genre must be exactly `Melodic Techno / Techno / Progressive` in Featured Events and All Events; tickets only. Do not substitute `Mainstage EDM` or omit `Techno`.
- **Astrolab — 17 Oct:** tickets + event-specific guestlist.
- **Marquee Halloween — 31 Oct:** tickets only, no guestlist. Confirmed official ticket URL: `https://marquee.bigtix.io/en/events/halloween-hotel-delirium/MQ261X31`.
- **Kossa:** display **FREE ENTRY** for the relevant October show(s); no guestlist/ticket CTA unless otherwise configured.
- **Baes — 05 Oct:** heading `Baes`, 11 PM till late, Hip-Hop / R&B; guestlist option exactly `Baes — 05 Oct 2026`, with its prefilled link in the **NASH.D Shows calendar event**. Preserve the provisional 3 AM endpoint as a calendar implementation detail, not the visible title.
- **Unexpected Lulu's Lounge listing:** inspect whether it actually belongs in the intended public schedule; trace calendar/feed/metadata and resolve the discrepancy, without touching personal calendars or indiscriminately suppressing the venue.

### F. Official event artwork

1. First use the official event artwork from the venue/promoter's event page, as in the September workflow. Reuse an already-approved file if present. Request an upload only if an official usable image is unavailable or NASH.D requests custom artwork.
2. If NASH.D supplies a **newer approved image**, it takes precedence over an older repository asset. Do not replace it with a generated approximation.
3. Optimize assets for web (e.g. `.webp` in `public/events/`) while retaining a suitable source as needed. Use consistent card **containers/aspect ratios** on desktop and mobile; avoid mismatched square and tall Featured Event cards.
4. Crop or position thoughtfully so artists, branding and event dates remain legible. Do not stretch images or chop off important poster typography. Seek a visual review of tight mobile crops if required.
5. Treat the source artwork and the **CSS/image presentation** as separate questions. Fix a card-container layout bug before recreating art unnecessarily.

### G. Featured Events and All Events

- A Featured Event **also appears exactly once in All Events**. Featured is a presentation flag, not a reason to remove it from the main schedule or add a duplicate record.
- Preserve the approved image and any ticket/guestlist CTAs in both presentation contexts.
- Check desktop and mobile: consistent artwork boxes, readable text, correct event dates and functional buttons.
- Preserve the site's existing hero, navigation, visual language and booking CTA unless a specific change is approved.

## 3. Local quality-control checklist

Before asking for deployment approval, verify:

- [ ] Google Form only offers the active month's eligible guestlist events; previous submissions remain in the Master Sheet.
- [ ] Every guestlist URL prefills the **correct exact event**, and every ticket URL opens the correct official event page.
- [ ] Relevant URLs have been saved to and **read back from** the NASH.D Shows calendar event descriptions.
- [ ] Calendar feed/refresh and site listing agree with the intended gigs; unexpected events investigated, not silently discarded.
- [ ] Correct venue display titles, **exact approved genre wording and order** (cross-check the gig schedule), local date/time, late-night formatting and admission labels. When wrong, inspect `[NASHD] genre:` in the public calendar and stale ICS caches before adding overrides.
- [ ] Tickets-only shows have no guestlist CTA; free-entry shows show `FREE ENTRY`.
- [ ] Featured shows also appear once each in All Events; no accidental duplicates.
- [ ] Approved event artwork displays consistently on desktop and mobile.
- [ ] No outdated September events/guestlist options in the **active October** experience; historic submissions untouched.
- [ ] Tests, TypeScript, changed-file lint and production build run. Distinguish new failures from pre-existing repository issues; report both accurately.
- [ ] Provide a **working local preview URL and port**; make sure the dev server is actually running. Do not assume `localhost:3000` (e.g. a session may use `127.0.0.1:3100`).
- [ ] NASH.D has explicitly approved the preview **before** deployment.
- [ ] After the GitHub Desktop push and manual Vercel deployment, verify the **newest commit hash** is building and that the actual live URL works on mobile and desktop; retest critical CTAs.

Relevant existing files to inspect when appropriate (not a fixed edit list):

```text
app/page.tsx
app/globals.css
components/NextShow.tsx
lib/events/metadata.ts
lib/events/selection.ts
tests/events.test.ts
public/events/
```

A previously reported full-repository lint issue in `components/Hero.tsx` should be assessed separately from monthly event work unless it blocks the requested release. Do not conceal new lint failures behind that pre-existing issue.

## 4. Permission and handoff rules

- Normal flow: **make local change → run checks → give one working preview link → collect consolidated feedback → fix → request approval → Codex local commit → NASH.D clicks Push origin in GitHub Desktop → NASH.D deploys through Vercel → verify**.
- Never take “looks good locally” or a successful test report as implicit deployment approval.
- Google Docs/Form access requests: explain **what Codex is opening and why**; use one-time permission when sufficient, not blanket access. Avoid repeating verification that the calendar owner has already completed unless needed for a specific failure.
- Do not access Finder or export assets by default. Do not create unrelated Canva designs or re-generate supplied official artwork.
- Report completed changes, verification results, deployment status and **only genuine blockers**. Avoid sprawling new feature proposals during a monthly maintenance push.

## 5. Template: monthly Codex handoff

Copy this **only after the Form and calendar setup is finished**, and substitute the month:

```text
Perform the [MONTH YEAR] djnashd-site maintenance update according to WEBSITE_SOP.md.
The existing Google Form choices and event-specific prefilled URLs have been prepared,
and the NASH.D Shows PUBLIC gig calendar descriptions have been updated and verified.
Use only this public gig calendar. Refresh the existing ICS feed and reconcile site events,
links, admission settings and artwork with the current calendar and approved assets.
Preserve the site's design. Source missing event posters from official venue/event pages.
Keep Featured Events in All Events exactly once each. Verify all event CTAs and mobile
presentation, then run tests, TypeScript, lint and production build.
Start and keep running the local preview server and give me its actual working URL.
Do not deploy, export or access Finder. Wait for explicit deployment approval.
Report changes and any genuine blockers.
```

## 6. If something looks wrong

**Follow the data path backward rather than guessing:** Google Form exact choice → prefilled link → `[NASHD]` calendar event description → public ICS/cache → parsing and site metadata → event selection → rendering/CSS → browser preview. Fix the earliest incorrect step, then retest downstream behavior.

## 7. GitHub Desktop and Vercel release procedure — DO NOT SKIP

**The three systems have distinct roles.** Codex can edit and commit the local `djnashd-site` repository. It is **not** authorised to browse Vercel or request Finder access. GitHub Desktop is the owner's simple manual route for pushing local commits to `origin/main`; NASH.D manually handles the Vercel production deployment. A local commit is **not** the same thing as a GitHub push, and a GitHub push is **not** proof that production deployed.

1. **Codex (local only):** run relevant tests, TypeScript, changed-file lint and a **clean** `pnpm run build`. Run the actual local preview and obtain explicit visual approval. Check the scope of changes and create a local commit. Report its full hash and whether the working tree is clean. Do not attempt GitHub credential workarounds, open GitHub Desktop or request Vercel dashboard access.
2. **NASH.D / GitHub Desktop:** open the `djnashd-site` repository, check the commit and click **Push origin**. Verify push success and that local `main` is no longer ahead of `origin/main`. A Terminal `git push origin main` is an optional fallback, **not** a required extra step.
3. **NASH.D / Vercel:** manually initiate or confirm a **new Production deployment** for the latest pushed commit on `main` (according to the project's existing integration). Verify the deployment's **Source / commit hash**, and wait for **Ready**. Do not redeploy a failed old commit assuming it includes subsequent fixes.
4. **Live verification:** open `https://djnashd.com/` on desktop and mobile. Verify current events, Featured/All Events, poster crops, actual guestlist prefills and ticket pages, free-entry messaging and no expired active listings. Record the deployed commit hash and production status. Stop for the night once the approved scope is working; treat unrelated enhancements separately.

**Permission policy:** NASH.D handles Vercel manually. Codex must not ask for Vercel dashboard access or Finder export. If Codex cannot push due to missing GitHub credentials, **this is expected**: request a local commit hash and let NASH.D use GitHub Desktop's Push origin. Do not try to change authentication arrangements midway through a release.

### Vercel package-manager configuration (confirmed October 2026)

The repo pins the package manager in `package.json` to **`pnpm@10.34.6`** (font-fix commit `ae697d1bed71b374cb9f5c2078fa9d26671d2bb7`). The earlier failed build had auto-selected `pnpm v10.28.0`; this difference was observed, **not proven to cause the font failure**.

In Vercel, set the Production environment variable to honour the explicit Corepack pin:

| Field in Vercel → Project → Settings → Environment Variables | Value |
| --- | --- |
| Type | **Config** (non-secret; not Secret) |
| Key | `ENABLE_EXPERIMENTAL_COREPACK` |
| Value | `1` |
| Environment | **Production** |
| Note | Leave blank |

Save this setting **before a fresh Production deployment**. This was configured manually on 02 Oct 2026; on later releases **check that it is still present** rather than repeatedly adding it. If Vercel's UI or recommended flag changes, check Vercel's current package-manager documentation and update this SOP.

### Font-build failure record and recovery

The 02 Oct 2026 October release initially failed on Vercel at commit `5678a309b35bc0ebffb2fd90a98e8468c2269ccc`:

```text
app/layout.tsx
An error occurred in `next/font`.
TypeError: Cannot read properties of null (reading '1')
.../next/dist/compiled/@next/font/dist/google/loader.js:122:78
```

The failing Next.js build was `15.5.23`. The log named the **Inter** configuration in `app/layout.tsx`. This was a Google Font loader compilation failure, **not evidence that the October guestlist or event metadata was broken**. Avoid claiming that pnpm or Google network access was definitively responsible without reproducing the root cause.

The remedy committed locally as `ae697d1bed71b374cb9f5c2078fa9d26671d2bb7` replaced build-time Google Font fetching with bundled local **Inter and Space Grotesk** fonts, maintaining the site's typography and weights, and pinned `pnpm@10.34.6`. Codex reported: **44 tests passed; TypeScript, relevant lint and a clean production build passed; desktop/mobile preview checked**. The pre-existing `components/Hero.tsx` full-repository lint issue was left untouched.

**If Vercel fails again:**

1. Open the new deployment's **Build Logs**. Read the **first error**, including lines just above it. A generic “`pnpm run build` exited with 1” is not a diagnosis.
2. Confirm Vercel fetched the **latest pushed commit**, and check the selected pnpm version / Corepack setting and whether a stale cache was restored.
3. Compare local and Vercel runtime/dependency conditions. If it is a font loader error, inspect local font references and `app/layout.tsx` before changing content or design.
4. Ask Codex for a narrowly scoped fix with a clean production build. Codex **commits locally**, NASH.D **Push origin**, NASH.D **deploys Vercel** again. Do not alter working October event metadata as a speculative fix.
5. Distinguish old, pre-existing lint errors (notably `Hero.tsx`) from release-blocking build errors. A previously passed local build does not guarantee a Vercel build.

### October 2026 release checkpoints (historical; not a permanent monthly event list)

- `5678a309b35bc0ebffb2fd90a98e8468c2269ccc` — October shows/artwork/calendar metadata + first `WEBSITE_SOP.md`; reached GitHub but Vercel build failed at `next/font`.
- `ae697d1bed71b374cb9f5c2078fa9d26671d2bb7` — local-font fix + pnpm pin; clean local verification was reported. Push and final Production Ready confirmation must be checked separately, not presumed.
- The corrected Baes — 05 Oct guestlist was **saved into and read back from** the `NASH.D Shows` public calendar before the website sync.
- Only amend this release record after seeing a confirmed production deployment. Do not treat a successful build, local commit, GitHub push or saved environment variable as proof the live website is updated.

---

**Maintainer note:** Update this SOP when NASH.D approves a permanent change to the workflow. One-off October admissions, names and links above are examples, not permanent venue-wide rules.
