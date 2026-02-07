export const GAME_CONFIG = {
  name: "MH Super Bowl Boxes",
  pricePerBox: 1,
  currency: "USD",
  payouts: {
    q1: 25,
    q2: 25,
    q3: 25,
    final: 25,
  },
  kickoffAt: new Date("2026-02-08T23:30:00Z").getTime(),
  autoLockOffsetMs: 15 * 60 * 1000,
  revealOffsetMs: 5 * 60 * 1000,
  customRules: [
    "Box value is $1.",
    "Payouts are Q1 $25, Q2 $25, Q3 $25, Final $25.",
    "Squares are pending until I confirm payment.",
  ].join("\n"),
}

export function getAutoLockTime() {
  return GAME_CONFIG.kickoffAt - GAME_CONFIG.autoLockOffsetMs
}

export function getRevealTime() {
  return GAME_CONFIG.kickoffAt - GAME_CONFIG.revealOffsetMs
}
