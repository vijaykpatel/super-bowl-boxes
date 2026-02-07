const DEFAULT_PASSWORD = "admin"

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD
}

export function getAdminSecret() {
  return process.env.ADMIN_SECRET || "secret"
}

export function verifyAdminPassword(input: string) {
  return input === getAdminPassword()
}
