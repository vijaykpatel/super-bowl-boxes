# Setup Guide (Auth, KV, Cron)

This guide explains how to set up Google auth, NextAuth, KV, and the cron lock.

## 1. Admin Access (No Auth Flow)
This build does not use Google auth. Any user can create a table by providing
a name and email. Admin access is controlled by a per‑table **admin key** and
the **superadmin password**.

## 2. Vercel KV (Upstash)
### On Vercel
1. Go to Vercel -> your project.
2. Install **Redis** integration from the Vercel Marketplace.
3. Vercel will automatically add:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

### Local development
1. In Upstash, create a Redis database.
2. Copy the REST URL and REST token.
3. Set:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

## 3. Cron Lock (Optional)
Auto‑locking is handled on‑demand when someone opens a table or submits a claim,
so a cron is optional. If you want a scheduled lock, use the route below:
- `GET /api/cron/auto-lock`

### Vercel Cron (Optional)
Vercel Hobby only supports cron schedules that run at most once per day.
For precise per‑table locking, use an external scheduler instead.

### Optional: CRON_SECRET
If you want extra protection:
1. Generate a secret:
   - `openssl rand -base64 32`
2. Set `CRON_SECRET` in Vercel.
3. Call the cron route with:
   - `Authorization: Bearer <CRON_SECRET>`

If `CRON_SECRET` is not set, the route only accepts Vercel cron requests.

## 4. Superadmin Password
Set a password to access `/superadmin`:
- `SUPERADMIN_PASSWORD=abcd1234` (change this in production)

Also set a session secret used to sign the superadmin cookie:
- `SUPERADMIN_SESSION_SECRET=$(openssl rand -base64 32)`
