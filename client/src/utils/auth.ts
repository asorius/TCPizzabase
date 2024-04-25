import type { AuthUser } from '@mono/server/src/shared/entities'

const TOKEN_KEY = 'token'
const EMAIL_KEY = 'email'

export function getStoredAccessToken(storage: Storage): string | null {
  return storage.getItem(TOKEN_KEY)
}

export function clearStoredAccessToken(storage: Storage) {
  storage.removeItem(TOKEN_KEY)
}

export function storeAccessToken(storage: Storage, token: string) {
  storage.setItem(TOKEN_KEY, token)
}

export function storeUserEmail(storage: Storage, email: string) {
  storage.setItem(EMAIL_KEY, email)
}
export function getStoredEmail(storage: Storage): string | null {
  return storage.getItem(EMAIL_KEY)
}
export function clearStoredEmail(storage: Storage) {
  storage.removeItem(EMAIL_KEY)
}

export function getUserFromToken(token: string): AuthUser {
  return JSON.parse(atob(token.split('.')[1])).user
}

export function getUserIdFromToken(token: string) {
  return getUserFromToken(token).id
}
