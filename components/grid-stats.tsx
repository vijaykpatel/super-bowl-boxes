"use client"

import { useGame } from "@/lib/game-context"

export function GridStats() {
  const { boxes } = useGame()

  const confirmed = boxes.filter((b) => b.status === "confirmed").length
  const pending = boxes.filter((b) => b.status === "pending").length
  const available = boxes.filter((b) => b.status === "available").length
  const claimedPercent = confirmed + pending

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground text-xs sm:text-sm font-medium">
          <span className="text-seahawks-green font-bold">{available}</span>{" "}
          available
        </span>
        <div className="flex items-center gap-3">
          {pending > 0 && (
            <span className="text-muted-foreground text-xs sm:text-sm font-medium">
              <span className="text-pending font-bold">{pending}</span>{" "}
              pending
            </span>
          )}
          <span className="text-muted-foreground text-xs sm:text-sm font-medium">
            <span className="text-patriots-red font-bold">{confirmed}</span>{" "}
            confirmed
          </span>
        </div>
      </div>
      {/* Progress bar */}
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden flex">
        <div
          className="h-full bg-patriots-red rounded-l-full transition-all duration-500"
          style={{ width: `${confirmed}%` }}
        />
        <div
          className="h-full bg-pending transition-all duration-500"
          style={{ width: `${pending}%` }}
        />
      </div>
    </div>
  )
}
