<template>
  <div>
    <!-- Header -->
    <div class="flex items-start justify-between pb-4 border-b-[3px] border-b-primary rounded-t">
      <div>
        <button class="text-xs text-appgray hover:underline mb-1 flex items-center gap-1" @click="$router.back()">
          ← กลับ
        </button>
        <h3 class="text-xl font-semibold text-primary">
          {{ sale?.saleNo }}
        </h3>
        <p class="text-sm text-appgray mt-0.5">
          {{ formatDateDisplayTH(sale?.saleDate) }}
          <span v-if="sale?.customerId?.customerName"> · {{ sale.customerId.customerName }}</span>
        </p>
        <div class="mt-1">
          <span v-if="sale?.status" :class="statusClass(sale.status)" class="text-xs px-2 py-0.5 rounded-full font-medium">
            {{ statusLabel(sale.status) }}
          </span>
        </div>
      </div>
      <div class="text-right">
        <p class="text-xs text-appgray">จำนวนรวม</p>
        <p class="text-lg font-bold text-appblack">{{ sale?.totalQuantity?.toLocaleString() }} <span class="text-sm font-normal">ตัว</span></p>
        <p class="text-xs text-appgray mt-1">ยอดรวม</p>
        <p class="text-2xl font-bold text-appsuccess">{{ sale?.totalAmount?.toLocaleString() }} <span class="text-sm font-normal">บาท</span></p>
      </div>
    </div>

    <!-- Note -->
    <p v-if="sale?.note" class="text-sm text-appgray pt-3">หมายเหตุ: {{ sale.note }}</p>

    <!-- Detail table -->
    <div class="pt-4">
      <p class="text-sm font-semibold text-appblack mb-3">รายการขาย</p>
      <div v-if="!sale?.details?.length" class="text-sm text-appgray text-center py-8">ไม่มีรายการ</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="bg-gray-50 text-appgray text-xs">
              <th class="text-left px-4 py-2 font-medium border-b border-gray-200">#</th>
              <th class="text-left px-4 py-2 font-medium border-b border-gray-200">รุ่นหมู</th>
              <th class="text-center px-4 py-2 font-medium border-b border-gray-200">จำนวน (ตัว)</th>
              <th class="text-center px-4 py-2 font-medium border-b border-gray-200">น้ำหนักเฉลี่ย (กก.)</th>
              <th class="text-center px-4 py-2 font-medium border-b border-gray-200">น้ำหนักรวม (กก.)</th>
              <th class="text-right px-4 py-2 font-medium border-b border-gray-200">ราคา/กก.</th>
              <th class="text-right px-4 py-2 font-medium border-b border-gray-200">ยอดเงิน (บาท)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(d, i) in sale.details" :key="d._id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-4 py-3 text-appgray">{{ i + 1 }}</td>
              <td class="px-4 py-3">
                <p class="font-semibold text-appblack">{{ d.batchId?.batchCode ?? d.batchId }}</p>
                <p v-if="d.batchId?.batchName" class="text-xs text-appgray">{{ d.batchId.batchName }}</p>
              </td>
              <td class="px-4 py-3 text-center">{{ d.quantity?.toLocaleString() }}</td>
              <td class="px-4 py-3 text-center">{{ d.averageWeight != null ? d.averageWeight.toLocaleString() : '-' }}</td>
              <td class="px-4 py-3 text-center">{{ d.totalWeight != null ? d.totalWeight.toLocaleString() : '-' }}</td>
              <td class="px-4 py-3 text-right">{{ d.pricePerKg != null ? d.pricePerKg.toLocaleString() : '-' }}</td>
              <td class="px-4 py-3 text-right font-semibold text-appsuccess">{{ d.amount?.toLocaleString() }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-gray-50">
              <td colspan="2" class="px-4 py-3 text-right text-sm font-semibold text-appblack">รวม</td>
              <td class="px-4 py-3 text-center text-sm font-bold text-appblack">{{ sale?.totalQuantity?.toLocaleString() }}</td>
              <td colspan="3" class="px-4 py-3 text-right text-sm font-semibold text-appblack">รวมยอดเงิน</td>
              <td class="px-4 py-3 text-right text-base font-bold text-appsuccess">{{ sale?.totalAmount?.toLocaleString() }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  setup() {
    definePageMeta({ layout: 'back-office' })
    const sLoadingState = useState<ILoading>('globalBaseLoading')
    const route = useRoute()
    return { sLoadingState, saleId: route.params.id as string }
  },

  data() {
    return {
      sale: null as any,
    }
  },

  mounted() {
    this.loadSale()
  },

  methods: {
    async loadSale() {
      this.sLoadingState?.show()
      try {
        const response = await useFetchGetClient(apiBffSalesById(this.saleId))
        this.sale = getSuccessDataClient(response) ?? null
      } finally {
        this.sLoadingState?.hide()
      }
    },

    statusLabel(status: string) {
      const map: Record<string, string> = { DRAFT: 'แบบร่าง', COMPLETED: 'เสร็จสิ้น', CANCELLED: 'ยกเลิก' }
      return map[status] ?? status
    },

    statusClass(status: string) {
      const map: Record<string, string> = {
        DRAFT: 'bg-yellow-100 text-yellow-700',
        COMPLETED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
      }
      return map[status] ?? 'bg-gray-100 text-gray-600'
    },
  },
}
</script>
