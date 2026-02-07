"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"

export type BoxStatus = "available" | "pending" | "confirmed"

export type BoxState = {
  id: number
  row: number
  col: number
  owner: string | null
  status: BoxStatus
  isSelected: boolean
}

type GamePhase = "selecting" | "checkout" | "submitted"

type GameContextType = {
  boxes: BoxState[]
  selectedBoxIds: Set<number>
  playerName: string
  gamePhase: GamePhase
  rowNumbers: number[] | null
  colNumbers: number[] | null
  numbersRevealed: boolean
  toggleBox: (id: number) => void
  setPlayerName: (name: string) => void
  setGamePhase: (phase: GamePhase) => void
  submitSelection: () => void
  clearSelection: () => void
  revealNumbers: () => void
  confirmBox: (id: number) => void
  rejectBox: (id: number) => void
  confirmAll: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

function generateShuffledNumbers(): number[] {
  const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[nums[i], nums[j]] = [nums[j], nums[i]]
  }
  return nums
}

function initializeBoxes(): BoxState[] {
  const boxes: BoxState[] = []
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      boxes.push({
        id: row * 10 + col,
        row,
        col,
        owner: null,
        status: "available",
        isSelected: false,
      })
    }
  }
  return boxes
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [boxes, setBoxes] = useState<BoxState[]>(initializeBoxes)
  const [selectedBoxIds, setSelectedBoxIds] = useState<Set<number>>(new Set())
  const [playerName, setPlayerName] = useState("")
  const [gamePhase, setGamePhase] = useState<GamePhase>("selecting")
  const [rowNumbers, setRowNumbers] = useState<number[] | null>(null)
  const [colNumbers, setColNumbers] = useState<number[] | null>(null)
  const [numbersRevealed, setNumbersRevealed] = useState(false)

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
        toggleBox,
        setPlayerName,
        setGamePhase,
        submitSelection,
        clearSelection,
        revealNumbers,
        confirmBox,
        rejectBox,
        confirmAll,
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
