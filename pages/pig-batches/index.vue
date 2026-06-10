<template>
  <div>
    <div class="pb-4 border-b-[3px] border-b-primary rounded-t">
      <h3 class="pt-2 text-xl font-semibold text-primary">จัดการรุ่นหมู</h3>
    </div>

    <div class="flex items-end gap-3 pt-4 pb-2">
      <div class="w-64">
        <UIBaseInputField
          :field="{ key: 'search', label: '', type: 'text', placeholder: 'ค้นหารหัสรุ่น, ชื่อรุ่น...', value: searchText, useForm: false, prefixIcon: 'magnifying-glass' }"
          @onChange="onSearchChange" />
      </div>
      <UIBaseDropdown :field="{
        key: 'filterStatus', label: '', useForm: false, value: filterStatus, children: [
          { label: 'ทุกสถานะ',   value: '' },
          { label: 'กำลังเลี้ยง', value: 'ACTIVE' },
          { label: 'ปิดรุ่นแล้ว', value: 'CLOSED' },
        ]
      }" @onChange="onFilterStatusChange" />
      <div class="ml-auto">
        <button class="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
          @click="onClickAdd">
          + เพิ่มรุ่นหมู
        </button>
      </div>
    </div>

    <div class="pt-2">
      <UIBaseTable :options="tableOptions" :data-pagination="items ?? {}" :show-running="true"
        @onChangePage="onChangePage">
        <template #sourceType="{ data }">
          <div class="flex justify-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-medium"
              :class="data.sourceType === 'BORN' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'">
              {{ SourceTypeMsg[data.sourceType] }}
            </span>
          </div>
        </template>
        <template #receivedDate="{ data }">
          <div class="text-center">{{ formatDateDisplayTH(data?.receivedDate) }}</div>
        </template>
        <template #status="{ data }">
          <div class="flex justify-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-medium"
              :class="data.status === 'ACTIVE' ? 'bg-green-100 text-appsuccess' : 'bg-gray-100 text-appgray'">
              {{ data.status === 'ACTIVE' ? 'กำลังเลี้ยง' : 'ปิดรุ่นแล้ว' }}
            </span>
          </div>
        </template>
        <template #action="{ data }">
          <div class="flex items-center justify-center gap-3">
            <button title="ประวัติ" @click="$router.push(`/pig-batches/${data._id}/transactions`)">
              <UIBaseHeroIcon name="clock" size="h-5 w-5" color="text-appgray" />
            </button>
            <button title="บันทึกเหตุการณ์" @click="onClickTransaction(data)">
              <UIBaseHeroIcon name="plus-circle" size="h-5 w-5" color="text-blue-500" />
            </button>
            <button title="แก้ไข" @click="onClickEdit(data)">
              <UIBaseHeroIcon name="pencil-square" size="h-5 w-5" color="text-primary-500" />
            </button>
            <button title="ลบ" @click="onClickDelete(data._id)">
              <UIBaseHeroIcon name="trash" size="h-5 w-5" color="text-apperror" />
            </button>
          </div>
        </template>
      </UIBaseTable>
    </div>

    <UIPigBatchesModalForm ref="modalBatchForm" @onSubmit="onHandleBatchSubmit" />
    <UIPigBatchesModalTx ref="modalBatchTx" @onSubmit="onHandleTxSubmit" />
  </div>
</template>

