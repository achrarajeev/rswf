# Session Log — rswf

<!--
  APPEND ONLY, newest at the bottom.
  Consistent prefix makes it greppable:  grep "^## \[" log.md | tail -5
  One entry per session. Two to five lines. Not a diff — a diff is in git.
-->

## [2026-10-27] init | context system installed

- Installed `.context/` scaffold and standards symlink.
- Next: fill in overview.md and state.md.

## [2026-10-28] session | Earth Ledger UI to PRD parity

- Added home KPIs, nav search, Issues filter sidebar and sort, clustered map with year slider, Me page, sticky Help, trust badges on cards.
- Added /about, /rti, share menu, "not found yet" placeholders, reviewer thumbnails and submitters.
- Mobile fixes: KPI row, story bento, nav search hidden under 900px.
- Open: verify indicator numbers, official boundary, real-phone test, commit.

## [2026-10-31] session | Forest-cover map layer

- Added state-level forest choropleth to MapView: Natural Earth admin-1 boundaries (`states.json`), ISFR 2015/2017 data (`forest.js`), colour ramp and legend; interpolates between report years, holds flat after 2017.
- Data came from Wikipedia (official sources unreachable); cross-checked class sums vs published totals and 2015 vs "change since 2015"; Delhi omitted, 5 regions flagged. Marked Unverified.
- Open: replace with real ISFR 2019/2021/2023 tables, `/verify` and commit, mobile check of the legend.

## [2026-10-31] session | Official FSI forest data

- Replaced Wikipedia-only forest data with FSI PDF tables (2019, 2021 revised, 2023; 2017 derived). National totals reconcile to the published 7,12,249 and 7,15,342.61 km2.
- 2019 table orders J&K/Ladakh alphabetically, 2023 table puts them last: misaligned rows gave Kerala 60%, Meghalaya 226%; sanity checks caught it.
- Open: change-since-2015 toggle, official 2015 column, /verify and commit.

## [2026-10-31] session | Forest change view toggle

- Added `changeAt`/`changeColor` in `IndiaMap.jsx` and a Change/Cover toggle in `MapView.jsx`: green = gained, orange = lost, baseline = each state's first report year.
- Reason: absolute shading barely moved between 2015 and 2023 (real changes are 1-7 pts), so the slider looked static.
- Open: `/verify` and commit; official 2015 column; map holds flat after 2023.

## [2026-10-31] session | Issue contributors, evidence, join form

- Replaced the "People and lawyers" tab with Contributors (filter by Individual/Company/Institute) and Progress and evidence (current status + dated, sourced timeline). Sample data for `saidongar` only, labelled illustrative.
- Added `Join.jsx` at `/issues/:id/join`: kind-dependent fields, registration number for organisations, validation, consent for public listing. Volunteer button now links to it.
- Decided: unsourced progress updates are not shown; organisations are listed only after reviewer approval.
- Open: browser/mobile check, persistence for registrations (TODO in `Join.jsx`), proof-logging flow.
