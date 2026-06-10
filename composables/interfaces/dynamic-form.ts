import type { IInputFieldGrid } from './input-field-grid'

export type FormMode = 'create' | 'edit' | 'view'

export interface IDynamicFormField extends IInputFieldGrid {
  validations?: IDynamicFormValidation[]
  hidden?: boolean
  col?: 1 | 2
}

export interface IDynamicFormValidation {
  rule: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'email' | 'pattern'
  value?: any
  message?: string
}

export interface IDynamicFormSection {
  title?: string
  fields: IDynamicFormField[]
}

export interface IDynamicFormConfig {
  mode: FormMode
  sections: IDynamicFormSection[]
}

export interface IDynamicFormEmit {
  keyChange: string
  values: Record<string, any>
}
