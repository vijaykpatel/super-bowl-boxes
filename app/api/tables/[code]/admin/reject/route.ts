import { NextResponse } from "next/server"
import { z } from "zod"
import { getTableByCode, getTableState, setTableState } from "@/lib/tables"

const schema = z.object({
  boxIds: z.array(z.number().int().min(0).max(99)).min(1),
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

  const state = await getTableState(table.id)
  const ids = new Set(parsed.data.boxIds)
  const nextBoxes = state.boxes.map((box) =>
    ids.has(box.id) && (box.status === "pending" || box.status === "confirmed")
      ? { ...box, status: "available", owner: null }
      : box
  )

  await setTableState(table.id, { ...state, boxes: nextBoxes, updatedAt: Date.now() })
  return NextResponse.json({ ok: true })
}
