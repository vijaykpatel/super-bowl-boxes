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
      <main className="min-h-screen flex flex-col bg-background">

        {/* ===== BROADCAST STATUS BAR ===== */}
        <div className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-background/90 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
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
            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-[11px] sm:text-sm text-white/40 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="hidden sm:inline uppercase tracking-wider">Super Bowl LIX</span>
                <span className="hidden sm:inline text-white/15">|</span>
                <span className="font-display text-base sm:text-xl text-sb-cyan">${data.table.pricePerBox}<span className="text-white/30 text-xs sm:text-sm">/box</span></span>
              </div>
              <span className="uppercase tracking-wider text-white/55">2 boxes max per person</span>
            </div>
            <Image
              src="/images/nfl-logo.png"
              alt="NFL"
              width={32}
              height={32}
              className="w-5 h-5 sm:w-7 sm:h-7 opacity-50"
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
          <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16 pt-0.5 sm:pt-2 lg:pt-4 pb-8 sm:pb-12 lg:pb-16">
            {/* Helmets + Trophy — fixed-height container, helmets overflow it */}
            <div className="relative flex items-center justify-center animate-hero-entrance h-32 sm:h-40 lg:h-48 xl:h-56 overflow-visible mb-2 sm:mb-3">
              <Image
                src="/images/seahawks-logo.png"
                alt="Seahawks"
                width={800}
                height={800}
                className="absolute left-1/2 top-1/2 -translate-y-1/2 w-44 h-44 sm:w-[17rem] sm:h-[17rem] lg:w-[390px] lg:h-[390px] xl:w-[460px] xl:h-[460px] object-contain drop-shadow-[0_0_60px_hsla(152,85%,45%,0.5)] -translate-x-[118%] sm:-translate-x-[112%] lg:-translate-x-[107%] z-0 hover:scale-105 transition-transform duration-500"
              />
              <Image
                src="/images/superbowl-logo.png"
                alt="Super Bowl LIX"
                width={500}
                height={500}
                className="relative w-[10.5rem] sm:w-[13.5rem] lg:w-[17rem] xl:w-[306px] h-auto drop-shadow-[0_0_60px_hsla(45,100%,58%,0.35)] z-10"
                priority
              />
              <Image
                src="/images/patriots-logo.png"
                alt="Patriots"
                width={800}
                height={800}
                className="absolute left-1/2 top-1/2 -translate-y-1/2 w-48 h-48 sm:w-[18rem] sm:h-[18rem] lg:w-[420px] lg:h-[420px] xl:w-[500px] xl:h-[500px] object-contain drop-shadow-[0_0_60px_hsla(0,80%,55%,0.5)] translate-x-[18%] sm:translate-x-[12%] lg:translate-x-[7%] z-0 hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Title — MASSIVE */}
            <h1 className="font-display text-[2.35rem] sm:text-[3.5rem] lg:text-[4.8rem] xl:text-[6.4rem] uppercase tracking-tight text-center mb-2 sm:mb-4 lg:mb-5 animate-hero-entrance stagger-2">
              <span className="gradient-text drop-shadow-lg">{data.table.name}</span>
            </h1>

            {/* ===== MATCHUP — MOBILE: stacked, DESKTOP: wide dramatic ===== */}
            {/* Desktop matchup (hidden on mobile) */}
            <div className="hidden sm:flex items-end justify-center gap-4 lg:gap-10 xl:gap-12 animate-hero-entrance stagger-3">
              {/* Seahawks side */}
              <div className="flex flex-col items-center flex-1 max-w-[290px]">
                <div className="relative mb-4 player-card">
                  <div className="absolute -inset-6 bg-seahawks-green/20 rounded-3xl blur-2xl" />
                  <div className="absolute -inset-12 bg-seahawks-green/8 rounded-full blur-3xl" />
                  <Image
                    src="/images/jsn-darnold.webp"
                    alt="Jaxon Smith-Njigba & Sam Darnold"
                    width={400}
                    height={520}
                    className="relative w-[230px] h-[245px] lg:w-[290px] lg:h-[320px] xl:w-[320px] xl:h-[360px] rounded-2xl object-cover object-top border-2 border-seahawks-green/40 shadow-[0_8px_40px_hsla(152,85%,45%,0.2)]"
                  />
                  {/* Logo badge removed per request */}
                </div>
                <p className="font-display text-3xl lg:text-4xl uppercase tracking-wider text-seahawks-green drop-shadow-lg">
                  Seahawks
                </p>
                <p className="text-sm text-white/50 mt-1 tracking-wide">Jaxon Smith-Njigba & Sam Darnold</p>
              </div>

              {/* VS center — GLOWING */}
              <div className="flex flex-col items-center gap-3 mb-14 lg:mb-16 shrink-0">
                <div className="relative">
                  <span className="font-display text-7xl lg:text-8xl xl:text-9xl gradient-text vs-badge">
                    VS
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-base text-white/50 uppercase tracking-[0.3em] font-medium">
                    Feb 8 &middot; 6:30 PM ET
                  </p>
                  <p className="text-sm text-white/30 uppercase tracking-[0.2em] mt-1">
                    Levi's Stadium &middot; San Francisco, CA
                  </p>
                </div>
              </div>

              {/* Patriots side */}
              <div className="flex flex-col items-center flex-1 max-w-[290px]">
                <div className="relative mb-4 player-card">
                  <div className="absolute -inset-6 bg-patriots-red/20 rounded-3xl blur-2xl" />
                  <div className="absolute -inset-12 bg-patriots-red/8 rounded-full blur-3xl" />
                  <Image
                    src="/images/drake_maye.webp"
                    alt="Drake Maye"
                    width={400}
                    height={520}
                    className="relative w-[230px] h-[245px] lg:w-[290px] lg:h-[320px] xl:w-[320px] xl:h-[360px] rounded-2xl object-cover object-top border-2 border-patriots-red/40 shadow-[0_8px_40px_hsla(0,80%,55%,0.2)]"
                  />
                  {/* Logo badge removed per request */}
                </div>
                <p className="font-display text-3xl lg:text-4xl uppercase tracking-wider text-patriots-red drop-shadow-lg">
                  Patriots
                </p>
                <p className="text-sm text-white/50 mt-1 tracking-wide">Drake Maye</p>
              </div>
            </div>

            {/* Mobile matchup (visible only on mobile) */}
            <div className="flex sm:hidden flex-col items-center gap-5 animate-hero-entrance stagger-3">
              {/* Both players side by side — compact */}
              <div className="flex items-stretch justify-center gap-3 w-full">
                {/* Seahawks */}
                <div className="flex flex-col items-center flex-1">
                  <div className="relative mb-3 player-card w-full">
                    <div className="absolute -inset-3 bg-seahawks-green/15 rounded-2xl blur-xl" />
                    <Image
                      src="/images/jsn-darnold.webp"
                      alt="Jaxon Smith-Njigba & Sam Darnold"
                      width={300}
                      height={400}
                      className="relative w-full h-44 rounded-xl object-cover object-top border-2 border-seahawks-green/40 shadow-[0_4px_20px_hsla(152,85%,45%,0.15)]"
                    />
                    {/* Logo badge removed per request */}
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
                      className="relative w-full h-44 rounded-xl object-cover object-top border-2 border-patriots-red/40 shadow-[0_4px_20px_hsla(0,80%,55%,0.15)]"
                    />
                    {/* Logo badge removed per request */}
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
                  Feb 8 &middot; 6:30 PM ET
                </p>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-0.5">
                  Levi's Stadium &middot; San Francisco, CA
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
            <div className="flex items-center justify-center gap-3 mb-2 sm:mb-4">
              <div className="h-px flex-1 max-w-[60px] sm:max-w-[100px] bg-gradient-to-r from-transparent to-white/10" />
              <h2 className="font-display text-lg sm:text-2xl lg:text-3xl uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/60">
                Payouts
              </h2>
              <div className="h-px flex-1 max-w-[60px] sm:max-w-[100px] bg-gradient-to-l from-transparent to-white/10" />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 mb-4 sm:mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs sm:text-sm uppercase tracking-[0.25em] text-sb-cyan/80">
                Cost <span className="text-white/40">·</span> <span className="font-display text-white">$5</span> <span className="text-white/40">/ box</span>
              </span>
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-white/45 text-center">
                To be approved, payment must be made to{" "}
                <span className="text-white/70">Vijay</span>{" "}
                <span className="text-white/25">·</span>{" "}
                <a
                  href="https://venmo.com/u/vijay_patel"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sb-cyan/80 hover:text-sb-cyan underline-offset-4 hover:underline"
                >
                  @vijay_patel
                </a>
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-4 lg:gap-6 max-w-4xl mx-auto">
              {(["q1", "q2", "q3", "final"] as const).map((q, i) => (
                <div
                  key={q}
                  className={`scoreboard-card rounded-lg sm:rounded-2xl p-2 sm:p-5 text-center relative overflow-hidden group aspect-square w-full flex items-center justify-center ${
                    q === "final" ? "sm:scale-[1.1] lg:scale-[1.12] z-10 ring-1 ring-sb-cyan/20" : ""
                  }`}
                >
                  {q === "final" && (
                    <div className="absolute inset-0 bg-gradient-to-br from-sb-cyan/5 via-transparent to-sb-magenta/5 pointer-events-none" />
                  )}
                  <div className="relative flex flex-col items-center justify-center">
                    <div className="text-[11px] sm:text-base uppercase tracking-[0.15em] sm:tracking-[0.25em] text-white/40 mb-1 sm:mb-3 font-medium">
                      {payoutLabels[q]}
                    </div>
                    <div
                      className={`font-display text-white ${
                        q === "final" ? "text-4xl sm:text-6xl lg:text-7xl" : "text-3xl sm:text-4xl lg:text-5xl"
                      }`}
                    >
                      ${data.table.payouts[q]}
                    </div>
                    {q === "final" && (
                      <div className="mt-1 sm:mt-2 text-base sm:text-lg uppercase tracking-widest text-sb-cyan/70">
                        Grand Prize
                      </div>
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
            {/* How it works */}
            <div className="mb-6 sm:mb-10 px-3 sm:px-8 lg:px-16 max-w-5xl mx-auto">
              <RulesSection customRules={data.table.rules} />
            </div>

            {/* Grid stats */}
            <div className="mb-4 sm:mb-8 px-1 sm:px-0">
              <GridStats />
            </div>

            {/* THE GRID — let it breathe */}
            <SquaresGrid />
          </div>
        </section>

        {/* ===== CHECKOUT ===== */}
        <div className="w-full pb-4 sm:pb-6 pt-3 sm:pt-4">
          <div className="w-full px-3 sm:px-8 lg:px-16 max-w-3xl mx-auto">
            <CheckoutPanel pricePerBox={data.table.pricePerBox} />
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
          <p className="mt-4 text-center text-[11px] sm:text-xs text-white/40 max-w-3xl mx-auto px-6">
            All forms of gambling carry the risk of financial loss. Please gamble responsibly and only with money you can afford to lose. If you or someone you know is struggling with gambling-related issues, we strongly recommend seeking professional help and support.
          </p>
        </footer>
      </main>
    </ServerGameProvider>
  )
}
