import crypto from "crypto"

const DEFAULT_PASSWORD = "abcd1234"

function getPassword() {
  return process.env.SUPERADMIN_PASSWORD || DEFAULT_PASSWORD
}

function getSessionSecret() {
  return process.env.SUPERADMIN_SESSION_SECRET || "superadmin-dev-secret"
}

export function verifySuperadminPassword(input: string) {
  return input === getPassword()
}

export function createSuperadminSession() {
  const payload = `superadmin:${Date.now()}`
  const hmac = crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("hex")
  return `${payload}.${hmac}`
}

export function verifySuperadminSession(token: string) {
  const [payload, hmac] = token.split(".")
  if (!payload || !hmac) return false
  const expected = crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("hex")
  if (expected.length !== hmac.length) return false
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hmac))
}
