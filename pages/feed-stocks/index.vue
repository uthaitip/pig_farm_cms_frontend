<template>
  <div>
    <!-- Header -->
    <div class="flex items-start justify-between pb-4 border-b-[3px] border-b-primary rounded-t">
      <h3 class="pt-2 text-xl font-semibold text-primary">คลังอาหารและยา</h3>
    </div>

    <!-- Search + Filter -->
    <div class="flex items-center gap-3 pt-4 pb-2 flex-wrap">
      <div class="w-64">
        <UIBaseInputField :field="searchField" @onChange="onSearchChange" />
      </div>
      <div class="w-44">
        <UIBaseDropdown :field="categoryField" @onChange="onCategoryChange" />
      </div>
    </div>

    <!-- Table -->
    <div class="pt-2">
      <UIBaseTable :options="tableOptions" :data-pagination="feedStocks ?? {}" :show-running="true"
        @onChangePage="onChangePage">
        <template #feedTypeId="{ data }">
          <span>{{ data?.includeFeedType?.feedCode }} - {{ data?.includeFeedType?.feedName }}</span>
        </template>
        <template #category="{ data }">
          <div class="flex justify-center">
            <span class="px-2 py-0.5 rounded-full text-base font-medium"
              :class="supplyCategoryClass(data.includeFeedType?.category)">
              {{ supplyCategoryLabel(data.includeFeedType?.category) }}
            </span>
          </div>
        </template>
        <template #currentQuantity="{ data }">
          <div class="flex justify-center">
            <span>{{ data.currentQuantity?.toLocaleString() }} {{ data.includeFeedType?.unit }}</span>
          </div>
        </template>
        <template #action="{ data }">
          <UIFeedStocksRowActions :data="data" @in="onOpenIn" @out="onOpenOut"
            @history="$router.push(`/feed-stocks/${$event._id}/transactions`)" />
        </template>
      </UIBaseTable>
    </div>

    <UIFeedStocksModalTx ref="modalTx" :batches="batches" @onSubmit="handleSubmit" />
  </div>
</template>

<script lang="ts">
import { apiBffFeedStocks, apiBffFeedStocksIn, apiBffFeedStocksOut, apiBffPigBatches } from '~/composables/api-bff'

const CATEGORY_OPTIONS = [
  { label: 'ทั้งหมด', value: '' },
  { label: 'อาหาร', value: 'FEED' },
  { label: 'ยา', value: 'MEDICINE' },
  { label: 'วัคซีน', value: 'VACCINE' },
]

export default {
  setup() {
    definePageMeta({ layout: 'back-office' })
    const sLoadingState = useState<ILoading>('globalBaseLoading')
    const sAlertState = useState<IModal>('globalAlertModal')
    return { sLoadingState, sAlertState, supplyCategoryLabel, supplyCategoryClass }
  },

  data() {
    return {
      feedStocks: null as IPagination<FeedStock> | null,
      batches: [] as any[],
      tableOptions: [
        { field: 'feedTypeId', label: 'ชื่อ', headerAlign: 'text-left', dataAlign: 'text-left', width: 'w-[40%]' },
        { field: 'category', label: 'ประเภท', headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-[15%]' },
        { field: 'currentQuantity', label: 'คงเหลือ', headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-[15%]' },
        { field: 'action', label: 'จัดการ', headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-[10%]' },
      ] as any[],
      selectedCategory: '' as string,
      searchText: '' as string,
      debounceTimer: null as ReturnType<typeof setTimeout> | null,
    }
  },

  computed: {
    searchField(): any {
      return {
        key: 'search', label: '', type: 'text',
        placeholder: 'ค้นหารหัส / ชื่อ...', value: this.searchText,
        useForm: false, prefixIcon: 'magnifying-glass',
      }
    },

    categoryField(): any {
      return {
        key: 'category', label: '', type: 'dropdown', useForm: false,
        value: this.selectedCategory,
        children: CATEGORY_OPTIONS,
      }
    },
  },

  mounted() {
    this.reloadData()
  },

  methods: {
    async reloadData(page: number = 1) {
      this.sLoadingState?.show()
      try {
        const response = await useFetchGetClient(apiBffFeedStocks, {
          params: {
            page,
            limit: 10,
            search: this.searchText.trim(),
            filter: this.selectedCategory ? { category: this.selectedCategory } : undefined,
          },
        })
        this.feedStocks = getSuccessDataClient(response) ?? null
      } finally {
        this.sLoadingState?.hide()
      }
    },

    onChangePage(page: number = 1) { this.reloadData(page) },

    onSearchChange(payload: any) {
      this.searchText = payload?.value ?? payload
      if (this.debounceTimer) clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => this.reloadData(), 400)
    },

    onCategoryChange(payload: any) {
      this.selectedCategory = payload?.value ?? ''
      this.reloadData()
    },

    async loadBatches() {
      const response = await useFetchGetClient(apiBffPigBatches, {
        params: { page: 1, limit: 999, filter: { status: 'ACTIVE' } },
      })
      this.batches = getSuccessDataClient(response)?.list ?? []
    },

    onOpenIn(stock: any) { (this.$refs.modalTx as any)?.show(stock, 'IN') },
    async onOpenOut(stock: any) {
      await this.loadBatches()
      ;(this.$refs.modalTx as any)?.show(stock, 'OUT')
    },

    async handleSubmit({ type, stockId, payload }: { type: 'IN' | 'OUT'; stockId: string; payload: any }) {
      this.sLoadingState?.show()
      try {
        const url = type === 'IN' ? apiBffFeedStocksIn(stockId) : apiBffFeedStocksOut(stockId)
        const response = await useFetchPostClient(url, payload)
        if (!isSuccessClient(response)) {
          (this.$refs.modalTx as any)?.setError(getErrorMessageClient(response))
          return
        }
        ; (this.$refs.modalTx as any)?.hide()
        this.sAlertState?.show(defaultAlertSuccess(type === 'IN' ? 'รับเข้าสำเร็จ' : 'เบิกใช้สำเร็จ'))
        await this.reloadData()
      } catch (e: any) {
        ; (this.$refs.modalTx as any)?.setError(e?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
      } finally {
        this.sLoadingState?.hide()
      }
    },
  },
}
</script>
