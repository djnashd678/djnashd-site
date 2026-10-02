# NASH.D — ARTIST OS
## Operating update / handover: 02 October 2026

**Status:** Consolidated update to merge into the existing ARTIST OS. Do not overwrite unrelated master-OS material. The separate `WEBSITE_SOP.md` in `djnashd-site` remains the detailed, authoritative website runbook.

**First principle:** Protect NASH.D's time, artistic identity and approved decisions. The assistant is an operator/collaborator, not an excuse to make the artist supervise every tiny step.

---

## 1. Identity and direction

- Public artist name: **NASH.D**. Website: **djnashd.com**. Singapore-based DJ and performing artist; retain internationally scalable positioning rather than making “Singapore DJ” the headline identity.
- Core identity: high-energy, genre-fluid; open format, hip-hop/R&B and electronic music. Distinguish the genre of the **individual event/set** from generic artist genres. Do not auto-label every Marquee performance “Mainstage EDM.”
- Approved short bio: “NASH.D is a Singapore-based DJ and performing artist known for high-energy, genre-fluid sets spanning hip-hop, R&B and electronic music. From clubs and festivals to private events and brand experiences, no two NASH.D sets are ever quite the same.”
- Longer-term aim: independent artist platform, more regional/overseas work, original event formats, consistent content that converts attention into followers and bookings; the website reduces dependence on social platforms.
- Creative directive for content: **Follow NASH.D's taste first; use performance data second.** Build affinity for the artist's musical judgment and personality, not a manufactured string of easy crowd-pleasers.

## 2. What happened on 02 Oct 2026 — website release log

The September website workflow was already established, but the October maintenance session became excessively repetitive. Reuse decisions and existing data; **do not repeat this failure pattern**.

### Intended October changes

- Monthly Google Form rollover: remove September event choices from the *active dropdown*, add October guestlist-eligible events, preserve historical Master Guestlist responses.
- Guestlist setup sequence: exact Form option → prefilled URL → relevant event's `[NASHD]` metadata in the **NASH.D Shows public calendar** → read back/verify → website ICS refresh → local site check → approval/deployment.
- Exact Form formatting example: `Baes — 05 Oct 2026` (not `OCT`, not `October`). A new Form dropdown choice does **not** magically create a calendar or website link.
- Only use the **NASH.D Shows** public gig calendar for website tasks. Do not use personal/private calendars.
- New/updated event art: source official artwork from Marquee or the official venue/promoter first (as done in September), reuse approved assets, optimise WebP. Supplied newer artwork overrides an outdated one. Match image **card containers and aspect ratio**, not by distorting/reimagining posters.
- Anyma 10 Oct: `Race Weekend: Anyma — Closing Set by NASH.D`, **Melodic Techno / Techno / Progressive** (exact words and order), tickets only, NO guestlist. Public calendar event ID `4ulgv7eb7vuaqo8g43eegu6d5k`. The earlier `Mainstage EDM` tag was wrong and was corrected in the calendar; refresh stale ICS cache before inventing metadata overrides.
- Astrolab 17 Oct: approved square official artwork; tickets + guestlist. The portrait art previously made the two featured cards appear inconsistent; preserve important poster text and consistent cards.
- Marquee Halloween 31 Oct: tickets **ONLY**, no guestlist. Official ticket URL `https://marquee.bigtix.io/en/events/halloween-hotel-delirium/MQ261X31`.
- Baes 05 Oct: heading `Baes` (not `Baes — 11PM Till Late`); 11:00 PM – LATE displayed separately; Hip-Hop / R&B; event-specific prefilled Guestlist. The actual prefilled link was saved to the public calendar and subsequently verified. A 3 AM calendar endpoint was provisional and must not be treated as the public headline.
- Kossa October shows: display **FREE ENTRY** (no invented purchase/guestlist CTA).
- Investigate/remove unintended Lulu's Lounge listing from site based on intended schedule/ICS source; do not silently change the underlying public calendar or exclude the venue forever.
- Featured Events (Anyma and Astrolab) must also appear **once each** in All Events; featured does not mean absent from the main listing, and duplication is not acceptable.
- September shows should not remain in active October listings; historic data/submissions stay intact.
- Preserve existing Beta 1 look, booking CTA, mobile-first layout, visual identity and already-approved working content. Maintenance ≠ redesign.

