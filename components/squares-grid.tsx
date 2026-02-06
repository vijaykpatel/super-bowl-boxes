"use client"

import { useGame } from "@/lib/game-context"
import { cn } from "@/lib/utils"
import Image from "next/image"

function GridCell({
  id,
  owner,
  isInSelection,
  onClick,
}: {
  id: number
  owner: string | null
  isInSelection: boolean
  onClick: () => void
}) {
  const isTaken = !!owner

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isTaken}
      aria-label={
        isTaken
          ? `Square ${id + 1} taken by ${owner}`
          : isInSelection
            ? `Square ${id + 1} selected, tap to deselect`
            : `Square ${id + 1} available, tap to select`
      }
      className={cn(
        "relative flex items-center justify-center aspect-square min-h-[44px] min-w-[44px] transition-all duration-200 text-[10px] sm:text-xs font-medium border border-border/50 rounded-sm",
        isTaken &&
          "bg-patriots-red/20 text-foreground cursor-not-allowed border-patriots-red/30",
        isInSelection &&
          "bg-seahawks-green/30 border-seahawks-green ring-1 ring-seahawks-green animate-pulse-green",
        !isTaken &&
          !isInSelection &&
          "bg-secondary/50 hover:bg-secondary hover:border-muted-foreground/40 cursor-pointer active:scale-95"
      )}
    >
      {isTaken && (
        <span className="truncate px-0.5 leading-tight text-foreground/80">
          {owner}
        </span>
      )}
      {isInSelection && (
        <svg
          className="w-3 h-3 sm:w-4 sm:h-4 text-seahawks-green"
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
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-[360px] max-w-[680px] mx-auto">
        {/* Column headers - Patriots side */}
        <div className="flex items-end mb-1 pl-10 sm:pl-14">
          <div className="flex items-center gap-1 mb-1 w-full justify-center">
            <Image
              src="/images/patriots-logo.jpg"
              alt="New England Patriots"
              width={24}
              height={24}
              className="rounded-full w-5 h-5 sm:w-6 sm:h-6 object-cover"
            />
            <span className="font-display text-xs sm:text-sm uppercase tracking-wider text-patriots-red font-bold">
              Patriots
            </span>
          </div>
        </div>

        <div className="flex items-end mb-0.5 pl-10 sm:pl-14">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`col-${i}`}
              className="flex-1 text-center text-xs sm:text-sm font-display font-bold text-patriots-red/80"
            >
              {numbersRevealed && colNumbers ? colNumbers[i] : "?"}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Row headers - Seahawks side */}
          <div className="flex flex-col w-10 sm:w-14 shrink-0">
            <div className="flex items-center gap-0.5 mb-1 justify-center">
              <Image
                src="/images/seahawks-logo.jpg"
                alt="Seattle Seahawks"
                width={24}
                height={24}
                className="rounded-full w-5 h-5 sm:w-6 sm:h-6 object-cover"
              />
            </div>
            <span className="font-display text-[10px] sm:text-xs uppercase tracking-wider text-seahawks-green font-bold text-center mb-1">
              SEA
            </span>
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`row-${i}`}
                className="flex-1 flex items-center justify-center text-xs sm:text-sm font-display font-bold text-seahawks-green/80"
              >
                {numbersRevealed && rowNumbers ? rowNumbers[i] : "?"}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 grid grid-cols-10 gap-px bg-border/30 rounded-md overflow-hidden border border-border/50">
            {boxes.map((box) => (
              <GridCell
                key={box.id}
                id={box.id}
                owner={box.owner}
                isInSelection={selectedBoxIds.has(box.id)}
                onClick={() => toggleBox(box.id)}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-secondary/50 border border-border/50" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-seahawks-green/30 border border-seahawks-green" />
            <span>Your pick</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-patriots-red/20 border border-patriots-red/30" />
            <span>Taken</span>
          </div>
        </div>
      </div>
    </div>
  )
}
