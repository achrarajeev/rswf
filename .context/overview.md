# Overview — rswf

<!-- Slow-changing. Architecture and setup only. NOT a file listing. -->

## What this is

Earth Ledger is a national open database of active environmental issues in India: projects, companies, legal position, emissions and biodiversity data, the people and institutes working on each case, and the evidence behind every claim. Citizens, lawyers, researchers and institutes contribute; reviewers check evidence before it is published. It is a clickable prototype: all data is in memory and resets on refresh.

## Architecture

Single-page React app (HashRouter). `src/data.js` holds seed arrays shaped like future database tables. Small in-memory stores (`authStore`, `issueStore`, `evidenceStore`, `tasksStore`, `forumStore`, `auditStore`) mutate those arrays and notify pages through `useSyncExternalStore`. `roles.js` is the one permission table. Pages in `src/pages` read stores and render; there is no network layer. Each store has TODO comments naming the API endpoint it will become.

Submission pipeline (issues, evidence, institutes, credentials): contributor submits, item sits as "Pending review", a reviewer approves, asks for more information, or rejects, and every decision is written to the audit log.

## Key paths

| Path | Role |
|---|---|
| `src/main.jsx` | entry point and routes |
| `src/data.js` | seed data (issues, people, institutions, evidence) |
| `src/*Store.js` | in-memory stores; future API boundaries |
| `src/roles.js` | who may do what |
| `src/proofDoc.js` | institute proof-document rules |
| `docs/` | PRD, user flow, pending features, vision |

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # no test suite yet; build plus manual browser check
```

## Environment

| Var | Purpose | Where it comes from |
|---|---|---|
| none | no environment variables | |

## External services

| Service | Used for | Failure mode |
|---|---|---|
| none | the prototype makes no network calls | |
