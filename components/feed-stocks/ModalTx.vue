<template>
  <UIBaseModal id="modal-feed-tx"
    :title="txType === 'IN' ? `รับเข้า · ${stock?.feedTypeId?.feedName}` : `เบิกใช้ · ${stock?.feedTypeId?.feedName}`"
    width="max-w-sm" :show-footer="false" @on-created="(m: any) => (modal = m)">
    <div class="flex flex-col gap-3">
      <div class="space-y-3">
        <div class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
          <span class="text-xs text-appgray">คงเหลือปัจจุบัน</span>
          <span class="font-bold text-appblack">
            {{ stock?.currentQuantity?.toLocaleString() }}
            <span class="text-sm font-normal">{{ stock?.feedTypeId?.unit }}</span>
          </span>
        </div>

        <div>
          <label class="text-xs text-appgray mb-1 block">
            {{ txType === 'IN' ? 'จำนวนที่รับเข้า' : 'จำนวนที่เบิก' }}
            <span class="text-apperror">*</span>
          </label>
          <input v-model.number="txForm.quantity" type="number" min="1" placeholder="0"
            class="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-primary-500 focus:border-primary-500"
            :class="formErrors.quantity ? 'border-apperror' : ''"
            @input="calcTotal" />
          <p v-if="formErrors.quantity" class="text-xs text-apperror mt-0.5">{{ formErrors.quantity }}</p>
        </div>

        <template v-if="txType === 'IN'">
          <div>
            <label class="text-xs text-appgray mb-1 block">ราคาต่อหน่วย (บาท)</label>
            <input :value="txForm.unitPrice" type="text" inputmode="decimal" placeholder="0.00"
              class="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-primary-500 focus:border-primary-500"
              @input="onUnitPriceInput" />
          </div>
          <div>
            <label class="text-xs text-appgray mb-1 block">ยอดรวม (บาท)</label>
            <input :value="txForm.totalAmount" type="text" inputmode="decimal" placeholder="0.00"
              class="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-primary-500 focus:border-primary-500"
              @input="onTotalAmountInput" />
          </div>
        </template>

        <div>
          <ClientOnly fallback-tag="span" fallback="">
            <UIBaseDatePicker
              :field="{ key: 'transactionDate', label: 'วันที่', value: txForm.transactionDate, required: true, useForm: false, width: 'full' }"
              @onChange="onTxDateChange" />
          </ClientOnly>
          <p v-if="formErrors.transactionDate" class="text-xs text-apperror mt-0.5">{{ formErrors.transactionDate }}</p>
        </div>

        <div v-if="txType === 'OUT'">
          <label class="text-xs text-appgray mb-1 block">ล็อตหมู (ถ้ามี)</label>
          <select v-model="txForm.batchId"
            class="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-primary-500 focus:border-primary-500 bg-white">
            <option value="">-- ไม่ระบุล็อต --</option>
            <option v-for="b in batches" :key="b._id" :value="b._id">
              {{ b.batchCode }}{{ b.batchName ? ' · ' + b.batchName : '' }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-xs text-appgray mb-1 block">หมายเหตุ</label>
          <input v-model="txForm.note" type="text" placeholder="หมายเหตุ (ถ้ามี)"
            class="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-primary-500 focus:border-primary-500" />
        </div>
      </div>

      <p v-if="txError" class="text-sm text-apperror">{{ txError }}</p>
      <div class="flex justify-end gap-2 pt-1 border-t border-gray-100">
        <button type="button" class="px-4 py-2 text-sm border border-appborder rounded-lg hover:bg-gray-50"
          @click="modal?.hide()">ยกเลิก</button>
        <button type="button"
          :class="txType === 'IN' ? 'bg-appsuccess hover:bg-green-600' : 'bg-appwarning hover:bg-orange-600'"
          class="px-4 py-2 text-sm text-white rounded-lg" @click="onSubmit">
          {{ txType === 'IN' ? 'รับเข้า' : 'เบิกใช้' }}
        </button>
      </div>
    </div>
  </UIBaseModal>
</template>

<script lang="ts">
import type { Modal } from 'flowbite'
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import { formatNumberComma, formatNumberByString, numberDecimalOnly } from '~/composables/constants/number'

const EMPTY_FORM = { quantity: null as number | null, unitPrice: '', totalAmount: '', transactionDate: '', batchId: '', note: '' }

const validationSchema = toTypedSchema(zod.object({
  quantity:        zod.number({ required_error: 'กรุณาระบุจำนวน', invalid_type_error: 'กรุณาระบุจำนวน' }).min(1, 'จำนวนต้องมากกว่า 0'),
  transactionDate: zod.string({ required_error: 'กรุณาระบุวันที่' }).min(1, 'กรุณาระบุวันที่'),
}))

export default {
  props: {
    batches: { type: Array, default: () => [] },
  },
  emits: ['onSubmit'],

  setup() {
    const { validate, setValues, errors } = useForm({ validationSchema })
    return { validate, setValues, formErrors: errors }
  },

  data() {
    return {
      modal:   null as Modal | null,
      stock:   null as any,
      txType:  'IN' as 'IN' | 'OUT',
      txForm:  { ...EMPTY_FORM } as any,
      txError: '' as string,
    }
  },

  methods: {
    show(stock: any, type: 'IN' | 'OUT') {
      this.stock   = stock
      this.txType  = type
      this.txError = ''
      this.txForm  = { ...EMPTY_FORM, transactionDate: new Date().toISOString().slice(0, 10) }
      this.$nextTick(() => this.modal?.show())
    },

    hide() { this.modal?.hide() },

    setError(msg: string) { this.txError = msg },

    onTxDateChange(payload: any) {
      const d: Date = payload.value
      if (d instanceof Date) {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        this.txForm.transactionDate = `${y}-${m}-${day}`
      }
    },

    onUnitPriceInput(e: Event) {
      const raw = numberDecimalOnly((e.target as HTMLInputElement).value)
      this.txForm.unitPrice = formatNumberComma(raw, 2, '', true)
      this.calcTotal()
    },

    onTotalAmountInput(e: Event) {
      const raw = numberDecimalOnly((e.target as HTMLInputElement).value)
      this.txForm.totalAmount = formatNumberComma(raw, 2, '', true)
    },

    calcTotal() {
      const q = this.txForm.quantity ?? 0
      const p = formatNumberByString(this.txForm.unitPrice)
      if (q > 0 && p > 0) {
        this.txForm.totalAmount = formatNumberComma(q * p, 2, '', true)
      }
    },

    async onSubmit() {
      this.txError = ''
      this.setValues({ quantity: this.txForm.quantity ?? undefined, transactionDate: this.txForm.transactionDate })
      const { valid } = await this.validate()
      if (!valid) return
      if (this.txType === 'OUT' && this.txForm.quantity > (this.stock?.currentQuantity ?? 0)) {
        this.txError = `ไม่สามารถเบิกได้ — คงเหลือมีเพียง ${(this.stock?.currentQuantity ?? 0).toLocaleString()} ${this.stock?.feedTypeId?.unit ?? ''}`
        return
      }

      const payload: any = {
        quantity:        this.txForm.quantity,
        transactionDate: this.txForm.transactionDate,
        note:            this.txForm.note || undefined,
      }
      if (this.txType === 'IN') {
        const unitPrice   = formatNumberByString(this.txForm.unitPrice)
        const totalAmount = formatNumberByString(this.txForm.totalAmount)
        if (unitPrice > 0)   payload.unitPrice   = unitPrice
        if (totalAmount > 0) payload.totalAmount = totalAmount
      }
      if (this.txType === 'OUT' && this.txForm.batchId) {
        payload.batchId = this.txForm.batchId
      }

      this.$emit('onSubmit', { type: this.txType, stockId: this.stock._id, payload })
    },
  },
}
</script>
