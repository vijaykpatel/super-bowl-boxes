"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Table = {
  id: string
  code: string
  name: string
  pricePerBox: number
  payouts: { q1: number; q2: number; q3: number; final: number }
  visibility: "link" | "code"
  accessCode?: string
  kickoffAt: number
  lock: { status: "open" | "locked" }
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [ownerEmail, setOwnerEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [adminKeys, setAdminKeys] = useState<Record<string, string>>({})

  useEffect(() => {
    const stored = window.localStorage.getItem("owner_email")
    if (stored) {
      setOwnerEmail(stored)
      fetchTables(stored)
    } else {
      setLoading(false)
    }
  }, [])

  // Load admin keys from localStorage when tables change
  useEffect(() => {
    const keys: Record<string, string> = {}
    for (const table of tables) {
      const key = window.localStorage.getItem(`admin_key_${table.code}`)
      if (key) keys[table.code] = key
    }
    setAdminKeys(keys)
  }, [tables])

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
    <main className="min-h-screen flex flex-col grain-overlay">
      <header className="border-b-2 border-border/80 bg-card/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase tracking-tight leading-none">
              My Tables
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mt-1">
              Create, share, and manage your Super Bowl Squares tables.
            </p>
          </div>
          <Link
            href="/tables/new"
            className="bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display uppercase tracking-wider px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl text-base sm:text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            New Table
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="bg-card/90 border-2 border-border/80 rounded-xl p-5 sm:p-6 mb-8 backdrop-blur-xl shadow-xl">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-bold mb-4">
            Find your tables
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <input
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder="Email used to create tables"
              className="flex-1 h-14 rounded-xl border-2 border-border/80 bg-secondary/80 px-4 text-base sm:text-lg text-foreground"
              type="email"
            />
            <Button
              onClick={() => fetchTables(ownerEmail)}
              className="bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display uppercase tracking-wider h-14 px-8 text-base sm:text-lg rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              Load Tables
            </Button>
          </div>
          {emailError && <p className="text-base text-destructive mt-3 font-medium">{emailError}</p>}
        </div>

        {loading && (
          <p className="text-muted-foreground text-lg">Loading tables...</p>
        )}

        {!loading && tables.length === 0 && (
          <div className="bg-card/90 border-2 border-border/80 rounded-xl p-8 sm:p-10 text-center backdrop-blur-xl shadow-xl">
            <p className="text-foreground font-display text-2xl sm:text-3xl uppercase tracking-tight">
              No tables yet
            </p>
            <p className="text-muted-foreground text-base sm:text-lg mt-3">
              Create your first table to share with friends.
            </p>
            <Link
              href="/tables/new"
              className="inline-flex mt-6 bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display uppercase tracking-wider px-8 py-4 rounded-xl text-base sm:text-lg shadow-lg hover:scale-105 transition-all"
            >
              Create a Table
            </Link>
          </div>
        )}

        <div className="grid gap-6">
          {tables.map((table) => (
            <div
              key={table.id}
              className="bg-card/90 border-2 border-border/80 rounded-xl p-5 sm:p-6 flex flex-col gap-5 backdrop-blur-xl shadow-xl"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl text-foreground uppercase tracking-tight">
                    {table.name}
                  </h3>
                  <p className="text-muted-foreground text-base sm:text-lg mt-2">
                    ${table.pricePerBox} per box • Payouts Q1 ${table.payouts.q1},
                    Q2 ${table.payouts.q2}, Q3 ${table.payouts.q3}, Final $
                    {table.payouts.final}
                  </p>
                </div>
                <span className="text-base sm:text-lg text-muted-foreground font-medium">
                  {table.lock.status === "locked" ? "🔒 Locked" : "🟢 Open"}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-base sm:text-lg text-muted-foreground">
                <span>Code: <span className="font-mono font-semibold text-foreground">{table.code}</span></span>
                <span>Visibility: {table.visibility === "code" ? "Link + PIN" : "Link"}</span>
                {table.visibility === "code" && table.accessCode && (
                  <span>Access PIN: <span className="font-mono font-semibold text-foreground">{table.accessCode}</span></span>
                )}
              </div>
              {adminKeys[table.code] ? (
                <div className="flex flex-wrap gap-4 text-base sm:text-lg text-muted-foreground">
                  <span>Admin key: <span className="font-mono font-semibold text-foreground">{adminKeys[table.code]}</span></span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>Admin key saved on the device that created this table</span>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/t/${table.code}`}
                  className="border-2 border-border/80 text-foreground hover:text-foreground hover:bg-secondary/50 px-5 py-3 rounded-xl text-base transition-all"
                >
                  Open Table
                </Link>
                <Link
                  href={`/t/${table.code}/admin`}
                  className="border-2 border-border/80 text-foreground hover:text-foreground hover:bg-secondary/50 px-5 py-3 rounded-xl text-base transition-all"
                >
                  Admin Panel
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!origin) return
                    navigator.clipboard.writeText(`${origin}/t/${table.code}`)
                  }}
                  className="border-2 border-border/80 text-foreground hover:text-foreground hover:bg-secondary/50 h-auto px-5 py-3 rounded-xl text-base"
                >
                  Copy Share Link
                </Button>
                {adminKeys[table.code] && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(adminKeys[table.code])
                    }}
                    className="border-2 border-border/80 text-foreground hover:text-foreground hover:bg-secondary/50 h-auto px-5 py-3 rounded-xl text-base"
                  >
                    Copy Admin Key
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
