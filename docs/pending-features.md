# Pending features

Anyone can add a row. Live copy with roles: [Google Doc](https://docs.google.com/document/d/1zb04DycLqouHbZ-VZLC4XY4w9eWEjZ-78uCwOEQv_80/edit).

Row numbers stay fixed so issues and chats can refer to them.

| # | Feature | Detail | Status |
|---|---|---|---|
| 6 | Roles and permissions | Admin, moderator, lawyer, local researcher; after prototypes | [deferred] |
| 7 | Admin-managed forum | Admins create topics and tag users. Moderation by staff exists; admin-created topics and tagging do not | [deferred] |
| 8 | Scheduled data pull | Cron into backend tables with last-pulled time; start with current projects | [deferred] |
| 9 | Royalty-free images | Replace copied images; needs writers and image creators | [deferred] |
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
