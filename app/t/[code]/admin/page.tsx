"use client"

import { useEffect, useState } from "react"
import { ServerGameProvider } from "@/lib/game-context"
import { AdminDashboard } from "@/components/admin-dashboard"
import { AdminKeyGate } from "@/components/admin-key-gate"

type AdminPayload = {
  table: {
    code: string
    name: string
    kickoffAt: number
    lock: { status: "open" | "locked"; reason?: "auto" | "manual" }
  }
  state: {
    boxes: any[]
    rowNumbers: number[] | null
    colNumbers: number[] | null
    numbersRevealed: boolean
    updatedAt: number
  }
}

export default function AdminPage({ params }: { params: { code: string } }) {
  const [data, setData] = useState<AdminPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminKey, setAdminKey] = useState<string | null>(null)

  useEffect(() => {
    const storedKey = window.localStorage.getItem(`admin_key_${params.code}`)
    if (storedKey) {
      setAdminKey(storedKey)
    }
    const fetchData = async () => {
      const res = await fetch(`/api/tables/${params.code}/state`, { cache: "no-store" })
      if (!res.ok) {
        setLoading(false)
        return
      }
      const json = await res.json()
      setData(json)
      setLoading(false)
    }
    fetchData()
  }, [params.code])

  if (!adminKey) {
    return (
      <AdminKeyGate
        code={params.code}
        onUnlock={(key) => setAdminKey(key)}
      />
    )
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading admin view...
      </div>
    )
  }

  return (
    <ServerGameProvider
      code={params.code}
      adminKey={adminKey}
      initialState={data.state}
      initialLock={data.table.lock}
    >
      <AdminDashboard
        tableCode={data.table.code}
        tableName={data.table.name}
        kickoffAt={data.table.kickoffAt}
      />
    </ServerGameProvider>
  )
}
