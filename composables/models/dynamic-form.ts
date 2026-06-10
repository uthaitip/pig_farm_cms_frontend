import { InputFieldGrid } from './input-field-grid'
import type { IDynamicFormField, IDynamicFormValidation } from '../interfaces/dynamic-form'

export class DynamicFormField extends InputFieldGrid implements IDynamicFormField {
  validations: IDynamicFormValidation[]
  hidden: boolean
  col: 1 | 2

  constructor(params: Partial<IDynamicFormField>) {
    super(params)
    Object.assign(this, {
      validations: [],
      hidden: false,
      col: 2,
      ...params,
    })
    this.validations = params.validations ?? []
    this.hidden      = params.hidden ?? false
    this.col         = params.col ?? 2
  }
}

export function validateField(field: IDynamicFormField, value: any): string {
  for (const v of field.validations ?? []) {
    switch (v.rule) {
      case 'required':
        if (!value && value !== 0)
          return v.message ?? `${field.label} จำเป็นต้องกรอก`
        break
      case 'minLength':
        if (typeof value === 'string' && value.length < v.value)
          return v.message ?? `${field.label} ต้องมีอย่างน้อย ${v.value} ตัวอักษร`
        break
      case 'maxLength':
        if (typeof value === 'string' && value.length > v.value)
          return v.message ?? `${field.label} ต้องไม่เกิน ${v.value} ตัวอักษร`
        break
      case 'min':
        if (Number(value) < v.value)
          return v.message ?? `${field.label} ต้องไม่น้อยกว่า ${v.value}`
        break
      case 'max':
        if (Number(value) > v.value)
          return v.message ?? `${field.label} ต้องไม่เกิน ${v.value}`
        break
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return v.message ?? `${field.label} รูปแบบอีเมลไม่ถูกต้อง`
        break
      case 'pattern':
        if (!new RegExp(v.value).test(value))
          return v.message ?? `${field.label} รูปแบบไม่ถูกต้อง`
        break
    }
  }
  return ''
}
