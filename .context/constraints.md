# Architectural Constraints — rswf

<!--
  DISTINCT FROM rules.md.
  rules.md = what the business requires ("GST applies above ₹X").
  constraints.md = how the code is allowed to be shaped ("controllers never touch the DB").

  Constraints are the file the AI violates most often, because they are invisible in
  any single file — you only see them by looking at the whole codebase.

  Rule of thumb: if you'd reject a PR for it but the tests would pass, it belongs here.
-->

## Layering

| # | Constraint | Rationale | Checkable |
|---|---|---|---|
| C1 | Pages never mutate the seed arrays from `data.js`; they call a store function | one place to log, validate and later swap for an API | `grep -rn '\.push(' src/pages` may show only local arrays, never `issues`, `people`, `institutions`, `evidence` |
| C2 | Permission checks go through `can()` / `isStaff()` in `roles.js`, never `me.type === ...` in a page | one table to replace with server-side checks | `grep -rn "type === '" src/pages` should only show display logic |
| C3 | Every reviewer or admin decision calls `audit.log` | audit tab must be complete | `grep -n "audit.log" src/*Store.js` |

## Module ownership

| Module | Owns (may write) | May read | Must never touch |
|---|---|---|---|
| authStore | accounts, people, institutions, assignments, credentials, staff | data | issues, evidence |
| issueStore | issues, legal, solutionSteps, evidence seed (on listing) | data | accounts |
| evidenceStore, tasksStore, forumStore | their own arrays | data | accounts |

## Directional rules

- UI checks only hide buttons; a backend must enforce every `can()` rule.
- Staff accounts (Reviewer, Moderator, Admin) are invite-only; no path turns a User or Institute into staff (ADR-004).

## Forbidden patterns

- Renaming `issue.help` values (Money, People, Legal): breaks the Issues filter and Home icons. Map via `needToKinds`.
- Shipping third-party figures without an Unverified flag and a cross-check.
- Real passwords or personal data in the prototype: passwords are plain text.
- Resizing the window to test mobile: use 360px iframes. Append new mobile CSS at the end of `src/styles.css` (it relies on `!important`; later rules win).
