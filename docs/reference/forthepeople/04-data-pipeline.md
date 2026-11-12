> Survey note from a read-only pass over jayanthmb14/forthepeople at commit 1131d0180e0fadd851c42a5b6b8ef841670fccfd (2026-11-04), written 2026-11-05 by a helper model. Summary and verdicts: [../forthepeople-analysis.md](../forthepeople-analysis.md). Lines marked "unverified" or "inferred" were not opened.
> Errata: the survey brief said rswf runs React 18. rswf runs React 19 (see package.json). Where this note says "fine for React 18 (rswf)", read: react-simple-maps 3.0.0 declares peers up to React 18, so React 19 needs `legacy-peer-deps` (the reference sets `legacy-peer-deps=true` in its `.npmrc`) or a port of the map code to d3-geo, which rswf already uses.
# ForThePeople.in: data pipeline and database (slice C)

Read-only review of the clone at `...\scratchpad\ftp` on 2026-11-05. Paths are relative to the repo root. "Unverified" marks anything not checked. † = purpose inferred from the file name and its callers, not read.

**Index**
- [0. Corrections to the brief](#0-corrections-to-the-brief)
- [1. Models](#1-models)
- [2. Cron table](#2-cron-table)
- [3. Scraper pattern](#3-scraper-pattern)
- [4. Caching](#4-caching)
- [5. src/lib inventory](#5-srclib-inventory)
- [6. AI usage](#6-ai-usage)
- [7. Proposal for rswf (my design, not theirs)](#7-proposal-for-rswf-my-design-not-theirs)

## 0. Corrections to the brief

- **110 models, not 108.** `^model ` matches 110 lines in `prisma/schema.prisma`, plus 2 enums. The header still says "40+ models".
- **src/lib has 75 top-level files (as briefed) and 172 with subfolders.**
- **No migrations.** There is no `prisma/migrations/`. The runbook applies the schema with `npm run db:push`, so there is no migration history (production state unverified).
- **Runbook schedules are stale for 3 crons.** `docs/RUNBOOKS/crons.md` §1 gives weather `*/30`, alerts `*/30`, tenders `15 */2`. `vercel.json` has `0 * * * *`, `5 * * * *`, `15 */6 * * *`, and the route headers match vercel.json. `tests/cron-schedule.test.ts` checks routes against vercel.json, not the runbook. The headers of `src/scraper/jobs/weather.ts` and `alerts.ts` still say "every 30 min".
- **Confirmed:** MIT (`vercel.json` `X-License`), Next.js + TypeScript, Prisma on Postgres (`@prisma/adapter-pg`), Upstash Redis (REST), 21 Vercel crons in region `bom1`.
- **Scraper count:** 38 = 14 in `jobs/` + 22 in `lib/` + `logger.ts` + `types.ts`.
- **Estimate step skipped:** I am a subagent running a fully specified read-only task.

## 1. Models

### 1a. Grouped (110 models + enums `DemographicLevel`, `SuggestionStatus`)

| Domain (count) | Models | Purpose |
|---|---|---|
| Places (6) | State, District, Taluk, Village, GramPanchayat, PollingBooth | Location hierarchy |
| Leaders & offices (5) | Leader, ElectionEvent, ElectionResult, DepartmentStaffing, GovOffice | Officials, elections, offices |
| Money (9) | BudgetEntry, BudgetAllocation, RevenueEntry, RevenueCollection, TrafficCollection, Expense, Subscription, Contribution, Supporter | Public finance; supporter payments; internal costs |
| Infrastructure & services (13) | InfraProject, InfraUpdate, HousingScheme, PowerOutage, JJMStatus, BusRoute, TrainSchedule, LocalIndustry, SugarFactory, SugarFactorySeason, ServiceGuide, RtiTemplate, Scheme | Projects with dated updates; services |
| Water, weather & alerts (5) | WeatherReading, RainfallHistory, DamReading, CanalRelease, LocalAlert | Environmental readings and alerts |
| Agriculture & markets (4) | CropPrice, MarketData, AgriAdvisory, SoilHealth | Mandi prices, advice |
| People & social (6) | PopulationHistory, DemographicProfile, DemographicUpdate, School, SchoolResult, FamousPersonality | Census-style profiles; school results |
| Safety, courts & RTI (4) | PoliceStation, CrimeStat, RtiStat, CourtStat | Statistics |
| Tips & responsibility (2) | CitizenTip, ResponsibilityItem | Citizen guidance |
| News (2) | NewsItem, NewsActionQueue | Stories; extracted actions to review |
| AI (10) | AIInsight, ReviewQueue, NewsIntelligenceLog, AIModuleInsight, SharedAIInsight, AIUsageLog, AIProviderSettings, FactCheck, FactCheckStatus, AdminBotMessage | AI outputs, review, call and cost log |
| Reports & scores (2) | DistrictHealthScore, PlatformReport | Report card; weekly AI report |
| Tenders (14) | Tender, TenderAuthority, TenderCategory, TenderCorrigendum, TenderAward, TenderBidder, TenderContract, TenderDocument, TenderRedFlag, TenderAISummary, TenderSavedByUser, TenderScraperConfig, TenderScraperRun, TenderEducationContent | Module 30 (Karnataka pilot) |
| India national (9) | IndiaIndicator, IndiaScraperRun, IndiaArticle, IndiaModuleNews, IndiaTimeSeries, IndiaStateBreakdown, IndiaModuleSuggestion, IndiaModuleVote, IndiaAnalysis | National dashboard |
| Exams (1) | GovernmentExam | Exam notices |
| Citizen input (5) | Feedback, Suggestion, DistrictRequest, FeatureRequest, FeatureVote | Feedback, ideas, votes |
| Pipeline & admin (13) | ScraperLog, DataRefresh, DataVerification, UpdateLog, ContentTranslation, AdminUser, AdminAuditLog, AdminAuth, AdminAlert, AdminAPIKey, AdminSetting, SupportPageConfig, SiteAnnouncement | Run logs, checks, change log, translations, admin |

Money units differ by model: `Contribution.amount` is paise (`prisma/schema.prisma` line 1358), `Supporter.amount` is rupees (line 1423), and `Tender` money is BigInt rupees while its block header (line 1934) says paise.

### 1b. The 15 models that matter for an environment site

| Model | Key fields | Relations and index | Written by |
|---|---|---|---|
| State / District | slug; District: `active`, `tendersActive`, `goLiveDate` | District has 50 child relations; `@@unique([stateId, slug])` | seeds and admin (not traced) |
| Taluk / Village | Village: lat, lng | `@@unique([talukId, slug])` | seeds (unverified) |
| WeatherReading | temperature, humidity, windSpeed, rainfall, conditions, `source`, `recordedAt` (source time) | `(districtId, recordedAt)`; no unique; newest 48 kept | `scrape-weather` |
| DamReading | damName, waterLevel, maxLevel, storage, storagePct, inflow, outflow, `recordedAt`, `source` | `(districtId, damName, recordedAt)`; newest 48 per dam | `scrape-dams` |
| RainfallHistory | year, month, rainfall, normal, departure, source | `(districtId, year, month)` | no cron writer found (unverified) |
| CropPrice | commodity, market, min/max/modalPrice, arrivalQty, date, source | `(districtId, commodity, date)` | `scrape-crops` |
| LocalAlert | type, severity, startDate, endDate, active, `sourceUrl` (CAP link) | `(districtId, active)`; no unique on sourceUrl | `scrape-alerts`; `scrape-news` (expiry) |
| NewsItem | title, url, publisher, publishedAt, targetModule, classifiedBy, duplicateOf | `(districtId, publishedAt)`; url not unique | `scrape-news`, action engine |
| NewsActionQueue | dataType, extractedData (Json), sourceUrl, confidence, status | `(districtId, status)` | `scrape-news`, `verify-data` |
| AIInsight | headline, summary, sentiment, confidence, sourceUrls[], approved | `(districtId, module, approved)` | `news-intelligence` |
| Feedback | type, module, message, email?, page, ipAddress (salted hash, `src/app/api/feedback/route.ts` line 63), status, ai* | `(status, createdAt)` | `/api/feedback` |
| Suggestion | name, email?, title, body, status enum, upvotes | `(status, createdAt)` | `/api/suggestions` |
| ScraperLog | jobName, status (success, partial, skipped, error, running), recordsNew, duration, error, startedAt | `(jobName, startedAt)`; failures as `job/district` | every cron |
| DataVerification | datasetKey, dataset, kind, primary and secondary source and value, agreed, status, checkedAt | 4 indexes; kept 120 days | `verify-data` |
| DataRefresh | endpoint (unique), lastRefreshed, nextRefresh, status | none | `scrape-budget` only (no-op job) |

**No data-source table exists.** The registry is code: `src/lib/constants/dataset-collection.ts` (`DATASETS`, the data-sources page), `src/scraper/lib/collector-registry.ts` (`PORTAL_COLLECTORS`, 4 portals), and `src/lib/constants/sidebar-modules.ts` (`MODULE_FRESHNESS`). Freshness is computed on each read in `src/lib/freshness.ts`. Only `DataVerification` stores it.

## 2. Cron table

All routes live in `src/app/api/cron/<name>/route.ts`. Each run also writes Redis `ftp:cron:<name>` and one ScraperLog row.

| Route | Schedule (UTC) | Does | Writes (beyond the two above) |
|---|---|---|---|
| scrape-news | `10 */4 * * *` | Google News and The Hindu feeds per district; keyword first, capped AI; 240 s budget | NewsItem, LocalAlert (expiry), ContentTranslation; via action engine: NewsActionQueue, InfraProject/InfraUpdate, GovernmentExam |
| translate-content | `20 */3 * * *` | Translates stored live text | ContentTranslation |
| scrape-crops | `30 3 * * *` | AGMARKNET mandi prices via data.gov.in | CropPrice, UpdateLog |
| scrape-weather | `0 * * * *` | OpenWeather, then Open-Meteo | WeatherReading, UpdateLog |
| scrape-dams | `0 */6 * * *` | Karnataka reservoir portal (3 districts) | DamReading |
| scrape-alerts | `5 * * * *` | NDMA SACHET CAP alerts | LocalAlert |
| generate-insights | `0 0,12 * * *` | Missing or stale module insights (AI) | AIModuleInsight, ContentTranslation, AIUsageLog; infra analyses in Redis (runbook) |
| news-intelligence | `0 */4 * * *` | AI reading of new news, one call per district | AIInsight, ReviewQueue, AIUsageLog |
| scrape-budget | `0 6 * * 1` | No-op until a data.gov.in id exists | DataRefresh |
| generate-citizen-tips | `0 6 * * 0` | Six AI tips per district | Redis `ftp:ai:citizen-tips:<slug>` (14 d) |
| update-exams | `30 6 * * *` | UPSC and SSC official pages | GovernmentExam |
| platform-report | `0 0 * * 0` | Weekly AI platform report | PlatformReport |
| health-score | `30 1 * * *` | District report cards | DistrictHealthScore |
| verify-data | `45 6 * * *` | Cross-checks; never edits data | DataVerification (120 d), NewsActionQueue |
| scrape-courts | `40 1,13 * * *` | NJDG court dashboards | CourtStat; Redis `ftp:courts:*` (120 d) |
| scrape-jjm | `15 4 * * *` | JJM tap-water dashboard (rural) | JJMStatus, UpdateLog |
| scrape-schools | `40 4 * * 2` | UDISE+ school statistics | Redis `ftp:data:udise:<slug>` (no expiry); no School write found |
| scrape-mgnrega | `50 4 * * *` | MGNREGA at-a-glance | Redis `ftp:data:mgnrega:<slug>` (no expiry) |
| scrape-tenders | `15 */6 * * *` | GePNIC tenders, 4 state portals | Tender, TenderAuthority (TenderRedFlag: call chain unverified) |
| dedupe-data | `15 7 * * *` | Merges exact duplicates; queues fuzzy pairs | many tables via `src/lib/dedupe/guard.ts` (runbook) |
| scrape-fuel | `0 7,14 * * *` | Metro petrol and diesel (PPAC, BPCL) | Redis `ftp:data:fuel` (no expiry) |

Locks (`lock:cron:<name>`) exist on 8 crons: verify-data, dedupe-data, scrape-courts, scrape-jjm, scrape-schools, scrape-mgnrega, scrape-tenders and scrape-fuel. scrape-weather, scrape-alerts, scrape-news, scrape-dams and scrape-crops have none (checked via imports).

## 3. Scraper pattern

Every collector follows the same steps:

1. **Auth:** `verifyCron()` (`src/lib/cron-auth.ts`) accepts Bearer or `x-cron-secret` and fails closed when `CRON_SECRET` is unset.
2. **Start:** `cronStarted()` writes Redis `ftp:cron:<name>` and a ScraperLog row with status "running".
3. **Scope:** `listActiveDistricts()` and `jobContextFor()` (`src/scraper/lib/cron-districts.ts`); batches and a time budget.
4. **Fetch:** `fetchSource()` (`src/scraper/lib/source-fetch.ts`): 20 s timeout, one retry on 500/502/503/504, at least 2.5 s between requests per host.
5. **Parse:** JSON; cheerio for RSS, HTML and CAP XML; PDF text for fuel.
6. **Validate:** range checks (`weatherProblems`, `damReadingProblems`); `parseAmount()` returns null, never 0 (`sanity.ts`); bad rows are logged and skipped.
7. **Upsert:** match the natural key (district plus source time, or sourceUrl); update if changed, else create; trim to the newest N.
8. **Freshness stamp:** store the source's own time (`recordedAt`, `date`, `pubDate`), not fetch time; set `lastSuccessAt` on success.
9. **Cache bust:** `dropModuleCaches()` only when rows changed.
10. **Log:** `logUpdate()` summary, then `cronFinished()` with `runOutcome()` (ok, partial, skipped, error).
11. **Failure:** per-district `Promise.allSettled`; a throw goes to `withCronErrors()` (error record, Sentry, HTTP 500). A dead source writes nothing.

**Walkthrough: weather** (`src/app/api/cron/scrape-weather/route.ts` calling `src/scraper/jobs/weather.ts`):

```
scrape-weather/route.ts          maxDuration 60; batch 5; budget 45 s
  verifyCron(req)                401 on wrong secret
  cronStarted("scrape-weather")  Redis hash + ScraperLog "running"
  listActiveDistricts()          active districts, A to Z
  for each batch of 5 (allSettled):
    collectWeather(ctx)          jobs/weather.ts
      point = DISTRICT_CENTROIDS[state/district]   district HQ lat/lng
      fromOpenWeather(ctx)       8 s timeout; needs OPENWEATHER_API_KEY
      on error or range failure:
        fromOpenMeteo(ctx)       no key needed
      weatherProblems(sample)    range checks; reading older than 6 h rejected
      findFirst(district, source, recordedAt)
        seen already -> duplicate, skip
      create WeatherReading      keeps the source's measured time
      delete readings beyond newest 48
    if stored: dropModuleCaches(slug, ["weather"])
  logUpdate(one row for the run) UpdateLog
  cronFinished(runOutcome(...))  Redis + ScraperLog; partial adds one error row per district
  return { ok, partial, stored, results }
```

**Scrapers** (`src/scraper/jobs/`):

| File | Source | Method | Cadence (UTC) |
|---|---|---|---|
| weather.ts | OpenWeatherMap; Open-Meteo fallback | JSON API | hourly |
| news.ts | Google News RSS per district; The Hindu feeds | RSS (cheerio XML) plus AI | every 4 h |
| alerts.ts | NDMA SACHET RSS, CAP XML, polygons | RSS plus XML | hourly |
| dams.ts | Karnataka water portal | POST; JSON wrapping GeoJSON | every 6 h |
| crops.ts | AGMARKNET via data.gov.in | JSON API (key) | daily 03:30 |
| budget.ts | data.gov.in budget resource (none set) | JSON API | Mon 06:00 (no-op) |
| courts-njdg.ts | NJDG public dashboards | text, parsed by `lib/courts/parse.ts` (format unverified) | 01:40, 13:40 |
| exams.ts | UPSC exam page; SSC live-exams | HTML (cheerio) plus JSON | daily 06:30 |
| fuel-prices.ts | PPAC home and metro PDF; BPCL Delhi PDF | HTML plus PDF | 07:00, 14:00 |
| gepnic-tenders.ts | GePNIC portals (MH, TN, WB, Delhi) | HTML tables, session cookies | every 6 h |
| jjm-dashboard.ts | ejalshakti JJM dashboard | JSON or HTML (unverified) | daily 04:15 |
| udise-schools.ts | UDISE+ open-services API | JSON (unverified) | Tue 04:40 |
| mgnrega-glance.ts | nrega.dord.gov.in at-a-glance | HTML (cheerio, ASP.NET) | daily 04:50 |
| ai-analyzer.ts | none; reads NewsItem, calls AI | AI | every 4 h |

## 4. Caching

Redis is Upstash REST (`src/lib/redis.ts`). With no `REDIS_URL`, the cache turns off and only warns.

| Key | Writer | TTL |
|---|---|---|
| `ftp:<district>:<module>` (+ `@<locale>`) | `GET /api/data/[module]` | 60 s for live modules (crops, weather, water, alerts, news, power); 600 s for stable (leaders, offices, elections, schools, services, taluks, exams); else 300 s; translated copy at most 600 s |
| `ftp:cron:<name>` | `cronStarted`/`cronFinished` | none, on purpose |
| `lock:cron:<name>` | 8 locked crons | maxDuration + 30 s (runbook) |
| `ftp:sachet:checked` | alerts | 3 days, renewed on write |
| `ftp:news:rejected:<districtId>` | news | sorted set, 4 days |
| `ftp:ai:models`, `ftp:ai:model-expiry` | ai-provider | 6 h; 3 days |
| `ftp:ai:cb:<model>` | circuit breaker | 10 min (429), 1 h (402), 24 h (gone) |
| `ftp:ai:degraded` | ai-provider | 24 h |
| `ftp:data:udise\|mgnrega:<slug>`, `ftp:data:fuel` | schools, mgnrega, fuel | none |
| `ftp:courts:njdg:<slug>` | courts | 120 days |
| `rate:<identifier>` | `rateLimit()` in 17 route files | window (default 60 per 60 s); fail open unless `failClosed` |

**Read path:** client hook (`src/hooks/useDistrictData.ts`) calls `GET /api/data/[module]?district&state`. The route runs `cacheGet`. On a miss it runs `fetchModule` (Prisma, or a district snapshot from `src/scraper/lib/district-snapshot.ts`; storage unverified), then `cacheSet`. The response carries `Cache-Control: public, s-maxage=TTL, stale-while-revalidate=2×TTL`. Some pages use ISR: home and state 3600 s, prices 900 s, support 86400 s. Some routes cache their own payloads (exam-news, freshness, verification, homepage-stats).

**Invalidation:** explicit `dropModuleCaches(slug, modules, {locales})` after writes: weather (`["weather"]`), news (`["news","overview"]` plus translated keys), dedupe (page caches of changed tables), courts (its response). Otherwise TTL expiry only.

**Gap:** `dropModuleCaches` clears Redis only. The CDN and browsers keep the response for `s-maxage` plus stale-while-revalidate, so a write can appear up to about three TTLs late (HTTP semantics; not measured).

## 5. src/lib inventory

75 top-level files, grouped by purpose. ★ = one of the 10 to port first (the other 6 are in subfolders, listed below). † = purpose from name and callers.

**Plumbing**

| File | Purpose |
|---|---|
| cache.ts | Redis get/set with TTL per module |
| redis.ts | Upstash REST client; null when unset |
| ★ rate-limit.ts | fixed-window limiter; fail open or closed |
| cron-auth.ts | cron secret check and run records |
| db.ts | Prisma client on pg adapter |
| update-log.ts | writes UpdateLog rows |
| audit-log.ts | admin audit rows |
| encryption.ts | AES for stored secrets |
| email.ts † | outgoing email |
| constants.ts † | shared constants |

**Admin and security**

| File | Purpose |
|---|---|
| admin-auth.ts | admin login, lockout, sessions |
| admin-second-factor.ts | TOTP and recovery second factor |
| totp.ts † | TOTP code helpers |
| admin-settings.ts | AdminSetting key-value rows |
| admin-alerts.ts | admin alert rows and email |
| vault-session.ts † | vault unlock session |
| sentry-api.ts | Sentry issues for admin |
| plausible-api.ts | analytics for admin |

**AI**

| File | Purpose |
|---|---|
| ai-provider.ts | OpenRouter calls, chain, breaker, usage log |
| ai-models.ts | model chain, tiers, prices (pure) |
| ★ ai-json.ts | extract JSON from model answers (pure) |
| insight-generator.ts | AI module insight generation |
| insight-config.ts | 29 module prompts and frequencies |
| insight-data.ts | checks input data before AI |
| insight-age.ts, insight-refresh.ts | insight staleness and regeneration rules |
| fact-checker.ts | admin-triggered AI fact checks |
| feedback-classifier.ts | AI triage of feedback |
| feedback-reply.ts | admin replies to feedback |
| platform-analysis.ts, platform-facts.ts | weekly AI report and its facts |
| citizen-tips.ts | citizen tip helpers (pure) |
| infra-extraction.ts, infra-analysis.ts, infra-sync.ts | infra AI extraction, analysis, DB sync |

**News and exams**

| File | Purpose |
|---|---|
| news-keywords.ts | keyword tables, queries, feed lists |
| news-action-engine.ts | applies AI classifications to DB |
| news-action-rules.ts | what a classified article may do (pure) |
| ★ news-dedupe.ts | title keys, duplicate and retention plans |
| ★ news-quality.ts | headline cleanup, promotion filter |
| news-store.ts | safe deletion of news rows |
| news-intel.ts | news-intelligence helpers (pure) |
| related-news.ts | picks related stories |
| exam-sync.ts, exam-news.ts | exam upsert; exam rules from news |
| next-exam.ts † | next upcoming exam |

**Freshness, health, places**

| File | Purpose |
|---|---|
| ★ freshness.ts | dataset age and status (pure) |
| freshness-facts.ts | facts for the freshness API |
| dataset-dates.ts | dataset date reads |
| health-score.ts | district health score algorithm |
| leader-roles.ts | office from role text (pure) |
| government-checks.ts | leader office phone lookup (call site) |
| ★ read-api.ts | slug check; Cache-Control headers |
| census-2011.ts, census-2011-db.ts | census figures and lookup |
| waiting-district.ts † | "coming soon" district state |

**Display, formatting, social**

| File | Purpose |
|---|---|
| csv.ts | CSV download helper (browser) |
| data-filters.ts | which rows the public sees |
| local-text.ts | stored Hindi and Kannada text |
| school-rows.ts | school row shaping |
| mgnrega-display.ts | MGNREGA display values |
| seo.ts | SEO metadata helpers |
| social-link.ts, social-detect.ts | parse and detect social links |
| fonts.ts † | font loading |
| mock-contributors.ts † | mock supporter data |

**Payments and supporters**

| File | Purpose |
|---|---|
| razorpay.ts | Razorpay API client |
| record-supporter-payment.ts | writes supporter payments |
| supporter-payment.ts, supporter-name.ts, supporter-cache.ts, supporter-totals.ts | payment, name, cache, totals helpers |
| contribution-expiry.ts, badge-level.ts | supporter expiry and badge tiers |
| support-defaults.ts | support page defaults |

**Subfolders (97 files, 21 folders).** `india/` (19): national dashboard getters. `verification/` (17): cross-source checks; `store.ts` writes DataVerification. `constants/` (12): static config, including the source registry. `tour/` (5), `weather/` (4): forecast fetch and codes. `markets/`, `translation/`, `geo/`, `courts/`, `dedupe/`, `tenders/` (4 each). `geo/`: ★ `locate.ts` (point-in-polygon, nearest district), ★ `aliases.ts` (state name to slug), `fit.ts`, `district-centroids.ts`. `dedupe/guard.ts` writes duplicate removals. `utils/`: ★ `timeAgo.ts` (IST age labels). `text/`: ★ `levenshtein.ts`. Also `civic/`, `validators/`, `design/`, `schemes/`, `money/`, `hooks/`, `exams/`, `data/`.

## 6. AI usage

**Used for** (purpose tag, tier in `src/lib/ai-models.ts`):

- **News classification** (`news-analysis`, Tier 1 free): is the article about this district, which module, what action. Keyword first; AI only when the place is unclear, the module is actionable, or the item is news (`src/scraper/jobs/news.ts`).
- **Module insights** (`insight`, Tier 2): `generate-insights`, the weekly platform report, infra analysis.
- **Extraction and triage** (`classify`, Tier 1): infra project data (second pass with another prompt), feedback triage.
- **Exam extraction** (`news-analysis`): `src/lib/exam-sync.ts`.
- **Citizen tips** (`summarize`, Tier 1): weekly.
- **Fact checks** (`fact-check`, Tier 3, admin only): Claude Sonnet 5, then Haiku 4.5. No free fallback.

**Route:** all calls go through OpenRouter via `callAI` / `callAIJSON` (`src/lib/ai-provider.ts`). Direct Anthropic is for scripts only (`FTP_AI_PROVIDER=anthropic`).

**Models:** Tier 1 free: `typesafe/jev-router`, `google/gemma-4-26b-a4b-it:free`, `openrouter/free`. Paid backstop `openai/gpt-5.6-luna` runs only with `AI_PAID_FALLBACK=1` and always last. Tier 2: gpt-5.6-luna, then gemini-3.1-flash-lite.

**Cost and time controls:**
- News: 20 AI calls per district per run; each district gets an equal share of the 240 s budget (`aiDeadlineAt`). Infra extractions are capped at 10 per run.
- Per call: at most 4 attempts (Tier 1 and 2), 2 for fact checks; 60 s per attempt unless the cron passes its own; an absolute deadline.
- Circuit breaker per model: 429 gives 10 min, 402 gives 1 h, a model that is gone gives 24 h. The live model list is cached 6 h; retirement warnings come 30 days ahead.
- One `AIUsageLog` row per call, with tokens and cost in USD and INR (84 per USD).
- Admin email at most once a day for degraded AI, out-of-credit, or retiring models.

**Fallback:** the chain tries models in order. If all fail, `markDegraded` sets a 24 h flag that `/api/health` reads. News keeps keyword classification (`classifiedBy = "keyword"`). If the place check fails, the article is deferred, not saved unchecked. News actions run only at `confidence ≥ 0.60` with `isAboutDistrict`. Low-confidence insights go to `ReviewQueue`.

**Stale comments:** `NewsItem.classifiedBy` says "opus | gemini | manual", but the code writes `ai:<model>` or `keyword` (`news.ts` line 348). `AIProviderSettings` provider fields are display-only, and `totalGeminiCalls` also counts OpenRouter calls. `AIInsight.geminiModel` defaults to "gemini-2.5-flash" (schema line 1216).

## 7. Proposal for rswf (my design, not theirs)

Eight tables, Postgres through Prisma when rswf gets a backend:

| Table | Purpose | Key fields | Unique / index |
|---|---|---|---|
| Location | places; self-parent hierarchy | kind (state, district, point), parentId, slug, name, lat, lng | unique (parentId, slug) |
| Source | data-source registry | key, publisher, url, method (api, html, pdf, rss, manual), licence, cron, expectedAgeHours, lastSuccessAt | unique key |
| Reading | time series (rain, water level, air) | locationId, sourceId, metric, value, unit, observedAt (source time), fetchedAt | unique (sourceId, locationId, metric, observedAt) |
| Alert | official warnings | locationId, sourceId, externalId, type, severity, startsAt, endsAt, active, sourceUrl | unique (sourceId, externalId) |
| Issue | an accountability case | slug, title, category, status (open, verified, resolved, disputed), locationId, summary | unique slug; (locationId, status) |
| Evidence | every claim links to a source | issueId, kind, url (required), publisher, publishedAt, capturedAt, reviewStatus, extracted (Json), confidence | (issueId); (reviewStatus) |
| Submission | citizen reports | issueId?, locationId?, category, body, contact (optional), ipHash, status, reviewerNote | (status, createdAt) |
| ScraperRun | one row per job run | job, sourceId?, status, recordsNew, recordsUpdated, error, startedAt, finishedAt | (job, startedAt) |

**Crons** (Vercel, same shape as §3: verifyCron, start record, time budget, finish record, each under 300 s):
- `ingest-readings`, hourly: API sources; upsert on the unique key; range checks; keep the newest N per location and metric.
- `ingest-alerts`, every 30 to 60 min: CAP or RSS; expire by endsAt.
- `ingest-evidence`, every 4 h: news per location; keyword first; capped AI; rows enter as `reviewStatus = pending`.
- `freshness-check`, daily: flags sources whose lastSuccessAt is older than expectedAgeHours; changes no data.
- `dedupe-evidence`, daily: merges exact URL duplicates; queues fuzzy pairs.

**Rules to carry over:** no value without a source URL and source time. AI proposes; a person or a rule approves. Live readings get a TTL of 60 s or less, with `s-maxage` no longer than that, so CDN lag stays small (see §4). One request per 2 to 3 s per host (reuse the `fetchSource` pattern). Lock the slow crons.
