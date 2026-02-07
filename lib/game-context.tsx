"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  useEffect,
} from "react"
import type { BoxState, BoxStatus, GameState } from "@/lib/game-types"
import { generateShuffledNumbers, initializeBoxes } from "@/lib/game-utils"

type GamePhase = "selecting" | "checkout" | "submitted"

type GameContextType = {
  boxes: BoxState[]
  selectedBoxIds: Set<number>
  playerName: string
  gamePhase: GamePhase
  rowNumbers: number[] | null
  colNumbers: number[] | null
  numbersRevealed: boolean
  tableLocked: boolean
  lockReason?: "auto" | "manual"
  toggleBox: (id: number) => void
  setPlayerName: (name: string) => void
  setGamePhase: (phase: GamePhase) => void
  submitSelection: () => void
  clearSelection: () => void
  revealNumbers: () => void
  confirmBox: (id: number) => void
  rejectBox: (id: number) => void
  confirmBoxes: (ids: number[]) => void
  rejectBoxes: (ids: number[]) => void
  confirmAll: () => void
  refreshState?: () => void
  adminPassword?: string
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const STORAGE_KEY = "super-bowl-boxes-state"
const STORAGE_VERSION = 1

type StoredGameState = {
  version: number
  state: GameState
}

function getInitialGameState(): GameState {
  if (typeof window === "undefined") {
    return {
      boxes: initializeBoxes(),
      rowNumbers: null,
      colNumbers: null,
      numbersRevealed: false,
      updatedAt: Date.now(),
    }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { boxes: initializeBoxes(), rowNumbers: null, colNumbers: null, numbersRevealed: false, updatedAt: Date.now() }
    const parsed = JSON.parse(raw) as StoredGameState
    if (parsed.version !== STORAGE_VERSION) {
      return { boxes: initializeBoxes(), rowNumbers: null, colNumbers: null, numbersRevealed: false, updatedAt: Date.now() }
    }
    return parsed.state
  } catch {
    return { boxes: initializeBoxes(), rowNumbers: null, colNumbers: null, numbersRevealed: false, updatedAt: Date.now() }
  }
}

function persistState(state: GameState) {
  if (typeof window === "undefined") return
  const payload: StoredGameState = { version: STORAGE_VERSION, state }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [initialState] = useState<GameState>(() => getInitialGameState())
  const [boxes, setBoxes] = useState<BoxState[]>(() => initialState.boxes)
  const [selectedBoxIds, setSelectedBoxIds] = useState<Set<number>>(new Set())
  const [playerName, setPlayerName] = useState("")
  const [gamePhase, setGamePhase] = useState<GamePhase>("selecting")
  const [rowNumbers, setRowNumbers] = useState<number[] | null>(() => initialState.rowNumbers)
  const [colNumbers, setColNumbers] = useState<number[] | null>(() => initialState.colNumbers)
  const [numbersRevealed, setNumbersRevealed] = useState(() => initialState.numbersRevealed)
  const [updatedAt, setUpdatedAt] = useState(() => initialState.updatedAt)
  const [tableLocked] = useState(false)
  const [lockReason] = useState<"auto" | "manual" | undefined>(undefined)

  useEffect(() => {
    const now = Date.now()
    setUpdatedAt(now)
    persistState({
      boxes,
      rowNumbers,
      colNumbers,
      numbersRevealed,
      updatedAt: now,
    })
  }, [boxes, rowNumbers, colNumbers, numbersRevealed])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return
      try {
        const parsed = JSON.parse(event.newValue) as StoredGameState
        if (parsed.version !== STORAGE_VERSION) return
        if (parsed.state.updatedAt <= updatedAt) return
        setBoxes(parsed.state.boxes)
        setRowNumbers(parsed.state.rowNumbers)
        setColNumbers(parsed.state.colNumbers)
        setNumbersRevealed(parsed.state.numbersRevealed)
        setUpdatedAt(parsed.state.updatedAt)
      } catch {
        return
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [updatedAt])

  const toggleBox = useCallback(
    (id: number) => {
      if (gamePhase !== "selecting") return
      const box = boxes.find((b) => b.id === id)
      if (!box || box.status !== "available") return

      setSelectedBoxIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        return next
      })
    },
    [boxes, gamePhase]
  )

  const submitSelection = useCallback(() => {
    if (selectedBoxIds.size === 0 || !playerName.trim()) return
    setBoxes((prev) =>
      prev.map((box) =>
        selectedBoxIds.has(box.id)
          ? { ...box, owner: playerName.trim(), status: "pending" as BoxStatus, isSelected: false }
          : box
      )
    )
    setSelectedBoxIds(new Set())
    setPlayerName("")
    setGamePhase("submitted")
    setTimeout(() => setGamePhase("selecting"), 3000)
  }, [selectedBoxIds, playerName])

  const clearSelection = useCallback(() => {
    setSelectedBoxIds(new Set())
    setGamePhase("selecting")
  }, [])

  const revealNumbers = useCallback(() => {
    setRowNumbers(generateShuffledNumbers())
    setColNumbers(generateShuffledNumbers())
    setNumbersRevealed(true)
  }, [])

  // Admin actions
  const confirmBox = useCallback((id: number) => {
    setBoxes((prev) =>
      prev.map((box) =>
        box.id === id && box.status === "pending"
          ? { ...box, status: "confirmed" as BoxStatus }
          : box
      )
    )
  }, [])

  const rejectBox = useCallback((id: number) => {
    setBoxes((prev) =>
      prev.map((box) =>
        box.id === id && box.status === "pending"
          ? { ...box, owner: null, status: "available" as BoxStatus }
          : box
      )
    )
  }, [])

  const confirmBoxes = useCallback((ids: number[]) => {
    if (ids.length === 0) return
    const idSet = new Set(ids)
    setBoxes((prev) =>
      prev.map((box) =>
        idSet.has(box.id) && box.status === "pending"
          ? { ...box, status: "confirmed" as BoxStatus }
          : box
      )
    )
  }, [])

  const rejectBoxes = useCallback((ids: number[]) => {
    if (ids.length === 0) return
    const idSet = new Set(ids)
    setBoxes((prev) =>
      prev.map((box) =>
        idSet.has(box.id) && box.status === "pending"
          ? { ...box, owner: null, status: "available" as BoxStatus }
          : box
      )
    )
  }, [])

  const confirmAll = useCallback(() => {
    setBoxes((prev) =>
      prev.map((box) =>
        box.status === "pending"
          ? { ...box, status: "confirmed" as BoxStatus }
          : box
      )
    )
  }, [])

  return (
    <GameContext.Provider
      value={{
        boxes,
        selectedBoxIds,
        playerName,
        gamePhase,
        rowNumbers,
        colNumbers,
        numbersRevealed,
        tableLocked,
        lockReason,
        toggleBox,
        setPlayerName,
        setGamePhase,
        submitSelection,
        clearSelection,
        revealNumbers,
        confirmBox,
        rejectBox,
        confirmBoxes,
        rejectBoxes,
        confirmAll,
        refreshState: undefined,
        adminPassword: undefined,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

type ServerGameProviderProps = {
  children: ReactNode
  initialState: GameState
  initialLock: { status: "open" | "locked"; reason?: "auto" | "manual" }
  adminPassword?: string
}

export function ServerGameProvider({ children, initialState, initialLock, adminPassword }: ServerGameProviderProps) {
  const [boxes, setBoxes] = useState<BoxState[]>(initialState.boxes)
  const [selectedBoxIds, setSelectedBoxIds] = useState<Set<number>>(new Set())
  const [playerName, setPlayerName] = useState("")
  const [gamePhase, setGamePhase] = useState<GamePhase>("selecting")
  const [rowNumbers, setRowNumbers] = useState<number[] | null>(initialState.rowNumbers)
  const [colNumbers, setColNumbers] = useState<number[] | null>(initialState.colNumbers)
  const [numbersRevealed, setNumbersRevealed] = useState(initialState.numbersRevealed)
  const [tableLocked, setTableLocked] = useState(initialLock.status === "locked")
  const [lockReason, setLockReason] = useState<"auto" | "manual" | undefined>(initialLock.reason)

  const refreshState = useCallback(async () => {
    const res = await fetch(`/api/state`, { cache: "no-store" })
    if (!res.ok) return
    const data = await res.json()
    setBoxes(data.state.boxes)
    setRowNumbers(data.state.rowNumbers)
    setColNumbers(data.state.colNumbers)
    setNumbersRevealed(data.state.numbersRevealed)
    setTableLocked(data.table.lock.status === "locked")
    setLockReason(data.table.lock.reason)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      refreshState()
    }, 5000)
    return () => clearInterval(interval)
  }, [refreshState])

  const toggleBox = useCallback(
    (id: number) => {
      if (tableLocked) return
      if (gamePhase !== "selecting") return
      const box = boxes.find((b) => b.id === id)
      if (!box || box.status !== "available") return

      setSelectedBoxIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        return next
      })
    },
    [boxes, gamePhase, tableLocked]
  )

  const submitSelection = useCallback(async () => {
    if (tableLocked) return
    if (selectedBoxIds.size === 0 || !playerName.trim()) return
    const res = await fetch(`/api/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerName: playerName.trim(),
        boxIds: Array.from(selectedBoxIds),
      }),
    })
    if (!res.ok) return
    setSelectedBoxIds(new Set())
    setPlayerName("")
    setGamePhase("submitted")
    setTimeout(() => setGamePhase("selecting"), 3000)
    refreshState()
  }, [playerName, refreshState, selectedBoxIds, tableLocked])

  const clearSelection = useCallback(() => {
    setSelectedBoxIds(new Set())
    setGamePhase("selecting")
  }, [])

  const revealNumbers = useCallback(async () => {
    if (!adminPassword) return
    const res = await fetch(`/api/admin/reveal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminPassword }),
    })
    if (!res.ok) return
    refreshState()
  }, [adminPassword, refreshState])

  const confirmBoxes = useCallback(
    async (ids: number[]) => {
      if (!adminPassword || ids.length === 0) return
      const res = await fetch(`/api/admin/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boxIds: ids, adminPassword }),
      })
      if (!res.ok) return
      refreshState()
    },
    [adminPassword, refreshState]
  )

  const rejectBoxes = useCallback(
    async (ids: number[]) => {
      if (!adminPassword || ids.length === 0) return
      const res = await fetch(`/api/admin/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boxIds: ids, adminPassword }),
      })
      if (!res.ok) return
      refreshState()
    },
    [adminPassword, refreshState]
  )

  const confirmBox = useCallback((id: number) => {
    confirmBoxes([id])
  }, [confirmBoxes])

  const rejectBox = useCallback((id: number) => {
    rejectBoxes([id])
  }, [rejectBoxes])

  const confirmAll = useCallback(async () => {
    if (!adminPassword) return
    const pendingIds = boxes.filter((b) => b.status === "pending").map((b) => b.id)
    if (pendingIds.length === 0) return
    confirmBoxes(pendingIds)
  }, [adminPassword, boxes, confirmBoxes])

  return (
    <GameContext.Provider
      value={{
        boxes,
        selectedBoxIds,
        playerName,
        gamePhase,
        rowNumbers,
        colNumbers,
        numbersRevealed,
        tableLocked,
        lockReason,
        toggleBox,
        setPlayerName,
        setGamePhase,
        submitSelection,
        clearSelection,
        revealNumbers,
        confirmBox,
        rejectBox,
        confirmBoxes,
        rejectBoxes,
        confirmAll,
        refreshState,
        adminPassword,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error("useGame must be used within GameProvider")
  return ctx
}