<script lang="ts">
export default {
  setup() {
    definePageMeta({ layout: 'back-office' })
    const sLoadingState = useState<ILoading>('globalBaseLoading')
    const sAlertState = useState<IModal>('globalAlertModal')
    return { sLoadingState, sAlertState }
  },

  data() {
    return {
      items:         {} as IPagination<IPigBatch>,
      currentPage:   1,
      searchText:    '' as string,
      filterStatus:  '' as string,
      debounceTimer: null as ReturnType<typeof setTimeout> | null,
      tableOptions: [
        { field: 'batchCode',        label: 'รหัสรุ่น',      headerAlign: 'text-left',   dataAlign: 'text-left',   width: 'w-32' },
        { field: 'batchName',        label: 'ชื่อรุ่น',      headerAlign: 'text-left',   dataAlign: 'text-left' },
        { field: 'sourceType',       label: 'แหล่งที่มา',    headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-28' },
        { field: 'initialQuantity',  label: 'จำนวนเริ่มต้น', headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-28' },
        { field: 'currentQuantity',  label: 'จำนวนปัจจุบัน', headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-28' },
        { field: 'receivedDate',     label: 'วันที่รับเข้า',  headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-28' },
        { field: 'status',           label: 'สถานะ',          headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-28' },
        { field: 'action',           label: 'จัดการ',         headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-44' },
      ] as any[],
    }
  },

  mounted() { this.reloadData() },

  methods: {
    async reloadData() {
      this.sLoadingState?.show()
      try {
        const response = await useFetchGetClient(apiBffPigBatches, {
          params: {
            page:   this.currentPage,
            limit:  10,
            search: this.searchText.trim(),
            filter: this.filterStatus ? JSON.stringify({ status: this.filterStatus }) : undefined,
          },
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

    onFilterStatusChange({ value }: { value: string }) {
      if (value === this.filterStatus) return
      this.filterStatus = value
      this.currentPage = 1
      this.reloadData()
    },

    onClickAdd() {
      (this.$refs.modalBatchForm as any).show()
    },

    onClickEdit(row: any) {
      (this.$refs.modalBatchForm as any).show(row)
    },

    onClickTransaction(row: any) {
      (this.$refs.modalBatchTx as any).show(row)
    },

    onClickDelete(id: string) {
      this.sAlertState?.show(defaultAlertConfirm(
        'ยืนยันการลบรุ่นหมูนี้?<br><span class="text-sm text-appgray font-normal">การกระทำนี้ไม่สามารถย้อนกลับได้</span>',
        async () => {
          this.sLoadingState?.show()
          try {
            await useFetchDeleteClient(apiBffPigBatchesById(id))
            await this.reloadData()
          } finally {
            this.sLoadingState?.hide()
          }
        },
      ))
    },

    async onHandleBatchSubmit({ editId, payload }: { editId: string; payload: any }) {
      this.sLoadingState?.show()
      try {
        const response = !editId
          ? await useFetchPostClient(apiBffPigBatches, payload)
          : await useFetchPutClient(apiBffPigBatchesById(editId), payload)
        if (!isSuccessClient(response)) {
          ;(this.$refs.modalBatchForm as any).setError(getErrorMessageClient(response))
          return
        }
        ;(this.$refs.modalBatchForm as any).hide()
        this.sAlertState?.show(defaultAlertSuccess(editId ? 'แก้ไขรุ่นหมูสำเร็จ' : 'เพิ่มรุ่นหมูสำเร็จ'))
        await this.reloadData()
      } catch (e: any) {
        ;(this.$refs.modalBatchForm as any).setError(e?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
      } finally {
        this.sLoadingState?.hide()
      }
    },

    async onHandleTxSubmit({ batchId, payload }: { batchId: string; payload: any }) {
      this.sLoadingState?.show()
      try {
        const response = await useFetchPostClient(apiBffPigBatchesTransactions, {
          batchId,
          ...payload,
        })
        if (!isSuccessClient(response)) {
          ;(this.$refs.modalBatchTx as any).setError(getErrorMessageClient(response))
          return
        }
        ;(this.$refs.modalBatchTx as any).hide()
        this.sAlertState?.show(defaultAlertSuccess('บันทึกเหตุการณ์สำเร็จ'))
        await this.reloadData()
      } catch (e: any) {
        ;(this.$refs.modalBatchTx as any).setError(e?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
      } finally {
        this.sLoadingState?.hide()
      }
    },
  },
}
</script>
