<template>
  <div>
    <div class="pb-4 border-b-[3px] border-b-primary rounded-t">
      <h3 class="pt-2 text-xl font-semibold text-primary">จัดการสิทธิ์</h3>
    </div>

    <div class="flex items-center gap-3 pt-4 pb-2">
      <div class="w-64">
        <UIBaseInputField :field="searchField" @onChange="onSearchChange" />
      </div>
      <div class="w-36">
        <UIBaseDropdown :field="filterField" @onChange="onFilterChange" />
      </div>
      <div class="ml-auto">
        <button class="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
          @click="onClickAdd">
          + เพิ่มสิทธิ์
        </button>
      </div>
    </div>

    <div class="pt-2">
      <UIBaseTable :options="tableOptions" :data-pagination="items ?? {}" :show-running="true"
        @onChangePage="onChangePage">
        <template #status="{ data }">
          <div class="flex justify-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-medium"
              :class="data.status === 'active' ? 'bg-green-100 text-appsuccess' : 'bg-gray-100 text-appgray'">
              {{ data.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน' }}
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

    <UIBaseModal id="modal-sc-role-form" :title="currentId ? 'แก้ไขสิทธิ์' : 'เพิ่มสิทธิ์'"
      width="max-w-lg" :show-footer="false" @on-created="(m: any) => (modalForm = m)">
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

const EMPTY_FORM = { name: '', description: '', status: 'active' }

export default {
  setup() {
    definePageMeta({ layout: 'back-office' })
    const sLoadingState = useState<ILoading>('globalBaseLoading')
    const sAlertState = useState<IModal>('globalAlertModal')
    const { validate, resetForm, values } = useForm({ initialValues: { ...EMPTY_FORM } })
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
      tableOptions: [
        { field: 'code',        label: 'รหัสสิทธิ์', headerAlign: 'text-left',   dataAlign: 'text-left font-mono text-sm', width: 'w-28' },
        { field: 'name',        label: 'ชื่อสิทธิ์',  headerAlign: 'text-left',   dataAlign: 'text-left' },
        { field: 'description', label: 'คำอธิบาย',   headerAlign: 'text-left',   dataAlign: 'text-left text-xs text-appgray', width: 'w-[30%]' },
        { field: 'status',      label: 'สถานะ',       headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-24' },
        { field: 'action',      label: 'จัดการ',      headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-24' },
      ] as any[],
    }
  },

  computed: {
    searchField(): any {
      return {
        key: 'search', label: '', type: 'text',
        placeholder: 'ค้นหาชื่อสิทธิ์...', value: this.searchText,
        useForm: false, prefixIcon: 'magnifying-glass',
      }
    },
    filterField(): any {
      return {
        key: 'filterStatus', label: '', type: 'dropdown', useForm: false,
        value: this.filterStatus,
        children: [
          { label: 'ทุกสถานะ',   value: '' },
          { label: 'ใช้งาน',     value: 'active' },
          { label: 'ไม่ใช้งาน', value: 'inactive' },
        ],
      }
    },
    formFields(): any[] {
      const v = this.formValues as any
      return [
        {
          key: 'name', label: 'ชื่อสิทธิ์', type: 'text',
          placeholder: 'เช่น ผู้ดูแลระบบ', flex: 'full', required: true, useForm: true,
          value: v.name,
        },
        {
          key: 'description', label: 'คำอธิบาย', type: 'textarea',
          placeholder: 'คำอธิบายเพิ่มเติม (ถ้ามี)', flex: 'full', useForm: true,
          value: v.description,
        },
        {
          key: 'status', label: 'สถานะ', type: 'dropdown', flex: 'full', useForm: true,
          value: v.status,
          children: [
            { label: 'ใช้งาน',    value: 'active' },
            { label: 'ไม่ใช้งาน', value: 'inactive' },
          ],
        },
      ]
    },
  },

  mounted() {
    this.reloadData()
  },

  methods: {
    async reloadData() {
      this.sLoadingState?.show()
      try {
        const response = await useFetchGetClient(apiSvcRoles, {
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

    onClickAdd() {
      this.currentId = ''
      this.formError = ''
      this.resetForm({ values: { ...EMPTY_FORM } })
      this.$nextTick(() => this.modalForm?.show())
    },

    onClickEdit(row: any) {
      this.currentId = row._id
      this.formError = ''
      this.resetForm({
        values: {
          name:        row.name        ?? '',
          description: row.description ?? '',
          status:      row.status      ?? 'active',
        },
      })
      this.$nextTick(() => this.modalForm?.show())
    },

    onClickDelete(id: string) {
      this.sAlertState?.show(defaultAlertConfirm(
        'ยืนยันการลบสิทธิ์นี้?',
        async () => {
          this.sLoadingState?.show()
          try {
            await useFetchDeleteClient(apiSvcRolesById(id))
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
        const response = !this.currentId
          ? await useFetchPostClient(apiSvcRoles, {
              name:        v.name.trim(),
              description: v.description || null,
            })
          : await useFetchPutClient(apiSvcRolesById(this.currentId), {
              name:        v.name.trim(),
              description: v.description || null,
              status:      v.status,
            })
        if (!isSuccessClient(response)) { this.formError = getErrorMessageClient(response); return }
        this.modalForm?.hide()
        this.sAlertState?.show(defaultAlertSuccess(this.currentId ? 'แก้ไขสิทธิ์สำเร็จ' : 'เพิ่มสิทธิ์สำเร็จ'))
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
