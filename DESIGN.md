# Super Bowl Boxes Platform - Design Doc

**Status:** Draft  
**Owner:** Vijay Patel  
**Last updated:** 2026-02-07

## 1. Goals
1. Allow any user to create a Super Bowl Squares table with name + email.
2. Each table has its own rules, payouts, price per box, visibility, and admin.
3. Players join via share link and optionally a 6-digit code gate.
4. Admins can approve/deny pending claims and lock/unlock tables.
5. Table auto-locks 15 minutes before kickoff, with manual unlock audit trail.
6. Numbers auto-reveal 5 minutes before kickoff.

## 2. User Types
1. **Creator/Admin**
   - Creates tables with name + email.
   - Receives a per-table admin key.
   - Manages approvals, locking, and numbers reveal.
2. **Participant**
   - Joins a table by link or link + code.
   - Selects squares and submits name.
   - Sees pending or confirmed status.

## 3. Core Routes
1. `/`
   - Landing/overview.
2. `/tables`
   - Admin dashboard listing tables by email.
3. `/tables/new`
   - Create-table flow (name + email + payouts).
4. `/t/[code]`
   - Public table view (participants).
5. `/t/[code]/admin`
   - Admin view for that table (owner only).

## 4. Table Creation Flow
**Purpose:** Collect table metadata and configure how the table is presented and used.

**Fields**
1. Table name / group name (required).
2. Admin email (required).
3. Price per box (required).
   - Provide defaults like `$5, $10, $25` plus custom.
4. Payouts (percent-based):
   - Q1, Q2, Q3, Final (must total 100%).
5. Visibility mode:
   - `Link only`
   - `Link + Code gate`
6. Optional rules text (optional, for display on table page).

**Result**
- System creates a unique `tableId` (6-character) and `6-character code`.
- Share link is generated.
- Admin key is generated for managing the table.
- Table is marked `open` and ready for participants.

## 5. Participant Flow
1. Open share link `/t/[code]`.
2. If visibility is `code`:
   - Prompt for 6-digit code.
   - Unlock table view on match.
3. Player selects available squares.
4. Player submits name.
5. Squares become `pending` until admin approval.

## 6. Admin Flow
**Admin controls on `/t/[code]/admin`**
1. Pending list grouped by player.
2. Confirm or reject each player's pending squares.
3. Confirm all pending.
4. Lock/unlock table.
5. Reveal numbers (admin action, auto-reveal occurs 5 minutes before kickoff).

**Admin access**
- Access requires the per-table admin key.

**Table locking**
- **Auto-lock** 15 minutes before kickoff.
- Admin can manually unlock.
- Every manual unlock is logged.

## 7. UI Elements
**Table page**
1. Prominent table name/group name.
2. Price per box and payout breakdown.
3. Countdown to numbers reveal.
4. Grid with state badges.
5. Rules section.
6. Checkout panel with name entry.

**Admin page**
1. Table name + code.
2. Current lock state with toggle.
3. Countdown with reveal button.
4. Pending/confirmed summaries.
5. Pending approval list.

## 8. Data Model (KV)
**Entities**
1. **User**
   - `email`
2. **Table**
   - `id`, `code`, `name`, `ownerEmail`, `adminKey`
   - `pricePerBox`, `currency`
   - `payouts`, `rules`
   - `visibility`
   - `kickoffAt`
   - `lock` object
3. **GameState**
   - `boxes[100]`, `rowNumbers`, `colNumbers`, `numbersRevealed`, `updatedAt`
4. **Claim**
   - `playerName`, `boxIds`, `status`, `timestamps`
5. **AuditEvent**
   - Records manual unlocks.

**Key Layout (KV)**
1. `table:{tableId}`
2. `table:{tableId}:state`
3. `table:{tableId}:claims`
4. `table:{tableId}:audit`
5. `code:{code}` -> `tableId`
6. `owner:{email}:tables` -> array of table IDs

## 9. Auth & Access
1. No third-party auth. Admin access is protected by a per-table admin key.
2. Superadmin route is protected by a password.
3. Participants do not need auth.

## 10. Locking & Audit
1. Auto-lock occurs on-demand when time >= kickoff - 15m.
2. Auto-reveal occurs on-demand when time >= kickoff - 5m.
3. Manual unlocks are logged with:
   - userId
   - timestamp
   - previous lock reason

## 11. Infrastructure
1. Next.js app router
2. NextAuth for Google
3. Vercel KV (Upstash Redis) for persistent state
4. Vercel Cron for auto-lock
5. No in-app payments for now
6. Standard REST APIs for state transitions

## 12. Current Implementation Status
1. Auth + KV scaffold added.
2. Table and game state APIs are created.
3. Table view at `/t/[code]`.
4. Admin view supports lock/unlock, confirm/reject, reveal numbers.
5. Auto-lock logic runs when table state is fetched.

## 13. Near-Term Next Steps
1. Build `/tables/new` create-table UI.
2. Build `/tables` owner dashboard.
3. Wire landing page to sign-in and table creation.
4. Ensure rules and payouts display on table page.
5. Add error states and empty states.
