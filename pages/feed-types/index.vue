<template>
  <div>
    <div class="flex items-start justify-between pb-4 border-b-[3px] border-b-primary rounded-t">
      <h3 class="pt-2 text-xl font-semibold text-primary">ประเภทยาและอาหาร</h3>
    </div>

    <div class="flex items-center justify-between gap-3 pt-4 pb-2">
      <div class="w-64">
        <UIBaseInputField :field="searchField" @onChange="onSearchChange" />
      </div>
      <button
        class="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap"
        @click="onClickAdd">
        + เพิ่มประเภทยาและอาหาร
      </button>
    </div>

    <div class="pt-2">
      <UIBaseTable :options="tableOptions" :data-pagination="items ?? {}" :show-running="true"
        @onChangePage="onChangePage">
        <template #category="{ data }">
          <div class="flex justify-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="supplyCategoryClass(data.category)">
              {{ supplyCategoryLabel(data.category) }}
            </span>
          </div>
        </template>
        <template #action="{ data }">
          <UIFeedTypesRowActions :data="data" @edit="onClickEdit" @delete="onClickDelete" />
        </template>
      </UIBaseTable>
    </div>

    <UIFeedTypesModalForm ref="modalForm" @onSubmit="handleSubmit" />
  </div>
</template>

<script lang="ts">
export default {
  setup() {
    definePageMeta({ layout: 'back-office' })
    const sLoadingState = useState<ILoading>('globalBaseLoading')
    const sAlertState = useState<IModal>('globalAlertModal')
    return { sLoadingState, sAlertState, supplyCategoryLabel, supplyCategoryClass }
  },

  data() {
    return {
      items: {} as IPagination<any>,
      searchText: '',
      debounceTimer: null as ReturnType<typeof setTimeout> | null,
      tableOptions: [
        { field: 'feedCode', label: 'รหัส', headerAlign: 'text-left', dataAlign: 'text-left font-mono text-xs', width: 'w-[10%]' },
        { field: 'category', label: 'ประเภท', headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-[15%]' },
        { field: 'feedName', label: 'ชื่อ', headerAlign: 'text-left', dataAlign: 'text-left' },
        { field: 'unit', label: 'หน่วย', headerAlign: 'text-left', dataAlign: 'text-left', width: 'w-[10%]' },
        { field: 'action', label: '', headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-[10%]' },
      ],
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
  },

  mounted() {
    this.reloadData()
  },

  methods: {
    async reloadData(page: number = 1) {
      this.sLoadingState?.show()
      try {
        const response = await useFetchGetClient(apiBffFeedTypes, {
          params: { page, limit: 10, search: this.searchText.trim() }
        })
        this.items = getSuccessDataClient(response) ?? {}
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

    onClickAdd() {
      this.$nextTick(() => (this.$refs.modalForm as any)?.show())
    },

    onClickEdit(item: any) {
      this.$nextTick(() => (this.$refs.modalForm as any)?.show(item))
    },

    onClickDelete(id: string) {
      this.sAlertState?.show(defaultAlertConfirm(
        'ยืนยันการลบ?<br><span class="text-sm text-appgray font-normal">สต็อกที่เกี่ยวข้องจะถูกลบด้วย</span>',
        async () => {
          this.sLoadingState?.show()
          try {
            await useFetchDeleteClient(apiBffFeedTypesById(id))
            await this.reloadData()
          } finally {
            this.sLoadingState?.hide()
          }
        },
      ))
    },

    async handleSubmit({ editId, payload }: { editId: string; payload: any }) {
      this.sLoadingState?.show()
      try {
        if (editId) {
          const response = await useFetchPutClient(apiBffFeedTypesById(editId), payload)
          if (!isSuccessClient(response)) { (this.$refs.modalForm as any)?.setError(getErrorMessageClient(response)); return }
        } else {
          const response = await useFetchPostClient(apiBffFeedTypes, payload)
          if (!isSuccessClient(response)) { (this.$refs.modalForm as any)?.setError(getErrorMessageClient(response)); return }
        }
        ;(this.$refs.modalForm as any)?.hide()
        this.sAlertState?.show(defaultAlertSuccess(editId ? 'แก้ไขประเภทสำเร็จ' : 'เพิ่มประเภทสำเร็จ'))
        await this.reloadData()
      } catch (e: any) {
        ; (this.$refs.modalForm as any)?.setError(e?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
      } finally {
        this.sLoadingState?.hide()
      }
    },
  },
}
</script>
