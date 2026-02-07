# MH Super Bowl Boxes — Design Notes

## Overview
Single, fixed Super Bowl Squares game with $1 boxes and standard payouts.

## Key Behaviors
- Public table opens at `/` with no access code.
- Auto-lock 15 minutes before kickoff.
- Numbers reveal 5 minutes before kickoff (auto or admin-triggered).
- Admin access via secret link + password at `/admin?secret=...`.

## Data Storage
- No database or KV.
- Game state is held in server memory.

## Admin
- Admin can confirm/reject pending squares.
- Admin is the only approver; no user accounts.
