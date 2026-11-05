> Survey note from a read-only pass over jayanthmb14/forthepeople at commit 1131d0180e0fadd851c42a5b6b8ef841670fccfd (2026-11-04), written 2026-11-05 by a helper model. Summary and verdicts: [../forthepeople-analysis.md](../forthepeople-analysis.md). Lines marked "unverified" or "inferred" were not opened.
> Errata: the survey brief said rswf runs React 18. rswf runs React 19 (see package.json). Where this note says "fine for React 18 (rswf)", read: react-simple-maps 3.0.0 declares peers up to React 18, so React 19 needs `legacy-peer-deps` (the reference sets `legacy-peer-deps=true` in its `.npmrc`) or a port of the map code to d3-geo, which rswf already uses.
# B2 - Feature widgets: inventory and portability

Index: [Scope and method](#scope) | [Part 1 - Inventory](#part-1) | [Part 2 - 35 deep entries](#part-2) | [Part 3 - Five repeating patterns](#part-3) | [Part 4 - India versus district](#part-4) | [Verified facts and unverified items](#facts)

<a id="scope"></a>
## Scope and method

- Reference repo: `REPO` (the ftp clone). Licence and stack verified in `LICENSE` and `package.json` (see [facts](#facts)).
- Slice: 175 files. `district` 61, `home` 42, other 17 folders 72. Paths are relative to `src/components/`; full repo-relative paths are given in Part 2.
- Line counts: per-file line count from Grep. Purposes come from file names, export lists and import lines. Only `prices/PriceChart.tsx` (first 40 lines) was opened. Anything else marked "unverified" was not opened.
- Part 2 signals come from Grep over imports, exports, `fetch`, `useQuery`, `"use client"` and prop signatures.
- Portability: **A** copy with small edits; **B** restyle or rewrite props; **C** tied to their server or data layer.

<a id="part-1"></a>
## Part 1 - Inventory

Format: file | lines | purpose (about six words).

### src/components/district/ (61 files)

| file | lines | purpose |
|---|---|---|
| ui.tsx | 2034 | shared kit: pills, tables, states, sources |
| DistrictBreadcrumb.tsx | 717 | district and state breadcrumb navigation |
| visuals.tsx | 683 | gauge, water tank, chart card, glyphs |
| DistrictHeroIllustration.tsx | 513 | SVG district hero illustration |
| ElectionSection.tsx | 358 | upcoming election events section |
| ExamStepper.tsx | 279 | government exam application stepper |
| page-kit.tsx | 279 | page helpers: clock, age, actions |
| LockedDistrictPreview.tsx | 273 | teaser for locked district module |
| DistrictHealthScoreCard.tsx | 253 | health score card, react-query |
| InfraSnippet.tsx | 249 | infrastructure projects summary |
| calm-parts.tsx | 329 | calm-reading cards, search box, helpers |
| MobileDistrictDrawer.tsx | 226 | mobile drawer of district modules |
| LeadersSnippet.tsx | 217 | leaders preview summary |
| DistrictIdentityCard.tsx | 197 | district name and identity header |
| TodayWeatherTile.tsx | 190 | today's weather tile |
| PopulationSnippet.tsx | 180 | population summary |
| DetailSheet.tsx | 168 | generic detail bottom sheet |
| BreadcrumbBottomSheet.tsx | 156 | breadcrumb choices in a sheet |
| StateVoteList.tsx | 153 | state vote list |
| ModuleNews.tsx | 133 | per-module news list, fetch |
| TenderSnippet.tsx | 110 | tender summary |
| DistrictBadges.tsx | 118 | achievement badge row |
| LiveElectionBanner.tsx | 92 | live election banner, react-query |
| HueScope.tsx | 31 | colour-scope wrapper (purpose unverified) |
| civic/ResponsibilityParts.tsx | 627 | responsibility topics, news counts, sheets |
| civic/LeaderDirectory.tsx | 268 | leader cards by department |
| civic/LeaderSheet.tsx | 263 | leader detail sheet |
| civic/ElectionResults.tsx | 294 | election results view |
| civic/CitizenParts.tsx | 391 | helplines and rights cards |
| civic/LeaderLadder.tsx | 180 | leader tier ladder |
| civic/HueDonut.tsx | 204 | SVG donut chart |
| civic/leader-shared.tsx | 152 | leader tier and provenance helpers |
| civic/LeaderDirectory.module.css | 179 | leader directory styles |
| daily-services/StaffingSection.tsx | 245 | staffing vacancy section, hook |
| daily-services/HueCharts.tsx | 295 | donut, progress ring, bar list |
| daily-services/BreakdownVisuals.tsx | 268 | breakdown donut and rank bars |
| icons/ (11 files, 32-56 each) | 32-56 | landmark SVG icons and index lookup |
| shell/GlanceRow.tsx | 278 | headline metrics row, react-query |
| shell/VerifyPanel.tsx | 336 | per-dataset verification and sources |
| shell/DistrictBar.tsx | 239 | module navigation bar |
| shell/MoneySnippet.tsx | 124 | money summary |
| shell/StaleDataNotice.tsx | 112 | stale data warning |
| shell/overview-art.tsx | 163 | overview card SVG marks |
| shell/verification.ts | 141 | verification status normalising |
| shell/OverviewCard.tsx | 59 | module overview tile |
| shell/useVerification.ts | 35 | verification hook |
| shell/ShellSlots.tsx | 45 | shell top and bottom slots |
| shell/sources.ts | 45 | module source names and portals |
| shell/path.ts | 31 | district route builder |
| shell/fiscal.ts | 19 | fiscal-year past check |
| shell/glance-types.ts | 18 | GlanceData type |

### src/components/home/ (42 files)

| file | lines | purpose |
|---|---|---|
| chrome.module.css | 1296 | header and footer styles |
| home.module.css | 1956 | home page styles |
| finder.module.css | 586 | finder styles |
| glyphs.module.css | 63 | glyph styles |
| HomeGlyphs.tsx | 211 | glyph illustrations and step icons |
| StatusStrip.tsx | 212 | live status strip, fetch |
| useLocate.ts | 213 | geolocation to district hook |
| district-search.ts | 233 | district search index and matching |
| DistrictFinder.tsx | 430 | district search and locate finder |
| home-data.ts | 301 | map stats and India figure loaders |
| YourDistrict.tsx | 298 | "your district" summary |
| Footer.tsx | 274 | site footer |
| HeaderBar.tsx | 180 | site header bar |
| LocateResult.tsx | 178 | locate-me result |
| products.tsx | 174 | product definitions and marks |
| PriceTicker.tsx | 155 | scrolling price ticker |
| LiveDistrictsCard.tsx | 160 | live districts card |
| HomeMap.tsx | 192 | district map with links (hand SVG) |
| HeaderMenu.tsx | 142 | header dropdown menu |
| HomeSearch.tsx | 139 | home search, routes to district |
| FooterFrame.tsx | 121 | footer wrapper by page mode |
| SupportBand.tsx | 124 | support call-to-action band |
| HomeHero.tsx | 122 | home hero section |
| home-picks.ts | 118 | home card picks and figures |
| DisclaimerLine.tsx | 102 | one-line data disclaimer |
| IndiaGlance.tsx | 100 | national glance figures |
| HeroStats.tsx | 101 | hero statistics |
| home-types.ts | 100 | home data types |
| ProductSwitcher.tsx | 116 | product switcher menu |
| home-markets.ts | 88 | market and fuel loaders |
| use-popover.ts | 82 | popover open and keyboard hook |
| HomeIntro.tsx | 81 | intro animation |
| status-strip.ts | 96 | status-strip market state |
| home-format.ts | 56 | money, percent and day formatters |
| your-district.ts | 74 | your-district headline picks |
| DataChecks.tsx | 75 | data-check badges |
| SectionReveal.tsx | 40 | scroll reveal wrapper |
| github-stars.ts | 38 | GitHub stars fetch |
| footer-mode.ts | 29 | footer mode by path |
| CountUp.tsx | 59 | animated count-up number |
| home-clock.ts | 25 | minute clock hook |
| DistrictLandmark.tsx | 23 | district landmark picture |

### Other folders (72 files)

| folder | file | lines | purpose |
|---|---|---|---|
| weather | ForecastCards.tsx | 378 | now and tomorrow weather cards |
| weather | WeatherArt.tsx | 373 | weather illustration art |
| weather | weather.module.css | 176 | weather styles |
| weather | ForecastStrip.tsx | 115 | multi-day forecast strip |
| weather | ForecastDaySheet.tsx | 90 | single forecast day sheet |
| weather | useWeatherText.ts | 68 | localised weather phrases hook |
| water | WaterVisuals.tsx | 101 | inflow and outflow bars |
| land-water | cards.tsx | 393 | tap-card grid and emoji tiles |
| land-water | visuals.tsx | 367 | donut, bar list, mini ring |
| land-water | FarmSheets.tsx | 215 | advisory and soil sheets |
| land-water | CropSheet.tsx | 239 | crop price detail sheet |
| land-water | DamSheet.tsx | 202 | reservoir detail, Recharts area chart |
| land-water | PanchayatSheet.tsx | 137 | panchayat and NREGA sheet |
| land-water | MgnregaSnapshot.tsx | 140 | MGNREGA snapshot card |
| land-water | crop-data.ts | 122 | crop price series helpers |
| land-water | dam-data.ts | 50 | dam name and fill percent |
| land-water | tap-share.ts | 26 | tap-share helper |
| money | TenderSheet.tsx | 316 | tender card and detail sheet |
| money | visuals.tsx | 324 | donut, top-bar list, stage bar |
| money | TapCard.tsx | 311 | money tap card and sheet parts |
| money | MoneyToolbar.tsx | 80 | CSV download and share toolbar |
| money | useMoney.ts | 92 | money data hook |
| money | tender-types.ts | 72 | tender list and detail types |
| prices | PriceChart.tsx | 81 | server-drawn SVG three-month line |
| prices | PriceCard.tsx | 169 | single price card |
| prices | price-view.ts | 146 | price view builder |
| news | NewsList.tsx | 174 | news rows, no hooks |
| news | NewsList.module.css | 186 | news styles |
| demographics | DemographicDisclaimer.tsx | 145 | demographic data disclaimer |
| demographics | types.ts | 176 | palettes and type guards |
| demographics | DataSourceCard.tsx | 87 | source citation card |
| demographics | chartKit.tsx | 77 | chart axis and tooltip constants |
| demographics | DataAgeChip.tsx | 32 | data age chip |
| demographics | charts/ (11 files, 59-129 each) | 59-129 | age pyramid, caste, education, employment, waffle, language, literacy, MPI, migration, religion, sex-ratio charts |
| accountability | AccountabilityKit.tsx | 573 | shared cards, sheets, list search |
| accountability | AccountabilityVisuals.tsx | 499 | rings, rank bars, count chips |
| accountability | PoliceStaffing.tsx | 99 | police staffing card |
| tenders | HowTenderWorks.tsx | 135 | tender explainer |
| tenders | EligibilityWizard.tsx | 253 | eligibility questionnaire |
| tenders | TenderGanttTimeline.tsx | 119 | milestone timeline |
| tenders | TenderLockedState.tsx | 112 | locked tender state |
| tenders | TenderCard.tsx | 189 | tender card with status |
| tenders | TenderDisclaimer.tsx | 108 | tender disclaimer |
| tenders | CountdownTimer.tsx | 55 | countdown to deadline |
| tenders | RedFlagBadge.tsx | 48 | red-flag badge |
| crops | CropVisuals.tsx | 236 | price range and move charts |
| farm | SoilVisuals.tsx | 242 | pH scale and nutrient bars |
| services-1 | kit.tsx | 448 | shared service kit |
| services-1 | PageEnd.tsx | 41 | page end block |
| services-2 | kit.tsx | 845 | service cards, checklist, search |
| vote-district | VoteDistrictPage.tsx | 730 | district vote page |
| tour | TourLayer.tsx | 391 | guided tour overlay |
| tour | tour.module.css | 322 | tour styles |
| tour | TourMount.tsx | 119 | tour mount |
| tour | dom.ts | 75 | tour DOM target helpers |
| tour | TourReplayButton.tsx | 31 | replay button |
| features | SuggestionForm.tsx | 275 | feature suggestion form |
| community | CommunityVisuals.tsx | 236 | donut and ring meter |
| community | TapCard.tsx | 110 | tap card |
| community | TapCard.module.css | 134 | tap card styles |
| community | examTimeline.ts | 204 | exam step timeline logic |
| community | pageTools.tsx | 81 | share button and hooks |

<a id="part-2"></a>
## Part 2 - 35 deep entries

Key: props, npm (imports), Next.js APIs, styling, data expected, port (A/B/C), environmental use. "unverified" = not opened.

| # | path (lines) | props | npm / imports | Next.js APIs | styling | data expected | port | environmental use |
|---|---|---|---|---|---|---|---|---|
| 1 | src/components/home/HomeMap.tsx (192) | districts, stats, locale | next-intl, lucide-react; no map library | next/link, "use client" | unverified | HomeDistrict[] and stats from home-data.ts (server) | B | district markers coloured by a water metric |
| 2 | src/components/home/DistrictFinder.tsx (430) | mode, current, onNavigate | next-intl, lucide-react | next/link, "use client" | finder.module.css (import unverified) | static index from district-search.ts | B | find district or river basin by name |
| 3 | src/components/home/district-search.ts (233) | pure functions | none | none | n/a | index from buildDistrictIndex; DISTRICT_ALIASES | A | spelling-tolerant place and river search |
| 4 | src/components/home/useLocate.ts (213) | hook: status, locate() | react | navigator.geolocation (browser) | n/a | fetches /geo/india-states.json (present in public/geo) and state GeoJSON | A | GPS point to nearest district or station |
| 5 | src/components/home/HomeSearch.tsx (139) | none | next-intl, lucide-react | next/navigation useRouter | unverified | none | B | search box opening a monitored location |
| 6 | src/components/prices/PriceChart.tsx (81) | points, label, startLabel, endLabel, highLabel, lowLabel | type import @/lib/markets/compute | none; server-drawn SVG, no client JS | HTML and SVG | PricePoint[] | A | 90-day trend line for groundwater or AQI |
| 7 | src/components/money/MoneyToolbar.tsx (80) | unverified; exports downloadCsv(filename, rows) | next-intl, lucide-react | "use client" | unverified | rows in browser | A | CSV download for any table |
| 8 | src/components/money/visuals.tsx (324) | DonutSlice[], TopBarRow[], IconCount[], StagePart[] | lucide-react (type only) | none | CSS variables | props only | A | budget share donut and stage bar |
| 9 | src/components/land-water/visuals.tsx (367) | DonutSlice[], BarRow[], MiniRing | React; re-exports useDistrictName from @/i18n/client | "use client" | CSS variables | props only | B | crop-water share donut and bars |
| 10 | src/components/water/WaterVisuals.tsx (101) | FlowRow[] | next-intl | "use client" | CSS variables (--hue, --hue-pop) | props only | B | inflow vs outflow bars |
| 11 | src/components/land-water/DamSheet.tsx (202) | DamSheet (fields unverified) | recharts (AreaChart family), next-intl | "use client" | unverified | DamReading shape (Prisma model exists); /api/data/dam-history exists | B | reservoir storage area chart, filling or emptying |
| 12 | src/components/land-water/dam-data.ts (50) | damKey, shownDamName, sameDam, fillPct | none | none | n/a | Pick of DamReading fields | A | reservoir name matching and fill percent |
| 13 | src/components/weather/ForecastCards.tsx (378) | NowView, NowCard, TomorrowCard, SourceLine, CheckLine, TipLine | lucide-react (about 15 icons) | "use client" | unverified | parent-supplied forecast; /api/data/forecast exists | B | now and tomorrow rain and heat cards |
| 14 | src/components/weather/ForecastStrip.tsx (115) | days, now, onOpen(date) | lucide-react | "use client" | unverified | ForecastDay[] from parent | A | seven-day rainfall strip |
| 15 | src/components/weather/useWeatherText.ts (68) | hook returning phrases | next-intl | "use client" | n/a | none | B | plain-language rain and heat sentences |
| 16 | src/components/district/TodayWeatherTile.tsx (190) | locale, state, district; view props now, tomorrow, forecastSource, fetchedAt, oldReadingAt | lucide-react | next/link, "use client" | unverified | loader not in this file (unverified) | B | today's tile with old-reading warning |
| 17 | src/components/home/PriceTicker.tsx (155) | locale, markets[], fuel[] | next-intl, lucide-react | next/link, "use client" | unverified | MarketFigure, FuelFigure from home-markets.ts | B | scrolling commodity and fuel ticker |
| 18 | src/components/home/StatusStrip.tsx (212) | none | next-intl | next/link, next/navigation usePathname | unverified | GET /api/data/prices (route exists) | C | live status strip with price freshness |
| 19 | src/components/district/LiveElectionBanner.tsx (92) | locale, state slug | @tanstack/react-query, next-intl, lucide-react | "use client" | unverified | GET /api/data/election-events (route and ElectionEvent model exist) | C | live alert banner for warnings |
| 20 | src/components/news/NewsList.tsx (174) | NewsRowItem[] | lucide-react | next/link; no hooks, no "use client" | NewsList.module.css | props | B | news rows with source links |
| 21 | src/components/district/ModuleNews.tsx (133) | district, state, locale, module, limit | next-intl | next/link, "use client" | unverified | GET /api/data/news (no dedicated route file; [module] route unverified) | C | district news for one topic |
| 22 | src/components/district/DistrictHealthScoreCard.tsx (253) | districtSlug; HealthScoreRing({districtSlug, size, compact}) | @tanstack/react-query, next-intl, lucide-react | "use client" | unverified | GET /api/data/health-score (route and DistrictHealthScore model exist) | C | 0-100 environment score with trend |
| 23 | src/components/district/shell/GlanceRow.tsx (278) | stateSlug, districtSlug | @tanstack/react-query, next-intl, lucide-react | next/link, "use client" | unverified | GET /api/data/glance (route exists; 10-min cache per comment) | C | headline environment KPI row |
| 24 | src/components/district/civic/ResponsibilityParts.tsx (627) | topics, name, latestAt, state, base, items, inNews | next-intl, lucide-react | "use client"; type import from @/app/api/data/responsibility-news/route | unverified | NewsTopicCount from /api/data/responsibility-news (route exists) | C | who to call and what to do per topic |
| 25 | src/components/accountability/PoliceStaffing.tsx (99) | district, state | next-intl, lucide-react; @/hooks/useDistrictData; @/components/district/ui | "use client" | via district/ui | useDistrictData (endpoint unverified) | C | staffing against sanctioned posts |
| 26 | src/components/district/civic/LeaderDirectory.tsx (268) | Leader[]; LeaderCard({l, onOpen, hq}); KeyPeople | next-intl, lucide-react | "use client" | LeaderDirectory.module.css | Leader model (exists); officerDept maps roles | B | official directory by department |
| 27 | src/components/tenders/TenderCard.tsx (189) | tender, districtSlug, stateSlug, locale | next-intl, lucide-react | next/link, "use client" | unverified | props; useTenderStatus has no fetch | B | project card with status and red flag |
| 28 | src/components/tenders/TenderGanttTimeline.tsx (119) | events: TimelineEvent[] | next-intl, lucide-react, React useMemo | "use client" | unverified | props | A | project milestone timeline |
| 29 | src/components/money/TenderSheet.tsx (316) | TenderTapCard, TenderSheet | @tanstack/react-query, next-intl, lucide-react | next/link, "use client" | unverified | GET /api/tenders/[district]/[tenderId] (route exists) | C | project detail on tap |
| 30 | src/components/district/ui.tsx (2034) | Pill, FreshnessPill, SourcePill, AsOfText, LastUpdated, DataTable, SourcesFooter, LoadingShell, ErrorBlock, EmptyState, StatTile, KpiRing | next-intl, lucide-react, @/lib/design/*, @/lib/utils/script-lang, @/i18n/client | next/link, next/navigation, "use client" | CSS classes and variables (unverified) | FreshnessStatus green, amber, red, unknown (from /api/data/freshness) | C (split; primitives A/B) | as-of dates, source footer, panel states |
| 31 | src/components/district/shell/StaleDataNotice.tsx (112) | stateSlug, districtSlug | next-intl, lucide-react | next/navigation usePathname | unverified | freshness via hook (per comment, /api/data/freshness) | C | banner when data older than cadence |
| 32 | src/components/district/shell/VerifyPanel.tsx (336) | default export (fields unverified) | next-intl, lucide-react | next/link, next/navigation | unverified | /api/data/freshness and /api/data/verification (both exist) | C | per-dataset checks with sources |
| 33 | src/components/demographics/DataSourceCard.tsx (87) | DataSourceCardProps (unverified) | next-intl, lucide-react, @/i18n/client | "use client" | unverified | props | B | source card: publisher, date, link |
| 34 | src/components/district/shell/OverviewCard.tsx (59) | unverified | lucide-react | next/link, "use client" | unverified | props | B | module summary tile linking to detail |
| 35 | src/components/district/DistrictIdentityCard.tsx (197) | DistrictIdentityCardProps (unverified) | next-intl, lucide-react | useLocale, "use client" | unverified | props | B | district header: name, codes, headline |

<a id="part-3"></a>
## Part 3 - Five repeating patterns

1. **Freshness and source footer.** Best: `src/components/district/ui.tsx` (`FreshnessStatus` at line 97, `AsOfText` line 441, `LastUpdated` line 1885, `SourcesFooter` line 1664). Reused in `src/components/district/shell/StaleDataNotice.tsx`, `src/components/district/shell/VerifyPanel.tsx`, `src/components/demographics/DataSourceCard.tsx`.
2. **Loading, empty and error states.** Best: `src/components/district/ui.tsx` (`LoadingShell` line 1297, `ErrorBlock` line 1315, `EmptyState` line 1356, `EmptyBlock` line 2005). Also `ForecastLoading` in `src/components/weather/ForecastStrip.tsx` (line 101) and the `isLoading` branch in `src/components/district/shell/GlanceRow.tsx`.
3. **Client fetch through TanStack Query.** Best: `src/components/district/DistrictHealthScoreCard.tsx` lines 73-80 (`useHealthScore`, `queryFn` calling `/api/data/health-score`). Also `GlanceRow.tsx` lines 78-82 and `LiveElectionBanner.tsx` lines 45-47. Needs a provider; `src/components/providers/QueryProvider.tsx` (34 lines, outside slice) is the one in the reference.
4. **Bottom sheet or drawer.** Best: `src/components/district/DetailSheet.tsx` (uses `createPortal`, `useId`, `useRef`, `useEffect`). Same shape in `src/components/district/civic/ResponsibilityParts.tsx` (`TopicSheet` line 310, `ActionSheet` line 435) and `src/components/money/TenderSheet.tsx` (`TenderSheet` line 101).
5. **Tap card that opens a sheet.** Five copies of `TapCard` in this slice: `src/components/community/TapCard.tsx`, `src/components/money/TapCard.tsx`, `src/components/land-water/cards.tsx`, `src/components/accountability/AccountabilityKit.tsx`, `src/components/services-2/kit.tsx` (a sixth in `src/components/site/TapCard.tsx`, outside slice). Best single reference: `src/components/money/TapCard.tsx`. Port one copy only.

Cross-cutting: 24 of the 35 deep entries import `next-intl`. Porting them means replacing `useTranslations` and `useFormat` calls, not only styles.

<a id="part-4"></a>
## Part 4 - India versus district (names and line counts only; not read)

1. `india` has 92 files against 61 for district, organised by section: `sections/<Topic>/index.tsx` (11-18 lines) delegates to `<Topic>Client.tsx` (about 16 lines), plus `metrics.ts` (about 70-90 lines) and `styles.module.css` (about 700-810 lines).
2. Section CSS is per module (`styles.module.css`), whereas district uses shared classes in `district/ui.tsx`.
3. `india/primitives/` has its own source and freshness chips (`SourcePill.tsx` 81, `SourceHealthDot.tsx` 106, `DataQualityChip.tsx` 52) rather than reusing district UI.
4. `india/module-page/` is a generic module page (`ModulePage.tsx` 403, `ModuleVisuals.tsx` 360), which district does not have.
5. Assume nothing about india's data flow from district; it is the national roll-up and was excluded from this read.

<a id="facts"></a>
## Verified facts and unverified items

**Verified**
- `LICENSE`: "MIT License", Copyright (c) 2026 Jayanth M B. `package.json` `"license": "MIT"`.
- Stack in `package.json`: next ^16.3.4, react 19.2.3, tailwindcss ^4 (dev), prisma ^7.5 with @prisma/adapter-pg, recharts ^3.8.0, react-simple-maps ^3.0.0, @tanstack/react-query ^5.90.21, next-intl ^4.8.3, lucide-react, typescript ^5.
- `src/app/api/` exists (144 route files: admin, ai, cron, data, tenders and others). `prisma/schema.prisma` defines at least 80 models (grep listing capped at 80). The environmental ones include `DamReading`, `WeatherReading`, `RainfallHistory`, `CropPrice`, `MarketData`, `SoilHealth`, `AgriAdvisory`, `DistrictHealthScore`.
- Routes used by the 35 entries exist: `/api/data/health-score`, `/api/data/glance`, `/api/data/freshness`, `/api/data/verification`, `/api/data/forecast`, `/api/data/prices`, `/api/data/election-events`, `/api/data/dam-history`, `/api/data/responsibility-news`, `/api/tenders/[district]/[tenderId]`.
- `public/geo/india-states.json` exists.
- Each file carries a header "MIT License" notice (example: `src/components/prices/PriceChart.tsx` lines 2-3). Copying code keeps that notice.
- Only 7 of the 35 entries call `fetch` or react-query directly (`home/useLocate.ts`, `home/StatusStrip.tsx`, `district/LiveElectionBanner.tsx`, `district/ModuleNews.tsx`, `district/DistrictHealthScoreCard.tsx`, `district/shell/GlanceRow.tsx`, `money/TenderSheet.tsx`). Only `land-water/DamSheet.tsx` imports `recharts` in the 35.

**Unverified**
- Postgres as the datasource (only `@prisma/adapter-pg` seen; the datasource block was not read).
- How `ModuleNews` reaches `/api/data/news` (no route file named `news`; the `[module]` dynamic route was not read).
- Which parent passes data into `DamSheet`, `ForecastCards`, `WaterVisuals`, `HomeMap` (callers not read).
- Styling beyond CSS variables and `*.module.css` (Tailwind class usage not checked).
- Where `react-simple-maps` is used (not imported by any of the 35; probably the `map/` folder, outside this slice).
- Purpose of `HueScope.tsx` and `LockedDistrictPreview.tsx` beyond their names.
