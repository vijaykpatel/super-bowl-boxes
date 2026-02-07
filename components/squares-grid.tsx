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
        "relative flex items-center justify-center aspect-square min-h-0 sm:min-h-[52px] sm:min-w-[52px] transition-all duration-200 text-[10px] sm:text-sm font-semibold border sm:border-2 rounded-md sm:rounded-lg",
        isConfirmed &&
          "bg-patriots-red/25 text-foreground cursor-not-allowed border-patriots-red/40 shadow-sm",
        isPending &&
          "bg-pending/20 text-foreground cursor-not-allowed border-pending/50 animate-pulse-pending shadow-sm",
        isInSelection &&
          "bg-seahawks-green/35 border-seahawks-green ring-2 ring-seahawks-green/50 animate-pulse-green shadow-lg",
        !isTaken &&
          !isInSelection &&
          "bg-secondary/60 hover:bg-secondary/80 hover:border-muted-foreground/50 cursor-pointer active:scale-95 border-border/60"
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
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[320px] max-w-[760px] mx-auto">
        {/* Column headers - Patriots side */}
        <div className="flex items-end mb-2 pl-12 sm:pl-16">
          <div className="flex items-center gap-2 mb-2 w-full justify-center">
            <Image
              src="/images/patriots-logo.jpg"
              alt="New England Patriots"
              width={32}
              height={32}
              className="rounded-full w-6 h-6 sm:w-8 sm:h-8 object-cover border-2 border-patriots-red/50"
            />
            <span className="font-display text-base sm:text-lg uppercase tracking-[0.15em] text-patriots-red">
              Patriots
            </span>
          </div>
        </div>

        <div className="flex items-end mb-1 pl-12 sm:pl-16">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`col-${i}`}
              className="flex-1 text-center text-sm sm:text-base font-display text-patriots-red/90"
            >
              {numbersRevealed && colNumbers ? colNumbers[i] : "?"}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Row headers - Seahawks side */}
          <div className="flex flex-col w-12 sm:w-16 shrink-0">
            <div className="flex items-center gap-1 mb-2 justify-center">
              <Image
                src="/images/seahawks-logo.jpg"
                alt="Seattle Seahawks"
                width={32}
                height={32}
                className="rounded-full w-6 h-6 sm:w-8 sm:h-8 object-cover border-2 border-seahawks-green/50"
              />
            </div>
            <span className="font-display text-xs sm:text-sm uppercase tracking-[0.15em] text-seahawks-green text-center mb-2 -rotate-90 origin-center translate-y-[140px]">
              Seahawks
            </span>
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`row-${i}`}
                className="flex-1 flex items-center justify-center text-xs sm:text-base font-display text-seahawks-green/90 min-h-[28px] sm:min-h-[52px]"
              >
                {numbersRevealed && rowNumbers ? rowNumbers[i] : "?"}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 grid grid-cols-10 gap-1 bg-border/50 rounded-2xl overflow-hidden border-2 border-border/70 p-1 shadow-2xl">
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

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-sm sm:text-base text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-secondary/60 border-2 border-border/60" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-seahawks-green/35 border-2 border-seahawks-green" />
            <span>Your pick</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-pending/20 border-2 border-pending/50" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-patriots-red/25 border-2 border-patriots-red/40" />
            <span>Confirmed</span>
          </div>
        </div>
      </div>
    </div>
  )
}
