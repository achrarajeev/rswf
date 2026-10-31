# Decision Log — rswf

<!--
  APPEND ONLY. Newest at the bottom. Never edit or delete a past entry.
  To reverse a decision, add a NEW one and change the old entry's Status line only.

  STATUS is the one field you may edit retroactively:
    Accepted     — in force
    Experimental — trying it, may not stick; don't build hard on it
    Deprecated   — still true in code, but don't extend it
    Superseded   — replaced; says by which ADR
    Reverted     — we tried it and undid it. KEEP IT. This is the most valuable kind.

  TYPE drives the architecture timeline (`llmw timeline`):
    architecture · stack · data · security · process · ops
-->

Format: `## [YYYY-MM-DD] ADR-00N — Title`

---

## [2026-10-27] ADR-001 — Adopt .context/ for project memory

- **Status:** Accepted
- **Type:** process
- **Context:** Sessions lose context; the same decisions get re-argued; re-explaining
  the project every session is expensive.
- **Options:** ad-hoc CLAUDE.md · memory MCP server · full spec-driven framework ·
  file-based `.context/` in-repo
- **Decision:** file-based `.context/` committed with the code, aggregated by a hub repo.
- **Why:** versions atomically with the code, inspectable, recoverable from git history,
  zero infrastructure.
- **Consequences:** requires discipline at session end (mitigated by hooks); does not
  scale past ~1000 pages (not a concern at current size).

---

## [2026-10-31] ADR-002 — Demo forest layer on unverified secondary data

- **Status:** Accepted (temporary)
- **Type:** product / data
- **Context:** Map needs per-state forest cover by year; official FSI sources were unreachable and the only full tables were on Wikipedia, partly corrupted.
- **Options:** Wikipedia 2015+2017 cross-checked · wait for ISFR PDFs · placeholder sample data
- **Decision:** ship 2015 and 2017 only, cross-checked, flagged Unverified in the UI; hold flat after 2017.
- **Why:** real and honest for a demo, two true time points beat invented ones; PRD requires traceable sources.
- **Consequences:** must be replaced with ISFR 2019/2021/2023 before publishing; slider after 2017 shows no change.

## [2026-10-31] ADR-003 — Volunteer registration with reviewer approval
- **Context:** Issues need a fair, visible record of who is helping and what has been achieved; volunteers may be people, companies or institutes.
- **Options:** open self-listing; login-only; registration form with reviewer approval.
- **Decision:** One form with Individual/Company/Institute variants; organisations give a registration number; listed publicly only after reviewer approval; progress updates require a source.
- **Why:** Matches the "no source, no claim" principle and stops fake organisations appearing.
- **Consequences:** Needs a store and a reviewer queue (not built); email/phone stay private.

## [2026-10-31] ADR-004 — Role table and invite-only staff
- **Context:** Spec wants admin, moderator, lawyer, local researcher with verification; prototype had only User/Institute/Reviewer checks scattered across pages.
- **Options:** per-page type checks; one permission table; full RBAC with per-user grants.
- **Decision:** `src/roles.js` maps action → roles; Reviewer, Moderator, Admin are separate, invite-only staff; Lawyer/Local researcher are reviewer-verified badges on a User, not account types.
- **Why:** The same table becomes server-side authorisation later; badges avoid a role per profession.
- **Consequences:** UI checks only hide buttons; backend must enforce; ADR-003's reviewer approval now covers credentials too.
