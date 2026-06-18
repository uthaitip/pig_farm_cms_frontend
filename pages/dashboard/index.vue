<template>
  <div>
    <div class="flex items-start justify-between pb-4 border-b-[3px] border-b-primary rounded-t">
      <h3 class="pt-2 text-xl font-semibold text-primary">Dashboard</h3>
      <span class="text-xs text-appgray pt-3">{{ currentMonthLabel }}</span>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6">
      <div v-for="card in statCards" :key="card.label" class="p-4 bg-white border border-gray-200 rounded-lg shadow"
        :class="card.colSpan">
        <div class="flex items-center gap-3">
          <UIBaseHeroIcon :name="card.icon" size="h-10 w-10" :color="card.color" />
          <div>
            <p class="text-xs text-appgray">{{ card.label }}</p>
            <p class="text-2xl font-bold" :class="card.color">
              {{ card.value }}
              <span class="text-sm font-normal text-appgray">{{ card.unit }}</span>
            </p>
            <p v-if="card.sub" class="text-xs text-appgray">{{ card.sub }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="summary.feedStocks?.length" class="bg-white border border-gray-200 rounded-lg shadow p-4">
      <div class="flex items-center gap-2 pb-3 border-b border-gray-100 mb-1">
        <UIBaseHeroIcon name="archive-box" size="h-5 w-5" color="text-primary" />
        <h4 class="font-semibold text-primary text-sm">คลังอาหารและยา</h4>
      </div>
      <div>
        <div v-for="stock in sortedFeedStocks" :key="stock.feedCode"
          class="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
          <span class="px-2 py-0.5 rounded-full text-xs font-medium shrink-0"
            :class="supplyCategoryClass(stock.category)">
            {{ supplyCategoryLabel(stock.category) }}
          </span>
          <p class="text-xs font-mono text-appgray shrink-0 w-20">{{ stock.feedCode }}</p>
          <p class="text-sm text-appblack flex-1 truncate">{{ stock.feedName }}</p>
          <p class="text-sm font-bold text-appblack shrink-0">
            {{ formatNumberComma(stock.currentQty) }}
            <span class="text-xs font-normal text-appgray">{{ stock.unit }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const CATEGORY_ORDER: Record<string, number> = { FEED: 0, MEDICINE: 1, VACCINE: 2 }

export default {
  setup() {
    definePageMeta({ layout: 'back-office' })
    const loading = useState<ILoading>('globalBaseLoading')
    return { loading, supplyCategoryLabel, supplyCategoryClass }
  },
  data() {
    return {
      summary: {
        totalPigCount:    0,
        activeBatchCount: 0,
        totalBatchCount:  0,
        incomeThisMonth:  0,
        expenseThisMonth: 0,
        profitThisMonth:  0,
        feedStocks:       [] as IDashboardFeedStock[],
      } as IDashboardSummary,
    }
  },
  computed: {
    currentMonthLabel() {
      const d = new Date()
      return `${d.toLocaleString('th-TH', { month: 'long' })} ${d.getFullYear() + 543}`
    },
    statCards(): any[] {
      const s = this.summary
      return [
        { label: 'จำนวนหมูทั้งหมด',     icon: 'user-group',       color: 'text-primary',                                                         value: formatNumberComma(s.totalPigCount),     unit: 'ตัว',  sub: null, colSpan: '' },
        { label: 'รุ่นหมูที่เปิดอยู่',   icon: 'cube',             color: 'text-primary',                                                         value: formatNumberComma(s.activeBatchCount), unit: 'รุ่น', sub: s.totalBatchCount > s.activeBatchCount ? `ทั้งหมด ${s.totalBatchCount} รุ่น` : null, colSpan: '' },
        { label: 'รายรับเดือนนี้',        icon: 'arrow-trending-up',  color: 'text-appsuccess',                                                    value: formatNumberComma(s.incomeThisMonth),  unit: 'บาท', sub: null, colSpan: '' },
        { label: 'ค่าวัสดุเดือนนี้',     icon: 'arrow-trending-down', color: 'text-apperror',                                                     value: formatNumberComma(s.expenseThisMonth), unit: 'บาท', sub: null, colSpan: '' },
        { label: 'กำไร/ขาดทุนเดือนนี้', icon: 'banknotes',         color: s.profitThisMonth >= 0 ? 'text-appsuccess' : 'text-apperror',           value: formatNumberComma(s.profitThisMonth),  unit: 'บาท', sub: null, colSpan: 'col-span-2 sm:col-span-1' },
      ]
    },
    sortedFeedStocks(): IDashboardFeedStock[] {
      return [...this.summary.feedStocks].sort(
        (a, b) => (CATEGORY_ORDER[a.category] ?? 9) - (CATEGORY_ORDER[b.category] ?? 9),
      )
    },
  },
  async mounted() {
    await this.getSummaryDashboard()
  },
  methods: {
    async getSummaryDashboard() {
      this.loading?.show()
      try {
        const res = await useFetchGetClient(apiSvcDashboard)
        const data = getSuccessDataClient(res) as IDashboardSummary
        if (data) {
          this.summary = {
            totalPigCount:    data.totalPigCount    ?? 0,
            activeBatchCount: data.activeBatchCount ?? 0,
            totalBatchCount:  data.totalBatchCount  ?? 0,
            incomeThisMonth:  data.incomeThisMonth  ?? 0,
            expenseThisMonth: data.expenseThisMonth ?? 0,
            profitThisMonth:  data.profitThisMonth  ?? 0,
            feedStocks:       data.feedStocks       ?? [],
          }
        }
      } finally {
        this.loading?.hide()
      }
    },
  },
}
</script>
