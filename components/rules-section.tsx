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
    title: "Enter Your Name",
    description:
      "After selecting your squares, hit checkout and enter your name to claim them.",
  },
  {
    step: "3",
    title: "Numbers Get Assigned",
    description:
      "1 hour before kickoff, random numbers (0-9) are assigned to each row and column.",
  },
  {
    step: "4",
    title: "Win Each Quarter",
    description:
      "At the end of each quarter, match the last digit of each team's score to your square. If it matches, you win!",
  },
]

export function RulesSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full max-w-2xl mx-auto">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg hover:bg-secondary/50 transition-colors min-h-[48px]"
      >
        <span className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
          How It Works
        </span>
        <svg
          className={cn(
            "w-5 h-5 text-muted-foreground transition-transform duration-200",
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
        <div className="mt-2 bg-card border border-border rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rules.map((rule) => (
              <div key={rule.step} className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-patriots-red/20 border border-patriots-red/30 flex items-center justify-center">
                  <span className="font-display text-sm font-bold text-patriots-red">
                    {rule.step}
                  </span>
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">
                    {rule.title}
                  </h4>
                  <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
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
