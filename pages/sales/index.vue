<template>
  <div>
    <!-- Header -->
    <div class="pb-4 border-b-[3px] border-b-primary rounded-t">
      <h3 class="pt-2 text-xl font-semibold text-primary">บันทึกการขาย</h3>
    </div>

    <!-- Search & Filter -->
    <div class="flex items-center gap-3 pt-4 pb-2">
      <div class="w-64">
        <UIBaseInputField :field="searchField" @onChange="onSearchChange" />
      </div>
      <div class="ml-auto">
        <button class="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
          @click="onClickAdd">
          + บันทึกการขาย
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="pt-2">
      <UIBaseTable :options="tableOptions" :data-pagination="items ?? {}" :show-running="true"
        @onChangePage="onChangePage">
        <template #customerId="{ data }">
          <span>{{ data.customerId?.customerName ?? '-' }}</span>
        </template>
        <template #saleDate="{ data }">
          <div class="flex justify-center">{{ formatDateDisplayTH(data.saleDate) }}</div>
        </template>
        <template #totalQuantity="{ data }">
          <div class="flex justify-center">{{ data.totalQuantity?.toLocaleString() }} ตัว</div>
        </template>
        <template #totalAmount="{ data }">
          <div class="flex justify-end  text-appsuccess">{{ data.totalAmount?.toLocaleString() }}</div>
        </template>
        <template #status="{ data }">
          <div class="flex justify-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="statusClass(data.status)">
              {{ statusLabel(data.status) }}
            </span>
          </div>
        </template>
        <template #action="{ data }">
          <div class="flex items-center justify-center gap-2">
            <button title="รายละเอียด" class="text-primary-500 hover:text-primary-700"
              @click="$router.push(`/sales/${data._id}`)">
              <UIBaseHeroIcon name="document-text" size="h-5 w-5" color="text-primary-500" />
            </button>
            <button title="ลบ" class="text-apperror hover:text-red-700" @click="onClickDelete(data._id)">
              <UIBaseHeroIcon name="trash" size="h-5 w-5" color="text-apperror" />
            </button>
          </div>
        </template>
      </UIBaseTable>
    </div>

    <UISalesModalForm ref="modalSaleForm" :values="formValues" :batches="batches" :customers="customers"
      :error="formError" @update:values="formValues = $event" @add-line="formValues.details.push(emptySaleDetail())"
      @remove-line="(idx) => formValues.details.splice(idx, 1)" @on-submit="onSubmit" />
  </div>
</template>

<script lang="ts">


const STATUS_LABEL: Record<string, string> = { DRAFT: 'แบบร่าง', COMPLETED: 'เสร็จสิ้น', CANCELLED: 'ยกเลิก' }
const STATUS_CLASS: Record<string, string> = {
  DRAFT: 'bg-yellow-100 text-yellow-600',
  COMPLETED: 'bg-green-100 text-appsuccess',
  CANCELLED: 'bg-gray-100 text-appgray',
}

