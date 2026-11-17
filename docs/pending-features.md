# Pending features

Anyone can add a row. Live copy with roles: [Google Doc](https://docs.google.com/document/d/1zb04DycLqouHbZ-VZLC4XY4w9eWEjZ-78uCwOEQv_80/edit).

Row numbers stay fixed so issues and chats can refer to them.

| # | Feature | Detail | Status |
|---|---|---|---|
| 8 | Scheduled data pull | Cron into backend tables with last-pulled time; start with current projects | [deferred] |
| 6 | Roles and permissions | Staff roles (Reviewer, Moderator, Admin) and the verified Lawyer and Local researcher badges are in the prototype, with one permission table in `src/roles.js`. Still open: what extra powers a verified lawyer or local researcher should get (for example editing the Legal tab). Needs a team decision; UI checks only hide buttons until the backend enforces them | [partly done] |
| 9 | Royalty-free images | Audit on 17 Nov 2026: all 14 images in `public/images` come from Wikimedia Commons (CC0, CC BY, CC BY-SA) with artist, licence and page in `src/credits.json`, shown as a photo credit. Still open: original images from writers and image creators, and a licence recheck of each source page | [partly done] |
| 10 | User flow document | See [user-flow.md](user-flow.md) | [agreed] |

## Implemented

| # | Feature | Detail | Status |
|---|---|---|---|
| 1 | Separate Evidence tab | Evidence (video, legal documents, recordings) has its own tab on the issue page, apart from Sources | [done] |
| 2 | People tab | Lists volunteers and institutes working on the issue, filterable by kind | [done] |
| 3 | Registration and login | User and institute accounts, with register and login pages | [done] |
| 4 | Volunteer form | After logging in, a user or institute opens the Join form on an issue; they then appear under People | [done] |
| 5 | Issue tasks | The Solution tab shows the problem, steps and tasks (open, taken up, done); institutes on the issue maintain tasks, volunteers pick them up | [done] |
| 12 | Issue submission form | Logged-in users submit an issue at /issues/new with title, state, category, description and mandatory evidence; a reviewer decides whether it is listed, and the form fills the issue tabs. Files: src/pages/IssueNew.jsx, src/issueStore.js, src/pages/Reviewer.jsx. Decided in the meeting of 1 Nov 2026 | [done] |
| 11 | Institution registration form | Institute registers with a proof document (PDF, JPG or PNG, up to 5 MB; type chosen from a list). Page shows Pending review until a reviewer opens the document and verifies, asks for more information, or rejects; the institute can send a new document after either. Files: src/pages/Register.jsx, src/proofDoc.js, src/pages/Reviewer.jsx, src/pages/Institute.jsx. Prototype keeps the file in the browser tab only; real storage needs the backend. Decided in the meeting of 1 Nov 2026 | [done] |
| 7 | Admin-managed forum | Admins create official, pinned topics and tag users; tagged users see them on their Me page, and admins can tag more users from the thread. Permission `forum.official` in `src/roles.js`; files: src/forumStore.js, src/pages/ForumNew.jsx, src/pages/ForumThread.jsx, src/pages/Me.jsx, src/components/TagPicker.jsx. Prototype: no email or push notification | [done] |
