"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { ServerGameProvider } from "@/lib/game-context"
import { CountdownTimer } from "@/components/countdown-timer"
import { GridStats } from "@/components/grid-stats"
import { SquaresGrid } from "@/components/squares-grid"
import { CheckoutPanel } from "@/components/checkout-panel"
import { RulesSection } from "@/components/rules-section"

type TablePayload = {
  table: {
    name: string
    pricePerBox: number
    currency: string
    payouts: { q1: number; q2: number; q3: number; final: number }
    rules: string
    kickoffAt: number
    lock: { status: "open" | "locked"; reason?: "auto" }
  }
  state: {
    boxes: any[]
    rowNumbers: number[] | null
    colNumbers: number[] | null
    numbersRevealed: boolean
    updatedAt: number
  }
}

export default function Page() {
  const [data, setData] = useState<TablePayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/state`, { cache: "no-store" })
      if (!res.ok) {
        setLoading(false)
        return
      }
      const json = await res.json()
      setData(json)
      setLoading(false)
    }
    fetchData()
  }, [])

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

  return (
    <ServerGameProvider initialState={data.state} initialLock={data.table.lock}>
      <main className="min-h-screen flex flex-col relative overflow-hidden bg-[#0a0f1f]">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/hero-stadium.jpg"
            alt="Stadium lights"
            fill
            className="object-cover object-center opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060a16]/85 via-[#0a0f1f]/92 to-[#0a0f1f]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(58,130,246,0.25),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(239,68,68,0.2),transparent_60%)]" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 80px), repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 2px, transparent 2px, transparent 80px)",
            }}
          />
        </div>

        <header className="relative z-10 border-b border-white/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src="/images/nfl-shield.svg"
                  alt="NFL"
                  width={56}
                  height={56}
                  className="w-12 h-12 sm:w-14 sm:h-14"
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">Super Bowl LIX</p>
                  <h1 className="font-display text-2xl sm:text-4xl text-white uppercase tracking-tight">
                    {data.table.name}
                  </h1>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
                <span>Box Value</span>
                <span className="text-white font-bold text-lg">${data.table.pricePerBox}</span>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] items-center">
              <div className="glass-panel rounded-3xl p-5 sm:p-6 flex items-center gap-4">
                <Image
                  src="/images/jsn-darnold.webp"
                  alt="Seahawks player"
                  width={120}
                  height={160}
                  className="w-20 sm:w-28 h-auto rounded-2xl object-cover shadow-2xl"
                />
                <div>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/seahawks-logo.jpg"
                      alt="Seahawks"
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-seahawks-green/70"
                    />
                    <span className="font-display text-lg sm:text-xl uppercase tracking-[0.2em] text-seahawks-green">
                      Seahawks
                    </span>
                  </div>
                  <p className="text-white/70 text-sm sm:text-base mt-3">
                    Defense meets swagger. Claim your squares before kickoff.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-white/70 text-xs uppercase tracking-[0.35em]">Kickoff</span>
                <span className="font-display text-3xl sm:text-4xl text-white">Feb 8 • 6:30 PM ET</span>
                <div className="text-white/60 text-xs uppercase tracking-[0.3em]">Numbers reveal 5 minutes before</div>
              </div>

              <div className="glass-panel rounded-3xl p-5 sm:p-6 flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <span className="font-display text-lg sm:text-xl uppercase tracking-[0.2em] text-patriots-red">
                      Patriots
                    </span>
                    <Image
                      src="/images/patriots-logo.jpg"
                      alt="Patriots"
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-patriots-red/70"
                    />
                  </div>
                  <p className="text-white/70 text-sm sm:text-base mt-3">
                    Red-zone ready. Lock your winning squares early.
                  </p>
                </div>
                <Image
                  src="/images/drake_maye.webp"
                  alt="Patriots player"
                  width={120}
                  height={160}
                  className="w-20 sm:w-28 h-auto rounded-2xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16 w-full">
          <section className="pt-10">
            <CountdownTimer revealAt={revealAt} showRevealButton={false} />
          </section>

          <section className="mt-8">
            <div className="glass-panel rounded-3xl p-5 sm:p-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-seahawks-green animate-pulse"></span>
                <p className="text-base sm:text-lg text-white/80 font-medium">
                  Table auto-locks 15 minutes before kickoff
                </p>
              </div>
              <p className="text-white/60 text-sm mt-2">
                Payouts: Q1 ${data.table.payouts.q1} • Q2 ${data.table.payouts.q2} • Q3 ${data.table.payouts.q3} • Final ${data.table.payouts.final}
              </p>
            </div>
          </section>

          <section className="mt-10">
            <GridStats />
          </section>

          <section className="mt-8">
            <SquaresGrid />
          </section>

          <section className="mt-10">
            <RulesSection customRules={data.table.rules} />
          </section>

          <section className="sticky bottom-0 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 bg-gradient-to-t from-[#0a0f1f] via-[#0a0f1f] to-transparent -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
            <CheckoutPanel />
          </section>
        </div>

        <footer className="relative z-10 border-t border-white/10 py-8 text-center text-white/60">
          <p className="text-sm uppercase tracking-[0.3em]">MH Super Bowl Boxes</p>
        </footer>
      </main>
    </ServerGameProvider>
  )
}
