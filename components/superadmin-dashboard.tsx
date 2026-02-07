"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"

type Table = {
  id: string
  code: string
  name: string
  ownerId: string
  ownerEmail?: string
  pricePerBox: number
  payouts: { q1: number; q2: number; q3: number; final: number }
  visibility: "link" | "code"
  lock: { status: "open" | "locked" }
}

export function SuperadminDashboard({ tables }: { tables: Table[] }) {
  const origin = useMemo(() => {
    if (typeof window === "undefined") return ""
    return window.location.origin
  }, [])

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-black text-foreground uppercase tracking-tight">
              Superadmin
            </h1>
            <p className="text-muted-foreground text-xs">
              All tables across the platform (private to the owner only).
            </p>
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              await fetch("/api/superadmin/logout", { method: "POST" })
              window.location.reload()
            }}
            className="border-border text-muted-foreground hover:text-foreground"
          >
            Log out
          </Button>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
        {tables.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <p className="text-muted-foreground text-sm">No tables yet.</p>
          </div>
        )}

        <div className="grid gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {table.name}
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1">
                    Owner: {table.ownerEmail ?? table.ownerId}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    ${table.pricePerBox} per box • Payouts Q1 ${table.payouts.q1},
                    Q2 ${table.payouts.q2}, Q3 ${table.payouts.q3}, Final $
                    {table.payouts.final}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {table.lock.status === "locked" ? "Locked" : "Open"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>Code: {table.code}</span>
                <span>Visibility: {table.visibility === "code" ? "Link + Code" : "Link"}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/t/${table.code}`}
                  className="border border-border text-muted-foreground hover:text-foreground hover:bg-secondary px-3 py-2 rounded-md text-xs"
                >
                  Open Table
                </Link>
                <Link
                  href={`/t/${table.code}/admin`}
                  className="border border-border text-muted-foreground hover:text-foreground hover:bg-secondary px-3 py-2 rounded-md text-xs"
                >
                  Admin Panel
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!origin) return
                    navigator.clipboard.writeText(`${origin}/t/${table.code}`)
                  }}
                  className="border-border text-muted-foreground hover:text-foreground"
                >
                  Copy Share Link
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
