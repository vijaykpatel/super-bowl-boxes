"use client"

import { useGame } from "@/lib/game-context"

export function GridStats() {
  const { boxes } = useGame()

  const confirmed = boxes.filter((b) => b.status === "confirmed").length
  const pending = boxes.filter((b) => b.status === "pending").length
  const available = boxes.filter((b) => b.status === "available").length
  const claimedPercent = confirmed + pending

  return (
    <div className="w-full max-w-[900px] mx-auto">
      <div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm bg-seahawks-green/50 border border-seahawks-green" />
            <span className="text-xs sm:text-base text-white/50">
              <span className="text-seahawks-green font-display text-sm sm:text-xl">{available}</span>
              <span className="ml-0.5 sm:ml-1">open</span>
            </span>
          </div>
          {pending > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm bg-pending/30 border border-pending/60" />
              <span className="text-xs sm:text-base text-white/50">
                <span className="text-pending font-display text-sm sm:text-xl">{pending}</span>
                <span className="ml-0.5 sm:ml-1">pending</span>
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm bg-patriots-red/30 border border-patriots-red/60" />
            <span className="text-xs sm:text-base text-white/50">
              <span className="text-patriots-red font-display text-sm sm:text-xl">{confirmed}</span>
              <span className="ml-0.5 sm:ml-1">locked</span>
            </span>
          </div>
        </div>
        <span className="font-display text-sm sm:text-lg text-white/30">{claimedPercent}%</span>
      </div>
      {/* Progress bar */}
      <div className="w-full h-1.5 sm:h-2 bg-white/[0.04] rounded-full overflow-hidden flex">
        <div
          className="h-full bg-gradient-to-r from-patriots-red/80 to-patriots-red/60 transition-all duration-700 ease-out"
          style={{ width: `${confirmed}%` }}
        />
        <div
          className="h-full bg-gradient-to-r from-pending/70 to-pending/50 transition-all duration-700 ease-out"
          style={{ width: `${pending}%` }}
        />
      </div>
    </div>
  )
}
