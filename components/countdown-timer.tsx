"use client"

import { useState, useEffect } from "react"
import { useGame } from "@/lib/game-context"

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
    <div className="flex flex-col items-center gap-2 sm:gap-2.5">
      <div className="countdown-block rounded-lg sm:rounded-xl lg:rounded-2xl w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        <span className="font-display text-3xl sm:text-5xl lg:text-7xl text-white tabular-nums relative">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] sm:text-xs lg:text-sm text-white/40 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium">
        {label}
      </span>
    </div>
  )
}

function Separator() {
  return (
    <div className="flex flex-col items-center justify-center h-16 sm:h-24 lg:h-32 px-1">
      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-sb-cyan/60 mb-2 sm:mb-3 lg:mb-4" />
      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-sb-cyan/60" />
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
        <div className="inline-flex items-center gap-3 bg-seahawks-green/10 border border-seahawks-green/30 rounded-full px-6 sm:px-8 py-3 sm:py-4">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-seahawks-green" />
            <div className="w-3 h-3 rounded-full bg-seahawks-green animate-ping absolute inset-0" />
          </div>
          <span className="text-seahawks-green font-display text-base sm:text-xl uppercase tracking-[0.2em]">
            Numbers Revealed — Game On!
          </span>
        </div>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div className="text-center">
        <p className="text-foreground font-display text-2xl sm:text-3xl uppercase tracking-tight mb-6">
          Numbers are ready to be revealed!
        </p>
        {showRevealButton ? (
          <button
            type="button"
            onClick={revealNumbers}
            className="bg-sb-cyan hover:bg-sb-cyan/90 text-white font-display uppercase tracking-wider px-10 py-4 rounded-xl text-base sm:text-lg transition-all hover:scale-105 shadow-[0_0_30px_hsla(190,100%,50%,0.3)]"
          >
            Reveal Numbers
          </button>
        ) : (
          <p className="text-muted-foreground text-base">
            Numbers will appear automatically shortly.
          </p>
        )}
      </div>
    )
  }

  if (!timeLeft) return null

  return (
    <div className="text-center">
      <p className="text-white/40 text-sm sm:text-base uppercase tracking-[0.3em] mb-6 sm:mb-8 font-medium">
        Numbers reveal in
      </p>
      <div className="flex items-start justify-center gap-2 sm:gap-3 lg:gap-4">
        <TimeBlock value={timeLeft.days} label="Days" />
        <Separator />
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <Separator />
        <TimeBlock value={timeLeft.minutes} label="Min" />
        <Separator />
        <TimeBlock value={timeLeft.seconds} label="Sec" />
      </div>
    </div>
  )
}
