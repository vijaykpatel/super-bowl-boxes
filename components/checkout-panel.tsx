"use client"

import { useGame } from "@/lib/game-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function CheckoutPanel({ pricePerBox }: { pricePerBox: number }) {
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
  const total = count * pricePerBox
  const totalLabel = `$${Number.isInteger(total) ? total : total.toFixed(2)}`

  if (tableLocked) {
    return (
      <div className="w-full">
        <div className="glass-panel gradient-border rounded-2xl p-5 sm:p-6 text-center">
          <p className="text-foreground font-display text-2xl sm:text-3xl uppercase tracking-tight">
            Table Locked
          </p>
          <p className="text-muted-foreground text-base sm:text-lg mt-1">
            New selections are paused for this table right now.
          </p>
        </div>
      </div>
    )
  }

  if (gamePhase === "submitted") {
    return (
      <div className="w-full">
        <div className="glass-panel rounded-2xl p-5 sm:p-6 text-center border border-pending/30">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-pending mx-auto mb-3"
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
          <p className="text-foreground font-display text-2xl sm:text-3xl uppercase tracking-tight">
            Squares Submitted!
          </p>
          <p className="text-muted-foreground text-base sm:text-lg mt-1">
            Your squares are pending confirmation. Please send payment to lock them in.
          </p>
        </div>
      </div>
    )
  }

  if (count === 0 && gamePhase === "selecting") {
    return (
      <div className="w-full text-center py-4">
        <p className="text-white/40 text-base sm:text-lg font-medium uppercase tracking-wider">
          Tap any available square above to get started
        </p>
      </div>
    )
  }

  if (gamePhase === "checkout") {
    return (
      <div className="w-full">
        <div className="glass-panel gradient-border rounded-2xl p-5 sm:p-6">
          <h3 className="font-display text-3xl sm:text-4xl text-foreground uppercase tracking-tight mb-1">
            Claim Your Squares
          </h3>
          <p className="text-muted-foreground text-base sm:text-lg mb-4">
            You selected{" "}
            <span className="text-seahawks-green font-display text-xl">{count}</span>{" "}
            {count === 1 ? "square" : "squares"},{" "}
            total of{" "}
            <span className="text-seahawks-green font-display text-xl">{totalLabel}</span>.
          </p>

          <div className="bg-pending/10 border border-pending/20 rounded-xl p-3 sm:p-4 mb-5">
            <p className="text-pending text-sm sm:text-base font-medium">
              Your squares will be held as PENDING until payment is confirmed.
            </p>
            <p className="text-white/70 text-sm sm:text-base mt-2">
              Payment must be made to{" "}
              <span className="text-white/85">Vijay</span> via Zelle to his phone number or Venmo:{" "}
              <a
                href="https://venmo.com/u/vijay_patel"
                target="_blank"
                rel="noreferrer"
                className="text-sb-cyan/90 hover:text-sb-cyan underline-offset-4 hover:underline"
              >
                @vijay_patel
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.1] text-foreground placeholder:text-muted-foreground h-13 text-base sm:text-lg rounded-xl focus:border-sb-cyan/50 focus:ring-sb-cyan/20"
              autoFocus
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={clearSelection}
                className="flex-1 h-13 border border-white/[0.1] text-foreground hover:text-foreground bg-transparent hover:bg-white/[0.05] rounded-xl text-base sm:text-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={submitSelection}
                disabled={!playerName.trim()}
                className={cn(
                  "flex-1 h-13 font-display uppercase tracking-wider text-base sm:text-lg rounded-xl transition-all",
                  playerName.trim()
                    ? "bg-sb-cyan hover:bg-sb-cyan/90 text-white hover:scale-[1.02] shadow-[0_0_20px_hsla(190,100%,50%,0.2)]"
                    : "bg-white/[0.06] text-muted-foreground"
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
    <div className="w-full">
      <div className="glass-panel gradient-border rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-foreground font-display text-2xl sm:text-3xl uppercase tracking-tight">
            <span className="text-seahawks-green">{count}</span>{" "}
            {count === 1 ? "square" : "squares"} selected
          </p>
          <p className="text-muted-foreground text-sm sm:text-base mt-0.5">
            Tap more or continue to checkout
          </p>
          <p className="text-white/50 text-sm sm:text-base mt-1">
            Approval requires payment to{" "}
            <span className="text-white/75">Vijay Patel</span> on Venmo{" "}
            <a
              href="https://venmo.com/u/vijay_patel"
              target="_blank"
              rel="noreferrer"
              className="text-sb-cyan/80 hover:text-sb-cyan underline-offset-4 hover:underline"
            >
              @vijay_patel
            </a>{" "}
            or Zelle at Vijay's phone number.
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={clearSelection}
            className="border border-white/[0.1] text-foreground hover:text-foreground bg-transparent hover:bg-white/[0.05] h-11 sm:h-12 px-4 rounded-xl text-base"
          >
            Clear
          </Button>
          <Button
            onClick={() => setGamePhase("checkout")}
            className="bg-sb-cyan hover:bg-sb-cyan/90 text-white font-display uppercase tracking-wider h-11 sm:h-12 px-5 sm:px-6 rounded-xl text-base hover:scale-[1.02] transition-all shadow-[0_0_20px_hsla(190,100%,50%,0.2)]"
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}
