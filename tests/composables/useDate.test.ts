import { describe, it, expect } from 'vitest'
import {
  formatDateDisplay,
  formatDateSave,
  formatDateDisplayTH,
  formatTimeDisplay,
  formatWithTimezone,
  formatDateTimeDisplayTHStrict,
  getAge,
} from '../../composables/useDate'

describe('formatDateDisplay', () => {
  it('formats date to DD-MM-YYYY by default', () => {
    expect(formatDateDisplay('2024-03-15')).toBe('15-03-2024')
  })

  it('supports custom format', () => {
    expect(formatDateDisplay('2024-03-15', 'YYYY/MM/DD')).toBe('2024/03/15')
  })

  it('returns undefined for falsy input', () => {
    expect(formatDateDisplay(null)).toBeUndefined()
    expect(formatDateDisplay('')).toBeUndefined()
  })
})

describe('formatDateSave', () => {
  it('formats date to YYYY-MM-DD by default', () => {
    expect(formatDateSave('2024-03-15')).toBe('2024-03-15')
  })

  it('returns undefined for falsy input', () => {
    expect(formatDateSave(null)).toBeUndefined()
    expect(formatDateSave('')).toBeUndefined()
  })
})

describe('formatDateDisplayTH', () => {
  it('converts year to Buddhist era (+543)', () => {
    const result = formatDateDisplayTH('2024-01-15')
    expect(result).toBe('15/01/2567')
  })

  it('returns undefined for falsy input', () => {
    expect(formatDateDisplayTH(null)).toBeUndefined()
    expect(formatDateDisplayTH('')).toBeUndefined()
  })
})

describe('formatTimeDisplay', () => {
  it('formats time as HH:mm:ss', () => {
    expect(formatTimeDisplay('2024-03-15T14:30:00')).toBe('14:30:00')
  })

  it('returns undefined for falsy input', () => {
    expect(formatTimeDisplay(null)).toBeUndefined()
  })
})

describe('formatWithTimezone', () => {
  it('returns ISO string with +07:00 offset', () => {
    const result = formatWithTimezone(new Date('2024-03-15T10:00:00.000Z'))
    expect(result).toMatch(/\+07:00$/)
  })

  it('result contains date portion', () => {
    const result = formatWithTimezone(new Date('2024-03-15T10:00:00.000Z'))
    expect(result).toContain('2024-03-15')
  })
})

describe('formatDateTimeDisplayTHStrict', () => {
  it('converts Christian year to Buddhist era', () => {
    const result = formatDateTimeDisplayTHStrict('15/03/2024 10:00', 'DD/MM/YYYY HH:mm', 'DD/MM/YYYY')
    expect(result).toBe('15/03/2567')
  })

  it('returns empty string for invalid date', () => {
    expect(formatDateTimeDisplayTHStrict('invalid')).toBe('')
    expect(formatDateTimeDisplayTHStrict('')).toBe('')
    expect(formatDateTimeDisplayTHStrict(null)).toBe('')
  })
})

describe('getAge', () => {
  it('returns age as string', () => {
    const birthYear = new Date().getFullYear() - 25
    const result = getAge(`${birthYear}-01-01`)
    expect(parseInt(result)).toBeGreaterThanOrEqual(24)
    expect(parseInt(result)).toBeLessThanOrEqual(25)
  })

  it('returns empty string for invalid date', () => {
    expect(getAge('invalid')).toBe('')
  })
})
