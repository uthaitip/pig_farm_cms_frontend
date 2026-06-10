<template>
  <div>
    <div class="pb-4 border-b-[3px] border-b-primary rounded-t">
      <h3 class="pt-2 text-xl font-semibold text-primary">จัดการหมู</h3>
    </div>

    <div class="flex items-center gap-3 pt-4 pb-2">
      <div class="w-64">
        <UIBaseInputField :field="searchField" @onChange="onSearchChange" />
      </div>
      <div class="ml-auto">
        <button class="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
          @click="onClickAdd">
          + เพิ่มหมู
        </button>
      </div>
    </div>

    <div class="pt-2">
      <UIBaseTable :options="tableOptions" :data-pagination="items ?? {}" :show-running="true"
        @onChangePage="onChangePage">
        <template #gender="{ data }">
          <div class="flex justify-center">{{ data.gender === 'male' ? 'เพศผู้' : 'เพศเมีย' }}</div>
        </template>
        <template #weight="{ data }">
          <div class="flex justify-center">{{ data.weight }} กก.</div>
        </template>
        <template #status="{ data }">
          <div class="flex justify-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-medium"
              :class="data.status === 'active' ? 'bg-green-100 text-appsuccess' : 'bg-gray-100 text-appgray'">
              {{ data.status === 'active' ? 'ปกติ' : 'ไม่ใช้งาน' }}
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

    <UIBaseModal id="modal-pig-form" :title="currentId ? 'แก้ไขหมู' : 'เพิ่มหมู'"
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

const EMPTY_FORM = { breed: '', gender: 'male', weight: '', status: 'active' }

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
      debounceTimer: null as ReturnType<typeof setTimeout> | null,
      tableOptions: [
        { field: 'code',   label: 'รหัส',      headerAlign: 'text-left',   dataAlign: 'text-left font-mono text-sm', width: 'w-28' },
        { field: 'breed',  label: 'สายพันธุ์',  headerAlign: 'text-left',   dataAlign: 'text-left' },
        { field: 'gender', label: 'เพศ',        headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-24' },
        { field: 'weight', label: 'น้ำหนัก',    headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-24' },
        { field: 'status', label: 'สถานะ',      headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-28' },
        { field: 'action', label: 'จัดการ',     headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-24' },
      ] as any[],
    }
  },

  computed: {
    searchField(): any {
      return {
        key: 'search', label: '', type: 'text',
        placeholder: 'ค้นหาหมู...', value: this.searchText,
        useForm: false, prefixIcon: 'magnifying-glass',
      }
    },
    formFields(): any[] {
      const v = this.formValues as any
      return [
        {
          key: 'breed', label: 'สายพันธุ์', type: 'text',
          placeholder: 'เช่น ลูกผสม', flex: 'full', required: true, useForm: true,
          value: v.breed,
        },
        {
          key: 'gender', label: 'เพศ', type: 'dropdown', flex: 'half', required: true, useForm: true,
          value: v.gender,
          children: [
            { label: 'เพศผู้', value: 'male' },
            { label: 'เพศเมีย', value: 'female' },
          ],
        },
        {
          key: 'weight', label: 'น้ำหนัก (กก.)', type: 'number',
          placeholder: '0', flex: 'half', useForm: true,
          value: v.weight,
        },
        {
          key: 'status', label: 'สถานะ', type: 'dropdown', flex: 'full', useForm: true,
          value: v.status,
          children: [
            { label: 'ปกติ',        value: 'active' },
            { label: 'ไม่ใช้งาน', value: 'inactive' },
          ],
        },
      ]
    },
  },

  mounted() { this.load() },

  methods: {
    onChangePage(page: number) { this.currentPage = page; this.load() },

    onSearchChange({ value }: { value: string }) {
      if (value === this.searchText) return
      this.searchText = value
      if (this.debounceTimer) clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => { this.currentPage = 1; this.load() }, 400)
    },

    async load() {
      this.sLoadingState?.show()
      try {
        const response = await useFetchGetClient(apiBffPigs, {
          params: { page: this.currentPage, limit: 10, search: this.searchText.trim() },
        })
        this.items = getSuccessDataClient(response) ?? {}
      } finally {
        this.sLoadingState?.hide()
      }
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
          breed:  row.breed  ?? '',
          gender: row.gender ?? 'male',
          weight: row.weight != null ? String(row.weight) : '',
          status: row.status ?? 'active',
        },
      })
      this.$nextTick(() => this.modalForm?.show())
    },

    onClickDelete(id: string) {
      this.sAlertState?.show(defaultAlertConfirm(
        'ยืนยันการลบหมูนี้?',
        async () => {
          this.sLoadingState?.show()
          try {
            await useFetchDeleteClient(apiBffPigsById(id))
            await this.load()
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
          breed:  v.breed.trim(),
          gender: v.gender,
          weight: v.weight ? Number(v.weight) : null,
          ...(this.currentId ? { status: v.status } : {}),
        }
        const response = !this.currentId
          ? await useFetchPostClient(apiBffPigs, payload)
          : await useFetchPutClient(apiBffPigsById(this.currentId), payload)
        if (!isSuccessClient(response)) { this.formError = getErrorMessageClient(response); return }
        this.modalForm?.hide()
        this.sAlertState?.show(defaultAlertSuccess(this.currentId ? 'แก้ไขข้อมูลหมูสำเร็จ' : 'เพิ่มหมูสำเร็จ'))
        await this.load()
      } catch (e: any) {
        this.formError = e?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่'
      } finally {
        this.sLoadingState?.hide()
      }
    },
  },
}
</script>