export default {
  setup() {
    definePageMeta({ layout: 'back-office' })
    const sLoadingState = useState<ILoading>('globalBaseLoading')
    const sAlertState = useState<IModal>('globalAlertModal')
    return { sLoadingState, sAlertState }
  },

  data() {
    return {
      items: {} as IPagination<ISale>,
      currentPage: 1,
      customers: [] as any[],
      batches: [] as IPigBatch[],
      tableOptions: [
        { field: 'saleNo', label: 'เลขที่ขาย', headerAlign: 'text-left', dataAlign: 'text-left ', width: 'w-32' },
        { field: 'saleDate', label: 'วันที่ขาย', headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-28' },
        { field: 'customerId', label: 'ลูกค้า', headerAlign: 'text-left', dataAlign: 'text-left' },
        { field: 'totalQuantity', label: 'จำนวน', headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-24' },
        { field: 'totalAmount', label: 'ยอดรวม (บาท)', headerAlign: 'text-right', dataAlign: 'text-right', width: 'w-36' },
        { field: 'status', label: 'สถานะ', headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-28' },
        { field: 'action', label: 'จัดการ', headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-24' },
      ] as any[],
      searchText: '',
      debounceTimer: null as ReturnType<typeof setTimeout> | null,
      formError: '',
      formValues: { customerId: '', saleDate: '', note: '', details: [emptySaleDetail()] } as IFormSale,
    }
  },

  computed: {
    searchField(): any {
      return {
        key: 'search', label: '', type: 'text',
        placeholder: 'ค้นหาเลขที่...', value: this.searchText,
        useForm: false, prefixIcon: 'magnifying-glass',
      }
    },
  },

  mounted() {
    this.reloadData()
  },

  methods: {
    statusLabel(status: string) { return STATUS_LABEL[status] ?? status },
    statusClass(status: string) { return STATUS_CLASS[status] ?? '' },

    async loadCustomers() {
      const response = await useFetchGetClient(apiBffCustomers, {
        params: { page: 1, limit: 999, filter: { status: 'ACTIVE' } },
      })
      this.customers = getSuccessDataClient(response)?.list ?? []
    },

    async loadBatches() {
      const response = await useFetchGetClient(apiBffPigBatches, {
        params: { page: 1, limit: 999, filter: { status: 'ACTIVE' } },
      })
      this.batches = getSuccessDataClient(response)?.list ?? []
    },

    async reloadData() {
      this.sLoadingState?.show()
      try {
        const response = await useFetchGetClient(apiBffSales, {
          params: { page: this.currentPage, limit: 10, search: this.searchText.trim() },
        })
        this.items = getSuccessDataClient(response) ?? {}
      } finally {
        this.sLoadingState?.hide()
      }
    },

    onChangePage(page: number) { this.currentPage = page; this.reloadData() },

    onSearchChange({ value }: { value: string }) {
      if (value === this.searchText) return
      this.searchText = value
      if (this.debounceTimer) clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => { this.currentPage = 1; this.reloadData() }, 400)
    },

    async onClickAdd() {
      this.formError = ''
      this.formValues = { customerId: '', saleDate: '', note: '', details: [emptySaleDetail()] }
      await Promise.all([this.loadCustomers(), this.loadBatches()])
      this.$nextTick(() => (this.$refs.modalSaleForm as any)?.show())
    },

    onClickDelete(id: string) {
      this.sAlertState?.show(defaultAlertConfirm(
        'ยืนยันการยกเลิกรายการขายนี้?<br><span class="text-sm text-appgray font-normal">ระบบจะคืนจำนวนหมูกลับในรุ่นที่เกี่ยวข้อง</span>',
        async () => {
          this.sLoadingState?.show()
          try {
            await useFetchDeleteClient(apiBffSalesById(id))
            await Promise.all([this.reloadData(), this.loadBatches()])
          } finally {
            this.sLoadingState?.hide()
          }
        },
      ))
    },

    async onSubmit() {
      this.formError = ''
      if (!this.formValues.customerId) { this.formError = 'กรุณาเลือกลูกค้า'; return }
      if (!this.formValues.saleDate) { this.formError = 'กรุณาระบุวันที่ขาย'; return }
      for (const [i, l] of this.formValues.details.entries()) {
        if (!l.batchId) { this.formError = `รายการที่ ${i + 1}: กรุณาเลือกรุ่นหมู`; return }
        if (!l.quantity) { this.formError = `รายการที่ ${i + 1}: กรุณาระบุจำนวน`; return }
        if (l.amount == null || l.amount === '') { this.formError = `รายการที่ ${i + 1}: กรุณาระบุยอดเงิน`; return }
      }
      const batchIds = this.formValues.details.map(l => l.batchId)
      if (new Set(batchIds).size !== batchIds.length) { this.formError = 'รุ่นหมูในแต่ละรายการต้องไม่ซ้ำกัน'; return }

      this.sLoadingState?.show()
      try {
        const response = await useFetchPostClient(apiBffSales, {
          customerId: this.formValues.customerId,
          saleDate: this.formValues.saleDate,
          note: this.formValues.note || null,
          details: this.formValues.details.map(l => ({
            batchId: l.batchId,
            quantity: Number(l.quantity),
            averageWeight: l.averageWeight ? Number(l.averageWeight) : undefined,
            totalWeight: l.totalWeight ? Number(l.totalWeight) : undefined,
            pricePerKg: l.pricePerKg ? Number(l.pricePerKg) : undefined,
            amount: Number(l.amount),
          })),
        })
        if (!isSuccessClient(response)) { this.formError = getErrorMessageClient(response); return }
        ; (this.$refs.modalSaleForm as any)?.hide()
        this.sAlertState?.show(defaultAlertSuccess('บันทึกการขายสำเร็จ'))
        await Promise.all([this.reloadData(), this.loadBatches()])
      } catch (e: any) {
        this.formError = e?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่'
      } finally {
        this.sLoadingState?.hide()
      }
    },
  },
}
</script>
