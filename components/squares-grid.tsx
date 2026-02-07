"use client"

import { useGame } from "@/lib/game-context"
import type { BoxStatus } from "@/lib/game-types"
import { cn } from "@/lib/utils"
import Image from "next/image"

function GridCell({
  id,
  owner,
  status,
  isInSelection,
  onClick,
}: {
  id: number
  owner: string | null
  status: BoxStatus
  isInSelection: boolean
  onClick: () => void
}) {
  const isTaken = status !== "available"
  const isPending = status === "pending"
  const isConfirmed = status === "confirmed"

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isTaken}
      aria-label={
        isConfirmed
          ? `Square ${id + 1} confirmed by ${owner}`
          : isPending
            ? `Square ${id + 1} pending for ${owner}`
            : isInSelection
              ? `Square ${id + 1} selected, tap to deselect`
              : `Square ${id + 1} available, tap to select`
      }
      className={cn(
        "relative flex items-center justify-center aspect-square min-h-[42px] sm:min-h-[58px] transition-all duration-200 text-[10px] sm:text-sm font-semibold rounded-xl border",
        isConfirmed &&
          "bg-patriots-red/25 text-foreground cursor-not-allowed border-patriots-red/40 shadow-[0_0_18px_rgba(220,38,38,0.25)]",
        isPending &&
          "bg-pending/20 text-foreground cursor-not-allowed border-pending/50 animate-pulse-pending",
        isInSelection &&
          "bg-seahawks-green/30 border-seahawks-green ring-2 ring-seahawks-green/50 animate-pulse-green shadow-[0_0_24px_rgba(34,197,94,0.35)]",
        !isTaken &&
          !isInSelection &&
          "bg-white/5 hover:bg-white/10 border-white/10 cursor-pointer active:scale-95"
      )}
    >
      {isConfirmed && (
        <span className="truncate px-1 leading-tight text-foreground font-medium">
          {owner}
        </span>
      )}
      {isPending && (
        <div className="flex flex-col items-center gap-0.5">
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pending"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.828a1 1 0 101.415-1.414L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="truncate px-1 leading-tight text-pending font-medium text-[10px] sm:text-xs">
            {owner}
          </span>
        </div>
      )}
      {isInSelection && (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-seahawks-green"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  )
}

export function SquaresGrid() {
  const { boxes, selectedBoxIds, toggleBox, rowNumbers, colNumbers, numbersRevealed } = useGame()

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="min-w-[720px] max-w-[980px] mx-auto grid-shell rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-[96px_1fr] gap-4">
          <div />
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/images/patriots-logo.jpg"
              alt="New England Patriots"
              width={40}
              height={40}
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10 object-cover border-2 border-patriots-red/60 shadow-lg"
            />
            <span className="font-display text-lg sm:text-2xl uppercase tracking-[0.2em] text-patriots-red">
              Patriots
            </span>
          </div>

          <div />
          <div className="grid grid-cols-10 gap-2 text-center">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`col-${i}`}
                className="text-sm sm:text-base font-display text-patriots-red/90"
              >
                {numbersRevealed && colNumbers ? colNumbers[i] : "?"}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/seahawks-logo.jpg"
                alt="Seattle Seahawks"
                width={40}
                height={40}
                className="rounded-full w-8 h-8 sm:w-10 sm:h-10 object-cover border-2 border-seahawks-green/60 shadow-lg"
              />
            </div>
            <div
              className="font-display text-xs sm:text-sm uppercase tracking-[0.2em] text-seahawks-green"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              Seahawks
            </div>
            <div className="mt-5 grid grid-rows-10 gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`row-${i}`}
                  className="flex items-center justify-center text-xs sm:text-base font-display text-seahawks-green/90 min-h-[42px] sm:min-h-[58px]"
                >
                  {numbersRevealed && rowNumbers ? rowNumbers[i] : "?"}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-10 gap-2">
            {boxes.map((box) => (
              <GridCell
                key={box.id}
                id={box.id}
                owner={box.owner}
                status={box.status}
                isInSelection={selectedBoxIds.has(box.id)}
                onClick={() => toggleBox(box.id)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 mt-8 text-sm sm:text-base text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-white/5 border border-white/10" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-seahawks-green/30 border border-seahawks-green" />
            <span>Your pick</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-pending/20 border border-pending/50" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-patriots-red/25 border border-patriots-red/40" />
            <span>Confirmed</span>
          </div>
        </div>
      </div>
    </div>
  )
}
