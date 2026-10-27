# Lessons & Solved Problems — rswf

<!--
  The memory that stops work being redone. Three sections, three different jobs:

    1. Standing rules   — injected into EVERY session automatically (~150 tok).
                          One-line imperatives. Keep to ~15 lines.
    2. Solved problems  — the "we already fixed this" ledger. NOT injected;
                          found via `llmw recall <keywords>`. Grows without limit.
    3. Incidents        — full detail for the entries above. Read on demand.

  HOW IT'S LOADED: the SessionStart hook extracts only the `- ` bullets under
  "## Standing rules". Everything else is retrieved, not loaded.

  THE RULE THAT MAKES THIS WORK: before debugging anything, run
  `llmw recall <symptom>`. This is enforced in standards/00-core.md.
-->

## Standing rules (auto-injected at every session start)

<!--
  One line each, imperative, no explanation. Both kinds belong here:
    NEVER — learned from something breaking
    ALWAYS — learned from something working well
-->

- Never rename an API route. Add the new one and deprecate the old.
- Always verify migration ordering before generating a migration.
- Never modify tax/GST validation without asking — the rules are not all in code.

---

## Solved problems

<!--
  APPEND ONLY. One line per problem, written so that GREP FINDS IT LATER.

  Lead with the SYMPTOM in the words you'd actually search for six months from
  now — the error text, the observed behaviour — not the diagnosis. You will
  search for what you see, not for what turned out to be true.

  Format:  - [YYYY-MM-DD] <symptom / error> → <fix> (`path`) [#tag #tag]

  Good:  - [2026-08-05] "ECONNREFUSED 5432" on boot after pull → docker compose
           needs `up -d db` before the app; app doesn't wait (`docker/README`) [#db #setup]
  Bad:   - Fixed the database connection issue.   ← unsearchable, useless later
-->

- [2026-10-28] Page goes blank (empty #root) after clicking a tab → missing import in a shared component (`Link` in `Missing`); check console ReferenceError (`src/components/ui.jsx`) [#react #vite]
- [2026-10-28] Nav burger pushed off-screen at 360px after adding nav search → later `.nav .search{display:flex}` overrode the mobile hide; add `display:none!important` in the 900px block (`src/styles.css`) [#mobile #css]
- [2026-10-28] Mobile `position:fixed` scrim doesn't dim the page → parent `backdrop-filter` becomes the containing block; render the scrim outside it (`src/components/Layout.jsx`) [#css #mobile]
- [2026-10-28] Grid tile rule like `:first-child{grid-column:1/-1}` ignored on mobile → items are wrapped in Reveal divs; style by class and use `!important` over inline grids (`src/styles.css`) [#css #mobile]

---

## Incidents

<!--
  Full detail. Only for things worth explaining — an AI breaking something, a
  revert, a subtle bug that cost real time. One-line fixes belong above, not here.
-->

Format: `### [YYYY-MM-DD] <tool/cause> — <what broke>`

### [2026-10-27] example — template entry, delete me

- **What happened:** the agent removed a validation check while refactoring.
- **Why it happened:** the rule it enforced was not written anywhere it could see.
- **Blast radius:** N files / which module / did it ship?
- **Recovery:** `git revert abc123`, then re-added the check with a test.
- **Rule extracted:** → added to Standing rules above.
- **Prevention:** documented the rule in `rules.md` so it's visible next time.
