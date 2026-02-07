import { kv } from "@/lib/kv"
import { GAME_CONFIG, getAutoLockTime, getRevealTime } from "@/lib/game-config"
import { generateShuffledNumbers, initializeBoxes } from "@/lib/game-utils"
import type { GameState } from "@/lib/game-types"

type LockState = {
  status: "open" | "locked"
  reason?: "auto"
  lockedAt?: number
}

type GameSnapshot = {
  table: {
    name: string
    pricePerBox: number
    currency: string
    payouts: typeof GAME_CONFIG.payouts
    kickoffAt: number
    lock: LockState
    rules: string
  }
  state: GameState
}

type StoreState = {
  state: GameState
  lock: LockState
}

const STORE_KEY = "game:state"

function createInitialState(): StoreState {
  return {
    state: {
      boxes: initializeBoxes(),
      rowNumbers: null,
      colNumbers: null,
      numbersRevealed: false,
      updatedAt: Date.now(),
    },
    lock: { status: "open" },
  }
}

async function getStore(): Promise<StoreState> {
  const existing = await kv.get<StoreState>(STORE_KEY)
  if (existing) return existing
  const initial = createInitialState()
  await kv.set(STORE_KEY, initial)
  return initial
}

function applyAutoRules(next: StoreState) {
  const now = Date.now()
  if (now >= getAutoLockTime() && next.lock.status === "open") {
    next.lock = { status: "locked", reason: "auto", lockedAt: now }
  }
  if (now >= getRevealTime() && !next.state.numbersRevealed) {
    next.state = {
      ...next.state,
      rowNumbers: generateShuffledNumbers(),
      colNumbers: generateShuffledNumbers(),
      numbersRevealed: true,
      updatedAt: now,
    }
  }
}

async function persistIfChanged(next: StoreState, previous: StoreState) {
  if (JSON.stringify(next) === JSON.stringify(previous)) return
  await kv.set(STORE_KEY, next)
}

export async function getGameSnapshot(): Promise<GameSnapshot> {
  const previous = await getStore()
  const next = structuredClone(previous)
  applyAutoRules(next)
  await persistIfChanged(next, previous)
  return {
    table: {
      name: GAME_CONFIG.name,
      pricePerBox: GAME_CONFIG.pricePerBox,
      currency: GAME_CONFIG.currency,
      payouts: GAME_CONFIG.payouts,
      kickoffAt: GAME_CONFIG.kickoffAt,
      lock: next.lock,
      rules: GAME_CONFIG.customRules,
    },
    state: next.state,
  }
}

export async function claimBoxes(playerName: string, boxIds: number[]) {
  const previous = await getStore()
  const next = structuredClone(previous)
  applyAutoRules(next)
  if (next.lock.status === "locked") {
    return { ok: false, error: "Table locked" }
  }
  const idSet = new Set(boxIds)
  const updated = next.state.boxes.map((box) => {
    if (!idSet.has(box.id)) return box
    if (box.status !== "available") return box
    return { ...box, owner: playerName, status: "pending" }
  })
  next.state = { ...next.state, boxes: updated, updatedAt: Date.now() }
  await kv.set(STORE_KEY, next)
  return { ok: true }
}

export async function confirmBoxes(boxIds: number[]) {
  const previous = await getStore()
  const next = structuredClone(previous)
  const idSet = new Set(boxIds)
  next.state = {
    ...next.state,
    boxes: next.state.boxes.map((box) =>
      idSet.has(box.id) && box.status === "pending"
        ? { ...box, status: "confirmed" }
        : box
    ),
    updatedAt: Date.now(),
  }
  await kv.set(STORE_KEY, next)
}

export async function rejectBoxes(boxIds: number[]) {
  const previous = await getStore()
  const next = structuredClone(previous)
  const idSet = new Set(boxIds)
  next.state = {
    ...next.state,
    boxes: next.state.boxes.map((box) =>
      idSet.has(box.id) && box.status === "pending"
        ? { ...box, owner: null, status: "available" }
        : box
    ),
    updatedAt: Date.now(),
  }
  await kv.set(STORE_KEY, next)
}

export async function revealNumbers() {
  const previous = await getStore()
  const next = structuredClone(previous)
  if (next.state.numbersRevealed) return
  next.state = {
    ...next.state,
    rowNumbers: generateShuffledNumbers(),
    colNumbers: generateShuffledNumbers(),
    numbersRevealed: true,
    updatedAt: Date.now(),
  }
  await kv.set(STORE_KEY, next)
}
