import { NextResponse } from "next/server"
import { getGameSnapshot } from "@/lib/game-store"

export async function GET() {
  const snapshot = await getGameSnapshot()
  return NextResponse.json(snapshot)
}
