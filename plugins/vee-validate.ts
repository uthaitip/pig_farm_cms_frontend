import { defineRule } from 'vee-validate'

export default defineNuxtPlugin(() => {
  defineRule('required', (value: any) => {
    if (value === null || value === undefined) return 'กรุณากรอกข้อมูล'
    if (typeof value === 'string' && !value.trim()) return 'กรุณากรอกข้อมูล'
    if (Array.isArray(value) && !value.length) return 'กรุณากรอกข้อมูล'
    return true
  })
})
