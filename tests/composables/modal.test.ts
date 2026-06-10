import { describe, it, expect, vi } from 'vitest'
import {
  defaultAlertSuccess,
  defaultAlertError,
  defaultAlertConfirm,
  defaultAlertWarning,
} from '../../composables/modal'

describe('defaultAlertSuccess', () => {
  it('uses default title', () => {
    const result = defaultAlertSuccess()
    expect(result.title).toBe('ทำรายการสำเร็จ')
  })

  it('uses custom title', () => {
    const result = defaultAlertSuccess('บันทึกสำเร็จ')
    expect(result.title).toBe('บันทึกสำเร็จ')
  })

  it('has correct default button texts', () => {
    const result = defaultAlertSuccess()
    expect(result.btnSubmitText).toBe('ตกลง')
    expect(result.btnCancelText).toBe('')
  })

  it('allows custom button text', () => {
    const result = defaultAlertSuccess('OK', { btnSubmitText: 'ปิด' })
    expect(result.btnSubmitText).toBe('ปิด')
  })

  it('sets success icon styling', () => {
    const result = defaultAlertSuccess()
    expect(result.iconColor).toContain('bg-primary-500')
  })
})

describe('defaultAlertError', () => {
  it('uses default title', () => {
    const result = defaultAlertError()
    expect(result.title).toBe('ทำรายการไม่สำเร็จ')
  })

  it('sets error icon', () => {
    const result = defaultAlertError()
    expect(result.icon).toBe('x-mark')
  })

  it('sets error icon color', () => {
    const result = defaultAlertError()
    expect(result.iconColor).toContain('bg-red-800')
  })
})

describe('defaultAlertConfirm', () => {
  it('uses default title', () => {
    const onSubmit = vi.fn()
    const result = defaultAlertConfirm(undefined as any, onSubmit)
    expect(result.title).toBe('ยืนยันการดำเนินการ')
  })

  it('sets custom title', () => {
    const onSubmit = vi.fn()
    const result = defaultAlertConfirm('ยืนยันการลบ?', onSubmit)
    expect(result.title).toBe('ยืนยันการลบ?')
  })

  it('attaches onSubmit handler', () => {
    const onSubmit = vi.fn()
    const result = defaultAlertConfirm('ยืนยัน', onSubmit)
    expect(result.onSubmit).toBe(onSubmit)
  })

  it('has cancel button by default', () => {
    const result = defaultAlertConfirm('ยืนยัน', vi.fn())
    expect(result.btnCancelText).toBe('ยกเลิก')
  })

  it('sets trash icon', () => {
    const result = defaultAlertConfirm('ยืนยัน', vi.fn())
    expect(result.icon).toBe('trash')
  })
})

describe('defaultAlertWarning', () => {
  it('uses default title', () => {
    const result = defaultAlertWarning(undefined as any, vi.fn())
    expect(result.title).toBe('คำเตือน')
  })

  it('sets warning icon', () => {
    const result = defaultAlertWarning('แจ้งเตือน', vi.fn())
    expect(result.icon).toBe('exclamation-circle')
  })

  it('attaches onSubmit handler', () => {
    const onSubmit = vi.fn()
    const result = defaultAlertWarning('แจ้งเตือน', onSubmit)
    expect(result.onSubmit).toBe(onSubmit)
  })
})
