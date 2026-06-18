<template>
  <UIBaseModal id="modal-pig-batch-tx" title="บันทึกกิจกรรม" width="max-w-lg" :show-footer="false"
    @on-created="(m: any) => (modal = m)">
    <div>
      <div v-if="batch" class="mb-4 px-3 py-2 bg-primary-50 rounded-lg grid grid-cols-2 gap-x-6 gap-y-2">
        <div>
          <p class="text-xs text-appgray">รหัสรุ่น</p>
          <p class="text-sm font-semibold text-primary">{{ batch.batchCode }}</p>
        </div>
        <div>
          <p class="text-xs text-appgray">ชื่อรุ่น</p>
          <p class="text-sm font-semibold text-primary">{{ batch.batchName ?? '-' }}</p>
        </div>
        <div>
          <p class="text-xs text-appgray">โรงเรือน</p>
          <p class="text-sm font-semibold text-primary">{{ batch.penId?.houseId?.houseName ?? '-' }}</p>
        </div>
        <div>
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
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'

const EMPTY_FORM = {
  transactionType: '', quantity: '', transactionDate: '', remark: '',
}

const validationSchema = toTypedSchema(zod.object({
  transactionType: zod.string({ required_error: 'กรุณาเลือกประเภทกิจกรรม' }).min(1, 'กรุณาเลือกประเภทกิจกรรม'),
  quantity:        zod.coerce.string({ invalid_type_error: 'กรุณาระบุจำนวน' }).min(1, 'กรุณาระบุจำนวน'),
  transactionDate: zod.string({ required_error: 'กรุณาเลือกวันที่' }).min(1, 'กรุณาเลือกวันที่'),
  remark:          zod.string().optional(),
}))

export default {
  emits: ['onSubmit'],

  setup() {
    const { validate, resetForm, values } = useForm({ validationSchema, initialValues: { ...EMPTY_FORM } })
    return { validate, resetForm, values }
  },

  data() {
    return {
      modal: null as any,
      batch: null as IPigBatch | null,
      formError: '' as string,
    }
  },

  computed: {
    fields(): any[] {
      const v = this.values as any
      const base: any[] = [
        {
          key: 'transactionType', label: 'ประเภทกิจกรรม', type: 'dropdown',
          flex: 'full', required: true, useForm: true,
          value: v.transactionType,
          children: [
            { label: 'รับเข้า (RECEIVE)', value: 'RECEIVE' },
            { label: 'ตาย (DEAD)', value: 'DEAD' },
            { label: 'ขาย (SOLD)', value: 'SOLD' },
            { label: 'ปรับจำนวน (ADJUST)', value: 'ADJUST' },
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
      base.push({
        key: 'remark', label: 'หมายเหตุ', type: 'textarea',
        placeholder: 'หมายเหตุ (ถ้ามี)', flex: 'full', useForm: true,
        value: v.remark,
      })
      return base
    },
  },

  methods: {
    show(batch: IPigBatch) {
      this.batch = batch
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
        batchId: this.batch!._id,
        payload: {
          transactionType: v.transactionType,
          quantity: Number(v.quantity),
          transactionDate: v.transactionDate,
          remark: v.remark || null,
        },
      })
    },
  },
}
</script>
