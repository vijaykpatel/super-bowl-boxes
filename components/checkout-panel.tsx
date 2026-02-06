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
    confirmSelection,
    clearSelection,
  } = useGame()

  const count = selectedBoxIds.size

  if (gamePhase === "confirmed") {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-seahawks-green/20 border border-seahawks-green/40 rounded-lg p-4 text-center">
          <svg
            className="w-8 h-8 text-seahawks-green mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="text-foreground font-display text-lg font-bold">
            Squares Claimed!
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Your squares have been locked in. Good luck!
          </p>
        </div>
      </div>
    )
  }

  if (count === 0 && gamePhase === "selecting") {
    return (
      <div className="w-full max-w-md mx-auto text-center py-3">
        <p className="text-muted-foreground text-sm">
          Tap on any available square above to get started
        </p>
      </div>
    )
  }

  if (gamePhase === "checkout") {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-display text-lg font-bold text-foreground mb-1">
            Claim Your Squares
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            You selected{" "}
            <span className="text-seahawks-green font-bold">{count}</span>{" "}
            {count === 1 ? "square" : "squares"}
          </p>

          <div className="flex flex-col gap-3">
            <Input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-12 text-base"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearSelection}
                className="flex-1 h-12 border-border text-muted-foreground hover:text-foreground bg-transparent hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmSelection}
                disabled={!playerName.trim()}
                className={cn(
                  "flex-1 h-12 font-display font-bold uppercase tracking-wide text-sm",
                  playerName.trim()
                    ? "bg-seahawks-green hover:bg-seahawks-green/90 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                Lock It In
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // selecting phase with boxes selected
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-foreground font-display font-bold">
            <span className="text-seahawks-green">{count}</span>{" "}
            {count === 1 ? "square" : "squares"} selected
          </p>
          <p className="text-muted-foreground text-xs mt-0.5">
            Tap more squares or continue to checkout
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={clearSelection}
            className="border-border text-muted-foreground hover:text-foreground bg-transparent hover:bg-secondary h-10 px-3"
          >
            Clear
          </Button>
          <Button
            size="sm"
            onClick={() => setGamePhase("checkout")}
            className="bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display font-bold uppercase tracking-wide h-10 px-4"
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}
