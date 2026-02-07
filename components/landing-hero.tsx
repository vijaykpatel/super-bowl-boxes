"use client"

import Image from "next/image"
import Link from "next/link"

const MOCK_ROW = [7, 2, 9, 1, 6, 0, 5, 3, 8, 4]
const MOCK_COL = [3, 8, 1, 4, 0, 6, 9, 2, 5, 7]
const MOCK_NAMES = ["VP", "JS", "DM", "LM", "AR", "KB", "MT", "ZN", "TR", "AP"]

function MockSquaresGrid() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[400px] max-w-[600px] mx-auto">
        <div className="flex items-end mb-2 pl-14">
          <div className="flex items-center gap-3 w-full justify-center">
            <span className="font-display text-base sm:text-lg uppercase tracking-[0.15em] text-patriots-red">
              Patriots
            </span>
          </div>
        </div>
        <div className="flex items-end mb-1 pl-14">
          {MOCK_COL.map((num, i) => (
            <div
              key={`mock-col-${i}`}
              className="flex-1 text-center text-sm sm:text-base font-display text-patriots-red/90"
            >
              {num}
            </div>
          ))}
        </div>

        <div className="flex">
          <div className="flex flex-col w-14 shrink-0">
            <span className="font-display text-base sm:text-lg uppercase tracking-[0.15em] text-seahawks-green text-center mb-2 -rotate-90 origin-center translate-y-[140px]">
              Seahawks
            </span>
            {MOCK_ROW.map((num, i) => (
              <div
                key={`mock-row-${i}`}
                className="flex-1 flex items-center justify-center text-sm sm:text-base font-display text-seahawks-green/90 min-h-[36px]"
              >
                {num}
              </div>
            ))}
          </div>

          <div className="flex-1 grid grid-cols-10 gap-0.5 bg-border/60 rounded-xl overflow-hidden border-2 border-border/80 shadow-2xl">
            {Array.from({ length: 100 }).map((_, i) => {
              const name = MOCK_NAMES[i % MOCK_NAMES.length]
              const status =
                i % 7 === 0 ? "pending" : i % 5 === 0 ? "available" : "confirmed"
              return (
                <div
                  key={`mock-cell-${i}`}
                  className={`aspect-square min-h-[34px] flex items-center justify-center text-xs sm:text-sm font-semibold transition-all ${
                    status === "confirmed"
                      ? "bg-patriots-red/30 text-foreground border border-patriots-red/40"
                      : status === "pending"
                        ? "bg-pending/25 text-foreground border border-pending/50 animate-pulse-pending"
                        : "bg-secondary/70 text-muted-foreground/60 border border-border/50 hover:bg-secondary"
                  }`}
                >
                  {status === "available" ? "" : name}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export function LandingHero() {
  return (
    <main className="min-h-screen flex flex-col grain-overlay">
      {/* Navigation Header */}
      <header className="border-b-2 border-border/80 bg-card/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-border/80 shadow-lg">
                <Image
                  src="/images/hero-stadium.jpg"
                  alt="Stadium"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl text-foreground uppercase tracking-tight leading-none">
                  Super Bowl LIX
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-0.5">
                  Premium Squares Experience
                </p>
              </div>
            </div>
            <Link
              href="/tables/new"
              className="bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display uppercase tracking-wider px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl text-base sm:text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Create Table
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden flex-1">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-stadium.jpg"
            alt="Super Bowl Stadium"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background" />
        </div>

        {/* Atmospheric Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-seahawks-green/20 blur-[120px] stadium-glow" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-patriots-red/20 blur-[120px] stadium-glow" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          {/* Team Matchup Header */}
          <div className="text-center mb-12 sm:mb-16 animate-slide-up">
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6">
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-seahawks-green shadow-2xl shadow-seahawks-green/40">
                  <Image
                    src="/images/seahawks-logo.jpg"
                    alt="Seattle Seahawks"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-display text-2xl sm:text-4xl text-seahawks-green uppercase tracking-[0.15em]">
                  Seahawks
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-display text-5xl sm:text-7xl text-foreground tracking-tight">
                  VS
                </span>
                <div className="mt-2 px-4 py-1.5 bg-primary/20 border border-primary/40 rounded-full">
                  <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wider">
                    Super Bowl LIX
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-patriots-red shadow-2xl shadow-patriots-red/40">
                  <Image
                    src="/images/patriots-logo.jpg"
                    alt="New England Patriots"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-display text-2xl sm:text-4xl text-patriots-red uppercase tracking-[0.15em]">
                  Patriots
                </span>
              </div>
            </div>

            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl text-foreground uppercase leading-none tracking-tight mb-6">
              Game Day Glory
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-seahawks-green via-foreground to-patriots-red">
                Starts Here
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create your table, share with friends, and watch the excitement build as squares fill up.
              Random number assignment ensures fairness for everyone.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link
                href="/tables/new"
                className="w-full sm:w-auto bg-gradient-to-r from-seahawks-green to-seahawks-green/90 hover:from-seahawks-green/90 hover:to-seahawks-green text-white font-display uppercase tracking-wider px-10 py-4 rounded-xl text-lg sm:text-xl shadow-2xl hover:shadow-seahawks-green/30 transition-all hover:scale-105"
              >
                Create Your Table
              </Link>
              <Link
                href="/tables"
                className="w-full sm:w-auto border-2 border-border text-foreground hover:text-foreground hover:bg-card font-display uppercase tracking-wider px-10 py-4 rounded-xl text-lg sm:text-xl transition-all hover:scale-105"
              >
                View My Tables
              </Link>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground mt-8 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-seahawks-green animate-pulse"></span>
              Tables auto-lock 15 minutes before kickoff
            </p>
          </div>

          {/* Featured Players Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {/* Patriots Featured */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-patriots-red/30 to-transparent rounded-2xl blur-2xl group-hover:blur-3xl transition-all" />
              <div className="relative bg-card/90 border-2 border-border/80 rounded-2xl p-6 backdrop-blur-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-patriots-red/10 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-patriots-red">
                      <Image
                        src="/images/patriots-logo.jpg"
                        alt="Patriots"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-display text-xl sm:text-2xl text-patriots-red uppercase tracking-wide">
                        Patriots Star
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Rising Quarterback
                      </p>
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-xl border-2 border-border/80 shadow-xl">
                    <img
                      src="/images/drake_maye.webp"
                      alt="Drake Maye"
                      className="object-cover w-full h-[280px] sm:h-[320px]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5">
                      <p className="font-display text-xl sm:text-2xl text-white uppercase">
                        Drake Maye
                      </p>
                      <p className="text-base text-white/90 mt-1">
                        Quarterback #10
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seahawks Featured */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-seahawks-green/30 to-transparent rounded-2xl blur-2xl group-hover:blur-3xl transition-all" />
              <div className="relative bg-card/90 border-2 border-border/80 rounded-2xl p-6 backdrop-blur-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-seahawks-green/10 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-seahawks-green">
                      <Image
                        src="/images/seahawks-logo.jpg"
                        alt="Seahawks"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-display text-xl sm:text-2xl text-seahawks-green uppercase tracking-wide">
                        Seahawks Power
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Dynamic Duo
                      </p>
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-xl border-2 border-border/80 shadow-xl">
                    <img
                      src="/images/jsn-darnold.webp"
                      alt="Jaxon Smith-Njigba and Sam Darnold"
                      className="object-cover w-full h-[280px] sm:h-[320px]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5">
                      <p className="font-display text-xl sm:text-2xl text-white uppercase">
                        JSN & Darnold
                      </p>
                      <p className="text-base text-white/90 mt-1">
                        Receiver & Quarterback
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Preview Section */}
          <div className="bg-card/90 border-2 border-border/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-bold mb-2">
                  Live Grid Preview
                </p>
                <h3 className="font-display text-2xl sm:text-3xl text-foreground uppercase tracking-tight">
                  How the Game Works
                </h3>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-seahawks-green/10 border border-seahawks-green/30 rounded-lg">
                <span className="inline-block w-2 h-2 rounded-full bg-seahawks-green animate-pulse"></span>
                <p className="text-sm sm:text-base text-seahawks-green font-semibold">
                  Numbers reveal 5 min before kickoff
                </p>
              </div>
            </div>
            <MockSquaresGrid />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-border/80 bg-card/95 backdrop-blur-xl py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground text-base sm:text-lg">
            Super Bowl Squares Platform • Game Day 2025
          </p>
        </div>
      </footer>
    </main>
  )
}
