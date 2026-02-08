# MH Super Bowl Boxes

A single-table Super Bowl Squares experience with a cinematic broadcast look, live status updates, and a lightweight admin workflow for confirming paid squares.

Read more about the project here - https://www.vijaypatel.dev/projects/super-bowl-boxes.

## What It Does
- Public grid at `/` with a full-bleed hero, matchup visuals, and live status bar.
- Players pick squares, enter a name, and submit a claim (held as **pending**).
- Admin reviews and confirms or rejects claims at `/admin?secret=...`.
- Table auto-locks before kickoff and numbers reveal shortly before kickoff.

## Tech Stack
- Next.js App Router
- Tailwind CSS
- Vercel KV (Upstash) for game state
- Next/Image for optimized media

## Key Routes
- `/` — Public game view and checkout flow.
- `/admin?secret=YOUR_SECRET` — Admin dashboard (requires password).
- `/api/state` — Read current game snapshot.
- `/api/claim` — Submit a claim.
- `/api/admin/confirm`, `/api/admin/reject`, `/api/admin/reveal` — Admin actions.

## Config
Game timing, payouts, and custom rules live in `lib/game-config.ts`.

## Local Dev
```bash
npm install
npm run dev
```

## Setup
See `SETUP.md` for environment variables and admin access.
