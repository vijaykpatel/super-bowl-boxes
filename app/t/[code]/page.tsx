"use client"

import { useEffect, useMemo, useState } from "react"
import { ServerGameProvider } from "@/lib/game-context"
import { CountdownTimer } from "@/components/countdown-timer"
import { GridStats } from "@/components/grid-stats"
import { SquaresGrid } from "@/components/squares-grid"
import { CheckoutPanel } from "@/components/checkout-panel"
import { RulesSection } from "@/components/rules-section"
import { TableAccessGuard } from "@/components/table-access-guard"

type TablePayload = {
  table: {
    id: string
    code: string
    name: string
    pricePerBox: number
    currency: string
    payouts: { q1: number; q2: number; q3: number; final: number }
    rules?: string
    visibility: "link" | "code"
    kickoffAt: number
    lock: { status: "open" | "locked"; reason?: "auto" | "manual" }
  }
  state: {
    boxes: any[]
    rowNumbers: number[] | null
    colNumbers: number[] | null
    numbersRevealed: boolean
    updatedAt: number
  }
}

export default function TablePage({ params }: { params: { code: string } }) {
  const [data, setData] = useState<TablePayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/tables/${params.code}/state`, { cache: "no-store" })
      if (!res.ok) {
        setLoading(false)
        return
      }
      const json = await res.json()
      setData(json)
      setLoading(false)
    }
    fetchData()
  }, [params.code])

  const revealAt = useMemo(() => {
    if (!data?.table?.kickoffAt) return undefined
    return data.table.kickoffAt - 5 * 60 * 1000
  }, [data?.table?.kickoffAt])

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading table...
      </div>
    )
  }

  const content = (
    <ServerGameProvider
      code={params.code}
      initialState={data.state}
      initialLock={data.table.lock}
    >
      <main className="min-h-screen flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight">
                {data.table.name}
              </h1>
              <p className="text-muted-foreground text-sm">
                ${data.table.pricePerBox} per box • Payouts: Q1 ${data.table.payouts.q1}, Q2 ${data.table.payouts.q2}, Q3 ${data.table.payouts.q3}, Final ${data.table.payouts.final}
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col gap-6 px-3 sm:px-6 pb-8 max-w-5xl mx-auto w-full">
          <section className="pt-4">
            <CountdownTimer revealAt={revealAt} showRevealButton={false} />
          </section>
          <section>
            <div className="bg-card border border-border rounded-lg p-3 text-center text-xs text-muted-foreground">
              Table auto‑locks 15 minutes before kickoff.
            </div>
          </section>

          <section>
            <RulesSection customRules={data.table.rules} />
          </section>

          <section>
            <GridStats />
          </section>

          <section>
            <SquaresGrid />
          </section>

          <section className="sticky bottom-0 pb-4 pt-2 bg-gradient-to-t from-background via-background to-background/0 -mx-3 px-3 sm:-mx-6 sm:px-6">
            <CheckoutPanel />
          </section>
        </div>

        <footer className="text-center py-6 border-t border-border">
          <p className="text-muted-foreground text-xs">
            Table code: {data.table.code}
          </p>
        </footer>
      </main>
    </ServerGameProvider>
  )

  if (data.table.visibility === "code") {
    return <TableAccessGuard requiredCode={data.table.code}>{content}</TableAccessGuard>
  }

  return content
}
