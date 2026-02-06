"use client"

import { useGame } from "@/lib/game-context"

export function GridStats() {
  const { boxes } = useGame()

  const taken = boxes.filter((b) => b.owner).length
  const available = 100 - taken
  const percentage = taken

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground text-xs sm:text-sm font-medium">
          <span className="text-seahawks-green font-bold">{available}</span>{" "}
          squares available
        </span>
        <span className="text-muted-foreground text-xs sm:text-sm font-medium">
          <span className="text-patriots-red font-bold">{taken}</span>/100
          claimed
        </span>
      </div>
      {/* Progress bar */}
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-patriots-red to-patriots-red/70 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
