<template>
  <UIBaseModal id="modal-customer-form" :title="editId ? 'แก้ไขลูกค้า' : 'เพิ่มลูกค้า'" width="max-w-lg"
    :show-footer="false" @on-created="(m: any) => (modal = m)">
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

const EMPTY_FORM = { customerName: '', contactName: '', phoneNumber: '', address: '', note: '', status: 'ACTIVE' }

export default {
  emits: ['onSubmit'],

  setup() {
    const { validate, resetForm, values } = useForm({ initialValues: { ...EMPTY_FORM } })
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
      return [
        {
          key: 'customerName', label: 'ชื่อลูกค้า', type: 'text', flex: 'full', required: true, useForm: true,
          value: (this.values as any).customerName,
          placeholder: 'ชื่อลูกค้า / ชื่อบริษัท',
        },
        {
          key: 'contactName', label: 'ผู้ติดต่อ', type: 'text', flex: 'half', useForm: true,
          value: (this.values as any).contactName,
          placeholder: 'ชื่อผู้ติดต่อ',
        },
        {
          key: 'phoneNumber', label: 'เบอร์โทร', type: 'text', flex: 'half', useForm: true,
          value: (this.values as any).phoneNumber,
          placeholder: '0xx-xxx-xxxx',
        },
        {
          key: 'address', label: 'ที่อยู่', type: 'textarea', flex: 'full', useForm: true,
          value: (this.values as any).address,
          placeholder: 'ที่อยู่',
        },
        {
          key: 'note', label: 'หมายเหตุ', type: 'textarea', flex: 'full', useForm: true,
          value: (this.values as any).note,
          placeholder: 'หมายเหตุ (ถ้ามี)',
        },
        {
          key: 'status', label: 'สถานะ', type: 'dropdown', flex: 'full', useForm: true,
          value: (this.values as any).status,
          children: [
            { label: 'ใช้งาน', value: 'ACTIVE' },
            { label: 'ปิดใช้งาน', value: 'INACTIVE' },
          ],
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
          ? {
              customerName: item.customerName ?? '',
              contactName:  item.contactName  ?? '',
              phoneNumber:  item.phoneNumber  ?? '',
              address:      item.address      ?? '',
              note:         item.note         ?? '',
              status:       item.status       ?? 'ACTIVE',
            }
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
          customerName: v.customerName.trim(),
          contactName:  v.contactName  || null,
          phoneNumber:  v.phoneNumber  || null,
          address:      v.address      || null,
          note:         v.note         || null,
          ...(this.editId ? { status: v.status } : {}),
        },
      })
    },
  },
}
</script>
