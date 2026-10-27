# Current State — rswf

**Updated:** 2026-10-28 · **Branch:** main (nothing committed yet)

## Right now

- RSWF Earth Ledger (Vite + React 19, HashRouter) UI is feature-complete against the PRD audit, items 1-8. All edits are uncommitted.

## Next step

1. Run `/verify`, then commit (add the Co-Authored-By line).
2. Verify indicator numbers in `src/data.js` (FSI/NTCA) against the sources; they came from memory.
3. Swap `src/india.json` for the official Survey of India boundary.
4. Test on a real phone; all mobile checks so far were 360px iframes.

## Blocked / waiting on

- Nothing.

## Known bugs & gotchas

- Case statuses, `trend`, `since`, claim submitters (`by`) and thumbnails are illustrative sample data. Company names are real.
- Only `saidongar` has sourced Legal/Emissions/People detail; other cases show the `Missing` placeholder.
- Mobile CSS (<=900px) relies on `!important` to beat inline grid styles; later appended rules win, so check the end of `src/styles.css`.
- Mobile test method: replace `document.body.innerHTML` with 360px iframes of `/#/route`. The helpers are lost on reload.
- `sed -i` on macOS needs a backup suffix; use Python replace scripts.
- `.context/*` templates (CLAUDE.md `{{...}}` placeholders, overview.md) are still unfilled.

## Dead ends — do not retry

- Resizing the browser window to test mobile: doesn't work. Use iframes.
- Full-width hamburger drawer: it expanded the whole section. Use the floating card.
- Keeping the scrim inside the nav: `backdrop-filter` makes it the fixed-position containing block. Render it outside the header.

## Low-confidence areas

- FSI/NTCA indicator numbers, the Natural Earth boundary, and all status/trend labels.
