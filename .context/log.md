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

## [2026-10-31] session | Prototype flows, tasks, roles, admin
- Built the in-memory prototype end to end: accounts and registration, institute approval, evidence pipeline with reviewer queue, forum thread/report, Evidence and People tabs, join form with needs, Solution tab with tasks (institutes maintain, volunteers pick up).
- Added `roles.js` permission table, `/admin` (overview, users, moderation, audit log), staff invite, suspension, and verified Lawyer/Local researcher badges.
- Decided: staff roles are invite-only; Reviewer, Moderator and Admin stay separate (ADR-004). Backend deferred until flows are final.
- Open: nothing committed yet, 360px check of new pages, reject-path tests, unfilled CLAUDE.md placeholders.

## [2026-11-12] session | dev

  - `cba7612` Merge pull request #12 from achrarajeev/feat/issue-submission-form
  - `ae70cab` feat: issue submission form with mandatory evidence and reviewer queue (#6)

## [2026-11-17] session | Institution registration with proof document (#7)
- Institute register form now requires a proof document (type, PDF/JPG/PNG, <=5 MB) via `src/proofDoc.js`; reviewer Institutes tab shows and opens it; institute page lets the owner resubmit after "More info needed" or "Rejected".
- Browser-tested the full loop. Limits assumed (not yet agreed on the issue): file types, size, one document. File is held in memory only (blob URL), lost on refresh.
- Issue #6 shipped in PR #12 but was left open on GitHub.

## [2026-11-17] session | Pending items cleared
- 360px check clean on all pages listed in state.md; reject and more-info paths tested for evidence, credentials and institutes.
- Filled CLAUDE.md placeholders, overview.md and constraints.md. Cross-checked indicators against PIB; tiger range lower bound flagged as secondary.
- Gap found: a rejected institute can still join issues (hidden from People only).

## [2026-11-17] session | Rows 7, 6, 9
- Row 7: `forum.official` permission, `forum.official()` and `forum.tag()` in forumStore (audited), TagPicker, "Admins tagged you" card on Me. Browser-tested: only admins see the toggle; moderator and user are refused at the store.
- Row 9: audited all 14 images, each has artist, licence and page in credits.json. Row 6 re-scoped in docs. Row 8 left deferred.

## [2026-11-17] session | Prototype rows done, PR pending
- Built #7 (institute proof document) and row 7 (admin official topics and tagging); audited images for row 9; re-scoped row 6; filled CLAUDE.md, overview, constraints; cross-checked indicators against PIB.
- Decided: build only what a prototype can show honestly; row 8 stays deferred (see ADR-006).
- Open: PR into `dev` not created (token/browser sign-in), #6/#7 comments and closing, rejected-institute join gap, 360px check of new forum screens.
