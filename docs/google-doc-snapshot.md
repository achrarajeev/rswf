<!-- Snapshot of the Google Doc "RSWF Website: Vision, Roles and Pending Features".
     Source: https://docs.google.com/document/d/1zb04DycLqouHbZ-VZLC4XY4w9eWEjZ-78uCwOEQv_80/edit
     Imported 2026-10-31. The Google Doc is the living copy; re-import when it changes. -->

# **RSWF Website: Vision, Roles and Pending Features**

Living document for the RSWF environmental accountability website. Anyone on the team can edit it. Last updated 31 Oct 2026\.

## **Index**

> 1. [Vision](#)  
> 2. [Roles and who takes care of them](#)  
> 3. [Pending features (next to build)](#)  
> 4. [Links and where the full PRD lives](#)

## **1\. Vision**

A national open-source database that connects every active environmental issue in India: which projects are clearing forest, which companies are behind them, the legal position (and what is missing), greenhouse-gas emissions and biodiversity-loss data, the people, organisations and lawyers working on each case, the status of progress, and the help needed (money and people). Anyone can see who to support.  
The focus is data that shows the reputational cost to companies and authorities: carbon and other GHG emissions, biodiversity loss, human-rights violations. Every claim must trace back to its original source.

## **2\. Roles and who takes care of them**

| Role | What this role does | Person | Since |
| :---- | :---- | :---- | :---- |
| Product and PRD | Writes the product requirements and user flow, decides what gets built and in what order, reviews the result | Ganesh Reddy | 27 Oct 2026 |
| Technical / software | Builds the website: code, database schema, repository, data pulls, hosting | Rajeev Kumar Achra | 28 Oct 2026 |
| Users, feedback and institute view | Speaks for users and institutes, gives feedback on every screen, knows the issues on the ground | Hima Mishra | 27 Oct 2026 |
| (open) | Content writers, royalty-free image creators, researchers, GitHub contributors | Needed |  |

**Note:** anyone reading this document can add a role and become part of the project. Add a row to the table with the role, what it does and your name. As features grow, this table is updated.

## **3\. Pending features (next to build)**

Anyone can add a proposed feature or next step (review, meeting, input) as a new row. Status: \[proposed\] \= an idea, \[agreed\] \= the team backed it, \[deferred\] \= parked. Only Ganesh's decision or clear group agreement makes a row \[agreed\].

| \# | Feature | What and why | Raised by | Status |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Separate Evidence tab | On an issue page, remove the "add evidence" button from the people section. Evidence gets its own tab (video, legal documents, live recordings). Sources stay separate from evidence. | Ganesh, 31 Oct | \[proposed\] |
| 2 | People tab shows only people working on the issue | Two kinds of people for now: volunteers/users, and institutes already working on the issue. One person can be tagged to many issues. Separate database tables for people and institutions. | Ganesh, Rajeev, 31 Oct | \[proposed\] |
| 3 | Registration and login | Register as a user or as an institute. Hima will register her institute and share the institute view. Ganesh will register as a user. Today only a per-issue join form exists, with no real accounts. | Ganesh, 31 Oct | \[proposed\] |
| 4 | Volunteer contribution form | After registering, clicking Volunteer on an issue opens a form: what can you contribute? After submitting, the person's name appears under People on that issue. | Ganesh, 31 Oct | \[proposed\] |
| 5 | How the issue can be solved: tasks | Each issue shows the problem, how it can be solved step by step, open tasks, and tasks taken up (assigned or volunteered). Mostly institutes already working on the issue maintain the task list. Volunteers add their input through the form in \#4 and pick up open tasks. | Ganesh, 31 Oct | \[proposed\] |
| 6 | Roles and permissions (admin, moderator, lawyer, local researcher) | Role-based access, admin panel, user verification. Later: after design prototypes and user flows are final. | Rajeev, 31 Oct | \[deferred\] |
| 7 | Discussion forum managed by admins | Public topic forum; admins create topics and tag users with roles. | Hima 27 Oct, Rajeev 31 Oct | \[proposed\] |
| 8 | Live data from sources | Scheduled job pulls data into backend tables with a last-pulled time. Start with the current RSWF projects: conscious living, urban forest, jantaa. | Rajeev, 31 Oct | \[proposed\] |
| 9 | Royalty-free images and content | Replace copied images with royalty-free or placeholder ones to avoid legal risk. Needs content writers and image creators. | Rajeev, 31 Oct | \[proposed\] |
| 10 | User flow document | Written user flow for each kind of user, stored in the repository docs folder next to the PRD. | Ganesh, Rajeev, 31 Oct | \[agreed\] |

## **4\. Links and where the full PRD lives**

> * Code repository (public): [github.com/achrarajeev/rswf](https://github.com/achrarajeev/rswf)  
> * Prototype (design only): [rswf.vercel.app](https://rswf.vercel.app)  
> * Full PRD and user flow: to b  
> * e kept in the repository, in a docs folder on a separate branch. Read it there, not here.