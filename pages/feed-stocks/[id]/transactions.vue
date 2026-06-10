<template>
  <div>
    <div class="flex items-start justify-between pb-4 border-b-[3px] border-b-primary rounded-t">
      <div>
        <button class="text-xs text-appgray hover:underline mb-1 flex items-center gap-1" @click="$router.back()">
          ← กลับ
        </button>
        <h3 class="text-xl font-semibold text-primary">
          ประวัติสต็อก · {{ stock?.feedTypeId?.feedName }}
        </h3>
        <p class="text-xs text-appgray font-mono mt-0.5">{{ stock?.feedTypeId?.feedCode }}</p>
      </div>
      <div class="text-right">
        <p class="text-xs text-appgray">คงเหลือปัจจุบัน</p>
        <p class="text-2xl font-bold text-appblack">
          {{ stock?.currentQuantity?.toLocaleString() }}
          <span class="text-sm font-normal text-appgray">{{ stock?.feedTypeId?.unit }}</span>
        </p>
      </div>
    </div>

    <div class="pt-4">
      <UIBaseTable :options="tableOptions" :data-pagination="pagination ?? {}" :show-running="true"
        @onChangePage="onChangePage">
        <template #transactionDate="{ data }">
          <span>{{ formatDateDisplayTH(data.transactionDate) }}</span>
        </template>
        <template #transactionType="{ data }">
          <div class="flex justify-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="feedTxClass(data.transactionType)">
              {{ feedTxLabel(data.transactionType) }}
            </span>
          </div>
        </template>
        <template #quantity="{ data }">
          <div class="flex justify-end">
            <span class="font-semibold" :class="feedTxQuantityColor(data.transactionType)">
              {{ fmtQty(data) }}
              <span class="text-xs font-normal text-appgray">{{ stock?.feedTypeId?.unit }}</span>
            </span>
          </div>
        </template>
        <template #createdInfo="{ data }">
          <div class="text-xs">
            <p class="font-medium text-appblack">{{ data.userId?.fullName ?? data.userId?.username ?? '-' }}</p>
            <p class="text-appgray">{{ formatDateDisplayTH(data.createdAt, 'DD/MM', '/YYYY HH:mm') }}</p>
          </div>
        </template>
      </UIBaseTable>
    </div>
  </div>
</template>

<script lang="ts">

export default {
  setup() {
    definePageMeta({ layout: 'back-office' })
    const sLoadingState = useState<ILoading>('globalBaseLoading')
    const route = useRoute()
    return { sLoadingState, stockId: route.params.id as string }
  },

  data() {
    return {
      stock: null as any,
      pagination: null as IPagination<any> | null,
      tableOptions: [
        { field: 'transactionDate', label: 'วันที่', headerAlign: 'text-left', dataAlign: 'text-left font-mono text-xs', width: 'w-[10%]' },
        { field: 'transactionType', label: 'ประเภท', headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-[10%]' },
        { field: 'quantity', label: 'จำนวน', headerAlign: 'text-right', dataAlign: 'text-right', width: 'w-[12%]' },
        { field: 'note', label: 'หมายเหตุ', headerAlign: 'text-left', dataAlign: 'text-left text-xs text-appgray' },
        { field: 'createdInfo', label: 'สร้างโดย', headerAlign: 'text-left', dataAlign: 'text-left', width: 'w-[15%]' },
      ] as any[],
    }
  },

  mounted() {
    this.loadData()
  },

  methods: {
    async loadData(page: number = 1) {
      this.sLoadingState?.show()
      try {
        const response = await useFetchGetClient(apiBffFeedStocksTransactions(this.stockId), {
          params: { page, limit: 20 },
        })
        const data = getSuccessDataClient(response)
        this.stock = data?.stock ?? null
        this.pagination = data ? { list: data.list, total: data.total, page: data.page, pages: data.pages } : null
      } finally {
        this.sLoadingState?.hide()
      }
    },

    onChangePage(page: number = 1) { this.loadData(page) },

    fmtQty(data: any): string {
      const sign = data.transactionType === 'OUT' ? '-' : data.quantity > 0 ? '+' : ''
      return `${sign}${Math.abs(data.quantity).toLocaleString()}`
    },

  },
}
</script>
