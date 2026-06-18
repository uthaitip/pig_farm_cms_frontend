<template>
  <div>
    <div class="pb-4 border-b-[3px] border-b-primary rounded-t">
      <h3 class="pt-2 text-xl font-semibold text-primary">จัดการคอก</h3>
    </div>

    <div class="flex items-center gap-3 pt-4 pb-2">
      <div class="w-64">
        <UIBaseInputField :field="searchField" @onChange="onSearchChange" />
      </div>
      <div class="w-44">
        <UIBaseDropdown :field="filterField" @onChange="onFilterChange" />
      </div>
      <div class="ml-auto">
        <button class="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
          @click="onClickAdd">
          + เพิ่มคอก
        </button>
      </div>
    </div>

    <div class="pt-2">
      <UIBaseTable :options="tableOptions" :data-pagination="items ?? {}" :show-running="true"
        @onChangePage="onChangePage">
        <template #houseId="{ data }">
          {{ data.houseId?.houseName ?? '-' }}
        </template>
        <template #capacity="{ data }">
          <div class="flex justify-center">{{ data.capacity }} ตัว</div>
        </template>
        <template #status="{ data }">
          <div class="flex justify-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="StatusPenColor[data.status]">
              {{ StatusPenMsg[data.status] ?? data.status }}
            </span>
          </div>
        </template>
        <template #action="{ data }">
          <div class="flex items-center justify-center gap-2">
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

    <UIBaseModal id="modal-sc-pen-form" :title="currentId ? 'แก้ไขคอกหมู' : 'เพิ่มคอกหมู'"
      width="max-w-xl" :show-footer="false" @on-created="(m: any) => (modalForm = m)">
      <div>
        <UIBaseGenerateFormGrid :fields="formFields" :hide-fields="currentId ? [] : ['status']" />
        <p v-if="formError" class="text-sm text-apperror mt-1">{{ formError }}</p>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="px-4 py-2 text-sm border border-appborder rounded-lg hover:bg-gray-50"
            @click="modalForm?.hide()">ยกเลิก</button>
          <button type="button" class="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
            @click="onSubmit">บันทึก</button>
        </div>
      </div>
    </UIBaseModal>
  </div>
</template>

<script lang="ts">
import type { Modal } from 'flowbite'

