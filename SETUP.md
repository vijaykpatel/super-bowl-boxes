# Setup Guide — MH Super Bowl Boxes

This app is a single, fixed Super Bowl Squares game backed by Vercel KV.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `KV_REST_API_URL` | Yes | Upstash Redis REST URL (from Vercel KV). |
| `KV_REST_API_TOKEN` | Yes | Upstash Redis REST token (from Vercel KV). |
| `ADMIN_SECRET` | Recommended | Secret query string to access `/admin` (default: `secret`). |
| `ADMIN_PASSWORD` | Recommended | Password required to perform admin actions (default: `admin`). |

Example `.env.local`:
```
KV_REST_API_URL=https://your-redis-url.upstash.io
KV_REST_API_TOKEN=your-token-here
ADMIN_SECRET=your-secret-link-token
ADMIN_PASSWORD=your-admin-password
```

## Admin Access

- Admin page is at `/admin?secret=YOUR_SECRET`.
- You’ll be prompted for the admin password before confirming or rejecting squares.

## Data Storage

- Game state is stored in **Vercel KV** under a single key (`game:state`).
- The public and admin pages read from the same snapshot.

## Quick Start (Local Dev)

```bash
npm install
npm run dev
```

Open http://localhost:3000
