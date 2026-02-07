import { cookies } from "next/headers"
import { listAllTables } from "@/lib/tables"
import { SuperadminDashboard } from "@/components/superadmin-dashboard"
import { verifySuperadminSession } from "@/lib/superadmin"
import { SuperadminLogin } from "@/components/superadmin-login"

export default async function SuperadminPage() {
  const cookieStore = cookies()
  const token = cookieStore.get("superadmin_session")?.value
  const isAuthed = token ? verifySuperadminSession(token) : false

  if (!isAuthed) {
    return <SuperadminLogin />
  }

  const tables = await listAllTables()
  return <SuperadminDashboard tables={tables} />
}
