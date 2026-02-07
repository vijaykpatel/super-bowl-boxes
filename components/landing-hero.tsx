"use client"

import Image from "next/image"
import Link from "next/link"

const MOCK_ROW = [7, 2, 9, 1, 6, 0, 5, 3, 8, 4]
const MOCK_COL = [3, 8, 1, 4, 0, 6, 9, 2, 5, 7]
const MOCK_NAMES = ["VP", "JS", "DM", "LM", "AR", "KB", "MT", "ZN", "TR", "AP"]

function MockSquaresGrid() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[360px] max-w-[520px] mx-auto">
        <div className="flex items-end mb-1 pl-10 sm:pl-12">
          <div className="flex items-center gap-2 w-full justify-center">
            <span className="font-display text-xs sm:text-sm uppercase tracking-wider text-patriots-red font-black">
              Patriots
            </span>
          </div>
        </div>
        <div className="flex items-end mb-0.5 pl-10 sm:pl-12">
          {MOCK_COL.map((num, i) => (
            <div
              key={`mock-col-${i}`}
              className="flex-1 text-center text-[10px] sm:text-xs font-display font-bold text-patriots-red/80"
            >
              {num}
            </div>
          ))}
        </div>

        <div className="flex">
          <div className="flex flex-col w-10 sm:w-12 shrink-0">
            <span className="font-display text-[10px] sm:text-xs uppercase tracking-wider text-seahawks-green font-black text-center mb-1">
              Seahawks
            </span>
            {MOCK_ROW.map((num, i) => (
              <div
                key={`mock-row-${i}`}
                className="flex-1 flex items-center justify-center text-[10px] sm:text-xs font-display font-bold text-seahawks-green/80"
              >
                {num}
              </div>
            ))}
          </div>

          <div className="flex-1 grid grid-cols-10 gap-px bg-border/40 rounded-md overflow-hidden border border-border/60">
            {Array.from({ length: 100 }).map((_, i) => {
              const name = MOCK_NAMES[i % MOCK_NAMES.length]
              const status =
                i % 7 === 0 ? "pending" : i % 5 === 0 ? "available" : "confirmed"
              return (
                <div
                  key={`mock-cell-${i}`}
                  className={`aspect-square min-h-[28px] flex items-center justify-center text-[9px] sm:text-[10px] font-medium ${
                    status === "confirmed"
                      ? "bg-patriots-red/25 text-foreground border border-patriots-red/30"
                      : status === "pending"
                        ? "bg-pending/20 text-foreground border border-pending/40"
                        : "bg-secondary/60 text-muted-foreground border border-border/40"
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
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border/60">
              <Image
                src="/images/hero-stadium.jpg"
                alt="Stadium lights"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="font-display text-lg sm:text-xl font-black text-foreground uppercase tracking-tight">
                Super Bowl Squares
              </h1>
              <p className="text-muted-foreground text-xs">
                A bold, football‑first squares experience.
              </p>
            </div>
          </div>
          <Link
            href="/tables/new"
            className="bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display font-bold uppercase tracking-wide px-4 py-2 rounded-lg text-xs"
          >
            Create a Table
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(15,23,36,0.85), rgba(15,23,36,0.2)), url('https://commons.wikimedia.org/wiki/Special:FilePath/Super_Bowl_XL_media_day_(236015718).jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.35),transparent_50%),radial-gradient(circle_at_15%_20%,rgba(239,68,68,0.35),transparent_40%)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 relative">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            <div>
              <div className="flex items-center gap-3">
                <Image
                  src="/images/seahawks-logo.jpg"
                  alt="Seattle Seahawks"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <span className="font-display text-2xl sm:text-3xl font-black text-seahawks-green uppercase tracking-widest">
                  Seahawks
                </span>
                <span className="text-muted-foreground text-sm sm:text-base">vs</span>
                <span className="font-display text-2xl sm:text-3xl font-black text-patriots-red uppercase tracking-widest">
                  Patriots
                </span>
                <Image
                  src="/images/patriots-logo.jpg"
                  alt="New England Patriots"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-foreground mt-6 leading-tight">
                Super Bowl Squares, built for the big stage.
              </h2>
              <p className="text-muted-foreground mt-5 text-sm sm:text-base max-w-xl">
                Set up a table, send the link to your crew, and watch the grid
                fill with names before kickoff. Football energy included.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  href="/tables/new"
                  className="bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display font-bold uppercase tracking-wide px-6 py-3 rounded-lg text-sm"
                >
                  Create a Table
                </Link>
                <Link
                  href="/tables"
                  className="border border-border text-muted-foreground hover:text-foreground hover:bg-secondary px-6 py-3 rounded-lg text-sm"
                >
                  View My Tables
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-6">
                Auto‑locks 15 minutes before kickoff.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -top-10 -left-8 w-32 h-32 rounded-full bg-seahawks-green/10 blur-3xl" />
              <div className="absolute -bottom-10 -right-8 w-40 h-40 rounded-full bg-patriots-red/10 blur-3xl" />

              <div className="bg-card/90 border border-border/60 rounded-2xl p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-semibold">
                  Featured stars
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="relative overflow-hidden rounded-xl border border-border/60">
                    <img
                      src="/images/drake_maye.webp"
                      alt="Drake Maye"
                      className="object-cover w-full h-[220px]"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-xs font-display font-bold text-white">
                        Drake Maye
                      </p>
                      <p className="text-[10px] text-white/80">QB • Patriots</p>
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-xl border border-border/60">
                    <img
                      src="/images/jsn-darnold.webp"
                      alt="Jaxon Smith-Njigba and Sam Darnold"
                      className="object-cover w-full h-[220px]"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-xs font-display font-bold text-white">
                        Jaxon Smith‑Njigba + Sam Darnold
                      </p>
                      <p className="text-[10px] text-white/80">
                        WR + QB • Seahawks
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-3">
                  Replace the player images by updating files in
                  <span className="text-foreground/70"> /public/images/</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-card/80 border border-border/60 rounded-2xl p-6 backdrop-blur">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-semibold">
                  Full grid preview
                </p>
                <p className="text-sm text-foreground font-display font-bold mt-1">
                  A live table looks like this when it’s packed.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Numbers auto‑reveal 5 minutes before kickoff.
              </p>
            </div>
            <MockSquaresGrid />
          </div>
        </div>
      </section>

      <footer className="text-center py-6 border-t border-border">
        <p className="text-muted-foreground text-xs">
          Super Bowl Squares Platform
        </p>
      </footer>
    </main>
  )
}
