# RSWF: Vision and Plan

Draft. Owner: Ganesh Reddy. Written 2026-11-10. This is a living plan: change it when a constraint or an easier way appears, and record the change and its reason in [section 9](#9-change-log).

## Index
1. [Vision](#1-vision)
2. [Plan to achieve the vision](#2-plan-to-achieve-the-vision)
3. [Where we are today](#3-where-we-are-today)
4. [How the vision works: three streams](#4-how-the-vision-works-three-streams)
5. [Principles](#5-principles)
6. [Delivery phases](#6-delivery-phases)
7. [Decisions the team must make](#7-decisions-the-team-must-make)
8. [Risks](#8-risks)
9. [Change log](#9-change-log)

Related: [PRD](PRD.md), [user flow](user-flow.md), [pending features](pending-features.md), [ForThePeople.in reference analysis](reference/forthepeople-analysis.md).

## 1. Vision

RSWF is the open site where anyone in India can see which environmental issues are live, who is behind them, what the law and the data say, and where help is needed. Every claim traces to its original source. Every number shows when it was last updated.

**Second pillar: NGO transparency (added 2026-11-10).** Many NGOs work on environmental and social causes. Donors cannot easily tell whether money reaches its stated purpose. RSWF brings transparency here too:
- List what each NGO received (donations, grants, CSR and foreign funds where public) and what it says it spends it on.
- List what the NGO says it does, and hold it accountable to that purpose.
- Ask the people the work is meant to help, and the people on the ground, what they actually received and what changed.
- Put the three side by side for anyone to compare: money in and spent, promised result, verified reality.
- An individual can verify and add to each comparison, with evidence, through the same reviewer gate as issues.

RSWF shows the gap between promise, spend and result. It does not declare an NGO corrupt or guilty of money laundering. Only a court or an authority decides that. A gap is shown as a documented fact with its sources, and the NGO gets a right of reply.

What this means in practice:
- A visitor opens an issue and sees the project, the company, the legal position, emissions and biodiversity data, the people and institutes working on it, its status, and the help it needs (money, people, legal).
- A volunteer or institute can join an issue and pick up a task.
- Anyone can post an issue or evidence. Nothing is published until a reviewer has checked it.
- The focus is data that shows the reputational cost to companies and authorities.

What RSWF is not (for now): a government site, a news site, a payments platform, or a place where unreviewed claims go live.

Model: ForThePeople.in (MIT licence). We copy its functionality and its honesty rules where it makes sense. Colours and content are our own. Detail in the [reference analysis](reference/forthepeople-analysis.md).

## 2. Plan to achieve the vision

Four steps, in this order. Each step needs the one before it. Before building any feature, check [what already exists](reference/landscape.md): where a site already does the job (for example NGO financial profiles or land-conflict research), we link to it instead of rebuilding.

| Step | What | Done when |
|---|---|---|
| 2.1 | Build the base list: companies that spend on CSR and donations, and NGOs already registered in India, with their purpose | The backend holds NGOs and companies with source and date on every record, and the site shows them |
| 2.2 | Let NGOs claim and manage their own record | A verified NGO edits its own page and shares internal data by consent |
| 2.3 | Let missing NGOs list themselves, verified by the admin team | An unlisted NGO is reviewed and published, using Hima's verification method |
| 2.4 | Promote the site to get users | Individuals use it to find a nearby NGO and check its response |

### 2.1 The base list: where the data lives

Checked on 2026-11-10 by a Gemini research pass plus my own look at the portals. "Verified" means I opened it. "Gemini only" means a claim I could not confirm; check it before building.

| Channel | What it holds | Access | Status |
|---|---|---|---|
| **NGO Darpan** (ngodarpan.gov.in, NITI Aayog) | Registered NGO list: Darpan ID, name, type, registration details, location, sectors, work areas. Self-declared by NGOs | Public site. 637,171 Darpan IDs: 317,549 trusts, 260,603 societies, 58,935 Section 8 companies. 84 blacklisted. Site says an ID is issued on a self-declared affidavit and is no endorsement | **Verified** (home page, updated 15-04-2026). Captcha on search, bulk download and licence: Gemini only |
| **National CSR Portal** (csr.gov.in, MCA) | Company CSR spend by year, state, sector, project; home page shows totals (29,546 companies, INR 40,794 crore, 72,233 projects, 40 states and UTs, 14 sectors; year tab not checked) | Blocks scripts (HTTP 403) but opens in a browser. Company and project level search: Gemini only | **Verified** the site exists and shows totals. Detail, export and terms: not checked |
| **MCA CSR forms** (CSR-1 for implementing agencies, CSR-2 for company annual CSR report; mca.gov.in) | CSR-2 lists company, spend, project, implementing agency and its Darpan ID. CSR-1 registers the NGO | mca.gov.in blocks scripts (403). Bulk data may need a fee and a login | **Gemini only**. Check by hand |
| **FCRA** (fcraonline.gov.in, MHA) | Foreign-contribution registrations, cancelled and expired lists, annual returns (donors, amounts, use) | **The portal moved.** Gemini's address fcraonline.nic.in no longer answers. The new site is an app with "Track Application", "Validate FCRA Certificate" and a dashboard link. Annual return is due 31 Dec | **Verified** the new site exists. Public search, return format (PDF or Excel) and captcha: not checked |
| **Income tax 12A/80G** (incometax.gov.in) | Tax-exempt and donation-eligible NGO status | No public full list found; status is checked one entity at a time. Form 10B and 10BB are not public | **Gemini only**; consistent with what I know. Check one lookup by hand |
| **data.gov.in** (OGD platform) | Many small NGO datasets from ministries and state departments (for example fund released to NGOs, child-care institution lists). Download and "Request API" buttons | Open, no login | **Verified** the platform and the small datasets. Gemini's "million-row Darpan dataset" did **not** appear in two searches: treat as unconfirmed |
| **Annual reports and SEBI BRSR** | Listed-company CSR detail, implementing agencies, impact assessment | PDFs on company, BSE and NSE sites; no single feed | **Gemini only**; matches the rules. Needs reading by hand or extraction |
| **State registrars (societies, charity commissioners)** | Society and trust registration records | Not uniform. No pan-India list; many records are on paper | **Gemini only** |
| **GuideStar India** | NGO profiles with documents, financials and validation seals | Site is an app that needs JavaScript. Reuse terms unknown | Opens; content **not checked** |
| **Existing aggregators** | None open-source and complete found. Commercial verification APIs for a Darpan ID exist (RPACPC) | Paid | **Gemini only** |

What this means for the plan:
- **Darpan is the NGO spine.** One ID per NGO, a big public list, and CSR-2 forms use the Darpan ID, so it links NGOs to company CSR spend.
- **Darpan is self-declared.** A listing is not proof of good work. We show it as "listed on Darpan", never as "approved".
- **No clean bulk feed found yet** for CSR project data or FCRA returns. Expect browser-assisted collection, PDF extraction, and manual work at first. We never bypass a captcha. That is already our rule.
- **Check licence and terms** for each source before any copy. Only data.gov.in is expected to carry an open licence, per dataset.

Next research step (small, to do with Raji): open each "not checked" cell by hand in a browser, save an example record for each, and note format, captcha and terms. Then pick the first two or three feeds to build.

Registration numbers an NGO may hold, and how we verify each (from Gemini, to be confirmed with Hima):
- Society number (state registrar), trust number (state registrar or charity commissioner): hard to check online, state by state.
- Section 8 company number (CIN): checkable in MCA company master data.
- Darpan ID: searchable on Darpan.
- FCRA number: checkable on the FCRA site.
- 12A and 80G: ask the NGO for the certificate; no public list.

### 2.2 NGOs claim and manage their record

The base list is public data. An NGO then takes control of its own page:
1. The NGO registers on RSWF and chooses "manage my NGO".
2. It enters its registration number (Darpan ID first, plus its society, trust or company number) and uploads the proof document.
3. We check the number exists in the public source and that the stated purpose matches the source record and its papers. A reviewer approves it (issue #7, pending feature 11).
4. Once approved, the NGO can edit its page: purpose, projects, areas, contacts, and updates with sources.
5. The NGO may also share internal data (for example accounts and project reports) with consent. Each item has a visibility setting: public, reviewers only, or private. Consent is recorded and can be withdrawn.
6. Data from the public source and data from the NGO are labelled differently on the page. We never mix them.

### 2.3 NGOs that are not listed

1. A person or NGO submits a new NGO: name, type, registration number, purpose, area, proof.
2. The admin team verifies it using the method agreed with Hima (to be written down; see decision D5). Until then it shows as "unverified" or not at all.
3. On approval it is published and its manager may claim it as in 2.2.
4. Duplicates are merged by registration number and PAN, not by name.

### 2.4 Promotion: how users come

Start only when 2.1 to 2.3 work, so visitors find real content.
- **Message for individuals:** "See a problem near you this weekend? Find the NGO that works on it nearby, see what funds it has, contact it, and check later whether it responded." The site shows which NGO can take care of which problem, so the visitor reaches the right NGO at the right time.
- **Value and message bank:** what RSWF offers each audience, feature status, ready lines, post ideas and words to avoid are in [value-and-messaging.md](value-and-messaging.md).
- **What we ask of them:** spot and post a problem with evidence; contact the nearby NGO; come back and rate whether the response met the promise.
- **Channels:** Instagram and other social accounts. Short posts that explain what the site does and what we need from people. Content ideas: one real local problem and the NGOs near it; "how to check an NGO in 2 minutes"; a weekly "problem of the week".
- **Partners:** institutes such as Hima's, RSWF projects, volunteers' networks, local leaders.
- **Honest limits:** promotion starts only after the reviewer team and right-of-reply flow exist, so a flood of posts has somewhere to go.
- **Measure:** NGOs claimed, problems posted, contacts made, NGO responses recorded, repeat visitors.

## 3. Where we are today

| Area | State |
|---|---|
| Product | Clickable prototype at rswf.vercel.app. All data is in-memory sample data and resets on refresh. No backend. |
| Built (pending-features rows 1 to 5) | Evidence tab, People tab, registration and login, volunteer form, Solution tab with tasks. Reviewer, moderator and admin screens exist as prototype. |
| Deferred | Roles and admin panel in full, admin-managed forum, scheduled data pull, royalty-free images (rows 6 to 9). |
| Proposed, open | Institution registration form with document check (issue #7). Issue submission form with mandatory evidence (issue #6). |
| Data quality | Forest figures are partly unverified (ADR-002). Hasdeo and Dibang legal text is placeholder. Some Overview text is Saidongar data shown for every case. |
| Team | Ganesh: product. Raji: technical and PR review. Hima: user and institute view. Open: writers, image makers, researchers. |
| Process | Feature branch, PR into `dev`, then `dev` into `main` (ADR-005). |

Gap between PRD and the 2026-11-05 direction: the PRD describes a database of issues. The newer direction adds public data pulled in automatically and people posting issues. This plan merges both. The PRD is not yet updated for the NGO pillar.

## 4. How the vision works: three streams

All three meet on issue, NGO and place pages.

1. **Public data stream.** Scheduled jobs and imports bring in public data (weather, water, alerts, forest cover, news, NGO lists, CSR spend). Each dataset shows its source and its age. When a source is down, the page shows an empty state, never an invented number.
2. **People stream.** Individuals post issues, evidence, volunteer offers, task updates and field reports. A reviewer publishes, rejects, or asks for more information. Evidence is mandatory for an issue.
3. **NGO stream.** Verified NGOs manage their own page and share internal data by consent. It is labelled as NGO-supplied.

The reviewer queue is the trust gate for streams 2 and 3.

## 5. Principles

1. No source, no claim.
2. Never show an invented number. Show an empty state.
3. Every dataset shows its source and "as of" date.
4. People and NGO content is reviewed before it is public.
5. Open to contribute, open source, public repo.
6. Prototype and user flow come before roles and admin panels (decision of 2026-10-31).
7. Show facts and gaps, never accusations. Every NGO has a right of reply before a gap is public. Beneficiary testimony is consent-based and protects identity where needed.
8. A listing is not an endorsement. "Listed on Darpan" is not "approved".
9. One thing at a time. New ideas go to [pending features](pending-features.md) so they do not compete with the current phase.

## 6. Delivery phases

Each phase has an exit check that anyone can run or see. Section 2 says what we build for the NGO side; this section says when.

### Phase 0: Prototype (done)
Clickable flows for visitor, user, institute, reviewer, moderator and admin on sample data.
Exit check: met. rswf.vercel.app works end to end on sample data.

### Phase 1: Trust kit and the two forms (front end only)
Goal: the prototype behaves like the final site, with honest states and the core forms. No backend decision needed.
- Freshness and source kit: `asOf`, `checkedAt`, freshness pill, sources footer, empty, loading and error states on Home, Tracker and every issue tab.
- Data access layer: pages read through functions that return `{ data, updatedAt, source }`, so arrays can later become API calls.
- Missing design tokens, then ported components (see analysis section 7).
- Issue submission form with mandatory evidence (issue #6).
- Institution registration form with proof document (issue #7); it also serves step 2.2.
- NGO and company sample pages in the prototype (design only), reviewed by Hima.
- Map upgrade: no overlapping pins, state drill-down, issue card on tap.
- Fix known data problems: replace placeholder legal text, verify FSI and NTCA figures, check layouts at 360 px.
- Hand-check the data channels in 2.1 (the research step).
- Add `THIRD_PARTY_NOTICES.md` before the first file copied from the reference.

Exit check: Ganesh and Hima click through both forms, an NGO page and the reviewer queue; no page shows a number without source and date; build and lint pass in CI.

### Phase 2: Backend and real accounts
Goal: data survives a refresh and real people can sign up.
- Pick Postgres host and file storage (D3).
- Tables for places, issues, evidence, submissions, sources, readings, alerts and job runs (analysis section 8), plus NGO, company, CSR spend record and NGO claim.
- Import the NGO base list and first CSR data from the checked channels (step 2.1).
- Real authentication; server-side permission checks from the `roles.js` table.
- Claim flow for NGOs (2.2) and listing of unlisted NGOs (2.3) with the reviewer and admin queues.
- Evidence upload: private storage, type and size limits, malware scan, retention rule.
- Submission rules on the server: validation order, rate limits, salted IP hash, mandatory evidence check, public status page per submission.
- Migrations in the deploy, one tested backup restore, error tracking.

Exit check: a submission made on the live site is reviewed, published and still there after redeploy; a user without the reviewer role cannot publish by calling the API directly; one real NGO is claimed and verified end to end.

### Phase 3: Real data and public launch
Goal: the site is trustworthy enough to share widely.
- Scheduled pulls with a run log and a daily freshness check; a health endpoint that reports freshness, not only liveness.
- Environmental data sources (D4), each with licence and terms checked. Candidates from the reference: NDMA alerts, Open-Meteo. Unverified for us: IMD, CPCB, CWC, PARIVESH, NGT, FSI.
- Replace sample content with sourced real cases, starting with the current RSWF projects (conscious living, urban forest, jantaa).
- Royalty-free images and content writers.
- Per-issue search and share previews (needs server rendering or prerendering).
- Privacy notice, "sourced from" wording rule, and legal review of company-level and NGO-level wording before any claim goes public.
- Start promotion (step 2.4).

Exit check: at least three live data sources updating on schedule; at least five real issues, each with sourced claims; NGO base list live; legal wording reviewed; privacy notice live.

### Phase 4: Grow
Only when a real user or a law asks for it.
- Roles and permissions in full, admin-managed forum.
- Year-on-year tracker and Unified Ecological Progress Index.
- Hindi and other languages.
- Share on social channels, funding for issues.

### Track B: promise vs spend vs reality (proposed, after the NGO base list works)
Not started. Builds on step 2.1 to 2.3 and the Phase 1 and 2 kit.
1. Prototype first: an NGO page with money in, stated spend, promised work and a "reality" panel, on sample data. Hima reviews the institute view.
2. Beneficiary and field verification form: structured questions, evidence, consent, identity protection.
3. Comparison view: promised vs spent vs verified result.
4. Right-of-reply flow and legal review before any real NGO is named.

Exit check: one pilot NGO, with its consent, shows all three columns from sourced data and verified field input.

## 7. Decisions the team must make

| # | Decision | Who | Needed by |
|---|---|---|---|
| D1 | Stay on Vite until the backend starts, or move to Next.js now (record an ADR). Default: stay | Ganesh, Raji | Start of Phase 2 |
| D2 | TypeScript or JavaScript | Raji | Before porting components |
| D3 | Postgres host, cache and file storage | Raji | Start of Phase 2 |
| D4 | First three environmental data sources, after research and licence check | Ganesh, Raji | Middle of Phase 2 |
| D5 | How NGOs are verified: which numbers and documents, who reviews, Hima's method | Ganesh, Hima | Before Phase 2 |
| D6 | First CSR and NGO feeds to import (from the 2.1 table), and how to collect them without bypassing captchas | Ganesh, Raji | End of Phase 1 |
| D7 | Who reviews submissions and moderates | Ganesh | Before Phase 2 ends |
| D8 | Legal review of company and NGO wording | Ganesh | Before Phase 3 launch |
| D9 | Brand palette and category colours | Ganesh, Hima | Phase 1 |
| D10 | When to start languages | Ganesh | Phase 4 |
| D11 | NGO scope: environmental only, or all NGOs | Ganesh | End of Phase 1 |
| D12 | Right-of-reply rules and beneficiary protection | Ganesh, lawyer | Before Track B goes public |
| D13 | Which social channels, who writes posts, when promotion starts | Ganesh, Hima | Phase 3 |

## 8. Risks

| Risk | Effect | Response |
|---|---|---|
| Company-level claims are adversarial | Defamation exposure | Every claim sourced; legal review before launch (D8). Note: the Gemini report cited IPC sections 499 and 500; India's criminal code changed in 2024 to the Bharatiya Nyaya Sanhita, so the lawyer must confirm current sections |
| NGO claims read as accusations of laundering or fraud | Defamation suits, harm to honest NGOs | Show documented gaps only; right of reply; legal review; never use "laundering" or "corrupt" in our own voice |
| Public NGO and CSR data has no clean bulk feed | Slow, manual data collection | Start with Darpan and data.gov.in; hand-collect first CSR records; PDF extraction later |
| Public sources block scripts, use captchas, or move (FCRA already moved) | Collection breaks | Never bypass a captcha; ask for permission where unclear; keep a source registry with last check date |
| Darpan data is self-declared | Wrong or stale NGO records | Label "self-declared"; show "as of"; NGO claim flow corrects it |
| Source terms forbid reuse | Legal issue | Check terms per source; link out instead of copying when unclear |
| Beneficiary testimony exposes vulnerable people | Real-world harm | Consent, identity protection, no precise personal data public; follow the data protection law (DPDP Act 2023; a lawyer confirms the rules in force) |
| NGOs refuse to claim or share data | Thin NGO pages | Public data still shows; explain the benefit (trust, donors); start with friendly NGOs from Hima's network |
| No reviewers named | Queue stalls, nothing publishes | Name reviewers before Phase 2 ends (D7) |
| Sample data mistaken for fact | Loss of trust | Keep "(sample)" labels until real data replaces them |
| Evidence upload abuse (malware, illegal content) | Security and legal harm | Private storage, scan, limits, reviewer gate |
| Small team, one build at a time | Slow progress | Keep phases small; park new ideas |
| Copied code breaks the licence | Legal issue | Keep MIT headers; add `THIRD_PARTY_NOTICES.md` first |

## 9. Change log

Append a row when the plan changes. State the reason.

| Date | Change | Reason |
|---|---|---|
| 2026-11-10 | Added the landscape check ([reference/landscape.md](reference/landscape.md)) and a pointer in section 2. Rule: link to existing sites instead of rebuilding NGO financial profiles, conflict research, grievance filing and CSR compliance software. | Ganesh: avoid adding features that already exist. Research found no site that checks NGO promise vs spend vs ground reality, so that stays ours. |
| 2026-11-10 | Added section 2 "Plan to achieve the vision" (base list, NGO claim, unlisted NGOs, promotion) with a checked data-channel table. Moved "Where we are" to section 3 and renumbered. Added a third stream, principle 8, decisions D5, D6, D13. Decisions renamed D1 to D13 so section moves do not break references. | Ganesh asked for a plan to reach the vision: collect company CSR and NGO data from public channels, let NGOs claim and manage records, list missing NGOs, then promote. |
| 2026-11-10 | Added NGO transparency pillar (vision, principle 7, Track B, decisions and risks). | Ganesh: donors cannot tell if NGO money reaches its purpose; compare spend, promise and reality, verifiable by individuals. |
| 2026-11-10 | First version. Merged the PRD vision with the 2026-11-05 ForThePeople direction into four phases. | Team needed one place that says where RSWF goes and how it gets there. |
