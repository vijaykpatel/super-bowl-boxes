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
      <main className="min-h-screen flex flex-col grain-overlay">
        <header className="border-b-2 border-border/80 bg-card/95 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase tracking-tight leading-none">
                {data.table.name}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg">
                ${data.table.pricePerBox} per box • Payouts: Q1 ${data.table.payouts.q1}, Q2 ${data.table.payouts.q2}, Q3 ${data.table.payouts.q3}, Final ${data.table.payouts.final}
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col gap-8 px-4 sm:px-6 lg:px-8 pb-12 max-w-6xl mx-auto w-full">
          <section className="pt-6">
            <CountdownTimer revealAt={revealAt} showRevealButton={false} />
          </section>
          <section>
            <div className="bg-card/90 border-2 border-border/80 rounded-xl p-4 sm:p-5 text-center backdrop-blur-xl">
              <div className="flex items-center justify-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-seahawks-green animate-pulse"></span>
                <p className="text-base sm:text-lg text-muted-foreground font-medium">
                  Table auto-locks 15 minutes before kickoff
                </p>
              </div>
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

          <section className="sticky bottom-0 pb-6 pt-4 bg-gradient-to-t from-background via-background to-background/0 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <CheckoutPanel />
          </section>
        </div>

        <footer className="border-t-2 border-border/80 bg-card/95 backdrop-blur-xl py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-muted-foreground text-base sm:text-lg">
              Table code: {data.table.code}
            </p>
          </div>
        </footer>
      </main>
    </ServerGameProvider>
  )

  if (data.table.visibility === "code") {
    return <TableAccessGuard requiredCode={data.table.code}>{content}</TableAccessGuard>
  }

  return content
}
