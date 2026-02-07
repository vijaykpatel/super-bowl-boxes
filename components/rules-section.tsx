"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const rules = [
  {
    step: "1",
    title: "Pick Your Squares",
    description:
      "Tap any available square on the 10x10 grid. You can select as many as you want.",
  },
  {
    step: "2",
    title: "Enter Your Name & Submit",
    description:
      "After selecting your squares, hit checkout and enter your name. Your squares will be held as PENDING.",
  },
  {
    step: "3",
    title: "Send Payment",
    description:
      "Send payment to confirm your squares. Once the admin verifies payment, your squares turn from yellow (pending) to red (confirmed).",
  },
  {
    step: "4",
    title: "Table Locks Before Kickoff",
    description:
      "The table locks 15 minutes before kickoff so no new squares can be claimed.",
  },
  {
    step: "5",
    title: "Numbers Get Assigned",
    description:
      "5 minutes before kickoff, random numbers (0-9) are assigned to each row and column.",
  },
  {
    step: "6",
    title: "Win Each Quarter",
    description:
      "At the end of each quarter, match the last digit of each team's score to your square. If it matches, you win!",
  },
]

export function RulesSection({ customRules }: { customRules?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 glass-panel rounded-xl sm:rounded-2xl hover:bg-white/[0.03] transition-all group"
      >
        <span className="font-display text-lg sm:text-xl uppercase tracking-[0.15em] text-foreground">
          How It Works
        </span>
        <svg
          className={cn(
            "w-5 h-5 sm:w-6 sm:h-6 text-white/30 transition-transform duration-300 group-hover:text-white/50",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-3 glass-panel rounded-xl sm:rounded-2xl p-5 sm:p-8">
          <div className="flex flex-col gap-6">
            {customRules && (
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 text-sm sm:text-base text-muted-foreground whitespace-pre-wrap">
                {customRules}
              </div>
            )}
            {rules.map((rule) => (
              <div key={rule.step} className="flex gap-4">
                <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-sb-cyan/10 border border-sb-cyan/25 flex items-center justify-center">
                  <span className="font-display text-sm sm:text-base text-sb-cyan">
                    {rule.step}
                  </span>
                </div>
                <div className="pt-0.5">
                  <h4 className="font-display text-base sm:text-lg text-foreground uppercase tracking-tight mb-1">
                    {rule.title}
                  </h4>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
