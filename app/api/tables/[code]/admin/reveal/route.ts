import { NextResponse } from "next/server"
import { z } from "zod"
import { getTableByCode, getTableState, setTableState } from "@/lib/tables"
import { generateShuffledNumbers } from "@/lib/game-utils"

const schema = z.object({
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
  if (state.numbersRevealed && state.rowNumbers && state.colNumbers) {
    return NextResponse.json({ ok: true })
  }

  const nextState = {
    ...state,
    rowNumbers: generateShuffledNumbers(),
    colNumbers: generateShuffledNumbers(),
    numbersRevealed: true,
    updatedAt: Date.now(),
  }
  await setTableState(table.id, nextState)
  return NextResponse.json({ ok: true })
}
