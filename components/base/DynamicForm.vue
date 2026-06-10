<template>
  <div>
    <template v-for="(section, sIdx) in config.sections" :key="`section_${sIdx}`">
      <!-- Section title -->
      <div v-if="section.title" class="flex items-start justify-between pb-2 border-b-[3px] border-b-primary rounded-t mb-4 mt-6">
        <h3 class="pt-2 font-semibold text-primary">{{ section.title }}</h3>
      </div>

      <!-- Fields grid -->
      <div class="grid grid-cols-2 gap-x-8 gap-y-6 mb-6">
        <template v-for="field in parsedFields(section.fields)" :key="field.key">
          <div
            v-if="!field.hidden"
            :class="[field.flex === 'full' || field.col === 1 ? 'col-span-2' : 'col-span-2 sm:col-span-1']"
          >
            <!-- Custom slot -->
            <template v-if="$slots[field.key!]">
              <slot :name="field.key" :data="field" />
            </template>

            <!-- Topic -->
            <template v-else-if="field.type === 'topic'">
              <div class="flex items-start justify-between pb-2 border-b-[3px] border-b-primary rounded-t mb-4">
                <h3 class="pt-2 font-semibold text-primary">{{ field.label }}</h3>
              </div>
            </template>

            <!-- Empty spacer -->
            <template v-else-if="field.type === 'empty'">
              <div class="h-[20px]" />
            </template>

            <!-- Text / Number -->
            <template v-else-if="field.type === 'text' || field.type === 'number'">
              <UIBaseInputField
                :field="{ ...field, disabled: isDisabled(field) }"
                @onChange="(v: any) => onChange(field.key!, v)"
                @onClickSuffix="() => $emit('onClickSuffix', field.key)"
              />
              <p v-if="errors[field.key!]" class="mt-1 text-xs text-red-500">{{ errors[field.key!] }}</p>
            </template>

            <!-- Datepicker -->
            <template v-else-if="field.type === 'datepicker'">
              <ClientOnly>
                <UIBaseDatePicker
                  :field="{ ...field, disabled: isDisabled(field) }"
                  @onChange="(v: any) => onChange(field.key!, v)"
                />
              </ClientOnly>
              <p v-if="errors[field.key!]" class="mt-1 text-xs text-red-500">{{ errors[field.key!] }}</p>
            </template>

            <!-- Dropdown -->
            <template v-else-if="field.type === 'dropdown'">
              <UIBaseDropdown
                :field="{ ...field, disabled: isDisabled(field) }"
                @onChange="(v: any) => onChange(field.key!, v)"
              />
              <p v-if="errors[field.key!]" class="mt-1 text-xs text-red-500">{{ errors[field.key!] }}</p>
            </template>

            <!-- Radio -->
            <template v-else-if="field.type === 'radio'">
              <UIBaseRadio
                :field="{ ...field, disabled: isDisabled(field) }"
                @onChange="(v: any) => onChange(field.key!, v)"
              />
              <p v-if="errors[field.key!]" class="mt-1 text-xs text-red-500">{{ errors[field.key!] }}</p>
            </template>

            <!-- Checkbox -->
            <template v-else-if="field.type === 'checkbox'">
              <UIBaseCheckbox
                :field="{ ...field, disabled: isDisabled(field) }"
                @onChange="(v: any) => onChange(field.key!, v)"
              />
            </template>

            <!-- Textarea -->
            <template v-else-if="field.type === 'textarea'">
              <UIBaseTextarea
                :field="{ ...field, disabled: isDisabled(field) }"
                @onChange="(v: any) => onChange(field.key!, v)"
              />
              <p v-if="errors[field.key!]" class="mt-1 text-xs text-red-500">{{ errors[field.key!] }}</p>
            </template>

            <!-- File -->
            <template v-else-if="field.type === 'file'">
              <ClientOnly>
                <UIBaseInputFile
                  :field="{ ...field, disabled: isDisabled(field) }"
                  @onChange="(v: any) => onChange(field.key!, v)"
                />
              </ClientOnly>
            </template>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import type { PropType } from 'vue'
import type { IDynamicFormConfig, IDynamicFormField, FormMode } from '../../composables/interfaces/dynamic-form'
import { DynamicFormField, validateField } from '../../composables/models/dynamic-form'

export default defineComponent({
  name: 'UIDynamicForm',

  props: {
    config: {
      type: Object as PropType<IDynamicFormConfig>,
      required: true,
    },
    initialValues: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    hideFields: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    disabledFields: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },

  emits: ['onChange', 'onClickSuffix', 'onSubmit'],

  setup() {
    return {}
  },

  data() {
    return {
      values: {} as Record<string, any>,
      errors: {} as Record<string, string>,
    }
  },

  mounted() {
    // init values from initialValues or field defaults
    this.config.sections.forEach((section) => {
      section.fields.forEach((f) => {
        this.values[f.key!] = this.initialValues[f.key!] ?? f.value ?? ''
      })
    })
  },

  methods: {
    parsedFields(fields: IDynamicFormField[]): IDynamicFormField[] {
      return fields.map((f) => new DynamicFormField({
        ...f,
        hidden: this.hideFields.includes(f.key!) ? true : f.hidden,
        value: this.values[f.key!] ?? f.value ?? '',
      }))
    },

    isDisabled(field: IDynamicFormField): boolean {
      if (this.config.mode === 'view') return true
      if (this.disabledFields.includes('*')) return !this.disabledFields.includes(`[not].${field.key}`)
      if (this.disabledFields.includes(field.key!)) return true
      return field.disabled ?? false
    },

    onChange(key: string, value: any) {
      this.values = { ...this.values, [key]: value }
      // validate on change
      const allFields = this.config.sections.flatMap((s) => s.fields)
      const field = allFields.find((f) => f.key === key)
      if (field) {
        this.errors = { ...this.errors, [key]: validateField(field, value) }
      }
      this.$emit('onChange', { keyChange: key, values: this.values })
    },

    validate(): boolean {
      let valid = true
      const newErrors: Record<string, string> = {}
      this.config.sections.forEach((section) => {
        section.fields.forEach((field) => {
          if (field.hidden || this.hideFields.includes(field.key!)) return
          const err = validateField(field, this.values[field.key!])
          if (err) {
            newErrors[field.key!] = err
            valid = false
          }
        })
      })
      this.errors = newErrors
      return valid
    },

    getValues(): Record<string, any> {
      return { ...this.values }
    },

    reset() {
      this.values = {}
      this.errors = {}
      this.config.sections.forEach((section) => {
        section.fields.forEach((f) => {
          this.values[f.key!] = f.value ?? ''
        })
      })
    },
  },

  watch: {
    initialValues(newVal: Record<string, any>) {
      this.values = { ...this.values, ...newVal }
    },
  },

  computed: {},
})
</script>
