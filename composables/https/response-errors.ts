// Client ($fetch) ─────────────────────────────────────────────────────────────

export function getErrorBodyClient(response: any) {
  return response?.error
}

export function getErrorMessageClient(response: any) {
  console.log('getErrorBodyClient(response)?.details', getErrorBodyClient(response))
  return getErrorBodyClient(response)?.error?.details ?? 'เกิดข้อผิดพลาด'
}

export function getErrorCodeClient(response: any) {
  return response?.status ?? 0
}

export function isErrorClient(response: any) {
  return !!getErrorBodyClient(response)
}
