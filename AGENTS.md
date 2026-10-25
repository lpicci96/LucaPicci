# AGENTS.md

## Current focus (temporary: remove once the revamp ships)

We are revamping this site and using the work to build Luca's agentic workflow: thinking partner, requirements and specs, delegated builds, reviews, and design collaboration.

The setup is deliberately minimal. Instructions get added only where Claude has been seen to fall short, not in anticipation.

- When Luca corrects *how* you work (not just what you built), append a dated entry to `.claude/friction-log.md`. Don't turn entries into instructions without agreeing it with Luca.
- When deciding how to configure Claude Code (skills, hooks, agents, settings), check the current docs at code.claude.com/docs rather than relying on memory.

## Project

Personal site: Vite with vanilla JS and CSS, no framework. `npm run dev` / `npm run build` / `npm run preview`.

- Every push to `main` deploys to GitHub Pages via `.github/workflows/static.yml`. Work happens on `dev`; merging to `main` means going live.
- `dist/` is still tracked from old manual builds even though it's gitignored. CI builds its own, so the committed copy is stale and unused.