### October code and release checkpoints

- October content/SOP commit: `5678a309b35bc0ebffb2fd90a98e8468c2269ccc`. It reached GitHub; Vercel cloned it and then **failed** at `next/font` on Inter in `app/layout.tsx`: `TypeError: Cannot read properties of null (reading '1')` in Next.js Google font loader (Next 15.5.23). This was not evidence the October calendar/guestlist data was faulty.
- Vercel had auto-selected pnpm 10.28.0. Difference from desired package manager was noted, but **not proven** to cause the font failure.
- Font-fix commit: `ae697d1bed71b374cb9f5c2078fa9d26671d2bb7` — replaced build-time Google Font retrieval with bundled **Inter and Space Grotesk**, preserving intended typography and weights; pinned **pnpm 10.34.6**. Codex reported **44 tests passed**, TypeScript/relevant lint and clean build passed; desktop/mobile preview checked; no October content changed.
- Vercel setting configured by NASH.D (02 Oct): Project → Settings → Environment Variables → **Type: Config**; **Key: `ENABLE_EXPERIMENTAL_COREPACK`**; **Value: `1`**; **Environment: Production**. Check it persists on future builds instead of asking to add duplicates.
- Revised SOP was replaced in the local repo and locally committed as `6fe0302985413e6b2dde061035937feb9f81e51b`; **only `WEBSITE_SOP.md` changed**, clean working tree, **no push or deployment for this commit attempted** at the moment of the report.
- The existing unrelated `components/Hero.tsx` full-repository lint issue was deliberately left alone. Distinguish it from production build blockers.
- **Verification status:** At the last explicit message, do **not** assume the font-fix commit or SOP commit has been pushed or that Vercel production is Ready. Need a genuine GitHub/Desktop and Vercel result before marking production complete. Local commit, GitHub push, saved env var, successful local build, and live deployment are five distinct states.

### Exact release workflow — never substitute new steps

1. ChatGPT gathers user intentions, checks prior decisions and actual public calendar/form dependencies, and drafts one consolidated change request only where needed.
2. Codex edits/tests/previews **locally**; user approves. Codex commits the approved change locally and reports full hash + clean working tree.
3. **NASH.D clicks `Push origin` in GitHub Desktop**. This is the normal push action; do not reflexively insist on Terminal or Codex obtaining GitHub credentials.
4. **NASH.D manually handles deployment in Vercel**; verify the deployment Source is the latest intended commit and status becomes **Ready**. Do not instruct Codex to request Vercel dashboard or Finder permissions, export artwork, or attempt browser workarounds.
5. Verify live djnashd.com on mobile/desktop, actual links/prefill, titles, genre, CTA and list membership. Report success only after verified production; stop the maintenance session once the requested scope is live.
6. A failed deployment needs its *full build log* (first meaningful error and context), not guesses based on the generic `pnpm run build` exited 1 line.

The detailed canonical technical checklist is in repository-root **`WEBSITE_SOP.md`**. This Artist OS section is project context, **not a substitute** for the specific technical runbook.

## 3. AI reliability protocol — READ BEFORE ALL MULTI-STEP WORK

**WARNING — AI CAN GO CRAZY, LOSE TRACK OF CONTEXT, REPEAT ITSELF, AND CONFIDENTLY INVENT OR SKIP STEPS.** It may appear to remember a project while mixing up previous instructions, misreading what is already complete, changing an established workflow without approval, or declaring victory too early. This happened repeatedly during the October website update. It is a failure mode to defend against, not a burden to push back to NASH.D.

Specific incidents to avoid:
- Asked again for poster images after earlier official-Marquee artwork sourcing was established; treated a square-vs-portrait CSS/card issue as a reason to regenerate art.
- Kept rewriting near-identical Codex prompts, even after Codex had completed and verified the work.
- Forgot that Google Form choice → verified prefill → **public Google Calendar description** must happen *before* website sync; initially expected Codex to infer an unshared Baes URL.
- Changed user-specified `Baes — 05 Oct 2026` to `OCT` and `October` despite the established form format.
- Changed Anyma's genre to a near match while omitting **Techno**. Exact approved text was `Melodic Techno / Techno / Progressive`.
- Confused Codex commit, GitHub push, and manual Vercel deployment; suggested extra permissions/steps that were not part of the established workflow.
- Estimated “10–15 minutes” repeatedly without allowing for preview, verification, GitHub Desktop, Vercel build and possible environment issues.
- Described “done” when something was only local/committed or awaiting verification. An announced success is not evidence.

