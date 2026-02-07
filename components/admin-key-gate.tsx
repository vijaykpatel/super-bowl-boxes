"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AdminKeyGate({
  code,
  onUnlock,
}: {
  code: string
  onUnlock: (key: string) => void
}) {
  const [key, setKey] = useState("")
  const [error, setError] = useState("")

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-sm text-center">
        <h1 className="font-display text-xl font-black text-foreground uppercase tracking-tight">
          Admin Key Required
        </h1>
        <p className="text-muted-foreground text-xs mt-1">
          Enter the admin key for table {code}.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Admin key"
            className="bg-secondary border-border text-foreground"
          />
          <Button
            onClick={() => {
              if (!key.trim()) {
                setError("Enter the admin key.")
                return
              }
              setError("")
              window.localStorage.setItem(`admin_key_${code}`, key.trim())
              onUnlock(key.trim())
            }}
            className="bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display font-bold uppercase tracking-wide"
          >
            Unlock Admin
          </Button>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </div>
    </main>
  )
}
