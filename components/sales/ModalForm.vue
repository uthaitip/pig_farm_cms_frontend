<template>
  <UIBaseModal id="modal-sale-form" title="บันทึกการขาย" width="max-w-2xl" :show-footer="false"
    @on-created="(m: any) => (modal = m)">
    <div>
      <UIBaseGenerateFormGrid :fields="headerFields" @on-change="onHeaderChange" />

      <div class="border-t border-gray-200 pt-3 mt-2">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm font-semibold text-appblack">รายการขาย</p>
          <button type="button" class="text-xs text-primary-500 hover:underline"
            @click="$emit('add-line')">+ เพิ่มรายการ</button>
        </div>

        <div class="max-h-64 overflow-y-auto pr-1">
          <div v-for="(line, idx) in values.details" :key="idx"
            class="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs font-semibold text-appgray">รายการที่ {{ idx + 1 }}</p>
              <button v-if="values.details.length > 1" type="button"
                class="text-xs text-apperror hover:underline"
                @click="$emit('remove-line', idx)">ลบ</button>
            </div>
            <UIBaseGenerateFormGrid :fields="lineFields(idx)" @on-change="onLineChange(idx, $event)" />
            <p v-if="lineErrors[idx]" class="text-xs text-apperror -mt-4 mb-1">{{ lineErrors[idx] }}</p>
          </div>
        </div>
      </div>

      <div class="flex justify-end items-center gap-6 pt-2 border-t border-gray-200">
        <div class="text-right">
          <p class="text-xs text-appgray">จำนวนรวม</p>
          <p class="text-sm font-semibold text-appblack">{{ totalQuantity }} ตัว</p>
        </div>
        <div class="text-right">
          <p class="text-xs text-appgray">ยอดรวม</p>
          <p class="text-xl font-bold text-appsuccess">
            {{ totalAmount.toLocaleString() }}
            <span class="text-sm font-normal">บาท</span>
          </p>
        </div>
      </div>

      <p v-if="error" class="text-sm text-apperror mt-2">{{ error }}</p>
      <div class="flex justify-end gap-2 pt-3">
        <button type="button" class="px-4 py-2 text-sm border border-appborder rounded-lg hover:bg-gray-50"
          @click="modal?.hide()">ยกเลิก</button>
        <button type="button" class="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
          @click="$emit('on-submit')">บันทึก</button>
      </div>
    </div>
  </UIBaseModal>
</template>

<script lang="ts">
import type { Modal } from 'flowbite'
import * as zod from 'zod'

