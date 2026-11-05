# Reference analysis: ForThePeople.in for RSWF

Draft. Owner: Ganesh Reddy. Analysed 2026-11-05 against [jayanthmb14/forthepeople](https://github.com/jayanthmb14/forthepeople) at commit `1131d0180e0fadd851c42a5b6b8ef841670fccfd` (2026-11-04), MIT licence.

Purpose: a future session reads this file instead of the reference code. It holds the vision, what the reference does and does not do, a catalogue of what we can copy and how hard each piece is, and the next changes to our own code.

## Index
1. [Vision](#1-vision)
2. [How to use this file](#2-how-to-use-this-file)
3. [The reference at a glance](#3-the-reference-at-a-glance)
4. [Stack comparison and decision](#4-stack-comparison-and-decision)
5. [Module map: reference to RSWF](#5-module-map-reference-to-rswf)
6. [Component catalogue](#6-component-catalogue)
7. [Port recipe](#7-port-recipe)
8. [Data pipeline pattern](#8-data-pipeline-pattern)
9. [What the reference lacks](#9-what-the-reference-lacks)
10. [Pitfalls to avoid](#10-pitfalls-to-avoid)
11. [Recommended next changes to RSWF](#11-recommended-next-changes-to-rswf)
12. [Open decisions](#12-open-decisions)
13. [Provenance and how to refresh](#13-provenance-and-how-to-refresh)

## 1. Vision

Owner's direction, 2026-11-05: replicate the kind of website ForThePeople.in is, for environmental issues and people. People post issues directly. Public data is pulled in wherever it is available. Colours are our own; the functionality is the target.

Draft vision statement (owner to confirm):

> RSWF is the open site where anyone in India can see which environmental issues are live, who is behind them, what the law and the data say, and where help is needed. Two streams meet on every page. The first is public data, pulled in automatically and shown with its source and its age; when a source is down we show an empty state and never an invented number. The second is issues and evidence posted by people and institutions, reviewed before they are published. Every claim traces to a source. Every number shows when it was last updated.

Functionality to achieve:
1. Public-data dashboards per place and per issue (weather, water, alerts, news, time series), each with source and "as of" date.
2. People and institutions post issues directly, with mandatory evidence (issue #6) and verified institution accounts (issue #7).
3. A reviewer queue that publishes, rejects or asks for more information.
4. A map that opens issues by place.
5. Scheduled data pulls with a run log and a freshness check.

Related: [PRD](PRD.md), [pending features](pending-features.md).

## 2. How to use this file

- Do not re-read the reference repo. Use section 6 to find the file, then fetch only that file, pinned to the analysed commit:
  ```
  gh api "repos/jayanthmb14/forthepeople/contents/<path>?ref=1131d0180e0fadd851c42a5b6b8ef841670fccfd" -H "Accept: application/vnd.github.raw"
  ```
- Licence: the reference is MIT, Copyright (c) 2026 Jayanth M B. Keep the header comment in every copied file. Some headers say "MIT License with Attribution"; keep them word for word. Before the first copy lands, add a `THIRD_PARTY_NOTICES.md` at the repo root with the licence text and a list of copied files (not created yet).
- Evidence levels used below: **R** the file was read by Claude; **S** read in full by a survey pass; **I** inferred from file names, exports and imports only; **D** from the reference's own docs, which drift (see section 13).
- Port ratings: **A** copy with small edits; **B** restyle or rewrite props; **C** tied to their server or data layer, copy the pattern only.
- When a component is copied, change its row's status in section 6 and note the rswf path.
- Detailed survey notes (props, imports, line counts for about 300 files) are in [forthepeople/](forthepeople/). They were written by a helper model and are partly unverified; the verdicts in this file win.

## 3. The reference at a glance

| | |
|---|---|
| What | Free district-level civic transparency platform for India: 36 modules per district plus an India roll-up. Live in 10 districts, goal 780+ (D). |
| Stack | Next.js 16 App Router, React 19.2.3, TypeScript, Tailwind v4 (barely used, see section 4), next-intl, Prisma 7 on Postgres (Neon), Upstash Redis, Vercel Cron, Sentry, Plausible, Razorpay (R/D). |
| Size | 1,565 files, about 20 MB. `src/` has 1,137 files: 337 in `app`, 338 in `components`, 172 in `lib`, 38 in `scraper`, 213 dictionary files. 110 database models, 144 API routes, 21 cron routes. |
| Core rules | Never invent data. Every dataset shows its date. "Live" only if under 30 minutes old. Say "government portals and other reputed sources", never "official only" (D). |
| Data | A few modules fill automatically (weather, crops, news, alerts, dams, courts, tenders); most are hand-curated. As of 28 Sep 2026 production ran 7 of the 21 crons and the AI chain had been failing since 22 Aug (D, may be stale). |
| Funding | Domestic supporters through Razorpay. No ads, no citizen accounts. |

**What it has that we want:** freshness and source shown on every dataset; a cron pipeline with a run log; district and state maps with pins; weather, dam, rainfall and alert modules; a collapsible module sidebar; honest empty and error states; per-page SEO (metadata, sitemap, JSON-LD, Open Graph images); an admin panel.

**What it does not have (verified, R):** public issue posting. Its public write paths are feedback (never shown publicly), feature and district votes, idea suggestions, a tender-alert sign-up and payments. There is no file upload anywhere in `src` (no multipart handler, no file input, no blob storage wired). Nothing makes evidence mandatory. There are no citizen or institution accounts, only one admin login. Citizen Corner, Local Alerts and the RTI tracker are read-only. "Contributors" means paying supporters. So the "people post issues" half of our vision is ours to design; section 9 lists what to borrow.

## 4. Stack comparison and decision

| | RSWF today | Reference |
|---|---|---|
| Framework | Vite 8, React 19, react-router 7: the browser builds each page | Next.js 16 App Router: the server builds each page |
| Language | JavaScript | TypeScript |
| Styling | One `src/styles.css`, CSS variables | CSS variables, inline styles and CSS Modules in the components we checked; Tailwind v4 only imports the theme and one `hidden lg:block` |
| Data | Arrays in `src/data.js`, in-memory stores, lost on reload | Postgres via Prisma, Redis cache, cron jobs |
| Auth | In-memory demo accounts, plain-text passwords (prototype) | Admin only: password + TOTP, signed cookie, revocable Redis session |
| Page HTML for search and link previews | Nearly empty until JavaScript runs | Full HTML per page |
| i18n | None | next-intl, 213 dictionary files (en live; hi, kn beta) |
| Size | About 3,000 lines, 21 pages, 6 stores | 1,565 files |

Key finding (S): 48 of 49 generic UI files use CSS variables and no Tailwind. Our plain-CSS site can take their components with a token copy. The real porting cost is not styling. It is `next-intl` (156 of 338 component files), `next/link`, `next/navigation`, `"use client"` and TypeScript, all mechanical.

**Recommendation (open decision, section 12):**
1. Keep Vite for now. The next changes in section 11 (freshness kit, data layer, forms, map) are all front-end and port cheaply.
2. Port leaf components framework-free: props in, JSX out, text passed as props, links through one small wrapper. Then a later move to Next.js costs little.
3. Decide the move to Next.js when the backend starts (database, cron, per-issue pages for search and WhatsApp previews). Those server features are the real reason to move, not styling. Vercel can also host a Vite site with `api/` functions and cron, so the move is a choice, not a forced step.
4. TypeScript is optional. Copy `.tsx` files as `.jsx` by stripping types, or adopt TypeScript first; decide once, not per file.

Both stacks run React 19. `react-simple-maps` 3.0.0 declares peers only up to React 18; the reference sets `legacy-peer-deps=true` in `.npmrc`. We do not need it: we already draw maps with `d3-geo` and `topojson-client`.

## 5. Module map: reference to RSWF

Data sources in the "idea" column are hypotheses, not verified. Research each before building (section 8).

| Reference module | RSWF equivalent | Data source idea | RSWF status |
|---|---|---|---|
| weather | Rain, heat and air quality beside an issue's place | Open-Meteo (no key) and OpenWeather: the reference's choice (D). IMD, CPCB: unverified | none |
| water (dams) | Reservoirs, rivers, lakes | Reference scrapes one Karnataka portal. CWC bulletins: unverified | none |
| alerts | Flood, cyclone and heatwave warnings | NDMA SACHET CAP feed: used by the reference (`src/scraper/jobs/alerts.ts`) | none |
| news | Evidence candidates per issue, `pending` until reviewed | Google News RSS per place (reference method) | Research tab is manual |
| rti, file-rti | RTI tracker and letter helper | Reference: stats table and a template that computes the 30-day dates | `Rti.jsx` exists |
| infrastructure, tenders | Projects and clearances | PARIVESH (PRD: "used with care"); feasibility unverified | issue cards only |
| courts (NJDG) | Tribunal and court cases per issue | NGT orders: unverified | `legal` data is static |
| health-score | Unified Ecological Progress Index (PRD) | Computed from the readings above | none |
| citizen-corner, responsibility | "What you can do" per issue | Static helplines and AI tips in the reference | Solution tab tasks |
| map | Map by issue and by state | Reference: `DrillDownMap` with pins | `MapView.jsx`, `IndiaMap.jsx` |
| update-log, data-sources | Sources tab and change log | `UpdateLog` table | `Sources` tab |
| features, vote-district | Feature voting | `FeatureRequest`, `FeatureVote` | skip for now |
| contributors, support | Supporters | Razorpay | skip |

## 6. Component catalogue

Paths are in the reference, relative to its root. Line counts as of the analysed commit. **Status** is "not copied" until a row says otherwise.

### 6a. Shared kit (port first)

| # | Reference path | Lines | What it is | Use in RSWF | Port | Lvl |
|---|---|---|---|---|---|---|
| 1 | `src/components/district/ui.tsx` | 2,034 | The shared kit. Split before porting; take only: `describeFreshness` (pure: age in minutes, `isLive` under 30 min, tone, label, exact IST time; line about 203), `FreshnessPill`, `AsOfText` (441), `LastUpdated` (1885), `SourcesFooter` (1664; takes `[{name, url?, licence?, frequency?}]`), `LoadingShell` (1297), `ErrorBlock` (1315), `EmptyState` (1356; "one honest sentence, never a fake zero"), `StatTile`, `KpiRing`, `DataTable` | Freshness, source and state components for every data block | B (split) | R (parts), I |
| 2 | `src/hooks/useFreshness.ts` | 235 | Module-level store with `useSyncExternalStore`, one request per place per 5 minutes, shared by all callers | Same hook over our data layer | C (pattern, reusable) | R |
| 3 | `src/lib/freshness.ts` | n/a | Pure dataset age and status | Backend phase | A | I |
| 4 | `src/components/district/shell/VerifyPanel.tsx`, `StaleDataNotice.tsx`, `verification.ts` | 336, 112, 141 | "How this was verified" panel with source, data date, last check, double-check status; amber stale notice | Pattern for our trust levels (High, Medium, Unverified) | C | I |
| 5 | `src/components/demographics/DataSourceCard.tsx` | 87 | Source citation card: publisher, date, link | Claims and indicators | B | I |
| 6 | `src/components/site/TapCard.tsx` | 78 | Card that opens a dialog. Six other copies exist (`community`, `money`, `land-water/cards.tsx`, `accountability`, `services-1/kit.tsx`, `services-2/kit.tsx`); port this one only | Issue and evidence cards | A | S |
| 7 | `src/components/district/DetailSheet.tsx` | 168 | Generic bottom sheet using `createPortal` | Issue summary on map tap; forms | B | I |
| 8 | `src/components/common/MobileHint.tsx`, `SkipLink.tsx`, `PageProgressBar.tsx` | 79, 31, 194 | Tooltip on desktop and inline text on phones; skip link; top progress bar | Accessibility and polish | A | S |
| 9 | `src/components/common/ModuleErrorBoundary.tsx` | 94 | Error card with "Try again" | Wrap each tab | B | S |
| 10 | `src/components/providers/QueryProvider.tsx` | 34 | React Query client defaults | Only if we adopt `@tanstack/react-query` | A | S |

### 6b. Charts and visuals

| # | Reference path | Lines | What it is | Use in RSWF | Port | Lvl |
|---|---|---|---|---|---|---|
| 11 | `src/components/site/SiteVisuals.tsx` | 288 | `Donut`, `BarList`, `RingStat` in plain SVG; replace the hard-coded `#fff` | Emissions and biodiversity tab | A | S |
| 12 | `src/components/graphics/GlyphBarList.tsx`, `GlyphChips.tsx`, `GlyphEmptyState.tsx`, `GlyphScene.tsx` | 87, 91, 60, 101 | Ranked bars, filter chips with counts, empty state with a picture | Issue filters (`aria-pressed`, 44 px targets) | A | S |
| 13 | `src/components/graphics/CategoryGlyph.tsx`, `glyph-data.ts`, `category-map.ts` | 164, 466, 276 | 56 drawn icons on a 24x24 grid. The shapes and category rules are civic; redraw for forests, rivers, wildlife, lakes | Category icons (system reusable, art not) | A (system) | S |
| 14 | `src/components/prices/PriceChart.tsx` | 81 | Server-drawn SVG line, no client JavaScript | Compare with our `Chart.jsx` (33 lines); keep ours unless we need the 90-day trend labels | A | I |
| 15 | `src/components/money/MoneyToolbar.tsx`, `src/lib/csv.ts` | 80, n/a | CSV download and share toolbar | "Download CSV" on tables | A | I |
| 16 | `src/components/land-water/dam-data.ts`, `DamSheet.tsx` | 50, 202 | Reservoir name matching and fill percent; detail sheet with a Recharts area chart (the only Recharts use) | Reservoir module; use our own chart instead of Recharts | A, B | I |
| 17 | `src/components/weather/ForecastStrip.tsx`, `ForecastCards.tsx`, `useWeatherText.ts` | 115, 378, 68 | Seven-day strip; now and tomorrow cards; plain-language phrases | Rain and heat on issue pages | A, B, B | I |
| 18 | `src/components/tenders/TenderGanttTimeline.tsx` | 119 | Milestone timeline from `TimelineEvent[]` | Clearance and hearing timeline per issue | A | I |
| 19 | `src/components/news/NewsList.tsx` | 174 | News rows with source links | Evidence rows | B | I |

### 6c. Maps and place search

| # | Reference path | Lines | What it is | Use in RSWF | Port | Lvl |
|---|---|---|---|---|---|---|
| 20 | `src/components/map/pin-layout.ts` | 155 | Pure: Mercator projection, `fanOut` for crowded pins, `placeLabels`. Test: `tests/map-pins.test.ts` | Stop overlapping pins on `MapView` (projection constants are India's) | A | S |
| 21 | `src/components/map/mapTheme.tsx` | 272 | `geoStyle`, `indiaStateStyle`, tooltip, legend using `--ftp-map-*` tokens | Map colours from our tokens | B (styles are A) | S |
| 22 | `src/components/map/DrillDownMap.tsx` | 496 | India map: state links, live pins, zoom, touch cards (first tap shows the card, second opens), Escape closes, pins are real links | Replace or extend `MapView`; port from `react-simple-maps` to `d3-geo` | B | S |
| 23 | `src/components/map/GenericStateMap.tsx`, `StateMapSection.tsx` | 130, 74 | Any state from GeoJSON with pins | State pages | B | S |
| 24 | `src/components/map/TalukMap.tsx` | 228 | District taluk map; its own note says taluk shapes are schematic boxes | Do not copy | n/a | S |
| 25 | `src/components/home/useLocate.ts` | 213 | Geolocation to nearest district | "Issues near me" using our `lon`/`lat` | A | I |
| 26 | `src/components/home/district-search.ts`, `src/lib/text/levenshtein.ts` | 233, n/a | Spelling-tolerant place search | Issue and place search | A | I |
| 27 | `src/lib/geo/locate.ts`, `aliases.ts` | n/a | Point-in-polygon, state-name aliases | With 26 | A | I |

### 6d. Layout, forms and pages

| # | Reference path | Lines | What it is | Use in RSWF | Port | Lvl |
|---|---|---|---|---|---|---|
| 28 | `src/components/common/FeedbackModal.tsx` | 318 | Bottom-sheet form: type chips, labelled fields with `useId`, `role="dialog"`, 44 px targets, plain `fetch` POST, success then auto-close. Labels are hard-coded English | Layout and behaviour for the issue form (#6) and institution form (#7). Add evidence, which it lacks | B | R |
| 29 | `src/components/features/SuggestionForm.tsx` | 275 | Idea form with required-field pattern and character counters | Same | B | S |
| 30 | `src/components/common/ReportButton.tsx` (+ `.module.css`) | 329 (+370) | Floating "Report a problem" button with page context | Report wrong data on any tab | B | S |
| 31 | `src/components/layout/Sidebar.tsx` | 286 | Collapsible rail (240 px or 56 px), remembers state, freshness dots, "Coming soon" | Issue-page tab rail | B | S |
| 32 | `src/components/site/PlainPageHeader.tsx`, `SiteHeader.tsx` | 66, 176 | Calm header with back link; gradient band header (breaks their own no-gradient rule) | Take `PlainPageHeader` | B | S |
| 33 | `src/components/site/LegalSection.tsx` + `legal.module.css` | 275 + 61 | Legal clause kit: table of contents, responsive table, "at a glance" cards | Privacy and disclaimer pages | B | S |
| 34 | `src/components/home/CountUp.tsx`, `SectionReveal.tsx` | 59, 40 | Animated number; scroll reveal | We already use framer-motion; skip | n/a | I |

### 6e. Backend patterns (copy the pattern, not the code)

| # | Reference path | What it shows |
|---|---|---|
| 35 | `src/scraper/lib/source-fetch.ts` | `fetchSource`: 20 s timeout, one retry on 500, 502, 503, 504, at least 2.5 s between requests to one host |
| 36 | `src/scraper/lib/sanity.ts` | `parseAmount()` returns null, never 0; range checks before storing |
| 37 | `src/lib/cron-auth.ts`, `src/scraper/lib/cron-run.ts` | Cron secret fails closed; start and finish records; `runOutcome` (ok, partial, skipped, error) |
| 38 | `src/scraper/jobs/alerts.ts`, `weather.ts` | NDMA SACHET CAP alerts; OpenWeather with Open-Meteo fallback (walkthrough in `forthepeople/04-data-pipeline.md`) |
| 39 | `src/lib/rate-limit.ts`, `src/app/api/feedback/route.ts` | Fixed-window limiter in Redis; salted IP hash; validate, then store, then send email without blocking |
| 40 | `src/lib/validators/contributor-name.ts` | Pure name validator (letters only; rejects URLs, phone numbers, promo text) |
| 41 | `src/lib/news-dedupe.ts`, `news-quality.ts`, `ai-json.ts`, `read-api.ts`, `utils/timeAgo.ts` | Pure helpers worth porting when we pull news |

### 6f. Do not copy

- `district/ui.tsx` as a whole (2,034 lines; take the pieces in row 1).
- The six duplicate `TapCard`s, `src/hooks/useRealtimeData.ts` (29 data hooks, not realtime), the whole `india/` component folder (92 files), `TalukMap.tsx`.
- The 22-tab admin panel, Razorpay and supporter code, the AI provider chain. Admin and payments are out of scope; the admin auth design is worth reading (section 10).
- Dead Leaflet rules in `src/app/globals.css` lines 771-819.

## 7. Port recipe

| Reference | In RSWF |
|---|---|
| `.tsx`, types | Strip types and rename to `.jsx`, or adopt TypeScript first (open decision) |
| `"use client"` | Remove (Vite). Keep it if we move to Next.js |
| `next/link` `<Link href>` | `react-router-dom` `<Link to>` |
| `useRouter().push`, `usePathname` | `useNavigate`, `useLocation` |
| `next/dynamic` | `React.lazy` with `Suspense` |
| `next/image` | `<img>` |
| `useTranslations(...)` (156 component files) | Pass text as props. Where a string is only English, keep it in a small `labels` object per component |
| `@/` import alias | Relative imports, or a Vite alias |
| CSS Modules (`*.module.css`) | Work in Vite as they are |
| `react-simple-maps` | Port the few calls to `d3-geo` (we have `d3-geo`, `topojson-client`, `world-atlas`), or install with `legacy-peer-deps` |
| `@tanstack/react-query` | Optional. A plain `useEffect` plus our data layer (section 11, item 2) is enough at first |
| `lucide-react` ^0.577 | We use ^1.62. Check every icon name on import |
| Licence header comment | Keep as it is |

Token map. Their tokens live in `src/app/globals.css`. Ours are in `src/styles.css` `:root`. Colours stay ours.

| Reference token | Meaning | RSWF token (add if marked new) |
|---|---|---|
| `--ftp-bg`, `--ftp-surface` | Page and card background | `--bg`; `--surface` (new, `#fff`) |
| `--ftp-surface-2` | Subtle panel | `--surface-2` (new) |
| `--ftp-border`, `--ftp-border-strong` | Lines | `--line`; `--line-strong` (new) |
| `--ftp-text`, `--ftp-text-2` | Text, secondary text | `--ink`, `--mute` |
| `--ftp-brand`, `-deep`, `-tint` | Brand | `--g1`, `--teal`, `--mint` |
| `--ftp-live` | Fresh data | `--ok` |
| `--ftp-warn` and `-tint` | Stale data | `--warn`; `--warn-tint` (new, `#fff2d1` already used in `Institute.jsx`) |
| `--ftp-danger` and `-tint` | Real errors only | `--sig`, `--sig-bg` |
| `--ftp-shadow-1`, `-2` | Rest, hover | `--shadow-1`, `--shadow-2` (new) |
| `--ftp-radius-card/tile/small/pill` | 14, 12, 10, 999 px | Keep our own shapes (`--shape-a/b/c`); add a pill radius |
| `--ftp-focus` | Focus ring | `--focus` (new) |
| `--hue`, `--hue-deep`, `--hue-pop`, `--hue-tint` (14 sets) | Per-module accent | Define a small set for our categories (Forest, Rivers, Wildlife, Lakes, Air, Climate) |

Motion in the reference: 120, 160, 180 and 560 ms with `cubic-bezier(0.2, 0.7, 0.2, 1)`; reduced-motion turns all motion off. Accessibility rules worth keeping: 2 px focus ring, 44 px touch targets, `role="dialog"` with `aria-modal`, an AA contrast test (`tests/design-tokens.test.ts`).

## 8. Data pipeline pattern

**Collector steps (every cron in the reference follows them):** verify the cron secret (fail closed); write a "running" record; choose the scope; fetch with timeout, retry and per-host spacing; parse; validate with range checks (bad rows are logged and skipped); upsert on a natural key and trim to the newest N; stamp the source's own time, not the fetch time; clear caches only if rows changed; write the run summary; return `partial` rather than being killed at the time limit. A dead source writes nothing.

**What users see:** every payload carries `updatedAt` and `source`. A stale notice uses each module's maximum age. A verify panel gives source, data date, last check and double-check status. The place bar says "N of M live feeds up to date".

**Cron cadence in the reference (UTC, from `vercel.json`):** weather hourly; alerts hourly; dams every 6 h; news every 4 h; crops daily; verify-data and dedupe-data daily. Locks exist on 8 of 21 crons. The runbook disagrees with `vercel.json` for three of them; trust `vercel.json`.

**Reference models that matter for an environment site (15 of 110):** State, District, Taluk, Village, `WeatherReading`, `DamReading`, `RainfallHistory`, `CropPrice`, `LocalAlert`, `NewsItem`, `NewsActionQueue`, `Feedback`, `Suggestion`, `ScraperLog`, `DataVerification`. There is no data-source table; the registry lives in code. Readings keep only the newest 48 rows per place.

**Cache:** Redis (Upstash) with 60 s for live modules and 300 to 600 s for stable ones; `Cache-Control: s-maxage` with stale-while-revalidate on `/api/data/*`. Gap: clearing Redis does not clear the CDN, so a write can show late by up to about three TTLs.

**Proposal for RSWF (our design, not theirs):** eight tables on Postgres when a backend exists.

| Table | Purpose | Key fields | Unique or index |
|---|---|---|---|
| Location | Places, self-parent hierarchy | kind, parentId, slug, name, lat, lng | (parentId, slug) |
| Source | Data-source registry | key, publisher, url, method, licence, cron, expectedAgeHours, lastSuccessAt | key |
| Reading | Time series (rain, water level, air) | locationId, sourceId, metric, value, unit, observedAt, fetchedAt | (sourceId, locationId, metric, observedAt) |
| Alert | Official warnings | locationId, sourceId, externalId, type, severity, startsAt, endsAt, active, sourceUrl | (sourceId, externalId) |
| Issue | An accountability case | slug, title, category, status, locationId, summary | slug |
| Evidence | Every claim links to a source | issueId, kind, url (required), publisher, publishedAt, reviewStatus, confidence | issueId; reviewStatus |
| Submission | Citizen reports | issueId?, locationId?, category, body, contact?, ipHash, status, reviewerNote | (status, createdAt) |
| ScraperRun | One row per job run | job, sourceId?, status, recordsNew, error, startedAt, finishedAt | (job, startedAt) |

Our current shapes map onto these: `issues` to Issue, `claims` and `evidence` (in `data.js`) to Evidence, `evidenceStore` to Submission, the `src` and `trust` fields to Source and `reviewStatus`, `forestSeries` and `tigerSeries` to Reading.

First crons: `ingest-alerts` (30 to 60 min), `ingest-readings` (hourly), `ingest-evidence` (every 4 h, rows enter as `pending`), `freshness-check` (daily; changes no data), `dedupe-evidence` (daily).

**Data-source candidates for environmental data: UNVERIFIED.** The reference proves these work: NDMA SACHET CAP alerts, Open-Meteo (no key), OpenWeather (key), data.gov.in APIs (keyed), Google News RSS, one Karnataka reservoir portal. Hypotheses for us, each needing a licence and terms check before use: IMD rainfall and warnings, CPCB air quality, CWC reservoir bulletins, PARIVESH clearances, NGT orders, FSI forest cover (already in `data.js` as static figures), NTCA tiger census (static). Run the research step (Gemini research, then sceptic review, then Claude verification) before building any of them. The reference notes that some portals are login-gated, behind a captcha, or need permission to reuse; skipping those is the right call.

**Collection manners and legal posture to copy:** 2 to 3 seconds between requests per portal; an honest user agent; never bypass a captcha; no government emblems; a one-time "not a government website" line; each chart carries a source card; the phrase "sourced from" in place of "scraped". Our PRD aims at showing reputational cost to companies and authorities, which is more adversarial than the reference. That raises defamation risk. My recommendation (not from the reference): have a lawyer review the wording rules before company-level claims go public.

## 9. What the reference lacks

Things we must design ourselves, and what to borrow for each.

| Need | Reference has | Borrow | Avoid |
|---|---|---|---|
| Issue submission with mandatory evidence (#6) | Feedback and suggestion forms; no evidence field | Form layout and accessibility from `FeedbackModal`; validate-then-store order and salted IP hash from `api/feedback/route.ts` | No captcha or honeypot there; fingerprint includes User-Agent so changing it bypasses limits; the limiter fails open; no email format check |
| File upload for evidence | Nothing (Vercel Blob "planned, not wired") | Nothing | Design ourselves: private storage, expiring links, type and size limits, malware scan, retention |
| Institution accounts and document verification (#7) | Nothing | Reviewer queue flow from the admin feedback page (list, filter, priority, reply) | Our `Reviewer.jsx` is already richer: three decisions plus a required note |
| Reviewer queue | Admin feedback tab; the review page queues AI news items, not citizen reports | Status vocabulary | Single admin login; add a reviewer role |
| Public tracking of a submission | None (a success message only) | Nothing | Give each submission a status page |
| Duplicate detection for submissions | Dedupe exists for scraped data only | `news-dedupe.ts` key idea | None |
| Retention and erasure | None found | Nothing | Define a schedule (DPDP principles) |
| Location on a submission | Feedback has no coordinates | Nothing | Add lat/lon and place |

## 10. Pitfalls to avoid

Taken from the reference's own bug tracker and checklists (D), mapped to us.

1. A public admin bypass cookie. Use signed, expiring, revocable sessions. Our `authStore.js` keeps plain-text passwords in memory, which is fine for the prototype only.
2. The build ran `prisma db push` on every deploy, previews included. Keep database changes out of builds.
3. Scrapers invented counts when a portal failed. Write nothing and show an empty state.
4. In-memory rate limiters reset on every serverless call. Use Redis; fail closed for logins.
5. A CDN rule once could serve admin JSON to anonymous users. Set `no-store` on private routes.
6. Free AI model IDs were withdrawn and every AI call failed for weeks. If we use AI, add a paid backstop and a monthly check.
7. `/api/health` said healthy with no freshness check. Check freshness, not just liveness.
8. Error monitoring never initialised and nobody noticed. Test error capture end to end.
9. A pilot seed wiped about 50 tables with invented figures. Seeds must refuse to run against production.
10. Supporter phone numbers leaked in public payloads. Anonymise at the API.
11. Lint was red for months. Make lint a CI gate from day one.
12. Documentation drift: three cron schedules differ across their docs. Keep one source of truth.

## 11. Recommended next changes to RSWF

Based on a read of our own code (`src/components/ui.jsx`, `Chart.jsx`, `IndiaMap.jsx`, `data.js`, the stores and 21 pages). Sizes are rough: S under half a day, M about a day, L several days.

**P0, front end only, no backend decision needed**

1. **Freshness and source kit (M).** Our data already has `src` and `trust`. Add `asOf` (date the source published) and `checkedAt`. Build `describeFreshness`, `FreshnessPill`, `SourcesFooter`, `EmptyState`, `LoadingShell` and `ErrorBlock` in `ui.jsx` (rows 1 and 2). Show them on Home indicators, Tracker and every `IssueDetail` tab. This replaces the "Illustrative sample" footnotes with real states and enforces "never a fake zero".
2. **Data access layer (S to M).** Pages import arrays straight from `data.js`. Put them behind functions that return `{ data, updatedAt, source }` and a `useData` hook. The UI stays the same; later the arrays become `fetch` calls. This also keeps a future Next.js move cheap.
3. **Missing tokens (S).** Add the tokens marked new in section 7 to `styles.css`. Ported components need them.

**P1, the core of our vision**

4. **Issue form (#6) and institution form (#7) (M each).** Use the layout in row 28 and 29, with our own fields from the proposals on the issues. Write the server rules down for the backend phase: validation order, salted IP hash, rate limits (the reference uses 10 per hour for feedback and 3 per hour for ideas), mandatory evidence check. The reviewer screen exists.
5. **Map upgrade (M).** Port `pin-layout.ts` so crowded pins do not overlap on `MapView`; add state drill-down from `GenericStateMap` logic using `d3-geo`; open an issue card in a bottom sheet on tap (rows 7, 20 to 23).
6. **Charts (S to M).** Add `Donut`, `BarList`, `RingStat` (row 11) to the Emissions and biodiversity tab. Add CSV download to tables (row 15). Keep `Chart.jsx`.
7. **Issues near me (S to M).** `useLocate` plus our issue `lon`/`lat` (rows 25 to 27).

**P2, needs the backend decision**

8. **Database and cron (L).** Pick a Postgres host. Create the eight tables in section 8. First proof: `ingest-alerts` from NDMA SACHET and `ingest-readings` from Open-Meteo, a `ScraperRun` log, a `freshness-check` job, and a `/api/health` that reports freshness.
9. **Real authentication (L).** Replace the in-memory accounts. Redis-backed rate limits that fail closed for logins; session revocation.
10. **Per-issue SEO (M to L).** Metadata, Open Graph image, JSON-LD, sitemap and robots, as the reference does. Needs server rendering or prerendering, which ties to the stack decision.
11. **Legal pages (S).** `LegalSection` kit (row 33), a "sourced from" wording rule, privacy notice under DPDP principles.

**P3**

12. **i18n.** Hindi and other languages. Keep strings in dictionaries or props from now so adding a language later is cheap.

Do not do now: the admin panel, payments, an AI news chain (cost, and the reference's own AI failures), a 14-hue palette.

## 12. Open decisions

1. Stack and timing: stay on Vite until the backend starts, or move to Next.js now (owner and Raji; record an ADR).
2. TypeScript or JavaScript.
3. Postgres host and Redis, or an alternative.
4. The first three environmental data sources (needs the research step and a licence check).
5. Attribution file: `THIRD_PARTY_NOTICES.md` format.
6. Legal review of company-level wording.
7. Hue set for our categories and the final brand palette.
8. When to start i18n.

## 13. Provenance and how to refresh

- Method: five read-only survey passes by a helper model (docs, generic UI, feature widgets, data pipeline, citizen features and routes), then Claude read the key files itself (`useFreshness.ts`, parts of `district/ui.tsx`, `FeedbackModal.tsx`) and checked claims in the clone: `district/ui.tsx` has 2,034 lines; `TapCard` exists in seven files; `react-simple-maps` is used by seven map files; no upload or blob code exists in `src`; the public POST routes are the ones listed in section 3.
- Not opened: most of the 175 widget files (levels I), the cron route bodies, the payment routes, the webhook signature check, `AdminUser` login mapping. Treat level I rows as leads, and open the file before copying.
- The reference's docs drift: the cron runbook disagrees with `vercel.json`; `docs/DATA-SOURCES.md` (21 Apr 2026) covers only population and map files; its status notes date from 28 Sep 2026. Trust code over docs.
- Survey errata: the survey brief said rswf runs React 18. It runs React 19.
- Refresh when this file is over 30 days old, or before copying a large piece. In a clone of the reference: `git diff 1131d01..HEAD --stat -- src/components src/lib src/scraper`.
