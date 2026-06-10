<template>
  <div>
    <!-- Header -->
    <div class="flex items-start justify-between pb-4 border-b-[3px] border-b-primary rounded-t">
      <div>
        <button class="text-xs text-appgray hover:underline mb-1 flex items-center gap-1" @click="$router.back()">
          ← กลับ
        </button>
        <h3 class="text-xl font-semibold text-primary">
          ประวัติรุ่นหมู {{ batch?.batchCode }}
          <span v-if="batch?.batchName" class="text-base font-normal text-appgray">· {{ batch.batchName }}</span>
        </h3>
      </div>
    </div>

    <!-- Summary cards -->
    <div v-if="batch" class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
      <div class="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
        <p class="text-xs text-appgray">จำนวนเริ่มต้น</p>
        <p class="text-2xl font-bold text-appblack">{{ batch.initialQuantity }} <span
            class="text-sm font-normal">ตัว</span></p>
      </div>
      <div class="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
        <p class="text-xs text-appgray">ปัจจุบัน</p>
        <p class="text-2xl font-bold text-appsuccess">{{ batch.currentQuantity }} <span
            class="text-sm font-normal">ตัว</span></p>
      </div>
      <div class="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
        <p class="text-xs text-appgray">ตาย</p>
        <p class="text-2xl font-bold text-apperror">{{ totalByType('DEAD') }} <span
            class="text-sm font-normal">ตัว</span></p>
      </div>
      <div class="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
        <p class="text-xs text-appgray">ขายแล้ว</p>
        <p class="text-2xl font-bold text-blue-500">{{ totalByType('SOLD') }} <span
            class="text-sm font-normal">ตัว</span></p>
      </div>
    </div>

    <!-- Timeline -->
    <div class="pt-6">
      <p v-if="transactions.length === 0" class="text-sm text-appgray text-center py-10">ไม่มีประวัติ</p>
      <div class="relative border-l-2 border-gray-200 ml-4 space-y-0">
        <div v-for="tx in transactions" :key="tx._id" class="relative pl-6 pb-6">
          <!-- dot -->
          <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow"
            :class="dotClass(tx.transactionType)"></div>

          <div class="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold px-2 py-0.5 rounded-full" :class="badgeClass(tx.transactionType)">
                {{ txLabel(tx.transactionType) }}
              </span>
              <span class="text-xs text-appgray">{{ formatDateDisplayTH(tx.transactionDate) }}</span>
            </div>
            <div class="flex items-center gap-4 mt-1">
              <p class="text-sm">
                <span class="font-semibold text-lg" :class="quantityClass(tx.transactionType)">
                  {{ quantitySign(tx.transactionType) }}{{ tx.quantity }}
                </span>
                <span class="text-appgray ml-1">ตัว</span>
              </p>
              <p v-if="tx.fromPenId || tx.toPenId" class="text-xs text-appgray">
                {{ tx.fromPenId }} → {{ tx.toPenId }}
              </p>
            </div>
            <p v-if="tx.remark" class="text-xs text-appgray mt-1">{{ tx.remark }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
const TX_TYPES = [
  { label: 'รับเข้า', value: 'RECEIVE', sign: 1 },
  { label: 'ย้ายเข้า', value: 'MOVE_IN', sign: 1 },
  { label: 'ย้ายออก', value: 'MOVE_OUT', sign: -1 },
  { label: 'ตาย', value: 'DEAD', sign: -1 },
  { label: 'ขาย', value: 'SOLD', sign: -1 },
  { label: 'ปรับจำนวน', value: 'ADJUST', sign: 1 },
]

export default {
  setup() {
    definePageMeta({ layout: 'back-office' })
    const sLoadingState = useState<ILoading>('globalBaseLoading')
    const route = useRoute()
    return { sLoadingState, batchId: route.params.id as string }
  },

  data() {
    return {
      batch: null as any,
      transactions: [] as any[],
    }
  },

  mounted() {
    this.loadBatch()
    this.loadTransactions()
  },

  methods: {
    async loadBatch() {
      this.sLoadingState?.show()
      try {
        const response = await useFetchGetClient(apiBffPigBatchesById(this.batchId))
        this.batch = getSuccessDataClient(response) ?? null
      } finally {
        this.sLoadingState?.hide()
      }
    },

    async loadTransactions() {
      this.sLoadingState?.show()
      try {
        const response = await useFetchGetClient(apiBffPigBatchesTxById(this.batchId), {
          params: { page: 1, limit: 999 }
        })
        const list = getSuccessDataClient(response)?.list ?? []
        this.transactions = list.sort((a: any, b: any) =>
          new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
        )
      } finally {
        this.sLoadingState?.hide()
      }
    },

    totalByType(type: string): number {
      return this.transactions
        .filter((t: any) => t.transactionType === type)
        .reduce((sum: number, t: any) => sum + (t.quantity ?? 0), 0)
    },

    txLabel(type: string): string {
      return TX_TYPES.find(t => t.value === type)?.label ?? type
    },

    quantitySign(type: string): string {
      return (TX_TYPES.find(t => t.value === type)?.sign ?? 1) > 0 ? '+' : '-'
    },

    quantityClass(type: string): string {
      return (TX_TYPES.find(t => t.value === type)?.sign ?? 1) > 0 ? 'text-appsuccess' : 'text-apperror'
    },

    dotClass(type: string): string {
      const map: Record<string, string> = {
        RECEIVE: 'bg-appsuccess', MOVE_IN: 'bg-blue-400', MOVE_OUT: 'bg-yellow-400',
        DEAD: 'bg-apperror', SOLD: 'bg-blue-600', ADJUST: 'bg-appgray',
      }
      return map[type] ?? 'bg-gray-300'
    },

    badgeClass(type: string): string {
      const map: Record<string, string> = {
        RECEIVE: 'bg-green-100 text-appsuccess',
        MOVE_IN: 'bg-blue-100 text-blue-500',
        MOVE_OUT: 'bg-yellow-100 text-yellow-600',
        DEAD: 'bg-red-100 text-apperror',
        SOLD: 'bg-blue-100 text-blue-700',
        ADJUST: 'bg-gray-100 text-appgray',
      }
      return map[type] ?? 'bg-gray-100 text-appgray'
    },
  },
}
</script>
