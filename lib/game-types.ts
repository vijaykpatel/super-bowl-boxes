export type BoxStatus = "available" | "pending" | "confirmed"

export type BoxState = {
  id: number
  row: number
  col: number
  owner: string | null
  status: BoxStatus
  isSelected: boolean
}

export type GameState = {
  boxes: BoxState[]
  rowNumbers: number[] | null
  colNumbers: number[] | null
  numbersRevealed: boolean
  updatedAt: number
}
