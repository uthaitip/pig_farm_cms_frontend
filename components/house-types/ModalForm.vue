<template>
  <UIBaseModal id="modal-house-type-form" :title="editId ? 'แก้ไขประเภทคอกหมู' : 'เพิ่มประเภทคอกหมู'"
    width="max-w-lg" :show-footer="false" @on-created="(m: any) => (modal = m)">
    <div>
      <UIBaseGenerateFormGrid :fields="fields" :hide-fields="editId ? [] : ['status']" />
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
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'

const EMPTY_FORM = { name: '', note: '', status: 'active' }

const validationSchema = toTypedSchema(zod.object({
  name: zod.string({ required_error: 'กรุณาระบุชื่อประเภทคอก' }).min(1, 'กรุณาระบุชื่อประเภทคอก'),
}))

export default {
  emits: ['onSubmit'],

  setup() {
    const { validate, resetForm, values } = useForm({ validationSchema, initialValues: { ...EMPTY_FORM } })
    return { validate, resetForm, values }
  },

  data() {
    return {
      modal:     null as Modal | null,
      editId:    '' as string,
      formError: '' as string,
    }
  },

  computed: {
    fields(): any[] {
      const v = this.values as any
      return [
        {
          key: 'name', label: 'ชื่อประเภทคอก', type: 'text',
          placeholder: 'เช่น คอกมาตรฐาน', flex: 'full', required: true, useForm: true,
          value: v.name,
        },
        {
          key: 'status', label: 'สถานะ', type: 'dropdown', flex: 'full', useForm: true,
          value: v.status,
          children: [
            { label: 'ใช้งาน',    value: 'active' },
            { label: 'ไม่ใช้งาน', value: 'inactive' },
          ],
        },
        {
          key: 'note', label: 'หมายเหตุ', type: 'textarea',
          placeholder: 'หมายเหตุเพิ่มเติม (ถ้ามี)', flex: 'full', useForm: true,
          value: v.note,
        },
      ]
    },
  },

  methods: {
    show(item?: any) {
      this.editId    = item?._id ?? ''
      this.formError = ''
      this.resetForm({
        values: item
          ? { name: item.name ?? '', note: item.note ?? '', status: item.status ?? 'active' }
          : { ...EMPTY_FORM },
      })
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
        editId: this.editId,
        payload: {
          name:   v.name.trim(),
          note:   v.note || null,
          ...(this.editId ? { status: v.status } : {}),
        },
      })
    },
  },
}
</script>
