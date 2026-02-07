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
    <main className="min-h-screen flex flex-col grain-overlay">
      <header className="border-b-2 border-border/80 bg-card/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase tracking-tight leading-none">
            Create a Table
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg mt-1">
            Set your rules and payouts, then share the link with your group.
          </p>
        </div>
      </header>

      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="bg-card/90 border-2 border-border/80 rounded-2xl p-6 sm:p-8 flex flex-col gap-8 backdrop-blur-xl shadow-xl">
          <div>
            <label className="text-base sm:text-lg font-semibold text-muted-foreground mb-3 block">
              Table name / group name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Super Bowl LIX Pool"
              className="bg-secondary/80 border-2 border-border/80 text-foreground h-14 text-base sm:text-lg rounded-xl"
            />
          </div>
          <div>
            <label className="text-base sm:text-lg font-semibold text-muted-foreground mb-3 block">
              Admin email
            </label>
            <Input
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-secondary/80 border-2 border-border/80 text-foreground h-14 text-base sm:text-lg rounded-xl"
              type="email"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
            <div>
              <label className="text-base sm:text-lg font-semibold text-muted-foreground mb-3 block">
                Price per box
              </label>
              <div className="flex flex-wrap gap-3 mt-3">
                {priceOptions.map((price) => (
                  <button
                    key={price}
                    type="button"
                    onClick={() => setPricePerBox(price)}
                    className={`px-5 py-3 rounded-xl text-base sm:text-lg font-semibold border-2 transition-all ${
                      pricePerBox === price
                        ? "bg-seahawks-green text-white border-seahawks-green shadow-lg"
                        : "border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    ${price}
                  </button>
                ))}
                <Input
                  type="number"
                  value={pricePerBox}
                  onChange={(e) => setPricePerBox(Number(e.target.value || 0))}
                  className="w-32 bg-secondary/80 border-2 border-border/80 text-foreground h-12 text-base sm:text-lg rounded-xl"
                  min={1}
                />
              </div>
            </div>
            <div className="bg-secondary/60 border-2 border-border/80 rounded-xl p-5 sm:p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-bold mb-3">
                Total pot
              </p>
              <p className="text-3xl sm:text-4xl font-display text-foreground">
                ${totalPot.toFixed(2)}
              </p>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">
                Based on 100 squares.
              </p>
            </div>
          </div>

          <div>
            <label className="text-base sm:text-lg font-semibold text-muted-foreground mb-3 block">
              Payouts (percent)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
              <div className="flex flex-col gap-2">
                <Input
                  type="number"
                  value={q1Pct}
                  onChange={(e) => setQ1Pct(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                  className="bg-secondary/80 border-2 border-border/80 text-foreground h-12 text-base rounded-xl"
                  placeholder="Q1 %"
                  min={0}
                  max={100}
                />
                <span className="text-sm sm:text-base text-muted-foreground font-medium">
                  ${payoutDollars.q1.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  type="number"
                  value={q2Pct}
                  onChange={(e) => setQ2Pct(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                  className="bg-secondary/80 border-2 border-border/80 text-foreground h-12 text-base rounded-xl"
                  placeholder="Q2 %"
                  min={0}
                  max={100}
                />
                <span className="text-sm sm:text-base text-muted-foreground font-medium">
                  ${payoutDollars.q2.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  type="number"
                  value={q3Pct}
                  onChange={(e) => setQ3Pct(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                  className="bg-secondary/80 border-2 border-border/80 text-foreground h-12 text-base rounded-xl"
                  placeholder="Q3 %"
                  min={0}
                  max={100}
                />
                <span className="text-sm sm:text-base text-muted-foreground font-medium">
                  ${payoutDollars.q3.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  type="number"
                  value={finalPct}
                  onChange={(e) => setFinalPct(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                  className="bg-secondary/80 border-2 border-border/80 text-foreground h-12 text-base rounded-xl"
                  placeholder="Final %"
                  min={0}
                  max={100}
                />
                <span className="text-sm sm:text-base text-muted-foreground font-medium">
                  ${payoutDollars.final.toFixed(2)}
                </span>
              </div>
            </div>
            <p className={`text-base sm:text-lg mt-3 font-medium ${totalPct === 100 ? "text-muted-foreground" : "text-destructive"}`}>
              Total: {totalPct}% (must equal 100%)
            </p>
          </div>

          <div className="bg-secondary/60 border-2 border-border/80 rounded-xl p-5 sm:p-6 shadow-lg">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-bold mb-3">
              Kickoff time
            </p>
            <p className="text-lg sm:text-xl text-foreground font-display mt-2">
              Sunday, February 8, 2026 at 6:30 PM ET
            </p>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Numbers reveal 5 minutes before kickoff.
            </p>
          </div>

          <div>
            <label className="text-base sm:text-lg font-semibold text-muted-foreground mb-3 block">
              Visibility
            </label>
            <div className="flex gap-3 mt-3">
              <button
                type="button"
                onClick={() => setVisibility("link")}
                className={`px-6 py-3 rounded-xl text-base sm:text-lg font-semibold border-2 transition-all ${
                  visibility === "link"
                    ? "bg-seahawks-green text-white border-seahawks-green shadow-lg"
                    : "border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                Link Only
              </button>
              <button
                type="button"
                onClick={() => setVisibility("code")}
                className={`px-6 py-3 rounded-xl text-base sm:text-lg font-semibold border-2 transition-all ${
                  visibility === "code"
                    ? "bg-seahawks-green text-white border-seahawks-green shadow-lg"
                    : "border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                Link + Code
              </button>
            </div>
          </div>

          <div>
            <label className="text-base sm:text-lg font-semibold text-muted-foreground mb-3 block">
              Rules (optional)
            </label>
            <Textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="Add any custom rules or payout notes."
              className="bg-secondary/80 border-2 border-border/80 text-foreground text-base sm:text-lg mt-3 min-h-[140px] rounded-xl"
            />
          </div>

          <div className="bg-card/80 border-2 border-border/80 rounded-xl p-5 sm:p-6 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-bold mb-4">
              Base rules
            </p>
            <div className="mt-4 text-base sm:text-lg text-muted-foreground flex flex-col gap-3">
              <p>• Selections are held as pending until admin confirmation.</p>
              <p>• Table auto-locks 15 minutes before kickoff.</p>
              <p>• Numbers reveal 5 minutes before kickoff.</p>
              <p>• Winners are based on last digits each quarter.</p>
              <p>• Admin key will appear on the My Tables page after creation.</p>
            </div>
          </div>

          {error && <p className="text-base sm:text-lg text-destructive font-medium">{error}</p>}

          <div className="flex items-center gap-4">
            <Button
              onClick={handleSubmit}
              disabled={loading || totalPct !== 100}
              className="bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display uppercase tracking-wider h-14 px-8 text-base sm:text-lg rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              {loading ? "Creating..." : "Create Table"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/tables")}
              className="border-2 border-border/80 text-foreground hover:text-foreground hover:bg-secondary/50 h-14 px-8 text-base sm:text-lg rounded-xl"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
