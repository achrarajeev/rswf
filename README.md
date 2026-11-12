# RSWF · Earth Ledger

A national open-source database connecting every active environmental issue in India: the projects, the companies behind them, the legal position, emissions and biodiversity data, the people and institutes working on each case, progress, and the help needed. Every claim should trace back to its source.

**Status:** clickable prototype. All data is in-memory sample data (labelled "(sample)") and resets on refresh. There is no backend yet.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the build
```

Stack: React 19, Vite, react-router (HashRouter), framer-motion, lucide-react, d3-geo.

## Demo accounts

Prototype only. Passwords are plain text and nothing leaves the browser. Password for all: `demo1234`.

| Email | Role |
|---|---|
| ganesh@example.org | User |
| hima@example.org | Institute (pending approval) |
| asha@example.org | Reviewer |
| ravi@example.org | Moderator |
| meena@example.org | Admin |

## Project layout

```
src/
  main.jsx        entry point and routes
  data.js         seed data shaped like future database tables
  *Store.js       in-memory stores (auth, tasks, evidence, forum, audit); TODOs name future API endpoints
  roles.js        single permission table (UI only hides buttons; a backend must enforce it)
  pages/          one file per screen
docs/             PRD, user flow, pending features (start at docs/README.md)
.context/         project knowledge for AI-assisted work: state, decisions, lessons
```

## Branching

1. Branch from `dev` (`feature/...`, `docs/...`, `fix/...`).
2. Open a PR into `dev`. Everyone merges here first.
3. When `dev` is ready, open a PR from `dev` into `main`.
4. Never push or merge feature branches straight into `main`.

## Documentation

See [docs/README.md](docs/README.md). The PRD is [docs/PRD.md](docs/PRD.md).

## Known limits

- State resets on refresh; only the login survives (sessionStorage).
- Uploaded files are not stored, only the file name.
- Some Overview/Sources content is Saidongar data shown for every case; Hasdeo and Dibang legal text is placeholder.

## Links

- Repository: https://github.com/achrarajeev/rswf
- Design prototype: https://rswf.vercel.app
