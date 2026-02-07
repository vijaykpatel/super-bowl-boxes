"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function TableAccessGuard({
  requiredCode,
  children,
}: {
  requiredCode: string
  children: React.ReactNode
}) {
  const [code, setCode] = useState("")
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState("")

  if (unlocked) return <>{children}</>

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md text-center">
        <h2 className="font-display text-xl font-bold text-foreground">
          Enter Table Code
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          This table requires a 6‑digit code to join.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6-digit code"
            className="bg-secondary border-border text-foreground text-center tracking-widest"
          />
          <Button
            onClick={() => {
              if (code.trim() === requiredCode) {
                setUnlocked(true)
                setError("")
              } else {
                setError("That code doesn’t match.")
              }
            }}
            className="bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display font-bold uppercase tracking-wide"
          >
            Unlock Table
          </Button>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </div>
    </div>
  )
}
