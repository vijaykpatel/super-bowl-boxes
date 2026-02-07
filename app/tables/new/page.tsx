"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const priceOptions = [5, 10, 25]

export default function NewTablePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [ownerEmail, setOwnerEmail] = useState("")
  const [pricePerBox, setPricePerBox] = useState(10)
  const [q1Pct, setQ1Pct] = useState(25)
  const [q2Pct, setQ2Pct] = useState(25)
  const [q3Pct, setQ3Pct] = useState(25)
  const [finalPct, setFinalPct] = useState(25)
  const [rules, setRules] = useState("")
  const [visibility, setVisibility] = useState<"link" | "code">("link")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const kickoffAt = new Date("2026-02-08T23:30:00Z").getTime()
  const totalPot = pricePerBox * 100
  const totalPct = q1Pct + q2Pct + q3Pct + finalPct
  const payoutDollars = {
    q1: Math.round((totalPot * q1Pct) / 100 * 100) / 100,
    q2: Math.round((totalPot * q2Pct) / 100 * 100) / 100,
    q3: Math.round((totalPot * q3Pct) / 100 * 100) / 100,
    final: Math.round((totalPot * finalPct) / 100 * 100) / 100,
  }

  const handleSubmit = async () => {
    setError("")
    if (!name.trim()) {
      setError("Table name is required.")
      return
    }
    if (!ownerEmail.trim()) {
      setError("Email is required.")
      return
    }
    if (totalPct !== 100) {
      setError("Payout percentages must add up to 100%.")
      return
    }
    setLoading(true)
    const res = await fetch("/api/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        ownerEmail,
        pricePerBox,
        payouts: {
          q1: payoutDollars.q1,
          q2: payoutDollars.q2,
          q3: payoutDollars.q3,
          final: payoutDollars.final,
        },
        rules: rules.trim() ? rules.trim() : undefined,
        visibility,
      }),
    })
    setLoading(false)
    if (!res.ok) {
      setError("Could not create table. Try again.")
      return
    }
    const data = await res.json()
    if (typeof window !== "undefined") {
      window.localStorage.setItem("owner_email", ownerEmail)
      window.localStorage.setItem(
        `admin_key_${data.table.code}`,
        data.table.adminKey
      )
    }
    router.push(`/t/${data.table.code}/admin`)
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="font-display text-2xl font-black text-foreground uppercase tracking-tight">
            Create a Table
          </h1>
          <p className="text-muted-foreground text-xs">
            Set your rules and payouts, then share the link with your group.
          </p>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-6">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Table name / group name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Patel Family Super Bowl Pool"
              className="bg-secondary border-border text-foreground mt-2"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Admin email
            </label>
            <Input
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-secondary border-border text-foreground mt-2"
              type="email"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] items-start">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Price per box
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {priceOptions.map((price) => (
                  <button
                    key={price}
                    type="button"
                    onClick={() => setPricePerBox(price)}
                    className={`px-3 py-2 rounded-md text-xs border ${
                      pricePerBox === price
                        ? "bg-seahawks-green text-white border-seahawks-green"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    ${price}
                  </button>
                ))}
                <Input
                  type="number"
                  value={pricePerBox}
                  onChange={(e) => setPricePerBox(Number(e.target.value || 0))}
                  className="w-24 bg-secondary border-border text-foreground"
                  min={1}
                />
              </div>
            </div>
            <div className="bg-secondary/60 border border-border rounded-lg p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Total pot
              </p>
              <p className="text-2xl font-display font-bold text-foreground mt-2">
                ${totalPot.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on 100 squares.
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Payouts (percent)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              <div className="flex flex-col gap-1">
                <Input
                  type="number"
                  value={q1Pct}
                  onChange={(e) => setQ1Pct(Number(e.target.value || 0))}
                  className="bg-secondary border-border text-foreground"
                  placeholder="Q1 %"
                  min={0}
                  max={100}
                />
                <span className="text-[10px] text-muted-foreground">
                  ${payoutDollars.q1.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <Input
                  type="number"
                  value={q2Pct}
                  onChange={(e) => setQ2Pct(Number(e.target.value || 0))}
                  className="bg-secondary border-border text-foreground"
                  placeholder="Q2 %"
                  min={0}
                  max={100}
                />
                <span className="text-[10px] text-muted-foreground">
                  ${payoutDollars.q2.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <Input
                  type="number"
                  value={q3Pct}
                  onChange={(e) => setQ3Pct(Number(e.target.value || 0))}
                  className="bg-secondary border-border text-foreground"
                  placeholder="Q3 %"
                  min={0}
                  max={100}
                />
                <span className="text-[10px] text-muted-foreground">
                  ${payoutDollars.q3.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <Input
                  type="number"
                  value={finalPct}
                  onChange={(e) => setFinalPct(Number(e.target.value || 0))}
                  className="bg-secondary border-border text-foreground"
                  placeholder="Final %"
                  min={0}
                  max={100}
                />
                <span className="text-[10px] text-muted-foreground">
                  ${payoutDollars.final.toFixed(2)}
                </span>
              </div>
            </div>
            <p className={`text-xs mt-2 ${totalPct === 100 ? "text-muted-foreground" : "text-destructive"}`}>
              Total: {totalPct}% (must equal 100%)
            </p>
          </div>

          <div className="bg-secondary/60 border border-border rounded-lg p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
              Kickoff time
            </p>
            <p className="text-sm text-foreground font-display font-bold mt-2">
              Sunday, February 8, 2026 at 6:30 PM ET
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Numbers reveal 5 minutes before kickoff.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Visibility
            </label>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setVisibility("link")}
                className={`px-3 py-2 rounded-md text-xs border ${
                  visibility === "link"
                    ? "bg-seahawks-green text-white border-seahawks-green"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Link Only
              </button>
              <button
                type="button"
                onClick={() => setVisibility("code")}
                className={`px-3 py-2 rounded-md text-xs border ${
                  visibility === "code"
                    ? "bg-seahawks-green text-white border-seahawks-green"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Link + Code
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Rules (optional)
            </label>
            <Textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="Add any custom rules or payout notes."
              className="bg-secondary border-border text-foreground mt-2 min-h-[120px]"
            />
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
              Base rules
            </p>
            <div className="mt-3 text-xs text-muted-foreground flex flex-col gap-2">
              <p>Selections are held as pending until admin confirmation.</p>
              <p>Table auto‑locks 15 minutes before kickoff.</p>
              <p>Numbers reveal 5 minutes before kickoff.</p>
              <p>Winners are based on last digits each quarter.</p>
              <p>Admin key will appear on the My Tables page after creation.</p>
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSubmit}
              disabled={loading || totalPct !== 100}
              className="bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display font-bold uppercase tracking-wide"
            >
              {loading ? "Creating..." : "Create Table"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/tables")}
              className="border-border text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
