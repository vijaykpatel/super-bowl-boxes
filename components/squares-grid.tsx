"use client"

import React from "react"
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
        "relative flex items-center justify-center aspect-square transition-all duration-150 text-[7px] sm:text-[9px] lg:text-xs font-semibold rounded border sm:rounded-md lg:rounded-lg",
        isConfirmed &&
          "bg-patriots-red/25 text-foreground cursor-not-allowed border-patriots-red/40",
        isPending &&
          "bg-pending/20 text-foreground cursor-not-allowed border-pending/50 animate-pulse-pending",
        isInSelection &&
          "bg-seahawks-green/30 border-seahawks-green ring-1 ring-seahawks-green/50 animate-pulse-green",
        !isTaken &&
          !isInSelection &&
          "bg-white/[0.03] hover:bg-white/[0.1] hover:border-white/[0.15] border-white/[0.06] cursor-pointer active:scale-95 transition-colors"
      )}
    >
      {isConfirmed && (
        <span className="truncate px-0.5 leading-tight text-foreground/80 font-medium">
          {owner}
        </span>
      )}
      {isPending && (
        <div className="flex flex-col items-center gap-0.5">
          <svg
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 text-pending"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.828a1 1 0 101.415-1.414L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="truncate px-0.5 leading-tight text-pending font-medium text-[6px] sm:text-[8px] lg:text-[10px]">
            {owner}
          </span>
        </div>
      )}
      {isInSelection && (
        <svg
          className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-seahawks-green drop-shadow-[0_0_6px_hsla(152,85%,45%,0.5)]"
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
    <div className="w-full max-w-[900px] mx-auto grid-shell rounded-2xl sm:rounded-3xl p-3 sm:p-5 lg:p-8">
      {/* Top: Patriots header centered over grid columns */}
      <div className="flex">
        {/* Spacer matching left columns (branding + numbers) */}
        <div className="shrink-0 w-[56px] sm:w-[96px] lg:w-[112px]" />
        {/* Patriots header */}
        <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 pb-2 sm:pb-4">
          <span className="font-display text-sm sm:text-xl lg:text-2xl uppercase tracking-[0.2em] text-patriots-red/90 font-bold">
            Patriots
          </span>
        </div>
      </div>

      {/* Column numbers row */}
      <div className="flex">
        <div className="shrink-0 w-[56px] sm:w-[96px] lg:w-[112px]" />
        <div className="flex-1 grid grid-cols-10 gap-[3px] sm:gap-1.5 lg:gap-2 mb-[3px] sm:mb-1.5 lg:mb-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`col-${i}`} className="flex items-center justify-center">
              <span className="text-xs sm:text-base lg:text-lg font-display text-patriots-red tabular-nums font-bold">
                {numbersRevealed && colNumbers ? colNumbers[i] : "?"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main grid area */}
      <div className="flex">
        {/* Left: Seahawks branding (logo + vertical name) then row numbers */}
        <div className="shrink-0 flex">
          {/* Seahawks branding column — logo + vertical text, centered vertically */}
          <div className="flex flex-col items-center justify-center w-8 sm:w-12 lg:w-14 mr-1 sm:mr-2">
            <div className="flex flex-col items-center gap-0 leading-none">
              {"SEAHAWKS".split("").map((letter, i) => (
                <span key={i} className="font-display text-base sm:text-2xl lg:text-3xl text-seahawks-green/90 font-bold">
                  {letter}
                </span>
              ))}
            </div>
          </div>

          {/* Row numbers column */}
          <div className="grid grid-rows-[repeat(10,1fr)] gap-[3px] sm:gap-1.5 lg:gap-2 w-5 sm:w-8 lg:w-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`row-${i}`}
                className="flex items-center justify-center aspect-square"
              >
                <span className="text-sm sm:text-lg lg:text-xl font-display text-seahawks-green tabular-nums font-bold">
                  {numbersRevealed && rowNumbers ? rowNumbers[i] : "?"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 10x10 Grid */}
        <div className="flex-1 grid grid-cols-10 gap-[3px] sm:gap-1.5 lg:gap-2 ml-[3px] sm:ml-1.5 lg:ml-2">
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
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-white/[0.06] text-sm sm:text-base lg:text-lg text-white/40">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-white/[0.03] border border-white/[0.06]" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-seahawks-green/30 border border-seahawks-green" />
          <span>Your pick</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-pending/20 border border-pending/50" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-patriots-red/25 border border-patriots-red/40" />
          <span>Confirmed</span>
        </div>
      </div>
    </div>
  )
}
