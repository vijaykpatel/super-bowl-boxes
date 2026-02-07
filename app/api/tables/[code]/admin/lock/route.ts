import { NextResponse } from "next/server"
import { z } from "zod"
import { addAuditEvent, getTableByCode, updateTable } from "@/lib/tables"
import { nanoid } from "nanoid"

const schema = z.object({
  status: z.enum(["open", "locked"]),
  adminKey: z.string().min(1),
})

export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const table = await getTableByCode(code)
  if (!table) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
  if (parsed.data.adminKey !== table.adminKey) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const now = Date.now()
  if (parsed.data.status === "locked") {
    table.lock = { status: "locked", reason: "manual", lockedAt: now }
  } else {
    table.lock = {
      status: "open",
      reason: table.lock.reason,
      unlockedAt: now,
      unlockedBy: "admin",
    }
    await addAuditEvent(table.id, {
      id: nanoid(),
      type: "unlock",
      userId: "admin",
      createdAt: now,
      meta: {
        previousReason: table.lock.reason ?? "unknown",
      },
    })
  }

  await updateTable(table)
  return NextResponse.json({ ok: true })
}
