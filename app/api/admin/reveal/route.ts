import { NextResponse } from "next/server"
import { z } from "zod"
import { revealNumbers } from "@/lib/game-store"
import { verifyAdminPassword } from "@/lib/admin-auth"

const schema = z.object({
  adminPassword: z.string().min(1),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
  if (!verifyAdminPassword(parsed.data.adminPassword)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await revealNumbers()
  return NextResponse.json({ ok: true })
}
