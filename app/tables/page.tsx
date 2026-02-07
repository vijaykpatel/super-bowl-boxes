"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Table = {
  id: string
  code: string
  name: string
  adminKey: string
  pricePerBox: number
  payouts: { q1: number; q2: number; q3: number; final: number }
  visibility: "link" | "code"
  kickoffAt: number
  lock: { status: "open" | "locked" }
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [ownerEmail, setOwnerEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  useEffect(() => {
    const stored = window.localStorage.getItem("owner_email")
    if (stored) {
      setOwnerEmail(stored)
      fetchTables(stored)
    } else {
      setLoading(false)
    }
  }, [])

  const origin = useMemo(() => {
    if (typeof window === "undefined") return ""
    return window.location.origin
  }, [])

  const fetchTables = async (email: string) => {
    setEmailError("")
    if (!email.trim()) {
      setEmailError("Enter the email used to create tables.")
      return
    }
    setLoading(true)
    const res = await fetch(`/api/tables?ownerEmail=${encodeURIComponent(email)}`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      setTables(data.tables ?? [])
      window.localStorage.setItem("owner_email", email)
    } else {
      setTables([])
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-black text-foreground uppercase tracking-tight">
              My Tables
            </h1>
            <p className="text-muted-foreground text-xs">
              Create, share, and manage your Super Bowl Squares tables.
            </p>
          </div>
          <Link
            href="/tables/new"
            className="bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display font-bold uppercase tracking-wide px-4 py-2 rounded-lg text-xs"
          >
            New Table
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
            Find your tables
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <input
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder="Email used to create tables"
              className="flex-1 h-10 rounded-md border border-border bg-secondary px-3 text-sm text-foreground"
              type="email"
            />
            <Button
              onClick={() => fetchTables(ownerEmail)}
              className="bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display font-bold uppercase tracking-wide"
            >
              Load Tables
            </Button>
          </div>
          {emailError && <p className="text-xs text-destructive mt-2">{emailError}</p>}
        </div>

        {loading && (
          <p className="text-muted-foreground text-sm">Loading tables...</p>
        )}

        {!loading && tables.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <p className="text-foreground font-display text-lg font-bold">
              No tables yet
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Create your first table to share with friends.
            </p>
            <Link
              href="/tables/new"
              className="inline-flex mt-4 bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display font-bold uppercase tracking-wide px-4 py-2 rounded-lg text-xs"
            >
              Create a Table
            </Link>
          </div>
        )}

        <div className="grid gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {table.name}
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1">
                    ${table.pricePerBox} per box • Payouts Q1 ${table.payouts.q1},
                    Q2 ${table.payouts.q2}, Q3 ${table.payouts.q3}, Final $
                    {table.payouts.final}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {table.lock.status === "locked" ? "Locked" : "Open"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>Code: {table.code}</span>
                <span>Visibility: {table.visibility === "code" ? "Link + Code" : "Link"}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>Admin key: {table.adminKey}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/t/${table.code}`}
                  className="border border-border text-muted-foreground hover:text-foreground hover:bg-secondary px-3 py-2 rounded-md text-xs"
                >
                  Open Table
                </Link>
                <Link
                  href={`/t/${table.code}/admin`}
                  className="border border-border text-muted-foreground hover:text-foreground hover:bg-secondary px-3 py-2 rounded-md text-xs"
                >
                  Admin Panel
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!origin) return
                    navigator.clipboard.writeText(`${origin}/t/${table.code}`)
                  }}
                  className="border-border text-muted-foreground hover:text-foreground"
                >
                  Copy Share Link
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(table.adminKey)
                    window.localStorage.setItem(`admin_key_${table.code}`, table.adminKey)
                  }}
                  className="border-border text-muted-foreground hover:text-foreground"
                >
                  Copy Admin Key
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
