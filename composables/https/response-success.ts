import { getErrorBodyClient } from './response-errors'

// Client ($fetch) ─────────────────────────────────────────────────────────────

export function getSuccessDataClient(response: any) {
  if (!getErrorBodyClient(response)) {
    return response?.data ?? {}
  }
  return null
}

export function getSuccessMessageClient(response: any) {
  return response?.message ?? ''
}

export function isSuccessClient(response: any) {
  return !getErrorBodyClient(response)
}
