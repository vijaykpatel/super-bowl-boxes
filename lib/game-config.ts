export const GAME_CONFIG = {
  name: "MH Super Bowl Boxes",
  pricePerBox: 1,
  currency: "USD",
  payouts: {
    q1: 20,
    q2: 20,
    q3: 20,
    final: 40,
  },
  kickoffAt: new Date("2026-02-08T23:30:00Z").getTime(),
  autoLockOffsetMs: 15 * 60 * 1000,
  revealOffsetMs: 5 * 60 * 1000,
  customRules: [
    "Box value is $1.",
    "Payouts are Q1 $20, Q2 $20, Q3 $20, Final $40.",
    "Squares are pending until I confirm payment.",
  ].join("\n"),
}

export function getAutoLockTime() {
  return GAME_CONFIG.kickoffAt - GAME_CONFIG.autoLockOffsetMs
}

export function getRevealTime() {
  return GAME_CONFIG.kickoffAt - GAME_CONFIG.revealOffsetMs
}