**Mandatory safeguards:**
1. Read the latest Artist OS and relevant SOP **before** undertaking a recurring workflow. At the start, assemble a short state ledger: `approved`, `already changed`, `verified`, `pending`, `blocked`, `who performs next step`, `deploy state`.
2. Prefer exact known event identities, dates, names, URLs, approved creative and prior decisions over reinterpretation. Re-read the source if uncertain. Never infer a link from a newly added Form dropdown choice without validating the link and saving it in the event's calendar metadata.
3. Check actual tools/sources first. Never assert access to a Mac repository, browser session, Forms UI, private file, or asset when not available. No invented paths or completed actions.
4. Make the **smallest approved change**. Do not redesign or regenerate assets to mask a presentation issue. Ask only for information truly missing.
5. Send **one consolidated Codex instruction** after dependencies are ready. If a correction is required, explain exactly what changed from the earlier prompt instead of resending the entire job.
6. Confirm exact copy/labels **character for character**, especially genres, dates, event titles and admission states. Compare against the actual approved gig schedule.
7. Use evidence-backed labels: `Proposed`, `Updated locally`, `Committed`, `Pushed`, `Vercel build failed`, `Production Ready`, `Verified live`. Never merge these into “done.”
8. Separate serious deployment blockers from unrelated historical warnings. Identify first actual build error and commit hash.
9. Do not impose permissions, exports or vendor/model switches mid-task. User controls GitHub Desktop push and Vercel. Respect security prompts; no attempts to bypass denied access.
10. When the user is tired or in a rush: reduce interaction count, avoid redundant confirmations, no optimistic time guarantee, and **stop after the agreed result**.
11. If context conflicts or is missing, explicitly say what is verified and what needs checking, rather than confidently filling gaps. Update the permanent SOP after a new lesson is confirmed.

**Desired assistant behaviour:** “I checked the existing decision and source; X is already done; Y is the single next action; Z remains unverified.” Not “one last thing” five times.

## 4. Website operational guardrails

- Stack at this checkpoint: Next.js 15.5.23, React 19.2.8, pnpm pin 10.34.6 after the font fix, Vercel production; verify actual currently deployed package versions rather than silently assuming local == production.
- Calendar source: public ICS configured via `NASHD_SHOWS_ICS_URL`, previously using 15-minute revalidation. Respect public/private/cancelled and event validation rules; UTC and Asia/Singapore handling; do not edit personal calendars.
- Guestlist V1: existing single Google Form → Master Guestlist Sheet; event-specific prefilled URLs; party size cap 5. WhatsApp deep link may be a later improvement, not a reason to replace the Form/Sheet as source of truth.
- Website booking address: `hello@djnashd.com` with subject `Booking Enquiry — NASH.D`.
- Private Beta/password gate and SEO release conditions must be checked separately from an October event-content deployment. Don't open public indexing or redesign without direct approval.
- Active event artwork and links: official venue/promoter sources first; preserve approved assets; mobile and desktop actual crop review.
- The old full-repository `Hero.tsx` anchor/Link lint issue is pre-existing and a separately scoped future maintenance item. Do not call a failing full lint “all checks passed.”

## 5. Marketing / content OS checkpoint

