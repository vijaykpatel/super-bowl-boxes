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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-sb-cyan/30 border-t-sb-cyan rounded-full animate-spin" />
          <span className="text-muted-foreground font-display text-lg uppercase tracking-widest">Loading</span>
        </div>
      </div>
    )
  }

  const isLocked = data.table.lock.status === "locked"
  const payoutLabels = { q1: "1ST QTR", q2: "HALFTIME", q3: "3RD QTR", final: "FINAL" } as const

  return (
    <ServerGameProvider initialState={data.state} initialLock={data.table.lock}>
      <main className="min-h-screen flex flex-col bg-background overflow-x-hidden">

        {/* ===== BROADCAST STATUS BAR ===== */}
        <div className="relative z-20 w-full border-b border-white/[0.06] bg-background/80 backdrop-blur-md">
          <div className="w-full px-4 sm:px-8 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${isLocked ? "bg-patriots-red" : "bg-seahawks-green"}`} />
                {!isLocked && <span className="inline-block w-2 h-2 rounded-full bg-seahawks-green animate-ping absolute" />}
              </div>
              <span className="text-xs sm:text-sm font-medium text-white/60 uppercase tracking-wider">
                {isLocked ? "Locked" : "Live"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-white/40">
              <span className="hidden sm:inline uppercase tracking-wider">Super Bowl LIX</span>
              <span className="hidden sm:inline text-white/15">|</span>
              <span className="font-display text-base sm:text-lg text-sb-cyan">${data.table.pricePerBox}<span className="text-white/30 text-xs">/box</span></span>
            </div>
            <Image
              src="/images/nfl-logo.png"
              alt="NFL"
              width={32}
              height={32}
              className="w-6 h-6 sm:w-8 sm:h-8 opacity-50"
            />
          </div>
        </div>

        {/* ===== HERO SECTION — FULL BLEED ===== */}
        <div className="relative w-full overflow-hidden grain-overlay">
          {/* Stadium background — HIGH opacity, it should be FELT */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero-stadium.jpg"
              alt=""
              fill
              className="object-cover object-center opacity-50"
              priority
            />
            {/* Cinematic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>

          {/* Living team color washes — VISIBLE, breathing, moving */}
          <div className="absolute top-0 left-0 w-[60%] h-full light-leak-green pointer-events-none" />
          <div className="absolute top-0 right-0 w-[60%] h-full light-leak-red pointer-events-none" />

          {/* Ambient floating orbs */}
          <div className="absolute top-[20%] left-[15%] w-64 h-64 rounded-full bg-seahawks-green/10 blur-[100px] animate-float pointer-events-none" />
          <div className="absolute top-[30%] right-[10%] w-80 h-80 rounded-full bg-patriots-red/8 blur-[120px] animate-float pointer-events-none" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-[10%] left-[40%] w-48 h-48 rounded-full bg-sb-cyan/6 blur-[80px] animate-float pointer-events-none" style={{ animationDelay: '4s' }} />

          {/* Hero content — edge to edge */}
          <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16 pt-2 sm:pt-4 lg:pt-6 pb-10 sm:pb-14 lg:pb-18">
            {/* Helmets + Trophy — fixed-height container, helmets overflow it */}
            <div className="relative flex items-center justify-center animate-hero-entrance h-36 sm:h-48 lg:h-56 xl:h-64 overflow-visible mb-2 sm:mb-4">
              <Image
                src="/images/seahawks-logo.png"
                alt="Seahawks"
                width={800}
                height={800}
                className="absolute left-1/2 top-1/2 -translate-y-1/2 w-52 h-52 sm:w-80 sm:h-80 lg:w-[460px] lg:h-[460px] xl:w-[540px] xl:h-[540px] object-contain drop-shadow-[0_0_60px_hsla(152,85%,45%,0.5)] -translate-x-[118%] sm:-translate-x-[112%] lg:-translate-x-[107%] z-0 hover:scale-105 transition-transform duration-500"
              />
              <Image
                src="/images/superbowl-logo.png"
                alt="Super Bowl LIX"
                width={500}
                height={500}
                className="relative w-48 sm:w-64 lg:w-80 xl:w-[360px] h-auto drop-shadow-[0_0_60px_hsla(45,100%,58%,0.35)] z-10"
                priority
              />
              <Image
                src="/images/patriots-logo.png"
                alt="Patriots"
                width={800}
                height={800}
                className="absolute left-1/2 top-1/2 -translate-y-1/2 w-52 h-52 sm:w-80 sm:h-80 lg:w-[460px] lg:h-[460px] xl:w-[540px] xl:h-[540px] object-contain drop-shadow-[0_0_60px_hsla(0,80%,55%,0.5)] translate-x-[18%] sm:translate-x-[12%] lg:translate-x-[7%] z-0 hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Title — MASSIVE */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl xl:text-9xl uppercase tracking-tight text-center mb-10 sm:mb-14 lg:mb-16 animate-hero-entrance stagger-2">
              <span className="gradient-text drop-shadow-lg">{data.table.name}</span>
            </h1>

            {/* ===== MATCHUP — MOBILE: stacked, DESKTOP: wide dramatic ===== */}
            {/* Desktop matchup (hidden on mobile) */}
            <div className="hidden sm:flex items-end justify-center gap-8 lg:gap-16 xl:gap-24 animate-hero-entrance stagger-3">
              {/* Seahawks side */}
              <div className="flex flex-col items-center flex-1 max-w-[340px]">
                <div className="relative mb-4 player-card">
                  <div className="absolute -inset-6 bg-seahawks-green/20 rounded-3xl blur-2xl" />
                  <div className="absolute -inset-12 bg-seahawks-green/8 rounded-full blur-3xl" />
                  <Image
                    src="/images/jsn-darnold.webp"
                    alt="Jaxon Smith-Njigba"
                    width={400}
                    height={520}
                    className="relative w-60 h-72 lg:w-72 lg:h-[380px] xl:w-80 xl:h-[420px] rounded-2xl object-cover object-top border-2 border-seahawks-green/40 shadow-[0_8px_40px_hsla(152,85%,45%,0.2)]"
                  />
                  <Image
                    src="/images/seahawks-logo.png"
                    alt="Seahawks"
                    width={56}
                    height={56}
                    className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full object-cover border-[3px] border-background shadow-xl ring-2 ring-seahawks-green/30"
                  />
                </div>
                <p className="font-display text-3xl lg:text-4xl uppercase tracking-wider text-seahawks-green drop-shadow-lg">
                  Seahawks
                </p>
                <p className="text-sm text-white/50 mt-1 tracking-wide">Jaxon Smith-Njigba</p>
              </div>

              {/* VS center — GLOWING */}
              <div className="flex flex-col items-center gap-3 mb-16 lg:mb-20 shrink-0">
                <div className="relative">
                  <span className="font-display text-7xl lg:text-8xl xl:text-9xl gradient-text vs-badge">
                    VS
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-base text-white/50 uppercase tracking-[0.3em] font-medium">
                    Feb 9 &middot; 6:30 PM ET
                  </p>
                  <p className="text-sm text-white/30 uppercase tracking-[0.2em] mt-1">
                    Caesars Superdome &middot; New Orleans
                  </p>
                </div>
              </div>

              {/* Patriots side */}
              <div className="flex flex-col items-center flex-1 max-w-[340px]">
                <div className="relative mb-4 player-card">
                  <div className="absolute -inset-6 bg-patriots-red/20 rounded-3xl blur-2xl" />
                  <div className="absolute -inset-12 bg-patriots-red/8 rounded-full blur-3xl" />
                  <Image
                    src="/images/drake_maye.webp"
                    alt="Drake Maye"
                    width={400}
                    height={520}
                    className="relative w-60 h-72 lg:w-72 lg:h-[380px] xl:w-80 xl:h-[420px] rounded-2xl object-cover object-top border-2 border-patriots-red/40 shadow-[0_8px_40px_hsla(0,80%,55%,0.2)]"
                  />
                  <Image
                    src="/images/patriots-logo.png"
                    alt="Patriots"
                    width={56}
                    height={56}
                    className="absolute -bottom-3 -left-3 w-14 h-14 rounded-full object-cover border-[3px] border-background shadow-xl ring-2 ring-patriots-red/30"
                  />
                </div>
                <p className="font-display text-3xl lg:text-4xl uppercase tracking-wider text-patriots-red drop-shadow-lg">
                  Patriots
                </p>
                <p className="text-sm text-white/50 mt-1 tracking-wide">Drake Maye</p>
              </div>
            </div>

            {/* Mobile matchup (visible only on mobile) */}
            <div className="flex sm:hidden flex-col items-center gap-6 animate-hero-entrance stagger-3">
              {/* Both players side by side — compact */}
              <div className="flex items-stretch justify-center gap-3 w-full">
                {/* Seahawks */}
                <div className="flex flex-col items-center flex-1">
                  <div className="relative mb-3 player-card w-full">
                    <div className="absolute -inset-3 bg-seahawks-green/15 rounded-2xl blur-xl" />
                    <Image
                      src="/images/jsn-darnold.webp"
                      alt="Jaxon Smith-Njigba"
                      width={300}
                      height={400}
                      className="relative w-full h-52 rounded-xl object-cover object-top border-2 border-seahawks-green/40 shadow-[0_4px_20px_hsla(152,85%,45%,0.15)]"
                    />
                    <Image
                      src="/images/seahawks-logo.png"
                      alt="Seahawks"
                      width={40}
                      height={40}
                      className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full object-cover border-2 border-background shadow-lg ring-1 ring-seahawks-green/30"
                    />
                  </div>
                  <p className="font-display text-xl uppercase tracking-wider text-seahawks-green">
                    Seahawks
                  </p>
                  <p className="text-[10px] text-white/40 tracking-wide">JSN</p>
                </div>

                {/* VS divider */}
                <div className="flex flex-col items-center justify-center shrink-0 -mx-1">
                  <span className="font-display text-3xl gradient-text vs-badge">VS</span>
                </div>

                {/* Patriots */}
                <div className="flex flex-col items-center flex-1">
                  <div className="relative mb-3 player-card w-full">
                    <div className="absolute -inset-3 bg-patriots-red/15 rounded-2xl blur-xl" />
                    <Image
                      src="/images/drake_maye.webp"
                      alt="Drake Maye"
                      width={300}
                      height={400}
                      className="relative w-full h-52 rounded-xl object-cover object-top border-2 border-patriots-red/40 shadow-[0_4px_20px_hsla(0,80%,55%,0.15)]"
                    />
                    <Image
                      src="/images/patriots-logo.png"
                      alt="Patriots"
                      width={40}
                      height={40}
                      className="absolute -bottom-2 -left-2 w-10 h-10 rounded-full object-cover border-2 border-background shadow-lg ring-1 ring-patriots-red/30"
                    />
                  </div>
                  <p className="font-display text-xl uppercase tracking-wider text-patriots-red">
                    Patriots
                  </p>
                  <p className="text-[10px] text-white/40 tracking-wide">Drake Maye</p>
                </div>
              </div>

              {/* Game info */}
              <div className="text-center">
                <p className="text-xs text-white/50 uppercase tracking-[0.3em] font-medium">
                  Feb 9 &middot; 6:30 PM ET
                </p>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-0.5">
                  Caesars Superdome &middot; New Orleans
                </p>
              </div>
            </div>
          </div>

          {/* Bottom edge glow */}
          <div className="absolute bottom-0 left-0 right-0 h-px section-divider" />
        </div>

        {/* ===== COUNTDOWN — BOLD ===== */}
        <section className="relative w-full py-6 sm:py-14 lg:py-16">
          <div className="absolute inset-0 accent-stripe pointer-events-none opacity-50" />
          <div className="relative z-10 w-full px-3 sm:px-8 lg:px-16">
            <CountdownTimer revealAt={revealAt} showRevealButton={false} />
          </div>
        </section>

        <div className="section-divider w-full" />

        {/* ===== SCOREBOARD PAYOUTS ===== */}
        <section className="relative w-full py-6 sm:py-14">
          <div className="w-full px-3 sm:px-8 lg:px-16">
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-8">
              <div className="h-px flex-1 max-w-[60px] sm:max-w-[100px] bg-gradient-to-r from-transparent to-white/10" />
              <h2 className="font-display text-lg sm:text-2xl lg:text-3xl uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/60">
                Payouts
              </h2>
              <div className="h-px flex-1 max-w-[60px] sm:max-w-[100px] bg-gradient-to-l from-transparent to-white/10" />
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-4 lg:gap-6 max-w-4xl mx-auto">
              {(["q1", "q2", "q3", "final"] as const).map((q, i) => (
                <div
                  key={q}
                  className="scoreboard-card rounded-lg sm:rounded-2xl p-2.5 sm:p-6 text-center relative overflow-hidden group"
                >
                  {q === "final" && (
                    <div className="absolute inset-0 bg-gradient-to-br from-sb-cyan/5 via-transparent to-sb-magenta/5 pointer-events-none" />
                  )}
                  <div className="relative">
                    <div className="text-[8px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.25em] text-white/40 mb-1 sm:mb-3 font-medium">
                      {payoutLabels[q]}
                    </div>
                    <div className="font-display text-xl sm:text-4xl lg:text-5xl text-white">
                      ${data.table.payouts[q]}
                    </div>
                    {q === "final" && (
                      <div className="mt-1 sm:mt-2 text-[8px] sm:text-[10px] uppercase tracking-widest text-sb-cyan/60">Grand Prize</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider w-full" />

        {/* ===== GRID SECTION — WIDE ===== */}
        <section className="relative w-full py-6 sm:py-14">
          <div className="w-full px-2 sm:px-6 lg:px-12">
            {/* Grid stats */}
            <div className="mb-4 sm:mb-8 px-1 sm:px-0">
              <GridStats />
            </div>

            {/* THE GRID — let it breathe */}
            <SquaresGrid />
          </div>
        </section>

        <div className="section-divider w-full" />

        {/* ===== RULES ===== */}
        <section className="w-full py-6 sm:py-14">
          <div className="w-full px-3 sm:px-8 lg:px-16 max-w-5xl mx-auto">
            <RulesSection customRules={data.table.rules} />
          </div>
        </section>

        {/* ===== STICKY CHECKOUT ===== */}
        <div className="sticky bottom-0 z-30 w-full pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:pt-4 bg-gradient-to-t from-background via-background/95 to-transparent">
          <div className="w-full px-3 sm:px-8 lg:px-16 max-w-3xl mx-auto">
            <CheckoutPanel />
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <footer className="relative z-10 w-full border-t border-white/[0.06] py-6 sm:py-8">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-white/10" />
            <p className="text-[10px] sm:text-xs text-white/25 uppercase tracking-[0.3em] sm:tracking-[0.4em] font-medium">
              MH Super Bowl Boxes &middot; 2026
            </p>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-white/10" />
          </div>
        </footer>
      </main>
    </ServerGameProvider>
  )
}
