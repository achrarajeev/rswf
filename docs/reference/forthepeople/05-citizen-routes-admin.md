> Survey note from a read-only pass over jayanthmb14/forthepeople at commit 1131d0180e0fadd851c42a5b6b8ef841670fccfd (2026-11-04), written 2026-11-05 by a helper model. Summary and verdicts: [../forthepeople-analysis.md](../forthepeople-analysis.md). Lines marked "unverified" or "inferred" were not opened.
> Errata: the survey brief said rswf runs React 18. rswf runs React 19 (see package.json). Where this note says "fine for React 18 (rswf)", read: react-simple-maps 3.0.0 declares peers up to React 18, so React 19 needs `legacy-peer-deps` (the reference sets `legacy-peer-deps=true` in its `.npmrc`) or a port of the map code to d3-geo, which rswf already uses.
# D: Citizen features, community routes and admin (ForThePeople.in)

Source: read-only clone at `scratchpad/ftp` (paths below are repo-relative to that clone). Facts from reading code only; nothing was run. "Unverified" marks anything not read.

**Index**
- [0. Stack facts](#0-stack-facts)
- [1. Route map](#1-route-map)
- [2. Citizen features](#2-citizen-features)
- [3. Admin panel](#3-admin-panel)
- [4. Cross-cutting](#4-cross-cutting)
- [5. Reuse for an issue-submission form](#5-reuse-for-an-issue-submission-form)
- [6. Gaps against rswf needs](#6-gaps-against-rswf-needs)
- [7. Not verified](#7-not-verified)

## 0. Stack facts

- License is MIT (`LICENSE`, `package.json`). Your description matches: Next.js App Router, TypeScript, Tailwind v4 (`tailwindcss` and `@tailwindcss/postcss` are devDependencies; `src/app/globals.css` imports tailwindcss), Prisma with Postgres (`@prisma/adapter-pg`).
- Two corrections: FTP runs **React 19.2.3** and **Next ^16.3.4**, not React 18. `vite` and `vitest` are devDependencies (test tooling), not the app bundler.
- Counts (from Glob and Grep): 74 `page.tsx`; 52 `layout.tsx` under `src/app/[locale]` plus the root layout; 144 `route.ts` files under `src/app/api` with 178 HTTP handler exports; 21 cron route files. I did not count the total of 337 files.
- Styling in the community, civic and citizen files I read: inline styles with `var(--ftp-*)` tokens and custom `ftp-*` classes. I saw no Tailwind utility classes there.

## 1. Route map

### 1a. Pages (`src/app/`)

| URL | File | Shows |
|---|---|---|
| `/` | `page.tsx` | Root (unverified; likely a locale redirect) |
| `/[locale]` | `[locale]/page.tsx` | Home; `opengraph-image.tsx` alongside |
| `/[locale]/[state]` | `[locale]/[state]/page.tsx` | State page |
| `/[locale]/[state]/[district]` | `…/[district]/page.tsx` | District overview |
| `…/[district]/<module>` | `…/[district]/<module>/page.tsx` (34 folders) | Module pages: alerts, citizen-corner, contributors, file-rti, rti, courts, crops, data-sources, elections, exams, famous-personalities, farm, finance, gram-panchayat, health, housing, industries, infrastructure, jjm, leadership, map, news, offices, police, population, power, responsibility, schemes, schools, services, transport, update-log, water, weather |
| `…/[district]/tenders` | `tenders/page.tsx`, `[tenderId]`, `apply-guide`, `disclaimer`, `how-it-works`, `transparency` (6 pages) | Tender list, detail and guides |
| `…/[district]/[taluk]`, `…/[taluk]/[village]` | 2 pages | Taluk and village |
| `/[locale]/features` | `features/page.tsx` + `FeaturesClient.tsx` | Feature votes; "Share your idea" form |
| `/[locale]/vote-district` | `vote-district/page.tsx` (component in `src/components/vote-district/`) | Vote for a waiting district; top requested |
| `/[locale]/feedback` | `feedback/page.tsx` + `FeedbackClient.tsx` | Feedback form |
| `/[locale]/contribute` | `contribute/page.tsx` + `ContributeClient.tsx` | Ways to help; feedback sheet; top requested districts |
| `/[locale]/contributors` | `contributors/page.tsx` + `GlobalContributorsClient.tsx` | National supporter leaderboard |
| `/[locale]/[state]/[district]/contributors` | `…/contributors/page.tsx` + `ContributorsClient.tsx` | District supporters |
| `/[locale]/support` | `support/page.tsx` | Donation checkout and supporter wall |
| `/[locale]/india`, `…/india/[moduleSlug]`, `…/india/category/[superCategorySlug]`, `…/india/updates` | 4 pages | National modules; Dataset JSON-LD on module pages |
| `/[locale]/admin` and 11 subpages | `admin/**/page.tsx` | Admin tabs (section 3) |
| `/[locale]/admin-recover` | `admin-recover/page.tsx` | 2FA recovery request, outside the admin layout |
| `/[locale]/about`, `privacy`, `disclaimer`, `prices`, `compare`, `offline` | one page each | Static and content pages |

### 1b. API routes (`src/app/api/`)

Citizen write paths. All are public, with no login.

- `POST /api/feedback` (`feedback/route.ts`): store a feedback row.
- `GET`, `POST /api/features` (`features/route.ts`): list features; vote with `?id=`.
- `GET`, `POST /api/district-request` (`district-request/route.ts`): top or all counts; vote for a waiting district.
- `GET`, `POST /api/suggestions` (`suggestions/route.ts`): public accepted list; submit an idea.
- `GET`, `POST /api/india/suggestions`; `POST /api/india/suggestions/[id]/vote`: India module ideas and votes.
- `POST /api/tenders/alerts/subscribe`: store a tender alert contact (consent required).
- `POST /api/payment/create-order`, `create-subscription`, `verify`, `verify-subscription`; `POST /api/webhooks/razorpay`: donations.
- `GET /api/payment/contributors`, `GET /api/data/contributors`: public-safe supporter lists.

Public reads: `GET /api/data/[module]` (module feeds, including alerts and rti); about 25 `/api/data/*` subroutes (court-pendency, dam-history, election-events, exam-news, exams, forecast, freshness, glance, health-score, homepage-stats, infra-analysis, insight, leader-news, population/profile, prices, resolve-ids, responsibility, scheme-coverage, update-log, verification, village and others); `GET /api/ai/citizen-tips` (cache only); `GET /api/ai/insight`; `GET /api/site-announcement`; `GET /api/health`; `GET /api/public/district/[district]`; `GET /api/india/*`; `GET /api/tenders/*` (about 10 routes).

Admin (`/api/admin/*`, section 3 for auth), grouped by family:
- `2fa` (setup, verify, disable, recover, recover/verify); `security` (GET, PATCH; `logout-all` POST); `users` (GET, POST; `[id]` PATCH, DELETE).
- `vault` (GET, POST; `[id]` GET, PATCH, DELETE; `[id]/reveal`; `session` GET, DELETE; `unlock` POST).
- `feedback-list` (GET, PATCH); `feedback/reply`, `classify`, `classify-toggle` (GET, POST), `templates`, `[id]/reclassify`.
- `suggestions` (GET); `suggestions/[id]` (PATCH, DELETE).
- `supporters` (GET); `supporters/[id]` (PATCH); `[id]/flag`, `[id]/flag-message` (PATCH); `manual-supporter` (POST); `sync-razorpay` (POST); `subscriptions` (GET, POST, PATCH, DELETE), `[id]` (PATCH, DELETE), `[id]/reveal` (GET); `payments` (GET); `finance-summary`, `dashboard-summary`, `nav-counts`, `usage`, `openrouter-usage` (GET).
- `expenses` (GET, POST); `expenses/[id]` (PATCH, DELETE).
- `responsibility` (GET, POST); `responsibility/[id]` (PATCH, DELETE).
- `content` (GET); `content/save` (POST); `support-config` (GET, PUT); `site-announcement` (GET, PUT).
- `alerts` (GET, PATCH, DELETE; this is `AdminAlert`, not public alerts); `expire-stale` (POST); `cleanup-news` (POST).
- `ai-settings` (GET, PUT); `ai-test` (POST); `bot` (GET, POST); `fact-check`, `fact-check-all`, `fact-check-module`, `fact-check-status`.
- `run-scraper` (POST); `scraper-logs` (GET, DELETE); `system-health`, `sentry-errors`, `traffic`, `analytics`, `audit-log`, `update-log`, `population-audit`, `verify-data`, `platform-report` (GET, POST); `seed-tenders` (POST, `SEED_SECRET` only); `districts`, `sync-razorpay`.

Cron: 21 route files under `src/app/api/cron/` (`scrape-*`, `generate-*`, `verify-data`, `dedupe-data`, `health-score`, `news-intelligence`, `platform-report`, `translate-content`, `update-exams`). All call `verifyCron` from `src/lib/cron-auth.ts` (grep check).

## 2. Citizen features

Common to all six: no login, no captcha, no honeypot. Validation is hand-written (no schema library in the app). Rate limits come from `src/lib/rate-limit.ts`, which fails open on a Redis outage unless a caller passes `failClosed`.

### 2.1 Citizen Corner (`[state]/[district]/citizen-corner`)
- **Citizen can:** call helplines (`tel:` links), read rights cards, read this month's AI civic tips. No submission.
- **Form fields:** none. Validation and spam controls: not applicable (GET only).
- **Moderation:** tips are written weekly by AI (`api/cron/generate-citizen-tips`). A route comment says none had been written since Aug 2026, so the page shows an empty state.
- **Storage:** `CitizenTip`, served from Redis cache for 7 days (`src/lib/citizen-tips.ts`).
- **Public:** helplines (static list in `src/components/district/civic/CitizenParts.tsx`) and tips.
- **Notification:** none.
- **Files:** `src/app/[locale]/[state]/[district]/citizen-corner/page.tsx`; `src/app/api/ai/citizen-tips/route.ts`; `src/app/api/cron/generate-citizen-tips/route.ts`.

### 2.2 Local Alerts (`…/alerts`)
- **Citizen can:** view warnings sorted by severity; open a "what to do" sheet; tap to call 112, 1077 (disasters) or 101 (fire). Reports go through the site-wide Report button, not this page.
- **Form fields:** none.
- **Data source:** `LocalAlert` rows from the scraper (`src/scraper/jobs/alerts.ts`, cron `scrape-alerts`; code comments name the NDMA SACHET feed), and AI rows built from news (`autoGenerated`, cron `scrape-news` and `news-intelligence`).
- **Moderation:** no admin edit screen for `LocalAlert`. Admin can only run bulk endpoints (`expire-stale`, `cleanup-news`).
- **Public:** every active alert for a district; ended ones are dimmed.
- **Notification:** none.
- **Files:** `…/alerts/page.tsx`; `src/hooks/useRealtimeData.ts` (`useAlerts`, line 630); `src/app/api/data/[module]/route.ts` (`LocalAlert` query, line 680); `src/app/api/admin/expire-stale/route.ts`.

### 2.3 RTI tracker and File RTI (`…/rti`, `…/file-rti`)
- **Tracker:** read-only table of RTI stats per department and month (filed, disposed, pending, average days against the 30-day limit). Rows whose source says "estimated" are dropped. No citizen submission.
- **File RTI:** pick an active template (`RtiTemplate`), copy the letter, then enter the sent date. The page computes the reply date (+30 days) and the appeal date (+30 days) in the browser. Nothing is sent. The letter goes by post or to rtionline.gov.in.
- **Form fields:** one date input. Neither page writes to the server.
- **Template moderation:** unverified (templates are not among the admin tabs).
- **Files:** `…/rti/page.tsx`; `…/file-rti/page.tsx`; `src/hooks/useRealtimeData.ts` (`useRTI`, line 587); `src/app/api/data/[module]/route.ts`. Models: `RtiStat`, `RtiTemplate`.

### 2.4 Feature voting (`/features`)
- **Citizen can:** vote for a feature request; see votes and status.
- **Form fields:** none beyond `?id=`. `id` is required (400); the feature must exist (404).
- **Spam controls:** 20 votes per hour per hashed IP. One vote per `(featureId, fingerprint)`, where fingerprint is the first 32 hex characters of sha256(IP + User-Agent). A repeat returns 409.
- **Weakness:** the fingerprint includes User-Agent, so one IP can cast up to 20 votes an hour by changing it. The duplicate check is a read followed by a transaction. A concurrent duplicate hits the unique index, and the POST handler has no try/catch, so it likely returns 500 (inferred from code, not run).
- **Moderation:** none. Features are seeded by `scripts/seed-features.ts` (file name only; contents not read). There is no create or edit API and no admin tab.
- **Storage:** `FeatureRequest`, `FeatureVote`.
- **Public:** all features with votes, status and priority.
- **Files:** `src/app/[locale]/features/page.tsx`; `FeaturesClient.tsx`; `src/app/api/features/route.ts`; `src/lib/rate-limit.ts`; `scripts/seed-features.ts`.

### 2.5 Feedback (Report button, `/feedback`, `/contribute`)
- **Citizen can:** send feedback from the site-wide "Report a problem" button (`ReportButton`, mounted in `src/app/[locale]/layout.tsx`), from `FeedbackModal` (used on `/support`), from `/feedback`, or from `/contribute`.
- **Form fields (FeedbackModal):** type (bug, wrong_data, suggestion, praise, other); subject (required, max 200); message (required, max 2000); name (optional, max 100); email (optional, max 200, `type="email"`); context fields (district, state, module). `/contribute` also sends district_request, data_source and translation.
- **Validation:** client side, only `required` and `maxLength`. Server (`api/feedback/route.ts`): type, subject and message present; subject ≤200; message ≤2000; rating clamped to 1–5. No email format check, no type list, no name check.
- **Spam controls:** 10 submissions per hour per hashed IP (fails open). No captcha, no honeypot, no login. User-Agent stored (max 500). The IP is stored as a salted hash, and the salt falls back to a built-in default if `VOTE_IP_SALT` is unset.
- **Moderation:** admin Feedback tab (`admin/feedback/page.tsx`): filter by status and priority; AI classification through `callAI` (`src/lib/feedback-classifier.ts`); reclassify; reply from templates. Email reply goes out only when the submitter gave an address (`src/lib/feedback-reply.ts`, Resend). A feedback action also sits in `admin/review/page.tsx`.
- **Storage:** `Feedback` (status new, reviewed, resolved or archived; AI and reply fields).
- **Public:** none.
- **Notification:** admin alert "New User Feedback" (`alertNewFeedback` in `src/lib/admin-alerts.ts`; channel not read). Submitter: manual email reply only.

### 2.6 Contributors (paying supporters, not data contributors)
- **Citizen can:** view the supporter wall, district and state lists, and the leaderboard; donate through Razorpay (`SupportCheckout`).
- **Form fields (donation):** name, amount, email and phone at checkout (checkout form not read in detail).
- **Validation:** name checked by `validateContributorName` (`src/lib/validators/contributor-name.ts`): letters only, no digits, URLs, phone numbers, promo text or business suffixes.
- **Spam controls:** create-order and create-subscription share 10 per hour per IP (runbook figure). The verify routes check the Razorpay signature (`validRazorpaySignature`, `src/lib/supporter-payment.ts`), but have no rate-limit call in the file. The webhook's signature check is unverified.
- **Moderation:** admin Flagged Names and Flagged Messages (`admin/contributors-flagged/`); supporter edit and an `isPublic` flag; manual supporter form; Razorpay sync.
- **Storage:** `Supporter` (name, amount, tier, subscription fields, `isPublic`); `Contribution` (order records).
- **Public:** `publicDisplayName` name, one-time amount, tier, sponsored district or state. `api/data/contributors/route.ts` never selects email, phone or payment IDs.
- **Notification:** `alertPaymentReceived` exists in `admin-alerts.ts` (call site unverified). Donor emails: unverified.
- **Files:** `src/app/[locale]/contributors/page.tsx`; `[state]/[district]/contributors/ContributorsClient.tsx`; `src/app/api/data/contributors/route.ts`; `src/app/api/payment/*`; `src/app/api/webhooks/razorpay/route.ts`; `src/lib/supporter-payment.ts`.

### 2.7 Other public write paths found
- **Suggestions** (`POST /api/suggestions`; form `src/components/features/SuggestionForm.tsx`, used on `/features` and the home modal). Fields: name (validator), email (optional, max 120, no format check), category (Feature, Bug, Data, UX or Other; default Other), title (5–120), details (20–2000). Limit: 3 per hour per IP. Stored in `Suggestion` (PENDING, REVIEWED, ACCEPTED, REJECTED, SPAM, IMPLEMENTED). Public `GET` returns ACCEPTED and IMPLEMENTED only (name, title, body; max 50). Admin can change status or notes, or hard-delete (`api/admin/suggestions/[id]/route.ts`, audited). A non-blocking Resend email goes to a product inbox: a hard-coded fallback in the route, overridable with `ADMIN_EMAIL`.
- **District vote** (`POST /api/district-request`; used on `/vote-district`, `/contribute` and locked district previews). Only inactive districts from `INDIA_STATES` are accepted (`src/lib/waiting-district.ts`). Limit: 120 per minute per IP (fails open). Each vote adds 1 to `DistrictRequest` (unique on state and district). There is no per-person check, so one IP can add 7,200 an hour.
- **India ideas** (`POST /api/india/suggestions`). Title 3–80; description ≤200; regex filter for URLs and profanity; 3 per hour per IP. Public only once status is shortlisted, in_progress or live. The route comment says no moderation screen exists. No UI caller found in `src` (a grep for `india/suggestions` finds only the route files).
- **Tender alerts** (`POST /api/tenders/alerts/subscribe`). Needs `consent: true`; email regex; fields ≤200; 5 per hour per IP; create only (duplicate returns 409). Stores email and WhatsApp in `TenderSavedByUser` with no verification. Delivery is "v2" per the code comment. No UI caller found in `src`.

## 3. Admin panel

- **Auth** (`docs/RUNBOOKS/admin-auth.md`; code in `src/lib/admin-auth.ts`). `admin/layout.tsx` calls `requireAdmin()`. Flow: password, then a 6-digit TOTP code or one of 8 backup codes, then a signed cookie `ftp_admin_v1` (8 hours, backed by a revocable Redis session).
- **Limits:** 5 password attempts and 5 codes per IP per 15 minutes. 10 failures from any IP lock login for 15 minutes. Fails closed when Redis is down.
- **Header path:** `x-admin-secret` or `x-admin-password` equal to `ADMIN_PASSWORD`, for ops scripts. Failures limited to 10 per IP per 15 minutes. 2FA changes, recovery details, logout-all and the vault require the cookie only.
- **Recovery:** `/admin-recover` emails a 1-hour reset link to the recovery address (needs `RESEND_API_KEY`).
- **Route check (grep):** every `api/admin` route file calls `requireAdmin`, `requireAdminCookie` or `requireVaultSession`, except the two 2FA recovery routes (`2fa/recover`, `2fa/recover/verify`), which have their own limits.
- **Discrepancy:** the runbook describes "the single admin account", but the code has an `AdminUser` model and `/api/admin/users` CRUD. How a login maps to a user: unverified.
- **IP allowlist:** the optional `ADMIN_ALLOWED_IPS` check in `src/proxy.ts` covers the admin page only. `/api/*` is outside the proxy matcher, so the allowlist never sees API calls.
- **Sidebar tabs (22, `components/admin/AdminSidebar.tsx`):** Dashboard, System Health, Alerts & Logs, Content Editor, Update Log, Support Page, Site Announcement, AI Settings, Review Queue, News & Check Queue, Population Audit, Revenue & Supporters, Flagged Names, Expenditure, Costs & Billing, Analytics, Traffic, Access & 2FA, API Vault, Feedback, Suggestions, Responsibility.
- **Approve or reject:** suggestion status; feedback status and reply; flagged names and messages; news and fact-check queue items (approve or reject action in `admin/review`).
- **Edit:** supporters and subscriptions; expenses; responsibility items; content per district; support page and site announcement; AI settings; users; vault entries; suggestion notes.
- **Delete:** suggestions (hard delete); subscriptions; expenses; responsibility items; vault entries; users; `AdminAlert` rows; scraper logs.
- **Local alerts:** no edit or delete UI, only the bulk endpoints in section 1b.
- **Audit:** mutations write `AdminAuditLog` through `logAuditAuto`. Verified for suggestions only.

## 4. Cross-cutting

- **SEO.** Root `src/app/layout.tsx` sets `metadataBase`, OpenGraph and four JSON-LD blocks (WebApplication, Organization, WebSite, FAQPage). Each route has `generateMetadata` with `languageAlternates` (`src/i18n/seo.ts`: canonical and hreflang). Module pages use `generateModuleMetadata` and `generateModuleJsonLd` (`src/lib/seo.ts`). `src/app/sitemap.ts` lists every routed locale and all active states and districts. It sets `lastModified` only on pages the file says cron refreshes. `src/app/robots.ts` allows Googlebot, Bingbot, ChatGPT-User and PerplexityBot, disallows `/api/`, and blocks GPTBot, ClaudeBot, Google-Extended, CCBot and others. OG images: `[locale]/opengraph-image.tsx` and `india/[moduleSlug]/opengraph-image.tsx`. `manifest.ts` exists. No Twitter image file.
- **Analytics.** Plausible script in the root layout (`plausible.io/js/script.js`, domain from `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`). The admin Traffic tab reads the Plausible Stats API (`src/lib/plausible-api.ts`, `PLAUSIBLE_API_KEY`). `TrafficCollection` is read in `api/data/[module]` (line 439); its writer is unverified.
- **Errors.** Sentry (`@sentry/nextjs`): `src/instrumentation.ts` (server and edge), `src/instrumentation-client.ts`, `withSentryConfig` in `next.config.ts` (source maps via `SENTRY_AUTH_TOKEN`), `captureException` in `src/scraper/lib/cron-run.ts`. Admin Sentry panel: `api/admin/sentry-errors`. Admin alerts: `sendAdminAlert` in `src/lib/admin-alerts.ts`. The CSP report URI points to Sentry when a DSN is set.
- **Headers** (`next.config.ts`). HSTS (2 years, preload); `nosniff`; `X-Frame-Options: DENY`; strict-origin referrer policy; Permissions-Policy (camera and microphone off, geolocation self). CSP is `Content-Security-Policy-Report-Only` only, so it blocks nothing. `Cache-Control: private, no-store` on `/api/admin/*` and `/api/payment/*`; `s-maxage=300` on `/api/data/*`. Custom headers `X-Creator`, `X-Project-ID`, `X-License: MIT`.
- **Middleware** (`src/proxy.ts`, the Next 16 file name). Redirects planned-locale paths to `/en` (307); optional admin IP allowlist (section 3); next-intl routing. Matcher skips `_next`, `api` and static files.
- **Redirects** (`next.config.ts`). District slug aliases, 308: budget to finance, citizen to citizen-corner, panchayat to gram-panchayat, farm-advisory to farm, famous to famous-personalities. `/en/india-detail` and `/kn/india-detail` go to `/…/india`.
- **Locale routing** (`src/i18n/routing.ts`, `src/i18n/languages.ts`). Prefix always; no browser detection; no locale cookie. Routed locales are the ones marked live or beta: en (live), kn and hi (beta). The other 20 Eighth Schedule languages are marked planned and redirect to `/en`.

## 5. Reuse for an issue-submission form

Ratings: **A** = copy with small edits; **B** = rewrite styling or strings; **C** = tied to their server.

| Piece | File | Rating | Notes |
|---|---|---|---|
| Name validator | `src/lib/validators/contributor-name.ts` | A | Pure function, no imports; Unicode letters; spam regexes. |
| Waiting-district allow-list | `src/lib/waiting-district.ts` | A/B | Depends on `INDIA_STATES` constants. |
| Feedback form | `src/components/common/FeedbackModal.tsx` | B | Imports `useTranslations` but strings are hard-coded English; uses the `Chips` kit. Good field set. |
| Suggestion form | `src/components/features/SuggestionForm.tsx` | B | next-intl and `nameErrorText`; good required-field pattern and character counters. |
| Feedback reviewer UI | `src/app/[locale]/admin/feedback/page.tsx` | B | List, filter, priority, reply; inline styles and emoji. Useful as a flow reference. |
| Feedback and suggestion API | `src/app/api/feedback/route.ts`, `src/app/api/suggestions/route.ts` | C | Validation order, hashed IP, rate limit, non-blocking email. Port the logic to a backend. |
| Rate limiter | `src/lib/rate-limit.ts` | C | Fixed window in Redis with a fail-open or fail-closed flag. Pattern reusable. |
| Admin auth | `src/lib/admin-auth.ts`, `src/lib/totp.ts` | C | Signed cookie, Redis session, lockout. Design reference. |
| Classifier and reply | `src/lib/feedback-classifier.ts`, `src/lib/feedback-reply.ts` | C | Depends on `callAI` and Resend. |

Notes: no schema library exists in the app (no zod, yup or valibot), so validators are hand-written. For rswf (React 18, Vite), every component above needs next-intl removed, which makes them B at best. No evidence handling exists to copy.

## 6. Gaps against rswf needs

- **Evidence upload:** none. No multipart or FormData handler for citizens. Admin expense invoices are "link-only"; the comments say Vercel Blob is "not wired yet" (`admin/ExpenditureTab.tsx`).
- **Mandatory evidence:** no field requires it. Feedback free text is optional.
- **Verification workflow:** status values only. Feedback: new, reviewed, resolved, archived. Suggestion: PENDING through IMPLEMENTED. No verifier role, second review or SLA. The review page queues AI news items, not citizen reports.
- **Institution accounts:** none. One admin login plus an `AdminUser` table. No organisation or citizen accounts.
- **Submitter identity and email verification:** none. Emails are stored unverified.
- **Public tracking:** no ticket or status page. The success message is the only feedback.
- **Automatic status updates:** none. Replies are manual and email-only.
- **Bot protection:** no captcha, honeypot or bot scoring.
- **Location:** `Feedback` has no coordinates. `LocalAlert` has them, but only scrapers write it.
- **Duplicate detection for submissions:** none. `src/lib/dedupe` is for scraped data; its scope for submissions is unverified.
- **Retention and erasure for submissions:** no purge found for `Feedback` or `Suggestion` (unverified overall).
- **Public display of individual reports:** none for feedback. Only accepted suggestions are public.

## 7. Not verified

- Bodies of the 21 cron routes, the `/api/data/[module]` subroutes, the payment create routes, and the India vote route (its header comment describes a daily-salted fingerprint).
- The Razorpay webhook signature check (the grep output was cut).
- The `alertNewFeedback` channel; the `TrafficCollection` writer; how `AdminUser` maps to login; `ContributorsClient` internals; `src/app/page.tsx`; the support checkout form (skimmed only).
- Runtime behaviour of any finding above. Everything comes from reading code.
