import { NextResponse } from "next/server"
import { getTableByCode, getTableState, updateTable, shouldAutoLock, shouldAutoReveal, setTableState } from "@/lib/tables"
import { generateShuffledNumbers } from "@/lib/game-utils"

export async function GET(
  _req: Request,
  { params }: { params: { code: string } }
) {
  const table = await getTableByCode(params.code)
  if (!table) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const now = Date.now()
  if (shouldAutoLock(table, now)) {
    table.lock = { status: "locked", reason: "auto", lockedAt: now }
    await setTableState(table.id, state)
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
    await updateTable(table)
  }

  const { adminKey, ...publicTable } = table
  return NextResponse.json({ table: publicTable, state })
}
