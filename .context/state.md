# Current State — rswf

**Updated:** 2026-11-03 · **Branch:** docs/wrap-nov-3 (from `dev`). `main` and `dev` differ only by the branching-docs PR #9 (dev is 2 ahead).

## Right now

- In-memory prototype is complete and merged: accounts/roles (`roles.js`), join, tasks, evidence pipeline, forum + moderation, `/admin`. Checked at 360px (no overflow). README and `docs/` (PRD, user-flow, pending-features, Google Doc snapshot) are in.
- Workflow changed: feature branch → PR into `dev` → PR `dev` → `main` (ADR-005). Stores have TODOs naming future API endpoints.

## Next step

1. Open the `dev` → `main` PR (dev is ahead by the branching docs) when the team is ready to release.
2. Turn on GitHub branch protection for `main` (Settings → Branches); not possible from this machine.
3. Write `docs/api.md` from the store TODOs; extend `docs/user-flow.md` (PRD feature #10).
4. Test untested paths: evidence "More info"/"Reject", credential reject, institute reject.
5. Fill CLAUDE.md `{{...}}` placeholders and `.context/overview.md`, `constraints.md`. Verify FSI/NTCA figures in `src/data.js`.

## Blocked / waiting on

- `gh` CLI is not logged in here (PRs must be opened in the browser, or run `! gh auth login`).
- Backend deferred until flows are final; PRD feature #6 roles were prototyped early.

## Known bugs & gotchas

- State resets on refresh; only login is kept (`sessionStorage` `rswf-session`). Passwords plain text; demo password `demo1234`.
- Overview "Government says 38 ha" and Sources tab are Saidongar data for every case; Hasdeo/Dibang legal text is placeholder.
- Staff are invite-only; tasks can't be edited, only removed and re-added; evidence files keep only the file name.
- Mobile CSS (<=900px) uses `!important`; append new CSS at the end of `src/styles.css`.
- Browser testing: scope selectors to `main`, native value setters + events, no `location.reload()` mid-script, never echo URLs containing `?`.
- `main` can move while you work (PRs merged by others): `git fetch` and re-check before pushing to `dev`.
- Commits are authored as `achrarajeev`; the user does not want a Claude co-author line.
- `sed -i` on macOS needs `-i ''`; `python3 -I` blocks local imports.

## Dead ends — do not retry

- Resizing the window to test mobile: use 360px iframes.
- Renaming `issue.help` values: breaks Issues filter and Home icons; map via `needToKinds`.
- Wikipedia ISFR columns are corrupted; RBI/data.gov.in fail with WebFetch (use `curl -A Mozilla/5.0`).
- GADM state GeoJSON is outdated; use Natural Earth admin-1.
- Google Doc PRD: `/export?format=md` works for a link-shared doc (no Drive connector needed).
