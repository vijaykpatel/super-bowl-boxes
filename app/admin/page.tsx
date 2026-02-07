"use client"

import { GameProvider } from "@/lib/game-context"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  return (
    <GameProvider>
      <AdminDashboard />
    </GameProvider>
  )
}
