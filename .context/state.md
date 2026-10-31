# Current State — rswf

**Updated:** 2026-10-31 · **Branch:** ra_rapiddeploy (uncommitted: stores, accounts, tasks, admin; last commit 38dd3fc)

## Right now

- Prototype flows are complete in memory: accounts (User/Institute/Reviewer/Moderator/Admin via `roles.js`), join, tasks (Solution tab), evidence submit-review-publish, forum + moderation, verified badges, `/admin`. Build passes; browser-tested on desktop. NOT checked at 360px.
- Stores (`authStore`, `forumStore`, `evidenceStore`, `tasksStore`, `auditStore`) have TODOs naming the future API endpoints.

## Next step

1. Run `/verify`, then commit this branch (nothing committed yet this session).
2. Check the new pages at 360px: Solution, Admin, Reviewer Verification tab, Me, Login, Register, Institute.
3. Test the untested paths: evidence "More info"/"Reject", credential reject, institute reject.
4. Fill CLAUDE.md `{{...}}` placeholders and `.context/overview.md`, `constraints.md`.
5. Verify indicator numbers in `src/data.js` (FSI/NTCA); they came from memory.

## Blocked / waiting on

- Nothing. The backend is deferred until the prototype flows are final.

## Known bugs & gotchas

- All state resets on full page refresh; only the login is kept (`sessionStorage` `rswf-session`). Passwords are plain text; demo password is `demo1234`.
- Overview "Government says 38 ha" and the Sources tab are Saidongar data for every case. Hasdeo/Dibang legal text is placeholder and may read as fact.
- Staff are invite-only; admins cannot convert a User/Institute into staff. Task steps are fixed seed data; tasks cannot be edited, only removed and re-added.
- Evidence files are never uploaded; only the file name is kept.
- Mobile CSS (<=900px) relies on `!important`; later-appended rules win, so append new CSS at the end of `src/styles.css`.
- Browser testing: scope selectors to `main` (nav search form is first in the DOM), use native value setters + dispatched events, no `location.reload()` mid-script, and do not echo URLs containing `?` in tool output (blocked).
- `sed -i` on macOS needs `-i ''`; `python3 -I` blocks importing local modules.

## Dead ends — do not retry

- Resizing the window to test mobile: use 360px iframes.
- Renaming `issue.help` values (Money/People/Legal): breaks Issues filter and Home icons. Map via `needToKinds` instead.
- Wikipedia ISFR 2021/2023 columns are corrupted; RBI/data.gov.in fail with WebFetch (use `curl -A Mozilla/5.0`).
- GADM state GeoJSON is pre-2014/2019 states. Use Natural Earth admin-1.
