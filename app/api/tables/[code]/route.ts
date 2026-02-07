import { NextResponse } from "next/server"
import { getTableByCode } from "@/lib/tables"

export async function GET(
  _req: Request,
  { params }: { params: { code: string } }
) {
  const table = await getTableByCode(params.code)
  if (!table) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const { adminKey, ...publicTable } = table
  return NextResponse.json({ table: publicTable })
}
