<template>
  <UIBaseModal id="modal-mgmt-role-add" title="เพิ่มสิทธิ์" width="max-w-md" :show-footer="false"
    @on-created="(m: any) => (modal = m)">
    <div>
      <UIBaseGenerateFormGrid :fields="fields" />
      <p v-if="formError" class="text-sm text-apperror mt-1">{{ formError }}</p>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" class="px-4 py-2 text-sm border border-appborder rounded-lg hover:bg-gray-50"
          @click="modal?.hide()">ยกเลิก</button>
        <button type="button" class="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
          @click="onSubmit">บันทึก</button>
      </div>
    </div>
  </UIBaseModal>
</template>

<script lang="ts">
import type { Modal } from 'flowbite'

const EMPTY_FORM = { code: '', name: '', description: '' }

export default {
  emits: ['onSubmit'],

  setup() {
    const { validate, resetForm, values } = useForm({ initialValues: { ...EMPTY_FORM } })
    return { validate, resetForm, values }
  },

  data() {
    return {
      modal:     null as Modal | null,
      formError: '' as string,
    }
  },

  computed: {
    fields(): any[] {
      const v = this.values as any
      return [
        {
          key: 'code', label: 'รหัสสิทธิ์', type: 'text',
          placeholder: 'เช่น ADMIN, STAFF', flex: 'full', required: true, useForm: true,
          value: v.code,
        },
        {
          key: 'name', label: 'ชื่อสิทธิ์', type: 'text',
          placeholder: 'ชื่อสิทธิ์', flex: 'full', required: true, useForm: true,
          value: v.name,
        },
        {
          key: 'description', label: 'คำอธิบาย', type: 'text',
          placeholder: 'คำอธิบาย (ถ้ามี)', flex: 'full', useForm: true,
          value: v.description,
        },
      ]
    },
  },

  methods: {
    show() {
      this.formError = ''
      this.resetForm({ values: { ...EMPTY_FORM } })
      this.modal?.show()
    },
    hide() { this.modal?.hide() },
    setError(msg: string) { this.formError = msg },

    async onSubmit() {
      const { valid } = await this.validate()
      if (!valid) return
      this.formError = ''
      const v = this.values as any
      this.$emit('onSubmit', {
        payload: {
          code:        v.code.trim().toUpperCase(),
          name:        v.name.trim(),
          description: v.description.trim() || undefined,
          status:      'active',
        },
      })
    },
  },
}
</script>
