# Setup Guide — Super Bowl Squares

This guide covers everything needed to make the site fully operational.

---

## Outstanding Setup Tasks

### 1. Vercel KV (Redis) — REQUIRED
The app uses Vercel KV (Upstash Redis) for all persistent data (tables, game state, claims).

**On Vercel (Production):**
1. Go to your Vercel project dashboard.
2. Navigate to **Storage** tab → **Create Database** → select **Redis (Upstash KV)**.
3. Vercel will automatically inject these env vars into your project:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
4. Redeploy after the database is linked.

**For Local Development:**
1. Create a Redis database on [Upstash](https://upstash.com) (free tier works).
2. Copy the **REST URL** and **REST Token** from the Upstash dashboard.
3. Create a `.env.local` file in the project root:
   ```
   KV_REST_API_URL=https://your-redis-url.upstash.io
   KV_REST_API_TOKEN=your-token-here
   ```

### 2. Superadmin Password — REQUIRED for Production
Set a strong password to protect the `/superadmin` dashboard.

```
SUPERADMIN_PASSWORD=your-strong-password-here
```

The default is `abcd1234` — **change this before going live**.

### 3. Superadmin Session Secret — REQUIRED for Production
Used to sign the superadmin session cookie (HMAC-SHA256).

Generate one:
```bash
openssl rand -base64 32
```

Set it:
```
SUPERADMIN_SESSION_SECRET=your-generated-secret
```

The default is a hardcoded dev secret — **change this before going live**.

### 4. Cron Auto-Lock — OPTIONAL
Auto-locking is handled **on-demand** when someone opens a table or submits a claim (the `/api/tables/[code]/state` endpoint checks the clock). A cron job is optional but can ensure tables lock even if nobody visits.

**If you want scheduled locking:**
1. Use an external scheduler (e.g., cron-job.org) to hit:
   ```
   GET https://your-domain.com/api/cron/auto-lock
   ```
2. Optionally protect it with a bearer token:
   ```bash
   openssl rand -base64 32
   ```
   Set `CRON_SECRET` in your env vars. Call the route with:
   ```
   Authorization: Bearer <CRON_SECRET>
   ```

> Note: Vercel Hobby plan only supports daily cron schedules, which is too infrequent for pre-kickoff locking. Use an external scheduler for more precision.

---

## Environment Variables Summary

| Variable | Required | Description |
|---|---|---|
| `KV_REST_API_URL` | Yes | Upstash Redis REST URL |
| `KV_REST_API_TOKEN` | Yes | Upstash Redis REST token |
| `SUPERADMIN_PASSWORD` | Yes (prod) | Password for `/superadmin` access |
| `SUPERADMIN_SESSION_SECRET` | Yes (prod) | HMAC secret for session cookie signing |
| `CRON_SECRET` | No | Bearer token to protect the cron endpoint |

---

## Architecture Notes

- **No user authentication**: Anyone can create a table by providing a name and email. Admin access is controlled by per-table **admin keys** (8-char codes generated at table creation).
- **Admin keys are visible** on the My Tables page to the person who created the table. Since there's no auth, anyone who knows the email can query tables — this is an accepted tradeoff of the no-auth design.
- **Data storage**: All data lives in Vercel KV (Upstash Redis). No SQL database needed.
- **Auto-lock**: Tables lock automatically 15 minutes before kickoff.
- **Auto-reveal**: Numbers are randomly assigned 5 minutes before kickoff.
- **Kickoff time**: Hardcoded to February 8, 2026 at 6:30 PM ET (23:30 UTC).

---

## Quick Start (Local Dev)

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with KV credentials (see above)

# 3. Start dev server
npm run dev

# 4. Open http://localhost:3000
```

---

## Deployment Checklist

- [ ] Link Vercel KV (Redis) database to your Vercel project
- [ ] Set `SUPERADMIN_PASSWORD` to a strong password in Vercel env vars
- [ ] Set `SUPERADMIN_SESSION_SECRET` to a random secret in Vercel env vars
- [ ] (Optional) Set `CRON_SECRET` and configure external cron scheduler
- [ ] Verify the site loads and you can create a table
- [ ] Test the full flow: create table → share link → claim squares → admin confirm
- [ ] Verify auto-lock and auto-reveal behavior near kickoff time
