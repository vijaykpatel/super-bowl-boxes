import { NextResponse } from "next/server"
import { z } from "zod"
import { claimBoxes } from "@/lib/game-store"

const schema = z.object({
  playerName: z.string().min(1),
  boxIds: z.array(z.number().int().min(0).max(99)).min(1),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const result = await claimBoxes(parsed.data.playerName.trim(), parsed.data.boxIds)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 403 })
  }

  return NextResponse.json({ ok: true })
}
