"use client"

import { GameProvider } from "@/lib/game-context"
import { HeroSection } from "@/components/hero-section"
import { CountdownTimer } from "@/components/countdown-timer"
import { GridStats } from "@/components/grid-stats"
import { SquaresGrid } from "@/components/squares-grid"
import { CheckoutPanel } from "@/components/checkout-panel"
import { RulesSection } from "@/components/rules-section"

export default function Page() {
  return (
    <GameProvider>
      <main className="min-h-screen flex flex-col">
        {/* Hero */}
        <HeroSection />

        {/* Main content */}
        <div className="flex-1 flex flex-col gap-6 px-3 sm:px-6 pb-8">
          {/* Countdown */}
          <section className="pt-2">
            <CountdownTimer />
          </section>

          {/* Rules */}
          <section>
            <RulesSection />
          </section>

          {/* Stats */}
          <section>
            <GridStats />
          </section>

          {/* Grid */}
          <section>
            <SquaresGrid />
          </section>

          {/* Checkout */}
          <section className="sticky bottom-0 pb-4 pt-2 bg-gradient-to-t from-background via-background to-background/0 -mx-3 px-3 sm:-mx-6 sm:px-6">
            <CheckoutPanel />
          </section>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border">
          <p className="text-muted-foreground text-xs">
            Super Bowl Squares - Seahawks vs Patriots
          </p>
        </footer>
      </main>
    </GameProvider>
  )
}
