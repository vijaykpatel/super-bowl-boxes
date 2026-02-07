import React from "react"
import { notFound } from "next/navigation"
import { AdminPageClient } from "@/components/admin-page-client"
import { getAdminSecret } from "@/lib/admin-auth"

export default function AdminPage({ searchParams }: { searchParams: Promise<{ secret?: string }> }) {
  const { secret } = React.use(searchParams)
  if (!secret || secret !== getAdminSecret()) {
    notFound()
  }

  return <AdminPageClient />
}
