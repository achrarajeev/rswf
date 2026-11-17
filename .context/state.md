# Current State — rswf

**Updated:** 2026-11-17 · **Branch:** ra_rapiddeploy (pushed; PR into `dev` not yet opened because the `gh` token cannot create PRs)

## Right now

- Prototype flows are complete in memory: accounts, join, tasks, evidence submit-review-publish, issue submission (#6, merged), institute registration with proof document (#7, on this branch), forum + moderation, verified badges, `/admin`.
- Checked at 360px: Solution, Admin, Reviewer (Institutes, Verification), Me, Login, Register, Institute, IssueNew. No horizontal page scroll; the issue tab bar scrolls on purpose.
- Reject / more-info paths tested: evidence, credential, institute (rejected institute is hidden from People and can resubmit).
- Indicators in `src/data.js` cross-checked against PIB (ISFR 2023, AITE 2022). The tiger range lower bound (3,167) is secondary-only and noted as such.

## Next step

1. Open the PR `ra_rapiddeploy` into `dev` (link in the log); close #7 when `dev` reaches `main`. Issue #6: comment added, owner to close.
2. Agree the open questions on #7 (file types, size, one document) and #6 (required fields, reviewer criteria).
3. Deferred rows 6-9 in `docs/pending-features.md` (roles beyond staff, admin-managed forum, scheduled data pull, royalty-free images) need the backend.

## Blocked / waiting on

- `gh` token lacks issue and PR write access (`gh auth refresh -s repo`).

## Known bugs & gotchas

- All state resets on refresh; only the login is kept (`sessionStorage` `rswf-session`). Passwords are plain text; demo password is `demo1234`.
- Evidence and institute documents are never uploaded; evidence keeps the file name, institute proof keeps an in-memory blob URL that dies on refresh.
- A rejected institute can still call `join`; it is only hidden from People. Decide whether to block it.
- Overview "Government says 38 ha" and the Sources tab are Saidongar data for every case. Hasdeo/Dibang legal text is placeholder.
- Staff are invite-only. Task steps are fixed seed data.
- Mobile CSS (<=900px) relies on `!important`; append new CSS at the end of `src/styles.css`.
- Hash routing: URLs are `/#/path`. Browser testing: scope selectors to `main`, use native value setters, no `location.reload()` mid-script.
- `sed -i` on macOS needs `-i ''`; `python3 -I` blocks importing local modules.

## Dead ends — do not retry

- Resizing the window to test mobile: use 360px iframes.
- Renaming `issue.help` values: map via `needToKinds` instead.
- Wikipedia ISFR 2021/2023 columns are corrupted; RBI/data.gov.in fail with WebFetch (use `curl -A Mozilla/5.0`).
- GADM state GeoJSON is pre-2014/2019 states. Use Natural Earth admin-1.
