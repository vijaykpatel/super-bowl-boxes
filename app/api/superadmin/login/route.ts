import { NextResponse } from "next/server"
import { verifySuperadminPassword, createSuperadminSession } from "@/lib/superadmin"

export async function POST(req: Request) {
  const body = await req.json()
  const password = String(body?.password ?? "")

  if (!verifySuperadminPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const session = createSuperadminSession()
  const res = NextResponse.json({ ok: true })
  res.cookies.set("superadmin_session", session, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  })
  return res
}
