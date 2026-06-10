import { describe, it, expect } from 'vitest'
import {
  supplyCategoryLabel,
  supplyCategoryClass,
} from '../../composables/constants/supply-category'

describe('supplyCategoryLabel', () => {
  it('returns Thai label for FEED', () => {
    expect(supplyCategoryLabel('FEED')).toBe('อาหาร')
  })

  it('returns Thai label for MEDICINE', () => {
    expect(supplyCategoryLabel('MEDICINE')).toBe('ยา')
  })

  it('returns Thai label for VACCINE', () => {
    expect(supplyCategoryLabel('VACCINE')).toBe('วัคซีน')
  })

  it('returns raw value for unknown category', () => {
    expect(supplyCategoryLabel('OTHER')).toBe('OTHER')
    expect(supplyCategoryLabel('')).toBe('')
  })
})

describe('supplyCategoryClass', () => {
  it('returns green class for FEED', () => {
    expect(supplyCategoryClass('FEED')).toBe('bg-green-100 text-green-700')
  })

  it('returns blue class for MEDICINE', () => {
    expect(supplyCategoryClass('MEDICINE')).toBe('bg-blue-100 text-blue-700')
  })

  it('returns purple class for VACCINE', () => {
    expect(supplyCategoryClass('VACCINE')).toBe('bg-purple-100 text-purple-700')
  })

  it('returns gray fallback for unknown category', () => {
    expect(supplyCategoryClass('UNKNOWN')).toBe('bg-gray-100 text-gray-600')
    expect(supplyCategoryClass('')).toBe('bg-gray-100 text-gray-600')
  })
})
