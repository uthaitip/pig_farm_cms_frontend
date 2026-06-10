<template>
  <UIBaseModal id="modal-pig-batch-form" :title="editId ? 'แก้ไขรุ่นหมู' : 'เพิ่มรุ่นหมู'"
    width="max-w-xl" :show-footer="false" @on-created="(m: any) => (modal = m)">
    <div>
      <UIBaseGenerateFormGrid :fields="fields" :hide-fields="editId ? [] : ['status']" />
      <p v-if="formError" class="text-sm text-apperror mt-1">{{ formError }}</p>
      <div class="flex justify-end gap-2 pt-3">
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

const EMPTY_FORM = {
  batchName: '', penId: '', sourceType: '', receivedDate: '',
  initialQuantity: '', averageWeight: '', description: '', status: 'ACTIVE',
}

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
      pens:      [] as any[],
    }
  },

  computed: {
    penOptions(): any[] {
      return [
        { label: '-- กรุณาเลือกคอก --', value: '' },
        ...this.pens.map((p: any) => ({ label: `${p.penCode} - ${p.penName}`, value: p._id })),
      ]
    },
    fields(): any[] {
      const v = this.values as any
      const list: any[] = [
        {
          key: 'batchName', label: 'ชื่อรุ่น', type: 'text',
          placeholder: 'เช่น หมูรุ่น มิ.ย.69', flex: 'full', useForm: true,
          value: v.batchName,
        },
        {
          key: 'penId', label: 'คอก', type: 'dropdown',
          flex: 'full', required: true, useForm: true,
          value: v.penId,
          children: this.penOptions,
        },
        {
          key: 'sourceType', label: 'แหล่งที่มา', type: 'dropdown',
          flex: 'half', required: true, useForm: true,
          value: v.sourceType,
          children: [
            { label: '-- กรุณาเลือกที่มาหมู --', value: '' },
            ...Object.entries(SourceTypeMsg).map(([value, label]) => ({ label, value })),
          ],
        },
        {
          key: 'receivedDate', label: 'วันที่รับเข้า', type: 'datepicker',
          flex: 'half', required: true, useForm: true,
          value: v.receivedDate,
        },
        {
          key: 'initialQuantity', label: 'จำนวนเริ่มต้น (ตัว)', type: 'number',
          placeholder: '0', flex: 'half', required: true, useForm: true,
          value: v.initialQuantity,
        },
        {
          key: 'averageWeight', label: 'น้ำหนักเฉลี่ย (กก.)', type: 'number',
          placeholder: '0', flex: 'half', useForm: true,
          value: v.averageWeight,
        },
        {
          key: 'description', label: 'หมายเหตุ', type: 'textarea',
          placeholder: 'หมายเหตุเพิ่มเติม (ถ้ามี)', flex: 'full', useForm: true,
          value: v.description,
        },
        {
          key: 'status', label: 'สถานะ', type: 'dropdown', flex: 'full', useForm: true,
          value: v.status,
          children: [
            { label: 'กำลังเลี้ยง', value: 'ACTIVE' },
            { label: 'ปิดรุ่นแล้ว', value: 'CLOSED' },
          ],
        },
      ]
      return list
    },
  },

  methods: {
    async show(item?: any) {
      this.editId    = item?._id ?? ''
      this.formError = ''
      this.resetForm({
        values: item ? {
          batchName:       item.batchName       ?? '',
          penId:           item.penId           ?? '',
          sourceType:      item.sourceType      ?? '',
          receivedDate:    item.receivedDate     ?? '',
          initialQuantity: item.initialQuantity != null ? String(item.initialQuantity) : '',
          averageWeight:   item.averageWeight   != null ? String(item.averageWeight)   : '',
          description:     item.description     ?? '',
          status:          item.status          ?? 'ACTIVE',
        } : { ...EMPTY_FORM },
      })
      await this.loadPens()
      this.modal?.show()
    },
    hide() { this.modal?.hide() },
    setError(msg: string) { this.formError = msg },

    async loadPens() {
      try {
        const response = await useFetchGetClient(apiBffPens, {
          params: { page: 1, limit: 999, filter: JSON.stringify({ statusPens: 'notFull' }) },
        })
        this.pens = getSuccessDataClient(response)?.list ?? []
      } catch {}
    },

    async onSubmit() {
      const { valid } = await this.validate()
      if (!valid) return
      this.formError = ''
      const v = this.values as any
      this.$emit('onSubmit', {
        editId: this.editId,
        payload: {
          batchName:       v.batchName       || null,
          penId:           v.penId,
          sourceType:      v.sourceType,
          receivedDate:    v.receivedDate,
          initialQuantity: Number(v.initialQuantity),
          averageWeight:   v.averageWeight ? Number(v.averageWeight) : null,
          description:     v.description   || null,
          ...(this.editId ? { status: v.status } : {}),
        },
      })
    },
  },
}
</script>