- Brand/channel priority: Instagram remains the primary short-form channel; TikTok is secondary and should be evaluated separately. On the website, Instagram is primary. YouTube is branded **NASH.D / @DJNASHD**; Mixcloud refreshed. Publish and link cleaned-up long-form content deliberately, not merely to fill a social row.
- Initial content pillar: transition videos with a “Trust me bro” payoff. Not necessary to put the phrase in every caption; natural, cheeky, casual captions beat punny AI copy. Include track names where useful. Preserve DJ flow and NASH.D's taste, not only obvious hits.
- The artist should be the reason people follow: different content has different functions (discovery/shareability, personality, DJ judgment). Do not engineer an entire brand around one viral band, trend or crowd-pleaser.
- Cadence checkpoint: roughly 2 Instagram Reels/week is an acceptable sustainable starting point. Earlier 18 Sep baseline: **4,713 Instagram followers**, **+18** from 16 Aug–18 Sep; historical highest follower gain from any single video **12**. The **10,000 by 31 Dec 2026** target is a stretch, not a default forecast. Measure actual follows per Reel as well as plays.
- A September transition Reel had about **4.8k IG views**; TikTok approximately **300+ followers**, a clip reaching roughly **3.2k views** with no change in followers. Keep platform metrics separate and date observations.
- Proposed expansion sequence: IG/TT short-form → consistent 30–45-minute branded mixtape series → curated Spotify playlist/NASH.D Selects → more deliberate YouTube long form (sets, mixtape visualisers, archive).
- Planned later content pillar: **DJ Etiquette**—educational, professional and constructive; never name/shame younger DJs or frame “old guard versus new guard.”
- Canva schedule SOP: use approved September design as master, maintain brand, split weeks **Monday–Sunday**, use readable mobile-sized show listings; avoid unnecessary exported files or Finder access. October final carousel recorded as six editable **1080 × 1350** pages with 18 performances; user prefers to export personally from Canva.

## 6. Live-event concepts and other Artist OS tracks

### Astrolab / Astrolab: Overdrive
- NASH.D original Marquee concept, dark-to-light space journey; evolving with more DnB and Zippy B2B, thematic activations and custom visuals. October 17 is listed on the website with approved astronaut-at-synth art. Do not treat every Marquee event as Astrolab or assign all to generic mainstage EDM.

### Sunday Reset
- Sunday hip-hop/R&B day-party concept; approximately every two months, four-person core team (two DJs and two ops). Keep its finance, marketing, guestlist, content capture and show-day playbooks separate from ordinary venue gigs.
- Second edition at Orh Gao (late Sep 2026): reported ~103 tickets/people, turnout figure not fully reconciled; revenue snapshot **$7,276.29**, bar cut 0%. Successful giveaway and food response; need stronger/faster musical energy build, improved sound, darker performance area, better bottle-vs-loose-drink plan, one show-day shot-caller and one extra person for live IG Stories. Guests wanted to stay later; venue-dependent extension to 11pm considered.
- Next Moonstone edition: indoor venue with **200 capacity**; plan attendance and guest behaviour rather than assume prior turnout scales. Keep actual ticket count, attendance/clicker and revenues distinct. Eventbrite-to-Sheet syncing to investigate later.

### Zippy × Kya × NASH.D B3B
- New Marquee dance-music B3B: 90–120 minutes; **two songs per DJ then rotate**; Rekordbox USB. VJ switches live simple web games/MS Paint with club-visual overlays; respects venue legal/copyright constraints. VJ has ShowKontrol and sightline; DJ console needs a monitor that mirrors the LED. NASH.D currently calls shots, rotate later; Kya is male; avoid an overly gamified dinner-and-dance vibe. Final energy flow discussed among DJs.

### Music library tasks
- Create accessible high-energy crates: **Jersey Club — Bangers — High BPM**; **Baile Funk — Commercial Remixes — High BPM**; **130–140 BPM — Baile Funk / Jersey / Cyber vibes**. These are live set workflow aids, not genre labels for every public gig.

### Finance / invoicing
- Maintain invoice OS separately: batch by venue and month, invoice date = final show at venue in that month, private events separated from public calendar, mark payments only when NASH.D confirms. Do not generate external SAP invoices for Marquee/Avenue. Check current rate cards against the authoritative invoice tracker before drafting.

## 7. Immediate handover / remaining next actions

1. **Check release status**: latest known local font-fix commit `ae697d1...`; updated `WEBSITE_SOP.md` committed locally at `6fe0302...`, clean tree. Ask whether these have been pushed with GitHub Desktop; do not assume. Confirm newest intended commit in Vercel and whether **Production Ready** and the live site are verified.
2. If the latest Vercel build fails, obtain its **full logs** and focus on the *new* first error, not the prior Inter loader trace by default.
3. Once verified live, add actual production timestamp/commit/status to the release record and **stop**. Avoid new features during the overnight release.
4. Merge this document into the existing Artist OS as a dated October update. Maintain `WEBSITE_SOP.md` as the canonical detailed runbook; the Artist OS must link to it and carry the AI reliability warning prominently.

---

*Prepared from the October 2026 website session and previous Artist OS project checkpoints. Exact user approvals override assumptions. Never turn proposed plans, old snapshots or unverified local statuses into claims of current live production.*
