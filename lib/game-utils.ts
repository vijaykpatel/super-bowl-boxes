import type { BoxState } from "@/lib/game-types"

export function initializeBoxes(): BoxState[] {
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

export function generateShuffledNumbers(): number[] {
  const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[nums[i], nums[j]] = [nums[j], nums[i]]
  }
  return nums
}
