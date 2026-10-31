# Current State — rswf

**Updated:** 2026-10-31 · **Branch:** main (uncommitted: forest-cover map layer)

## Right now

- Map page has a state-level forest-cover choropleth driven by the year slider (`IndiaMap.jsx`, `forest.js`, `states.json`). Built and browser-checked; not yet committed.
- Added a Change/Cover toggle (default Change): diverging orange/green vs each state's first report year, +-6 pts full colour. Browser-checked (Kerala +7.2, Mizoram -3.5); not yet committed.
- Data now comes from the FSI PDFs: 2019 (ISFR 2019 Table 2.4), 2017 (derived, official), 2021*/2023 (ISFR 2023 Table 2.4). 2015 is Wikipedia-derived and omitted where unconfirmed. Slider holds flat after 2023. Trust: Medium.

## Next step

1. Run `/verify`, then commit (add the Co-Authored-By line).
2. Get official ISFR 2015/2017 volumes to replace the Wikipedia 2015 column (the change baseline depends on it).
3. Verify indicator numbers in `src/data.js` (FSI/NTCA); they came from memory.
4. Swap `src/india.json` for the official Survey of India boundary (also re-clip `states.json` to it).
5. Test on a real phone; mobile checks so far were 360px iframes (forest legend untested on mobile).

## Blocked / waiting on

- Nothing. (fsi.nic.in PDFs download fine with curl and a browser User-Agent; the ISFR 2023 URL under /isfr-2021/chapter-2.pdf is actually the 2023 report.)

## Known bugs & gotchas

- `forest.js`: 2015 omitted for J&K, Ladakh, Delhi, Tripura, DNH+DD. 2021 is the revised figure from ISFR 2023, so it differs slightly from ISFR 2021 as printed. Methods change between reports.
- Case statuses, `trend`, `since`, claim submitters (`by`) and thumbnails are illustrative sample data. Company names are real.
- Only `saidongar` has sourced Legal/Emissions/People detail; other cases show the `Missing` placeholder.
- Mobile CSS (<=900px) relies on `!important` to beat inline grid styles; later appended rules win, so check the end of `src/styles.css`.
- Mobile test method: replace `document.body.innerHTML` with 360px iframes of `/#/route`.
- `sed -i` on macOS needs a backup suffix (`-i ''`); `python3 -I` blocks importing local modules.
- `.context/*` templates (CLAUDE.md `{{...}}` placeholders, overview.md, constraints.md) are still unfilled.

## Dead ends — do not retry

- Resizing the window to test mobile: use iframes.
- Full-width hamburger drawer; scrim inside the nav (`backdrop-filter` containing block).
- Wikipedia's ISFR 2021 and "As of 2023" columns: corrupted (Kerala 10,366 km2, Ladakh 77.77%). Do not use.
- RBI table pages redirect to the RBI homepage; data.gov.in returns 403 to WebFetch.
- GADM-based state GeoJSON (geohacker, Subhash9325): pre-2014/2019 states, no Telangana/Ladakh. Use Natural Earth admin-1.
