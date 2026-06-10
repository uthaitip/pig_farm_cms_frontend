<template>
  <div class="grid mb-6 grid-cols-2 gap-x-8 gap-y-6">
    <template v-for="(field, index) in parseDefaultFields" :key="`field_${field.key}`">
      <div v-if="canShow(field.key)" class="col-span-2" :class="{ 'sm:col-span-1': field.flex !== 'full' }">
        <template v-if="$slots[field.key] && canShow(field.key)">
          <slot :name="field.key" :key="`content_${index}`" :data="{ ...field, index: index }"></slot>
        </template>
        <template v-else>
          <div v-if="field.type === 'topic'" v-show="canShow(field.key)">
            <div class="flex items-start justify-between pb-2 border-b-[3px] border-b-primary rounded-t mb-4">
              <h3 class="pt-2 font-semibold text-primary">{{ field?.label ?? '' }}</h3>
            </div>
          </div>
          <div v-if="field.type === 'empty'" v-show="canShow(field.key)">
            <div class="h-[20px]"></div>
          </div>
          <div v-else-if="field.type === 'text' || field.type === 'number' || field.type === 'password'" v-show="canShow(field.key)">
            <UIBaseInputField :field="field"
              @onClickSuffix="() => onClickSuffix(field.key)"
              @onChange="(value) => onChange(field.key, value)"
              @onComplete="(value) => onComplete(field.key, value)" />
          </div>
          <div v-else-if="field.type === 'radio'" v-show="canShow(field.key)">
            <UIBaseRadio :field="field" @onChange="(value) => onChange(field.key, value)" />
          </div>
          <div v-else-if="field.type === 'checkbox'" class="w-full h-full" v-show="canShow(field.key)">
            <UIBaseCheckbox :field="field" @onChange="(value) => onChange(field.key, value)" />
          </div>
          <div v-else-if="field.type === 'datepicker'" v-show="canShow(field.key)">
            <ClientOnly fallback-tag="span" fallback="">
              <UIBaseDatePicker :field="field" @onChange="(value) => onChange(field.key, value)" />
            </ClientOnly>
          </div>
          <div v-else-if="field.type === 'dropdown'" v-show="canShow(field.key)">
            <UIBaseDropdown :field="field" @onChange="(value) => onChange(field.key, value)" />
          </div>
          <div v-else-if="field.type === 'file'" v-show="canShow(field.key)">
            <ClientOnly>
              <UIBaseInputFile :field="field" @onChange="(value) => onChange(field.key, value)" />
            </ClientOnly>
          </div>
          <div v-else-if="field.type === 'textarea'" v-show="canShow(field.key)">
            <UIBaseTextarea :field="field" @onChange="(value) => onChange(field.key, value)" />
          </div>
          <div v-else></div>
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    fields:         { type: Array<Object>, required: true },
    hideFields:     { type: Array<String>, default: () => [] },
    disabledFields: { type: Array<String>, default: () => [] },
  },
  emits: ['onClickSuffix', 'onChange', 'onComplete'],
  computed: {
    parseDefaultFields() {
      return (this.fields as any[]).map((e: any) => {
        const hasDisabled = !(this.disabledFields as string[]).includes(`[not].${e.key}`) &&
          ((this.disabledFields as string[]).includes(e.key) || (this.disabledFields as string[]).includes('*'))
        return { flex: 'half', ...e, disabled: hasDisabled ? true : e.disabled }
      })
    },
  },
  methods: {
    onClickSuffix(key: string) {
      this.$emit('onClickSuffix', { keyChange: key })
    },
    onChange(key: string, payload: any) {
      const value = payload?.value !== undefined ? payload.value : payload
      this.$emit('onChange', { keyChange: key, [key]: value })
    },
    onComplete(key: string, payload: any) {
      const value = payload?.value !== undefined ? payload.value : payload
      this.$emit('onComplete', { keyChange: key, [key]: value })
    },
    canShow(key: string) {
      const h = this.hideFields as string[]
      return h.includes(`[not].${key}`) || (!h.includes(key) && !h.includes('*'))
    },
    getValues() {
      return Object.fromEntries((this.fields as any[]).map((f: any) => [f.key, f.value ?? '']))
    },
  },
}
</script>
