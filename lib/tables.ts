import { kv } from "@/lib/kv"
import { initializeBoxes } from "@/lib/game-utils"
import type { GameState } from "@/lib/game-types"
import { nanoid, customAlphabet } from "nanoid"

export type TableVisibility = "link" | "code"

export type TablePayouts = {
  q1: number
  q2: number
  q3: number
  final: number
}

export type TableLock = {
  status: "open" | "locked"
  reason?: "auto" | "manual"
  lockedAt?: number
  unlockedAt?: number
  unlockedBy?: string
}

export type Table = {
  id: string
  code: string
  name: string
  ownerEmail: string
  adminKey: string
  pricePerBox: number
  currency: "USD"
  payouts: TablePayouts
  rules?: string
  visibility: TableVisibility
  kickoffAt: number
  lock: TableLock
  createdAt: number
  updatedAt: number
}

export type Claim = {
  id: string
  playerName: string
  boxIds: number[]
  status: "pending" | "confirmed" | "rejected"
  createdAt: number
  updatedAt: number
}

export type AuditEvent = {
  id: string
  type: "unlock"
  userId: string
  createdAt: number
  meta?: Record<string, string | number | boolean>
}

const TABLE_KEY = (id: string) => `table:${id}`
const TABLE_STATE_KEY = (id: string) => `table:${id}:state`
const TABLE_CLAIMS_KEY = (id: string) => `table:${id}:claims`
const TABLE_AUDIT_KEY = (id: string) => `table:${id}:audit`
const CODE_KEY = (code: string) => `code:${code}`
const OWNER_TABLES_KEY = (email: string) => `owner:${email}:tables`
const ALL_TABLES_KEY = "tables:all"

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
const generateCode = customAlphabet(CODE_ALPHABET, 6)
const generateAdminKey = customAlphabet(CODE_ALPHABET, 8)

export function getKickoffAutoLockTime(kickoffAt: number) {
  return kickoffAt - 15 * 60 * 1000
}

export function getRevealTime(kickoffAt: number) {
  return kickoffAt - 5 * 60 * 1000
}

export function shouldAutoLock(table: Table, now: number) {
  const autoLockAt = getKickoffAutoLockTime(table.kickoffAt)
  if (now < autoLockAt) return false
  if (table.lock.status === "locked") return false
  if (table.lock.unlockedAt && table.lock.unlockedAt >= autoLockAt) return false
  return true
}

export function shouldAutoReveal(table: Table, now: number) {
  const revealAt = getRevealTime(table.kickoffAt)
  return now >= revealAt
}

export function createEmptyState(): GameState {
  return {
    boxes: initializeBoxes(),
    rowNumbers: null,
    colNumbers: null,
    numbersRevealed: false,
    updatedAt: Date.now(),
  }
}

export async function generateTableCode(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const code = generateCode()
    const exists = await kv.get(CODE_KEY(code))
    if (!exists) return code
  }
  return generateCode()
}

export async function createTable(params: {
  ownerEmail: string
  name: string
  pricePerBox: number
  payouts: TablePayouts
  rules?: string
  visibility: TableVisibility
  kickoffAt: number
}) {
  const code = await generateTableCode()
  const id = code
  const adminKey = generateAdminKey()
  const now = Date.now()
  const table: Table = {
    id,
    code,
    name,
    ownerEmail: params.ownerEmail,
    adminKey,
    pricePerBox: params.pricePerBox,
    currency: "USD",
    payouts: params.payouts,
    rules: params.rules,
    visibility: params.visibility,
    kickoffAt: params.kickoffAt,
    lock: { status: "open" },
    createdAt: now,
    updatedAt: now,
  }
  const state = createEmptyState()

  await kv.set(TABLE_KEY(id), table)
  await kv.set(TABLE_STATE_KEY(id), state)
  await kv.set(CODE_KEY(code), id)

  const ownerTables = (await kv.get<string[]>(OWNER_TABLES_KEY(params.ownerEmail))) ?? []
  await kv.set(OWNER_TABLES_KEY(params.ownerEmail), Array.from(new Set([...ownerTables, id])))

  const allTables = (await kv.get<string[]>(ALL_TABLES_KEY)) ?? []
  await kv.set(ALL_TABLES_KEY, Array.from(new Set([...allTables, id])))

  return table
}

export async function getTableByCode(code: string) {
  const tableId = await kv.get<string>(CODE_KEY(code))
  if (!tableId) return null
  const table = await kv.get<Table>(TABLE_KEY(tableId))
  return table ?? null
}

export async function getTableState(tableId: string) {
  const state = await kv.get<GameState>(TABLE_STATE_KEY(tableId))
  return state ?? createEmptyState()
}

export async function setTableState(tableId: string, state: GameState) {
  await kv.set(TABLE_STATE_KEY(tableId), { ...state, updatedAt: Date.now() })
}

export async function listTablesForOwnerEmail(email: string) {
  const tableIds = (await kv.get<string[]>(OWNER_TABLES_KEY(email))) ?? []
  if (tableIds.length === 0) return []
  const tables = await kv.mget<Table[]>(...tableIds.map(TABLE_KEY))
  return tables.filter(Boolean) as Table[]
}

export async function listAllTables() {
  const tableIds = (await kv.get<string[]>(ALL_TABLES_KEY)) ?? []
  if (tableIds.length === 0) return []
  const tables = await kv.mget<Table[]>(...tableIds.map(TABLE_KEY))
  return tables.filter(Boolean) as Table[]
}

export async function updateTable(table: Table) {
  await kv.set(TABLE_KEY(table.id), { ...table, updatedAt: Date.now() })
}

export async function addClaim(tableId: string, claim: Claim) {
  const claims = (await kv.get<Claim[]>(TABLE_CLAIMS_KEY(tableId))) ?? []
  await kv.set(TABLE_CLAIMS_KEY(tableId), [...claims, claim])
}

export async function updateClaim(tableId: string, claimId: string, status: Claim["status"]) {
  const claims = (await kv.get<Claim[]>(TABLE_CLAIMS_KEY(tableId))) ?? []
  const next = claims.map((c) =>
    c.id === claimId ? { ...c, status, updatedAt: Date.now() } : c
  )
  await kv.set(TABLE_CLAIMS_KEY(tableId), next)
}

export async function addAuditEvent(tableId: string, event: AuditEvent) {
  const events = (await kv.get<AuditEvent[]>(TABLE_AUDIT_KEY(tableId))) ?? []
  await kv.set(TABLE_AUDIT_KEY(tableId), [...events, event])
}
