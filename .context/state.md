# Current State — rswf

**Updated:** 2026-11-17 · **Branch:** ra_rapiddeploy (pushed, last commit 2ca4ef7, 14 commits ahead of `dev`; clean)

## Right now

- Prototype work for #7 and rows 6, 7, 9 is finished and pushed. Waiting only on a PR into `dev` (the `gh` token cannot create PRs; PR text is in the last chat message).

## Next step

1. Open the PR `ra_rapiddeploy` into `dev` (compare link: github.com/achrarajeev/rswf/compare/dev...ra_rapiddeploy). Needs `gh auth refresh -s repo` or a signed-in browser.
2. Post the #7 status comment (owner says it is pasted); owner closes #6 and #7 (#7 closes when `dev` reaches `main`).
3. Team decisions: #7 file types/size/one document; #6 required fields and reviewer criteria; block rejected institutes from joining?
4. Check the new forum screens (ForumNew admin toggle, thread Tag users, Me tagged card) at 360px; not done yet.

## Blocked / waiting on

- `gh` token has no issue/PR write access; Chrome tab is not signed in to GitHub.
- Row 6: a decision on extra powers for verified lawyers/researchers. Row 8 needs a server. Row 9 needs original images from creators.

## Known bugs & gotchas

- All state resets on refresh; only the login is kept (`sessionStorage` `rswf-session`). Passwords are plain text; demo password is `demo1234`.
- Evidence files keep only the file name; institute proof keeps an in-memory blob URL that dies on refresh.
- A rejected institute can still call `join`; it is only hidden from People.
- Tagging only shows on the Me page; no email or push.
- Overview "Government says 38 ha" and the Sources tab are Saidongar data for every case. Hasdeo/Dibang legal text is placeholder.
- No test suite: verify with `npm run build` plus a browser check. HashRouter: URLs are `/#/path`; scope selectors to `main`, use native value setters.
- Mobile CSS (<=900px) relies on `!important`; append new CSS at the end of `src/styles.css`. `sed -i` on macOS needs `-i ''`.

## Dead ends — do not retry

- Resizing the window to test mobile: use 360px iframes.
- Posting to GitHub via `gh` or the Chrome tab without a token with write scope / a login: both fail (error `Resource not accessible by personal access token`).
- Renaming `issue.help` values: map via `needToKinds` instead.
- Wikipedia ISFR 2021/2023 columns are corrupted; RBI/data.gov.in fail with WebFetch (use `curl -A Mozilla/5.0`).
- GADM state GeoJSON is pre-2014/2019 states. Use Natural Earth admin-1.
