import { describe, it, expect } from 'vitest'
import {
  getErrorBodyClient,
  getErrorMessageClient,
  getErrorCodeClient,
  isErrorClient,
} from '../../composables/https/response-errors'
import {
  getSuccessDataClient,
  getSuccessMessageClient,
  isSuccessClient,
} from '../../composables/https/response-success'

// ─── response-errors ────────────────────────────────────────────────────────

describe('getErrorBodyClient', () => {
  it('returns error object when present', () => {
    const res = { error: { message: 'Not found' } }
    expect(getErrorBodyClient(res)).toEqual({ message: 'Not found' })
  })

  it('returns undefined when no error', () => {
    expect(getErrorBodyClient({ data: {} })).toBeUndefined()
  })

  it('returns undefined for null/undefined response', () => {
    expect(getErrorBodyClient(null)).toBeUndefined()
    expect(getErrorBodyClient(undefined)).toBeUndefined()
  })
})

describe('getErrorMessageClient', () => {
  it('returns details message when present', () => {
    const res = { error: { error: { details: 'Validation failed' } } }
    expect(getErrorMessageClient(res)).toBe('Validation failed')
  })

  it('returns default message when details missing', () => {
    const res = { error: { message: 'Server error' } }
    expect(getErrorMessageClient(res)).toBe('เกิดข้อผิดพลาด')
  })

  it('returns default message for response with no error', () => {
    expect(getErrorMessageClient({ data: {} })).toBe('เกิดข้อผิดพลาด')
  })
})

describe('getErrorCodeClient', () => {
  it('returns status code', () => {
    expect(getErrorCodeClient({ status: 404 })).toBe(404)
  })

  it('returns 0 when no status', () => {
    expect(getErrorCodeClient({})).toBe(0)
    expect(getErrorCodeClient(null)).toBe(0)
  })
})

describe('isErrorClient', () => {
  it('returns true when error present', () => {
    expect(isErrorClient({ error: { message: 'fail' } })).toBe(true)
  })

  it('returns false when no error', () => {
    expect(isErrorClient({ data: {} })).toBe(false)
    expect(isErrorClient({})).toBe(false)
  })
})

// ─── response-success ────────────────────────────────────────────────────────

describe('isSuccessClient', () => {
  it('returns true when no error field', () => {
    expect(isSuccessClient({ data: { list: [] } })).toBe(true)
  })

  it('returns false when error field present', () => {
    expect(isSuccessClient({ error: { message: 'fail' } })).toBe(false)
  })
})

describe('getSuccessDataClient', () => {
  it('returns data when response is successful', () => {
    const res = { data: { list: [1, 2, 3] } }
    expect(getSuccessDataClient(res)).toEqual({ list: [1, 2, 3] })
  })

  it('returns empty object when data missing but no error', () => {
    expect(getSuccessDataClient({})).toEqual({})
  })

  it('returns null when response has error', () => {
    const res = { error: { message: 'fail' }, data: { list: [] } }
    expect(getSuccessDataClient(res)).toBeNull()
  })
})

describe('getSuccessMessageClient', () => {
  it('returns message field', () => {
    expect(getSuccessMessageClient({ message: 'Created' })).toBe('Created')
  })

  it('returns empty string when no message', () => {
    expect(getSuccessMessageClient({})).toBe('')
    expect(getSuccessMessageClient(null)).toBe('')
  })
})
