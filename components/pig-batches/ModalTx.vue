<template>
  <UIBaseModal id="modal-pig-batch-tx" title="บันทึกเหตุการณ์" width="max-w-lg" :show-footer="false"
    @on-created="(m: any) => (modal = m)">
    <div>
      <div v-if="batch" class="mb-4 px-3 py-2 bg-primary-50 rounded-lg flex gap-6">
        <div class="flex-1">
          <p class="text-xs text-appgray">รหัสรุ่น</p>
          <p class="text-sm font-semibold text-primary">{{ batch.batchCode }}</p>
        </div>
        <div class="flex-1">
          <p class="text-xs text-appgray">ชื่อรุ่น</p>
          <p class="text-sm font-semibold text-primary">{{ batch.batchName ?? '-' }}</p>
        </div>
        <div class="flex-1">
          <p class="text-xs text-appgray">จำนวนปัจจุบัน</p>
          <p class="text-sm font-semibold text-primary">{{ batch.currentQuantity }} ตัว</p>
        </div>
      </div>

      <UIBaseGenerateFormGrid :fields="fields" />
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
  transactionType: '', quantity: '', transactionDate: '',
  fromPenId: '', toPenId: '', remark: '',
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
      batch:     null as IPigBatch | null,
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
      const base: any[] = [
        {
          key: 'transactionType', label: 'ประเภทเหตุการณ์', type: 'dropdown',
          flex: 'full', required: true, useForm: true,
          value: v.transactionType,
          children: [
            { label: 'รับเข้า (RECEIVE)',      value: 'RECEIVE' },
            { label: 'ย้ายเข้า (MOVE_IN)',     value: 'MOVE_IN' },
            { label: 'ย้ายออก (MOVE_OUT)',     value: 'MOVE_OUT' },
            { label: 'ตาย (DEAD)',             value: 'DEAD' },
            { label: 'ขาย (SOLD)',             value: 'SOLD' },
            { label: 'ปรับจำนวน (ADJUST)',    value: 'ADJUST' },
          ],
        },
        {
          key: 'quantity', label: 'จำนวน (ตัว)', type: 'number',
          placeholder: '0', flex: 'half', required: true, useForm: true,
          value: v.quantity,
        },
        {
          key: 'transactionDate', label: 'วันที่', type: 'datepicker',
          flex: 'half', required: true, useForm: true,
          value: v.transactionDate,
        },
      ]
      if (['MOVE_IN', 'MOVE_OUT'].includes(v.transactionType)) {
        base.push(
          {
            key: 'fromPenId', label: 'คอกจาก', type: 'dropdown',
            flex: 'half', useForm: true,
            value: v.fromPenId,
            children: this.penOptions,
          },
          {
            key: 'toPenId', label: 'คอกไป', type: 'dropdown',
            flex: 'half', useForm: true,
            value: v.toPenId,
            children: this.penOptions,
          },
        )
      }
      base.push({
        key: 'remark', label: 'หมายเหตุ', type: 'textarea',
        placeholder: 'หมายเหตุ (ถ้ามี)', flex: 'full', useForm: true,
        value: v.remark,
      })
      return base
    },
  },

  methods: {
    async show(batch: IPigBatch) {
      this.batch     = batch
      this.formError = ''
      this.resetForm({ values: { ...EMPTY_FORM } })
      await this.loadPens()
      this.modal?.show()
    },
    hide() { this.modal?.hide() },
    setError(msg: string) { this.formError = msg },

    async loadPens() {
      try {
        const response = await useFetchGetClient(apiBffPens, {
          params: { page: 1, limit: 999 },
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
        batchId: this.batch!._id,
        payload: {
          transactionType: v.transactionType,
          quantity:        Number(v.quantity),
          transactionDate: v.transactionDate,
          fromPenId:       v.fromPenId || null,
          toPenId:         v.toPenId   || null,
          remark:          v.remark    || null,
        },
      })
    },
  },
}
</script>
