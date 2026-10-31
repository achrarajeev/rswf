# Current State — rswf

**Updated:** 2026-10-31 · **Branch:** main (clean; last commit 8ab7649 "issue detail changes")

## Right now

- Issue detail now has Contributors and Progress-and-evidence tabs (replacing "People and lawyers") and a volunteer registration page `/issues/:id/join` (`Join.jsx`: Individual / Company / Institute). Committed; build passes; NOT yet checked in a browser or at 360px.
- Forest-cover map layer (Change/Cover toggle, FSI data) is committed. Trust: Medium.

## Next step

1. Browser-check `/#/issues/saidongar` (both new tabs, filter) and `/#/issues/saidongar/join` (kind switch, validation, success), desktop and 360px iframes.
2. Build a backend/store for registrations (`Join.jsx` submit has a TODO) and a reviewer step to approve them before they show under Contributors.
3. Decide how progress updates are logged with proof (today "Add proof of progress" links to the generic `/contribute`).
4. Get official ISFR 2015/2017 volumes to replace the Wikipedia 2015 column.
5. Verify indicator numbers in `src/data.js` (FSI/NTCA); they came from memory.
6. Swap `src/india.json` for the official Survey of India boundary (re-clip `states.json`).

## Blocked / waiting on

- Nothing.

## Known bugs & gotchas

- `contributors`, `progress` (data.js) exist only for `saidongar` and are illustrative; two orgs are labelled "(sample)". Other cases show `Missing` placeholders.
- Join form does not persist anything; registrations are lost on submit.
- Case statuses, `trend`, `since`, claim `by`, thumbnails are illustrative. Company names are real.
- `forest.js`: 2015 omitted for J&K, Ladakh, Delhi, Tripura, DNH+DD. 2021 is the revised ISFR 2023 figure. Methods change between reports. Slider holds flat after 2023.
- Mobile CSS (<=900px) relies on `!important` to beat inline grid styles; later appended rules win, so check the end of `src/styles.css` (new `.proof/.seg/.checks` rules are appended there).
- Mobile test method: replace `document.body.innerHTML` with 360px iframes of `/#/route`.
- `sed -i` on macOS needs `-i ''`; `python3 -I` blocks importing local modules.
- `.context/*` templates (CLAUDE.md `{{...}}` placeholders, overview.md, constraints.md) are still unfilled.

## Dead ends — do not retry

- Resizing the window to test mobile: use iframes.
- Full-width hamburger drawer; scrim inside the nav (`backdrop-filter` containing block).
- Wikipedia's ISFR 2021 and "As of 2023" columns: corrupted (Kerala 10,366 km2, Ladakh 77.77%).
- RBI table pages redirect to the RBI homepage; data.gov.in returns 403 to WebFetch.
- GADM-based state GeoJSON: pre-2014/2019 states. Use Natural Earth admin-1.
