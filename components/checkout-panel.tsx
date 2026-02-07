"use client"

import { useGame } from "@/lib/game-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function CheckoutPanel() {
  const {
    selectedBoxIds,
    playerName,
    setPlayerName,
    gamePhase,
    setGamePhase,
    submitSelection,
    clearSelection,
    tableLocked,
  } = useGame()

  const count = selectedBoxIds.size

  if (tableLocked) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-card/90 border-2 border-border/80 rounded-xl p-6 text-center backdrop-blur-xl">
          <p className="text-foreground font-display text-xl sm:text-2xl uppercase tracking-tight">
            Table Locked
          </p>
          <p className="text-muted-foreground text-base sm:text-lg mt-2">
            New selections are paused for this table right now.
          </p>
        </div>
      </div>
    )
  }

  if (gamePhase === "submitted") {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-pending/15 border-2 border-pending/40 rounded-xl p-6 text-center backdrop-blur-xl">
          <svg
            className="w-12 h-12 text-pending mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-foreground font-display text-xl sm:text-2xl uppercase tracking-tight">
            Squares Submitted!
          </p>
          <p className="text-muted-foreground text-base sm:text-lg mt-2">
            Your squares are pending confirmation. Please send payment to lock them in.
          </p>
        </div>
      </div>
    )
  }

  if (count === 0 && gamePhase === "selecting") {
    return (
      <div className="w-full max-w-lg mx-auto text-center py-4">
        <p className="text-muted-foreground text-base sm:text-lg">
          Tap on any available square above to get started
        </p>
      </div>
    )
  }

  if (gamePhase === "checkout") {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-card/90 border-2 border-border/80 rounded-xl p-6 backdrop-blur-xl shadow-xl">
          <h3 className="font-display text-2xl sm:text-3xl text-foreground uppercase tracking-tight mb-2">
            Claim Your Squares
          </h3>
          <p className="text-muted-foreground text-base sm:text-lg mb-5">
            You selected{" "}
            <span className="text-seahawks-green font-bold text-xl">{count}</span>{" "}
            {count === 1 ? "square" : "squares"}
          </p>

          <div className="bg-pending/15 border-2 border-pending/30 rounded-lg p-4 mb-5">
            <p className="text-pending text-sm sm:text-base font-medium">
              Your squares will be held as PENDING until payment is confirmed by the admin. Please send payment after submitting.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-secondary/80 border-2 border-border/80 text-foreground placeholder:text-muted-foreground h-14 text-base sm:text-lg rounded-xl"
              autoFocus
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={clearSelection}
                className="flex-1 h-14 border-2 border-border/80 text-foreground hover:text-foreground bg-transparent hover:bg-secondary rounded-xl text-base sm:text-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={submitSelection}
                disabled={!playerName.trim()}
                className={cn(
                  "flex-1 h-14 font-display uppercase tracking-wider text-base sm:text-lg rounded-xl shadow-lg transition-all",
                  playerName.trim()
                    ? "bg-seahawks-green hover:bg-seahawks-green/90 text-white hover:scale-105 hover:shadow-seahawks-green/30"
                    : "bg-muted text-muted-foreground"
                )}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // selecting phase with boxes selected
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-card/90 border-2 border-border/80 rounded-xl p-5 flex items-center justify-between gap-4 backdrop-blur-xl shadow-xl">
        <div>
          <p className="text-foreground font-display text-xl sm:text-2xl uppercase tracking-tight">
            <span className="text-seahawks-green">{count}</span>{" "}
            {count === 1 ? "square" : "squares"} selected
          </p>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Tap more squares or continue to checkout
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={clearSelection}
            className="border-2 border-border/80 text-foreground hover:text-foreground bg-transparent hover:bg-secondary h-12 px-4 rounded-xl text-base"
          >
            Clear
          </Button>
          <Button
            onClick={() => setGamePhase("checkout")}
            className="bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display uppercase tracking-wider h-12 px-5 rounded-xl text-base shadow-lg hover:scale-105 transition-all"
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}