export default {
  setup() {
    definePageMeta({ layout: 'back-office' })
    const sLoadingState = useState<ILoading>('globalBaseLoading')
    const sAlertState = useState<IModal>('globalAlertModal')
    const { validate, resetForm, values } = useForm({
      initialValues: { penName: '', houseId: '', capacity: '', status: 'ACTIVE' },
    })
    return { sLoadingState, sAlertState, validate, resetForm, formValues: values }
  },

  data() {
    return {
      currentId:     '' as string,
      formError:     '' as string,
      modalForm:     null as Modal | null,
      items:         {} as IPagination<any>,
      currentPage:   1,
      searchText:    '' as string,
      filterStatus:  '' as string,
      debounceTimer: null as ReturnType<typeof setTimeout> | null,
      houseItems:    [] as any[],
      tableOptions: [
        { field: 'penCode',  label: 'รหัสคอก', headerAlign: 'text-left',   dataAlign: 'text-left font-mono text-sm', width: 'w-28' },
        { field: 'penName',  label: 'ชื่อคอก',  headerAlign: 'text-left',   dataAlign: 'text-left' },
        { field: 'houseId',  label: 'โรงเรือน', headerAlign: 'text-left',   dataAlign: 'text-left',   width: 'w-36' },
        { field: 'capacity', label: 'ความจุ',   headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-24' },
        { field: 'status',   label: 'สถานะ',    headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-28' },
        { field: 'action',   label: 'จัดการ',   headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-24' },
      ] as any[],
    }
  },

  computed: {
    searchField(): any {
      return {
        key: 'search', label: '', type: 'text',
        placeholder: 'ค้นหาชื่อคอก, รหัสคอก...', value: this.searchText,
        useForm: false, prefixIcon: 'magnifying-glass',
      }
    },
    filterField(): any {
      return {
        key: 'filterStatus', label: '', type: 'dropdown', useForm: false,
        value: this.filterStatus,
        children: [
          { label: 'ทุกสถานะ',   value: '' },
          { label: 'ใช้งาน',     value: 'ACTIVE' },
          { label: 'เต็ม',       value: 'FULL' },
          { label: 'ซ่อมบำรุง', value: 'MAINTENANCE' },
        ],
      }
    },
    formFields(): any[] {
      const v = this.formValues as any
      return [
        {
          key: 'penName', label: 'ชื่อคอก', type: 'text',
          placeholder: 'เช่น คอก A1', flex: 'full', required: true, useForm: true,
          value: v.penName,
        },
        {
          key: 'houseId', label: 'โรงเรือน', type: 'dropdown',
          flex: 'full', required: true, useForm: true,
          value: v.houseId,
          children: this.houseItems,
        },
        {
          key: 'capacity', label: 'ความจุ (ตัว)', type: 'number',
          placeholder: '0', flex: 'full', required: true, min: 0, useForm: true,
          value: v.capacity,
        },
        {
          key: 'status', label: 'สถานะ', type: 'dropdown', flex: 'full', useForm: true,
          value: v.status,
          children: [
            { label: 'ใช้งาน',     value: 'ACTIVE' },
            { label: 'เต็ม',       value: 'FULL' },
            { label: 'ซ่อมบำรุง', value: 'MAINTENANCE' },
          ],
        },
      ]
    },
  },

  mounted() {
    this.reloadData()
  },

  methods: {
    async loadHouses() {
      try {
        const response = await useFetchGetClient(apiSvcHouses, {
          params: { page: 1, limit: 999, filter: JSON.stringify({ status: 'ACTIVE' }) },
        })
        const list = getSuccessDataClient(response)?.list ?? []
        this.houseItems = [
          { label: 'กรุณาเลือกโรงเรือน', value: '' },
          ...list.map((h: any) => ({ label: `${h.houseCode} - ${h.houseName}`, value: h._id })),
        ]
      } catch {}
    },

    async reloadData() {
      this.sLoadingState?.show()
      try {
        const response = await useFetchGetClient(apiSvcPens, {
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

    onFilterChange({ value }: { value: string }) {
      this.filterStatus = value
      this.currentPage = 1
      this.reloadData()
    },

    async onClickAdd() {
      this.currentId = ''
      this.formError = ''
      this.resetForm({ values: { penName: '', houseId: '', capacity: '', status: 'ACTIVE' } })
      await this.loadHouses()
      this.$nextTick(() => this.modalForm?.show())
    },

    async onClickEdit(row: any) {
      this.currentId = row._id
      this.formError = ''
      this.resetForm({
        values: {
          penName:  row.penName  ?? '',
          houseId:  row.houseId?._id ?? row.houseId ?? '',
          capacity: row.capacity != null ? String(row.capacity) : '',
          status:   row.status   ?? 'ACTIVE',
        },
      })
      await this.loadHouses()
      this.$nextTick(() => this.modalForm?.show())
    },

    onClickDelete(id: string) {
      this.sAlertState?.show(defaultAlertConfirm(
        'ยืนยันการลบคอกหมูนี้?',
        async () => {
          this.sLoadingState?.show()
          try {
            await useFetchDeleteClient(apiSvcPensById(id))
            await this.reloadData()
          } finally {
            this.sLoadingState?.hide()
          }
        },
      ))
    },

    async onSubmit() {
      const { valid } = await this.validate()
      if (!valid) return
      this.formError = ''
      const v = this.formValues as any

      this.sLoadingState?.show()
      try {
        const payload = {
          penName:  v.penName.trim(),
          houseId:  v.houseId,
          capacity: Number(v.capacity),
          ...(this.currentId ? { status: v.status } : {}),
        }
        const response = !this.currentId
          ? await useFetchPostClient(apiSvcPens, payload)
          : await useFetchPutClient(apiSvcPensById(this.currentId), payload)
        if (!isSuccessClient(response)) { this.formError = getErrorMessageClient(response); return }
        this.modalForm?.hide()
        this.sAlertState?.show(defaultAlertSuccess(this.currentId ? 'แก้ไขคอกสำเร็จ' : 'เพิ่มคอกสำเร็จ'))
        await this.reloadData()
      } catch (e: any) {
        this.formError = e?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่'
      } finally {
        this.sLoadingState?.hide()
      }
    },
  },
}
</script>
