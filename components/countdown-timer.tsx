"use client"

import { useState, useEffect } from "react"
import { useGame } from "@/lib/game-context"

// Fallback reveal time for demo/local mode
const REVEAL_TIME = new Date("2026-02-08T22:30:00Z")

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-secondary/80 border-2 border-border/80 rounded-xl w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center shadow-lg">
        <span className="font-display text-2xl sm:text-4xl text-foreground tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs sm:text-base text-muted-foreground uppercase tracking-wider mt-2 font-semibold">
        {label}
      </span>
    </div>
  )
}

export function CountdownTimer({
  revealAt,
  showRevealButton = false,
}: {
  revealAt?: number
  showRevealButton?: boolean
}) {
  const { numbersRevealed, revealNumbers } = useGame()
  const target = revealAt ? new Date(revealAt) : REVEAL_TIME
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    getTimeLeft(target)
  )
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const tl = getTimeLeft(target)
      if (!tl) {
        setIsExpired(true)
        clearInterval(interval)
      } else {
        setTimeLeft(tl)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [target])

  if (numbersRevealed) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-3 bg-seahawks-green/20 border-2 border-seahawks-green/40 rounded-full px-6 py-3 shadow-lg">
          <div className="w-3 h-3 rounded-full bg-seahawks-green animate-pulse" />
          <span className="text-seahawks-green font-display text-base sm:text-lg uppercase tracking-wider">
            Numbers Revealed - Game On!
          </span>
        </div>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div className="text-center">
        <p className="text-foreground font-display text-xl sm:text-2xl uppercase tracking-tight mb-5">
          Numbers are ready to be revealed!
        </p>
        {showRevealButton ? (
          <button
            type="button"
            onClick={revealNumbers}
            className="bg-patriots-red hover:bg-patriots-red/90 text-white font-display uppercase tracking-wider px-10 py-4 rounded-xl text-base sm:text-lg transition-all hover:scale-105 shadow-lg"
          >
            Reveal Numbers
          </button>
        ) : (
          <p className="text-muted-foreground text-base sm:text-lg">
            Numbers will appear automatically shortly.
          </p>
        )}
      </div>
    )
  }

  if (!timeLeft) return null

  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm sm:text-base uppercase tracking-[0.2em] mb-5 font-bold">
        Numbers reveal in
      </p>
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <TimeBlock value={timeLeft.days} label="Days" />
        <span className="text-muted-foreground text-2xl sm:text-3xl font-bold mt-[-20px]">
          :
        </span>
        <TimeBlock value={timeLeft.hours} label="Hrs" />
        <span className="text-muted-foreground text-2xl sm:text-3xl font-bold mt-[-20px]">
          :
        </span>
        <TimeBlock value={timeLeft.minutes} label="Min" />
        <span className="text-muted-foreground text-2xl sm:text-3xl font-bold mt-[-20px]">
          :
        </span>
        <TimeBlock value={timeLeft.seconds} label="Sec" />
      </div>
    </div>
  )
}
