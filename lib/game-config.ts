export const GAME_CONFIG = {
  name: "MH Super Bowl Boxes",
  pricePerBox: 5,
  currency: "USD",
  payouts: {
    q1: 100,
    q2: 100,
    q3: 100,
    final: 200,
  },
  kickoffAt: new Date("2026-02-08T23:30:00Z").getTime(),
  autoLockOffsetMs: 15 * 60 * 1000,
  revealOffsetMs: 5 * 60 * 1000,
  customRules: [
    "Box value is $5.",
    "Payouts are Q1 $100, Q2 $100, Q3 $100, Final $200.",
    "Squares are pending until I confirm payment.",
  ].join("\n"),
}

export function getAutoLockTime() {
  return GAME_CONFIG.kickoffAt - GAME_CONFIG.autoLockOffsetMs
}

export function getRevealTime() {
  return GAME_CONFIG.kickoffAt - GAME_CONFIG.revealOffsetMs
}
