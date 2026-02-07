import { NextResponse } from "next/server"
import { getTableByCode, getTableState, updateTable, shouldAutoLock, shouldAutoReveal, setTableState } from "@/lib/tables"
import { generateShuffledNumbers } from "@/lib/game-utils"

export async function GET(
  _req: Request,
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

  let state = await getTableState(table.id)
  if (shouldAutoReveal(table, now) && !state.numbersRevealed) {
    state = {
      ...state,
      rowNumbers: generateShuffledNumbers(),
      colNumbers: generateShuffledNumbers(),
      numbersRevealed: true,
      updatedAt: Date.now(),
    }
    await setTableState(table.id, state)
  }

  const { adminKey, ...publicTable } = table
  return NextResponse.json({ table: publicTable, state })
}