export default {
  props: {
    values:    { type: Object as () => IFormSale,   default: () => ({}) },
    batches:   { type: Array  as () => IPigBatch[], default: () => [] },
    customers: { type: Array  as () => any[],       default: () => [] },
    error:     { type: String, default: '' },
  },
  emits: ['update:values', 'add-line', 'remove-line', 'on-submit'],

  data() {
    return {
      modal: null as Modal | null,
      lineErrors: [] as string[],
    }
  },

  watch: {
    'values.details'(newDetails: any[]) {
      if (this.lineErrors.length > newDetails.length) {
        this.lineErrors = this.lineErrors.slice(0, newDetails.length)
      }
    },
  },

  computed: {
    totalQuantity(): number {
      return this.values.details.reduce((s, l) => s + (Number(l.quantity) || 0), 0)
    },
    totalAmount(): number {
      return this.values.details.reduce((s, l) => s + (formatNumberByString(String(l.amount)) || 0), 0)
    },

    customerOptions(): any[] {
      return [
        { label: '-- เลือกลูกค้า --', value: '' },
        ...this.customers.map((c: any) => ({ label: `${c.customerCode} · ${c.customerName}`, value: c._id })),
      ]
    },

    headerFields(): any[] {
      return [
        {
          key: 'customerId', label: 'ลูกค้า', type: 'dropdown', flex: 'full', required: true, useForm: false,
          value: this.values.customerId ?? '',
          children: this.customerOptions,
        },
        {
          key: 'saleDate', label: 'วันที่ขาย', type: 'datepicker', flex: 'half', required: true, useForm: false,
          value: this.values.saleDate ?? '',
        },
        {
          key: 'note', label: 'หมายเหตุ', type: 'text', flex: 'half', useForm: false,
          placeholder: 'หมายเหตุ (ถ้ามี)',
          value: this.values.note ?? '',
        },
      ]
    },
  },

  methods: {
    show() { this.modal?.show() },
    hide() { this.modal?.hide() },

    batchOptions(idx: number): any[] {
      const usedIds = this.values.details.map((l, i) => i !== idx ? l.batchId : null).filter(Boolean)
      const available = this.batches.filter((b: any) => !usedIds.includes(b._id))
      return [
        { label: '-- เลือกรุ่นหมู --', value: '' },
        ...available.map((b: any) => ({
          label: `${b.batchCode}${b.batchName ? ' · ' + b.batchName : ''} (เหลือ ${b.currentQuantity} ตัว)`,
          value: b._id,
        })),
      ]
    },

    lineFields(idx: number): any[] {
      const line = this.values.details[idx]
      const batch = (this.batches as any[]).find(b => b._id === line.batchId)
      return [
        {
          key: 'batchId', label: 'รุ่นหมู', type: 'dropdown', flex: 'full', required: true, useForm: false,
          value: line.batchId ?? '',
          children: this.batchOptions(idx),
        },
        {
          key: 'quantity',
          label: batch ? `จำนวน (ตัว) — เหลือ ${batch.currentQuantity} ตัว` : 'จำนวน (ตัว)',
          type: 'number', flex: 'half', required: true, useForm: false,
          placeholder: '0', value: line.quantity ?? '',
          min: 1, max: batch?.currentQuantity ?? undefined,
        },
        {
          key: 'averageWeight', label: 'น้ำหนักเฉลี่ย (กก.)', type: 'number', flex: 'half', useForm: false,
          placeholder: '0', value: line.averageWeight ?? '',
        },
        {
          key: 'totalWeight', label: 'น้ำหนักรวม (กก.)', type: 'number', flex: 'half', useForm: false,
          placeholder: '0', value: line.totalWeight ?? '',
        },
        {
          key: 'pricePerKg', label: 'ราคา/กก. (บาท)', type: 'number', flex: 'half', useForm: false,
          placeholder: '0', value: line.pricePerKg ?? '',
        },
        {
          key: 'amount', label: 'ยอดเงิน (บาท)', type: 'text', flex: 'full', required: true, useForm: false,
          placeholder: '0',
          value: line.amount !== '' && line.amount != null ? formatNumberComma(line.amount) : '',
        },
      ]
    },

    onHeaderChange({ keyChange, ...rest }: any) {
      this.$emit('update:values', { ...this.values, ...rest })
    },

    onLineChange(idx: number, { keyChange, ...rest }: any) {
      const line = { ...this.values.details[idx], ...rest }
      if ('amount' in rest) {
        line.amount = formatNumberRemoveComma(line.amount)
      }

      // validate quantity against batch currentQuantity
      if (['quantity', 'batchId'].includes(keyChange)) {
        const batch = (this.batches as any[]).find(b => b._id === line.batchId)
        const errors = [...this.lineErrors]
        if (batch && line.quantity !== '' && line.quantity != null) {
          const result = zod.number()
            .min(1, 'กรุณาระบุจำนวน')
            .max(batch.currentQuantity, `จำนวนต้องไม่เกิน ${batch.currentQuantity} ตัว`)
            .safeParse(Number(line.quantity))
          errors[idx] = result.success ? '' : result.error.issues[0].message
        } else {
          errors[idx] = ''
        }
        this.lineErrors = errors
      }

      // auto-calc totalWeight
      if (['quantity', 'averageWeight'].includes(keyChange)) {
        if (line.quantity && line.averageWeight) {
          line.totalWeight = Number(line.quantity) * Number(line.averageWeight)
        }
      }
      // auto-calc amount
      if (['totalWeight', 'pricePerKg', 'quantity', 'averageWeight'].includes(keyChange)) {
        if (line.totalWeight && line.pricePerKg) {
          line.amount = Number(line.totalWeight) * Number(line.pricePerKg)
        } else if (line.quantity && line.pricePerKg && !line.totalWeight && !line.averageWeight) {
          line.amount = Number(line.quantity) * Number(line.pricePerKg)
        }
      }

      const details = this.values.details.map((l, i) => i === idx ? line : l)
      this.$emit('update:values', { ...this.values, details })
    },
  },
}
</script>
