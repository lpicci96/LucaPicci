# AGENTS.md

## Current focus (temporary: remove once the revamp is complete, including Canopy Charts and project pages)

We are revamping this site and using the work to build Luca's agentic workflow: thinking partner, requirements and specs, delegated builds, reviews, and design collaboration.

The setup is deliberately minimal. Instructions get added only where Claude has been seen to fall short, not in anticipation.

- When Luca corrects *how* you work (not just what you built), append a dated entry to `.claude/friction-log.md`. Don't turn entries into instructions without agreeing it with Luca.
- When deciding how to configure Claude Code (skills, hooks, agents, settings), check the current docs at code.claude.com/docs rather than relying on memory.

## Project

Personal site: Astro (static output) with TypeScript, no UI framework. Node 24, pinned in `.node-version`; on Luca's Mac it lives in `.node/` (ignored locally), so put `.node/bin` first on `PATH`.

- `npm run dev` / `npm run build` (type check, then build) / `npm run preview` / `npm run test` (Playwright, against the local preview, so build first). `BASE_URL=https://lucapicci.com npm run test` checks production; `EXTERNAL=1` also opens every card's link.
- Copy lives in `src/i18n/`, one file per language, typed against each other; projects are in `src/data/projects.ts`. No content change goes live in one language only.
- Hosting is Cloudflare Workers (static assets, `wrangler.jsonc`), built from this repo. `main` deploys to lucapicci.com; `dev` deploys to a preview at `dev-website.lpicci96.workers.dev`, behind Cloudflare Access.
- The old address, `lpicci96.github.io/LucaPicci`, redirects to lucapicci.com through `.github/workflows/redirect.yml`, which runs only by hand.
- `.claude/` (docs, specs, design samples, Claude Code setup) is local only and git-ignored.
- Branch flow: work happens on a local branch off `dev` that is never pushed. Luca spot-checks it locally, and it's merged into `dev` and pushed only with his go. Before every push, `.gitignore` still lists `.claude/`, and `git ls-files .claude` and `git log --all --oneline -- .claude` both print nothing. `dev` goes into `main` (live) only with Luca's go.
