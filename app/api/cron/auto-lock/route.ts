import { NextResponse } from "next/server"
import { listAllTables, updateTable, shouldAutoLock } from "@/lib/tables"

function isAuthorized(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    const vercelHeader = req.headers.get("x-vercel-cron")
    return vercelHeader === "1" || vercelHeader === "true"
  }
  const authHeader = req.headers.get("authorization")
  if (!authHeader) return false
  return authHeader === `Bearer ${secret}`
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = Date.now()
  const tables = await listAllTables()
  let locked = 0

  for (const table of tables) {
    if (shouldAutoLock(table, now)) {
      table.lock = {
        status: "locked",
        reason: "auto",
        lockedAt: now,
      }
      await updateTable(table)
      locked += 1
    }
  }

  return NextResponse.json({ ok: true, locked })
}
