> Survey note from a read-only pass over jayanthmb14/forthepeople at commit 1131d0180e0fadd851c42a5b6b8ef841670fccfd (2026-11-04), written 2026-11-05 by a helper model. Summary and verdicts: [../forthepeople-analysis.md](../forthepeople-analysis.md). Lines marked "unverified" or "inferred" were not opened.
> Errata: the survey brief said rswf runs React 18. rswf runs React 19 (see package.json). Where this note says "fine for React 18 (rswf)", read: react-simple-maps 3.0.0 declares peers up to React 18, so React 19 needs `legacy-peer-deps` (the reference sets `legacy-peer-deps=true` in its `.npmrc`) or a port of the map code to d3-geo, which rswf already uses.
# A: ForThePeople.in documentation survey

Read-only survey of the reference clone's docs. Paths are repo-relative. The latest dated status is 28 Sep 2026 and today is 5 Nov 2026, so status claims are about five weeks old. "Unverified" means the docs do not say, or I could not check.

**Index**
- [1. Product](#1-product)
- [2. Modules](#2-modules)
- [3. Architecture](#3-architecture)
- [4. Data sources](#4-data-sources)
- [5. Refresh pipeline](#5-refresh-pipeline)
- [6. Design system](#6-design-system)
- [7. Layout and i18n](#7-layout-and-i18n)
- [8. Legal and compliance](#8-legal-and-compliance)
- [9. Lessons and pitfalls](#9-lessons-and-pitfalls)

## 1. Product

- Free, MIT-licensed district transparency platform for India, built by Jayanth M B. Not a government site (`README.md`, `docs/BLUEPRINT-UNIFIED.md` §1).
- Users: exam aspirants, citizens, researchers, journalists, officials (BLUEPRINT §2).
- Live in 10 districts in 7 states; goal 780+ (README, BLUEPRINT §13).
- 36 modules in 9 groups per district, plus an India roll-up (`docs/MODULE-MAP.md`).
- Languages: English default; Hindi and Kannada beta; 20 more planned (`docs/I18N.md` §7).
- Core rule: never invent data. A failed source writes nothing and shows an empty state (`CLAUDE.md`, BLUEPRINT §6).
- Every dataset shows its date; old data gets an amber notice; undated data says "Date not published by the source" (`docs/DESIGN-SYSTEM.md` §6).
- "Live" only under 30 minutes old (DESIGN §6). Sources are "government portals and other reputed sources", never "official only" (`CLAUDE.md`).
- Funded by domestic supporters via Razorpay. No ads, no third-party cookies, no citizen accounts (BLUEPRINT §11, `docs/ARCHITECTURE.md` §9).

## 2. Modules

Route for all 36: `/[locale]/[state]/[district]/<slug>` (BLUEPRINT §3). S-codes: section 4.

| Slug | Purpose | Data source |
|---|---|---|
| overview | District summary | Other modules |
| news | Headlines and summaries | S1 |
| alerts | Official warnings | S2 |
| weather | Reading and forecast | S3 |
| responsibility | What you can do | News; `src/lib/constants/responsibility-content.ts` |
| citizen-corner | Helplines and rights | Manual, unverified |
| file-rti | How to file an RTI | Static, unverified |
| rti | RTI reply tracker | Unverified |
| leadership | Leaders and officers | Seeded; top posts via S14 |
| elections | Results and calendar | Unverified |
| gram-panchayat | Village councils | Redis snapshot (ARCHITECTURE §3.3) |
| courts | Pending and decided cases | S6 |
| police | Police and crime | Unverified |
| finance | Budget | Hand-seeded; `scrape-budget` is a no-op |
| infrastructure | Projects being built | Manual, unverified |
| tenders | Government tenders | S10 |
| industries | Local industries | Manual, unverified |
| schemes | Government schemes | Manual, unverified |
| housing | Housing schemes | Unverified (PMAY named) |
| services | Certificates and steps | Manual, unverified |
| offices | Government offices | Manual, unverified |
| exams | Exams and jobs | S11 |
| jjm | Tap-water coverage | S7 |
| water | Dams and rivers | S5 |
| power | Power cuts | Unverified |
| transport | Buses and trains | Unverified |
| health | Hospitals | Unverified |
| schools | Schools | S8 |
| crops | Mandi prices | S4 |
| farm | Farm advice | Unverified |
| population | Census, poverty index | S13 |
| map | District and taluk maps | S19 |
| famous-personalities | Famous people | Manual; `bornInDistrict` rule |
| contributors | Supporters | Payments, anonymised |
| data-sources | Where data comes from | Unverified |
| update-log | Change history | `UpdateLog` table |

## 3. Architecture

- **Stack:** Next.js 16 App Router, React 19.2.3, TypeScript, Tailwind v4, next-intl, Prisma 7 on Neon Postgres, Upstash Redis (REST), Vercel region `bom1`, Node 24. No long-running worker (ARCHITECTURE §1).
- **Request flow:** `src/proxy.ts` (locale routing) to `src/app/[locale]/` server components, which call loaders directly. Client charts use React Query on `src/app/api/data/[module]/route.ts`, which returns `{ data, updatedAt, source }` (ARCHITECTURE §2, §3.4).
- **Caching:** India pages are static with revalidation. Page requests never call an AI model. Admin JSON is `no-store`. Forecast: Redis 1 h, CDN 30 min (ARCHITECTURE §3.8, §5; BLUEPRINT §8).
- **Data:** Prisma schema `prisma/schema.prisma` (108 models per README, unverified). Money in whole rupees. Some district figures live in Redis with no expiry (ARCHITECTURE §3.3).
- **Schema changes:** edit schema, run `npm run db:push` against prod, then push code. The build never touches the DB (`CLAUDE.md`).
- **Auth:** admin is password plus TOTP, with 8-hour Redis-backed sessions and `requireAdmin()` on every admin route (`docs/RUNBOOKS/admin-auth.md`).- **Folders:** `src/app`, `src/components`, `src/lib`, `src/scraper` (jobs), `src/dictionaries`, `tests` (Vitest), `scripts` (`scripts/archive/` never run), `docs/archive/` (history only). Styling is not one global CSS file: tokens in `src/app/globals.css` plus module CSS (DESIGN §2, §9).
- **Conventions:** one AI entry point (`callAI` / `callAIJSON`); model IDs only in `src/lib/ai-models.ts`; `@upstash/redis` only; `src/proxy.ts`, never `middleware.ts`; deploy by git push, never `npx vercel --prod`; never `npm audit fix`; `take: N` on large queries; every string in en, hi and kn; every env var in `.env.example`.

## 4. Data sources

Refresh is the cron cadence in `vercel.json`. "Not stated": the docs name the source but not its endpoint.

| ID | Source | URL or API | Method | Refresh | Terms note |
|---|---|---|---|---|---|
| S1 | Google News RSS | Not stated | Feed | 4-hourly | Headline, summary, link only |
| S2 | NDMA SACHET | CAP feed | Feed | Hourly | Official; expires at CAP date |
| S3 | OpenWeather, Open-Meteo | APIs (OpenWeather keyed) | API | Hourly | Open-Meteo licence question open (BLUEPRINT §17) |
| S4 | AGMARKNET (data.gov.in) | API, keyed | API | Daily | Stale upstream seen 26 Apr 2026 |
| S5 | Karnataka water portal | Not stated | Scrape | 6-hourly | Live districts only |
| S6 | NJDG dashboards | Not stated | Scrape | Twice daily | 3 requests per unit, 3 s apart |
| S7 | JJM dashboard | Not stated | Scrape | Daily | Two endpoints must agree |
| S8 | UDISE+ | Not stated | Scrape | Weekly | Totals must add up |
| S9 | NREGA "At a glance" | Not stated | Scrape | Daily | Snapshot read by gram-panchayat |
| S10 | GePNIC (MH, TN, WB, Delhi) | Not stated | Scrape | 2-hourly | Read from each tender's page |
| S11 | UPSC, SSC pages | Official pages | Scrape | Daily | 1 request per 2.5 s |
| S12 | PPAC, BPCL fuel | PDFs | Scrape | Twice daily | Writes nothing if sources disagree |
| S13 | Census 2011, NITI MPI 2023 | censusindia.gov.in; niti.gov.in | Manual | Periodic | GODL-India; attribution |
| S14 | Wikipedia, Wikidata | Not stated | API | Daily | Top posts only |
| S15 | IBJA, Yahoo Finance | Not stated | Live fetch | Cached | Terms unverified |
| S16 | Seeded or researched rows | Per-row source fields | Manual | None | Source stored per row |
| S17 | Karnataka DES | des.karnataka.gov.in | Manual | Annual | Permission needed to reuse |
| S18 | NFHS-5 | IIPS (login), DHS, Harvard CSV | Manual | Pending | Login-gated; not automated |
| S19 | DataMeet, geohacker | GitHub | File | Static | OGL India, CC-BY |

**Gap:** `docs/DATA-SOURCES.md` (last updated 21 Apr 2026) covers only population and map files, yet says every number must trace to it. S1 to S12 have no entry.

## 5. Refresh pipeline

**Schedule.** `vercel.json` holds 21 crons. Times are UTC; IST is UTC + 5:30 (`docs/RUNBOOKS/crons.md` §1).
- Hourly: scrape-weather `0 * * * *`, scrape-alerts `5 * * * *`
- Every 2 h: scrape-tenders. Every 3 h: translate-content. Every 4 h: scrape-news, news-intelligence. Every 6 h: scrape-dams.
- Twice daily: generate-insights `0 0,12`, scrape-courts `40 1,13`, scrape-fuel `0 7,14`
- Daily: health-score 01:30, scrape-crops 03:30, scrape-jjm 04:15, scrape-mgnrega 04:50, update-exams 06:30, verify-data 06:45, dedupe-data 07:15
- Weekly: platform-report (Sun), generate-citizen-tips (Sun), scrape-budget (Mon), scrape-schools (Tue)
- **Drift:** the runbook and BLUEPRINT §7 say weather and alerts run every 30 min; SCALING-CHECKLIST says weather every 5 min. BLUEPRINT §7 omits dedupe-data and scrape-fuel.

**Run.** Each route checks the bearer secret and fails closed if unset. It writes a `ScraperLog` row and Redis `ftp:cron:<name>`. Slow collectors take lock `lock:cron:<name>`; an overlapping run returns `skipped`. Each route has a time budget and returns `partial: true` rather than being killed (runbook §1 to §4).

**Failure.** A failed job writes nothing. When every AI model fails, Redis `ftp:ai:degraded` is set and the admin gets one email a day. `/api/health` marks a cron stale past 2x its interval (runbook §5; `docs/RUNBOOKS/ai-models.md` §2).

**Manual run.** `curl -H "Authorization: Bearer $CRON_SECRET" https://forthepeople.in/api/cron/<name>` (runbook §3).

**Shown to users.** Every payload carries `updatedAt` and `source`. `StaleNotice` uses each module's max age. `VerifyPanel` at the bottom gives source, data date, last check and double-check status. The district bar shows "N of M live feeds up to date" (ARCHITECTURE §3.4 to §3.5).

**Build note.** `vercel.json` `buildCommand` omits `gen-i18n-namespaces.mjs`, which the `package.json` build runs. Whether Vercel needs it is unverified.

## 6. Design system

Source: `docs/DESIGN-SYSTEM.md` v5.7 "White Calm, edged" (28 Sep 2026). Tokens in `src/app/globals.css`. No hex in components.

- **Surfaces:** `--ftp-bg` #F2F4F8; `--ftp-surface` #FFFFFF; `--ftp-surface-2` #F3F6FA; `--ftp-border` #DAE2EE
- **Text:** `--ftp-text` #0F1B2D; `--ftp-text-2` #4A5A70
- **Brand:** `--ftp-brand` #2563EB; `--ftp-brand-deep` #1E40AF; `--ftp-brand-tint` #E8F0FE; `--ftp-focus` #2563EB
- **Status:** `--ftp-warn` #B45309 (stale); `--ftp-live` #16A34A (fresh); `--ftp-danger` #B42318 (real errors only); `--ftp-support` #B4234F
- **Module hues:** 14 in `src/lib/design/hues.ts`, each with `--hue`, `--hue-deep`, `--hue-pop`, `--hue-tint`. Charts are always blue.
- **Gold and silver:** money and metals only; not yet in `globals.css` (DESIGN §2).
- **Type:** Plus Jakarta Sans; Bricolage Grotesque optional for H1 only, an open owner question (BLUEPRINT §17). H1 30/36, H2 21/28, card title 15 to 16/22 bold, body 15/22, labels 12/16.
- **Radius:** card 14, tile 12, small 10, pill 999 px. **Shadows:** `--ftp-shadow-1` rest, `--ftp-shadow-2` hover.
- **Motion:** `--ftp-dur-fast` 120 ms, `--ftp-dur` 160 ms, `--ftp-dur-slow` 180 ms, `--ftp-dur-draw` 560 ms, `--ftp-ease` cubic-bezier(0.2, 0.7, 0.2, 1).
- **Spacing:** no scale documented (unverified).
- **Kit:** PageHeader, StaleNotice, StatTile, Card, DetailSheet, ChartCard, VerifyPanel, about 56 SVG glyphs in `src/components/graphics/`. Emoji only as module identity.
- **Dark mode:** not documented (only home gold tokens mention it, DESIGN §2).
- **Accessibility:** AA contrast test at `tests/design-tokens.test.ts`; 2 px focus ring; 44 px touch targets; reduced motion turns all motion off; dialogs use `role="dialog"` and `aria-modal`.
- **Conflicts:** DESIGN §10 keeps v5.1 pastel-sky text under a v5.2 override. BLUEPRINT §5 describes v5.1 (`#F5F8FC`, pastel ribbon). `docs/LAYOUT.md` puts emoji in stat tiles, which DESIGN §4 forbids.

## 7. Layout and i18n

- **Breakpoints** (`docs/LAYOUT.md`): phone under 640 px (top bar and drawer, 16 px sides); tablet 640 to 1023 (20 px); laptop 1024 to 1439 (sidebar, 28 px); PC 1440 and up (sidebar, 1320 px frame).
- **Rules:** auto-fill card grids (280 px minimum); tables become cards on phones; page recipe: header, one-sentence answer, numbers, one picture, cards, charts, verification.
- **Languages** (`docs/I18N.md`): English default with no locale detection or cookie. Routed: en (live), hi and kn (beta, machine drafts). Registry: `src/i18n/languages.ts`.
- **Messages:** `src/dictionaries/<code>.json` plus `<code>/page_<name>.json`, indexed by `scripts/gen-i18n-namespaces.mjs`. Missing keys fall back to English.
- **Rules:** no English literals in JSX, aria-label or alt; variables, not concatenation; ICU plurals; en-IN number grouping with Latin digits.
- **Live text:** news and insights translated once into `ContentTranslation`; page reads never call a provider.
- **Scripts:** Noto via `next/font/local` for five scripts; others pending.

## 8. Legal and compliance

- **Banned in public text** (`docs/LEGAL-COMPLIANCE.md`): "scrape" forms, "corruption", "suspicious" (about spending), "promises vs reality", "ACTUALLY" in caps, "hold power accountable". Use "sourced from".
- **Sources:** "government portals and other reputed sources"; no emblems or seals; "not a government website" stated once per page. Each chart carries a source card.
- **Demographics:** only SC, ST and Other caste categories; no religion-by-caste-by-ward cross-tabs; cells under n=10 suppressed at ward level; election mode during the 48-hour pre-poll window (LEGAL §3A to §3G). Statutes cited there are unverified.
- **RTI:** RTI modules exist; README cites Article 19(1)(a). No doc read cites the RTI Act 2005.
- **Grievance and privacy:** support@forthepeople.in, 15-day SLA (doc claim). Cookieless analytics; salted IP hashes; supporter names anonymised at the API; DPDP enforcement "13 May 2027" is the doc's claim, unverified.
- **Collection:** 2 to 3 s between requests per portal; honest user agent; no captcha pages (runbook §7). GeM was skipped over Cloudflare Turnstile (LIVE-STATE, 20 Apr).
- **Never:** store budgets in crores; use SECC 2011 raw caste data (doc says unreleased); fabricate values.

## 9. Lessons and pitfalls

From BUG-TRACKER (B), SCALING-CHECKLIST (S) and LIVE-STATE (L).

1. The admin cookie `ftp_admin_v1="ok"` was a public bypass (B SEC-1). Use signed, expiring, revocable sessions.
2. Build ran `prisma db push` on every deploy, PR previews included (B SEC-2). Keep DB changes out of builds.
3. Scrapers invented counts on portal failure (B DATA-1). Write nothing; purge fabricated rows.
4. In-memory rate limiters reset on each serverless call (B June SEC-3). Use Redis. `rateLimit()` fails open (S, 11 Jun entry), but admin login fails closed (admin-auth runbook §2).
5. A CDN rule on `/api/(.*)` could serve admin JSON to anonymous users (B Sept table, SEC-3). Set `no-store`.
6. Free AI model IDs were withdrawn; every AI call failed from late August 2026 (B AI-1). Add a paid backstop and monthly checks.
7. `/api/health` reported healthy with no freshness check (B OPS-1).
8. Sentry never initialised: `instrumentation.ts` was missing, so zero events arrived (L, 26 Apr; fixed Session 10.5). Test error capture end to end.
9. Razorpay amounts for three plans were 5 to 10 times their UI labels (L, 26 Apr). README tier prices are unverified.
10. Five scroll-fix sessions (6.5 to 7.7) were masked by a global CSS smooth-scroll rule and stale `.next` output (L).
11. A pilot seed wiped about 50 tables with invented figures (S Part 3). Seeds must refuse production. Seeded random numbers were removed 27 Sep 2026 (BLUEPRINT §17).
12. Seeded rows double-count with cron rows: delete 18 seeded `JJMStatus` rows before the JJM cron's first run (runbook §1).
13. SSR must not depend on client data; the "NEW" pill needed a static fallback (L, Session 4).
14. Placeholder contacts and a fake `alert()` shipped in tenders (L, 20 Apr).
15. Lint was red for months (B CI-1).
16. Supporter phone numbers leaked through public payloads (B PRIV-1). Anonymise at the API.
17. Deploys blocked since 13 Sep 2026 on an owner billing action (B OPS-2, OPEN). Live secrets sat in vault notes (B SEC-7, OPEN). Keep names only.
18. Doc drift: "not pushed" notes stayed stale for months (B correction). LIVE-STATE (20 Apr) says run `db:push` at deploy, reversed 11 Jun. DATA-SOURCES points Pune taluk work to BUG-TRACKER, which has no entry.
