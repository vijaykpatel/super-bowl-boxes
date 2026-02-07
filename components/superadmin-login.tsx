"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SuperadminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError("")
    setLoading(true)
    const res = await fetch("/api/superadmin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (!res.ok) {
      setError("Invalid password")
      return
    }
    window.location.reload()
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-sm text-center">
        <h1 className="font-display text-xl font-black text-foreground uppercase tracking-tight">
          Superadmin Access
        </h1>
        <p className="text-muted-foreground text-xs mt-1">
          Enter the superadmin password to continue.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-secondary border-border text-foreground"
          />
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display font-bold uppercase tracking-wide"
          >
            {loading ? "Checking..." : "Unlock"}
          </Button>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </div>
    </main>
  )
}
