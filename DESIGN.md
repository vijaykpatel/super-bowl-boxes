# MH Super Bowl Boxes — Design Notes

## Overview
Single, fixed Super Bowl Squares game with $5 boxes, cinematic broadcast styling, and a streamlined admin approval flow.

## Visual Direction
- Broadcast-inspired hero with full-bleed stadium imagery, animated light leaks, and floating orbs.
- Team-color gradients (Seahawks green, Patriots red) layered over a deep, cinematic background.
- Large typography and uppercase display headings for an arena scoreboard feel.
- Glass panels and subtle grain overlays to add depth without losing clarity.

## Page Structure
- **Status Bar**: live/locked indicator, price-per-box, and NFL badge.
- **Hero**: team logos, Super Bowl mark, matchup callout, date/time/location.
- **Grid Section**: 10x10 squares with row/column headers, visual legend, and real-time availability states.
- **Checkout Panel**: step-driven flow (select → checkout → submitted), with payment instructions.
- **Rules Section**: collapsible “How It Works” list plus custom rules from config.

## Core Behaviors
- Public table opens at `/` with no access code.
- Claims are submitted as **pending** and require admin confirmation.
- Auto-locks **15 minutes before kickoff**.
- Numbers reveal **5 minutes before kickoff**.
- Admin access via secret link + password at `/admin?secret=...`.

## Admin Experience
- Password gate before actions (confirm/reject/reveal).
- Dashboard aggregates pending/confirmed counts and groups claims by owner.
- Quick approve/reject actions with adjustable counts.

## Data & State
- Game state is persisted in **Vercel KV** (`game:state`).
- Public/admin views consume the same server snapshot.
- Game rules and kickoff timing are centralized in `lib/game-config.ts`.

## Performance & Reliability Improvements
- KV writes are minimized by diffing snapshots before persisting changes.
- Auto-lock and number reveal are enforced server-side to keep state consistent.
- Client polling refreshes state on a 5s interval to avoid over-fetching.
- Derived admin lists use memoization to keep re-renders cheap.
- Images are served through `next/image` for optimized delivery.
