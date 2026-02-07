import { NextResponse } from "next/server"
import { createTable, listTablesForOwnerEmail } from "@/lib/tables"
import { z } from "zod"

const createSchema = z.object({
  name: z.string().min(2),
  pricePerBox: z.number().min(1),
  payouts: z.object({
    q1: z.number().min(0),
    q2: z.number().min(0),
    q3: z.number().min(0),
    final: z.number().min(0),
  }),
  rules: z.string().optional(),
  visibility: z.enum(["link", "code"]),
  ownerEmail: z.string().email(),
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const ownerEmail = searchParams.get("ownerEmail")
  if (!ownerEmail) {
    return NextResponse.json({ error: "Missing ownerEmail" }, { status: 400 })
  }

  const tables = await listTablesForOwnerEmail(ownerEmail)
  const publicTables = tables.map(({ adminKey, ...rest }) => rest)
  return NextResponse.json({ tables: publicTables })
}

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
  const expectedTotal = parsed.data.pricePerBox * 100
  const payoutTotal =
    parsed.data.payouts.q1 +
    parsed.data.payouts.q2 +
    parsed.data.payouts.q3 +
    parsed.data.payouts.final
  if (Math.abs(payoutTotal - expectedTotal) > 0.01) {
    return NextResponse.json({ error: "Payouts must equal total pot" }, { status: 400 })
  }

  const table = await createTable({
    ...parsed.data,
    kickoffAt: new Date("2026-02-08T23:30:00Z").getTime(),
  })

  return NextResponse.json({ table })
}
