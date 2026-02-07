import { NextResponse } from "next/server"
import { z } from "zod"
import { addClaim, getTableByCode, getTableState, setTableState, shouldAutoLock, updateTable } from "@/lib/tables"
import { nanoid } from "nanoid"

const schema = z.object({
  playerName: z.string().min(1),
  boxIds: z.array(z.number().int().min(0).max(99)).min(1),
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
  const now = Date.now()
  if (shouldAutoLock(table, now)) {
    table.lock = { status: "locked", reason: "auto", lockedAt: now }
    await updateTable(table)
  }

  if (table.lock.status === "locked") {
    return NextResponse.json({ error: "Table locked" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const state = await getTableState(table.id)
  const ids = new Set(parsed.data.boxIds)
  const unavailable = state.boxes.filter((box) => ids.has(box.id) && box.status !== "available")
  if (unavailable.length > 0) {
    return NextResponse.json({ error: "Some boxes are no longer available" }, { status: 409 })
  }

  const nextBoxes = state.boxes.map((box) =>
    ids.has(box.id)
      ? { ...box, owner: parsed.data.playerName, status: "pending" }
      : box
  )

  await setTableState(table.id, { ...state, boxes: nextBoxes, updatedAt: Date.now() })

  await addClaim(table.id, {
    id: nanoid(),
    playerName: parsed.data.playerName,
    boxIds: parsed.data.boxIds,
    status: "pending",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })

  return NextResponse.json({ ok: true })
}
