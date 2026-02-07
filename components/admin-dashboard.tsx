"use client"

import { useGame } from "@/lib/game-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"
import { CountdownTimer } from "@/components/countdown-timer"

function StatusBadge({ status }: { status: "pending" | "confirmed" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        status === "pending" && "bg-pending/15 text-pending border border-pending/30",
        status === "confirmed" && "bg-patriots-red/15 text-patriots-red border border-patriots-red/30"
      )}
    >
      {status === "pending" ? "Pending" : "Confirmed"}
    </span>
  )
}

function ClaimRow({
  owner,
  squareIds,
  status,
  onConfirm,
  onReject,
}: {
  owner: string
  squareIds: number[]
  status: "pending" | "confirmed"
  onConfirm: () => void
  onReject: () => void
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-card border border-border rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-display font-bold text-foreground text-base truncate">
            {owner}
          </p>
          <StatusBadge status={status} />
        </div>
        <p className="text-muted-foreground text-xs">
          {squareIds.length} {squareIds.length === 1 ? "square" : "squares"}:{" "}
          <span className="text-foreground/70">
            {squareIds.map((id) => {
              const row = Math.floor(id / 10)
              const col = id % 10
              return `R${row}C${col}`
            }).join(", ")}
          </span>
        </p>
      </div>

      <div className="flex gap-2 shrink-0">
        {status === "pending" && (
          <>
            <Button
              size="sm"
              onClick={onConfirm}
              className="bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display font-bold uppercase tracking-wide h-10 px-4 min-w-[100px]"
            >
              Confirm
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReject}
              className="border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent h-10 px-4 min-w-[100px]"
            >
              Reject
            </Button>
          </>
        )}
        {status === "confirmed" && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReject}
            className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary bg-transparent h-10 px-4"
          >
            Revoke
          </Button>
        )}
      </div>
    </div>
  )
}

export function AdminDashboard({
  tableCode,
  tableName,
  kickoffAt,
}: {
  tableCode: string
  tableName: string
  kickoffAt: number
}) {
  const { boxes, confirmBox, rejectBox, confirmAll, tableLocked, lockReason, refreshState, adminKey } = useGame()

  // Group boxes by owner and status
  const claims = useMemo(() => {
    const map = new Map<string, { owner: string; squareIds: number[]; status: "pending" | "confirmed" }>()

    for (const box of boxes) {
      if (box.owner && (box.status === "pending" || box.status === "confirmed")) {
        const key = `${box.owner}-${box.status}`
        if (!map.has(key)) {
          map.set(key, { owner: box.owner, squareIds: [], status: box.status })
        }
        map.get(key)!.squareIds.push(box.id)
      }
    }

    // Sort: pending first, then by owner name
    return Array.from(map.values()).sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1
      if (a.status !== "pending" && b.status === "pending") return 1
      return a.owner.localeCompare(b.owner)
    })
  }, [boxes])

  const pendingClaims = claims.filter((c) => c.status === "pending")
  const confirmedClaims = claims.filter((c) => c.status === "confirmed")
  const totalPending = pendingClaims.reduce((sum, c) => sum + c.squareIds.length, 0)
  const totalConfirmed = confirmedClaims.reduce((sum, c) => sum + c.squareIds.length, 0)
  const totalAvailable = boxes.filter((b) => b.status === "available").length
  const revealAt = kickoffAt - 5 * 60 * 1000

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <Image
              src="/images/hero-stadium.jpg"
              alt="Super Bowl"
              width={40}
              height={40}
              className="rounded-lg object-cover w-10 h-10"
            />
            <div>
              <h1 className="font-display text-lg sm:text-xl font-black text-foreground uppercase tracking-tight">
                {tableName}
              </h1>
              <p className="text-muted-foreground text-xs">
                Admin Panel • Table {tableCode}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/t/${tableCode}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 min-h-[44px] flex items-center"
            >
              Back to table
            </Link>
            <Link
              href="/tables"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              My tables
            </Link>
          </div>
        </div>
      </header>

      {/* Stats overview */}
      <div className="px-4 sm:px-6 pt-6 max-w-3xl mx-auto w-full">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="font-display text-2xl font-bold text-pending">{totalPending}</p>
            <p className="text-muted-foreground text-xs mt-0.5">Pending</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="font-display text-2xl font-bold text-patriots-red">{totalConfirmed}</p>
            <p className="text-muted-foreground text-xs mt-0.5">Confirmed</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="font-display text-2xl font-bold text-seahawks-green">{totalAvailable}</p>
            <p className="text-muted-foreground text-xs mt-0.5">Available</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 py-6 max-w-3xl mx-auto w-full">
        {/* Lock + Countdown */}
        <section className="mb-6">
          <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
                  Table Status
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  {tableLocked
                    ? `Locked (${lockReason ?? "manual"})`
                    : "Open for new selections"}
                </p>
              </div>
              <Button
                size="sm"
                onClick={async () => {
                  if (!adminKey) return
                  await fetch(`/api/tables/${tableCode}/admin/lock`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      status: tableLocked ? "open" : "locked",
                      adminKey,
                    }),
                  })
                  refreshState?.()
                }}
                className={cn(
                  "h-9 px-4 text-xs font-display font-bold uppercase tracking-wide",
                  tableLocked
                    ? "bg-seahawks-green hover:bg-seahawks-green/90 text-white"
                    : "bg-patriots-red hover:bg-patriots-red/90 text-white"
                )}
              >
                {tableLocked ? "Unlock" : "Lock"}
              </Button>
            </div>
            <CountdownTimer revealAt={revealAt} showRevealButton />
          </div>
        </section>

        {/* Pending section */}
        {pendingClaims.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-pending">
                Pending Confirmation ({totalPending} squares)
              </h2>
              <Button
                size="sm"
                onClick={confirmAll}
                className="bg-seahawks-green hover:bg-seahawks-green/90 text-white font-display font-bold uppercase tracking-wide h-9 px-3 text-xs"
              >
                Confirm All
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {pendingClaims.map((claim) => (
                <ClaimRow
                  key={`${claim.owner}-pending`}
                  owner={claim.owner}
                  squareIds={claim.squareIds}
                  status="pending"
                  onConfirm={() => claim.squareIds.forEach((id) => confirmBox(id))}
                  onReject={() => claim.squareIds.forEach((id) => rejectBox(id))}
                />
              ))}
            </div>
          </section>
        )}

        {/* Confirmed section */}
        {confirmedClaims.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-patriots-red mb-3">
              Confirmed ({totalConfirmed} squares)
            </h2>
            <div className="flex flex-col gap-2">
              {confirmedClaims.map((claim) => (
                <ClaimRow
                  key={`${claim.owner}-confirmed`}
                  owner={claim.owner}
                  squareIds={claim.squareIds}
                  status="confirmed"
                  onConfirm={() => {}}
                  onReject={() => claim.squareIds.forEach((id) => rejectBox(id))}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {claims.length === 0 && (
          <div className="text-center py-16">
            <svg
              className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-muted-foreground font-display text-lg font-bold">
              No claims yet
            </p>
            <p className="text-muted-foreground/60 text-sm mt-1">
              Claims will appear here as people select squares on the main page.
            </p>
            <p className="text-muted-foreground/40 text-xs mt-4">
              Note: Data is stored locally on this device. Share the same browser to manage claims.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-border">
        <p className="text-muted-foreground text-xs">
          Admin Panel - Super Bowl Squares
        </p>
      </footer>
    </main>
  )
}
