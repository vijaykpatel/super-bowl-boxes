"use client"

import { useEffect, useState } from "react"
import { ServerGameProvider } from "@/lib/game-context"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type AdminPayload = {
  table: {
    name: string
    kickoffAt: number
    lock: { status: "open" | "locked"; reason?: "auto" }
  }
  state: {
    boxes: any[]
    rowNumbers: number[] | null
    colNumbers: number[] | null
    numbersRevealed: boolean
    updatedAt: number
  }
}

export function AdminPageClient() {
  const [data, setData] = useState<AdminPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminPassword, setAdminPassword] = useState("")
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/state`, { cache: "no-store" })
      if (!res.ok) {
        setLoading(false)
        return
      }
      const json = await res.json()
      setData(json)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading admin...
      </div>
    )
  }

  if (!unlocked) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md text-center">
          <h2 className="font-display text-xl font-bold text-foreground">
            Admin Access
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Enter your admin password to continue.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <Input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Admin password"
              className="bg-secondary border-border text-foreground text-center"
            />
            <Button
              onClick={() => {
                if (!adminPassword.trim()) return
                setUnlocked(true)
              }}
              className="bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display font-bold uppercase tracking-wide"
            >
              Unlock Admin
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <ServerGameProvider initialState={data.state} initialLock={data.table.lock} adminPassword={adminPassword}>
      <AdminDashboard
        tableName={data.table.name}
        kickoffAt={data.table.kickoffAt}
      />
    </ServerGameProvider>
  )
}
