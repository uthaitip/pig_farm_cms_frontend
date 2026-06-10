<template>
  <UIBaseModal id="modal-feed-type-form"
    :title="editId ? 'แก้ไขประเภทยาและอาหาร' : 'เพิ่มประเภทยาและอาหาร'"
    width="max-w-md" :show-footer="false" @on-created="(m: any) => (modal = m)">
    <div>
      <UIBaseGenerateFormGrid :fields="fields" @onChange="onFormChange" />
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

const EMPTY_FORM = { feedName: '', category: 'FEED', unit: '', minimumQuantity: 0, description: '' }

export default {
  emits: ['onSubmit'],

  setup() {
    const { validate, resetForm } = useForm()
    return { validate, resetForm }
  },

  data() {
    return {
      modal:      null as Modal | null,
      editId:     '' as string,
      formError:  '' as string,
      formValues: { ...EMPTY_FORM } as any,
    }
  },

  computed: {
    fields(): any[] {
      return [
        {
          key: 'category', label: 'ประเภท', type: 'dropdown', flex: 'full', useForm: false,
          value: this.formValues.category ?? 'FEED',
          children: [
            { label: 'อาหาร', value: 'FEED' },
            { label: 'ยา', value: 'MEDICINE' },
            { label: 'วัคซีน', value: 'VACCINE' },
          ],
        },
        {
          key: 'feedName', label: 'ชื่อ', type: 'text', flex: 'full', required: true, useForm: false,
          value: this.formValues.feedName ?? '',
          placeholder: 'เช่น อาหารหมูขุน, ยาปฏิชีวนะ',
        },
        {
          key: 'unit', label: 'หน่วย', type: 'text', flex: 'full', useForm: false,
          value: this.formValues.unit ?? '',
          placeholder: 'เช่น กระสอบ, กก., ขวด',
        },
        {
          key: 'minimumQuantity', label: 'จำนวน', type: 'number', flex: 'full', min: 0, useForm: false,
          value: this.formValues.minimumQuantity ?? 0,
          placeholder: '0',
        },
        {
          key: 'description', label: 'รายละเอียด', type: 'text', flex: 'full', useForm: false,
          value: this.formValues.description ?? '',
          placeholder: 'รายละเอียดเพิ่มเติม (ถ้ามี)',
        },
      ]
    },
  },

  methods: {
    show(item?: any) {
      this.editId    = item?._id ?? ''
      this.formError = ''
      this.formValues = item
        ? { feedName: item.feedName, category: item.category ?? 'FEED', unit: item.unit ?? '', minimumQuantity: item.minimumQuantity ?? 0, description: item.description ?? '' }
        : { ...EMPTY_FORM }
      const currentValues = Object.fromEntries(this.fields.map((f: any) => [f.key, f.value]))
      this.resetForm({ values: currentValues })
      this.modal?.show()
    },

    hide() { this.modal?.hide() },

    setError(msg: string) { this.formError = msg },

    onFormChange(values: any) {
      const { keyChange, ...rest } = values
      this.formValues = { ...this.formValues, ...rest }
    },

    async onSubmit() {
      const { valid } = await this.validate()
      if (!valid) return
      this.formError = ''
      this.$emit('onSubmit', {
        editId: this.editId,
        payload: {
          feedName:         this.formValues.feedName.trim(),
          category:         this.formValues.category,
          unit:             this.formValues.unit?.trim() || undefined,
          minimumQuantity:  this.formValues.minimumQuantity ?? 0,
          description:      this.formValues.description?.trim() || undefined,
        },
      })
    },
  },
}
</script>
