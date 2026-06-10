<template>
  <div>
    <!-- Header -->
    <div class="pb-4 border-b-[3px] border-b-primary rounded-t">
      <h3 class="pt-2 text-xl font-semibold text-primary">จัดการผู้ใช้งาน</h3>
    </div>

    <!-- Search & Filter -->
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
          + เพิ่มผู้ใช้งาน
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="pt-2">
      <UIBaseTable :options="tableOptions" :data-pagination="items ?? {}" :show-running="true"
        @onChangePage="onChangePage">
        <template #fullName="{ data }">
          <div>
            <div class="font-medium text-appblack">{{ data.firstName }} {{ data.lastName }}</div>
            <div class="text-xs text-appgray">{{ data.userCode }}</div>
          </div>
        </template>
        <template #birthDate="{ data }">
          <div class="flex justify-center">{{ computeAge(data.birthDate) }}</div>
        </template>
        <template #roleId="{ data }">
          {{ data.roleId?.name ?? '-' }}
        </template>
        <template #startDate="{ data }">
          <div class="flex justify-center">{{ formatDate(data.startDate) }}</div>
        </template>
        <template #status="{ data }">
          <div class="flex justify-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="statusClass(data.status)">
              {{ statusLabel(data.status) }}
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

    <!-- Modal -->
    <UIBaseModal id="modal-sc-user-form" :title="currentId ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งาน'"
      width="max-w-2xl" :show-footer="false" @on-created="(m: any) => (modalForm = m)">
      <div>
        <p class="text-xs font-semibold text-appgray uppercase tracking-wide mb-2">ข้อมูลส่วนตัว</p>
        <UIBaseGenerateFormGrid :fields="personalFields" :hide-fields="currentId ? ['password'] : ['status']" />

        <div v-if="computedAge" class="mb-3 px-1">
          <span class="text-sm text-appgray">อายุ: </span>
          <span class="text-sm font-semibold text-primary">{{ computedAge }}</span>
        </div>

        <p class="text-xs font-semibold text-appgray uppercase tracking-wide mb-2 mt-2">ที่อยู่</p>
        <UIBaseGenerateFormGrid :fields="addressFields" />

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

const EMPTY_FORM = {
  firstName: '', lastName: '', birthDate: '', phone: '',
  email: '', password: '', roleId: '', startDate: '', status: 'active',
  houseNo: '', village: '', subDistrict: '', district: '', province: '', postalCode: '',
}

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
      roleItems:     [] as any[],
      tableOptions: [
        { field: 'fullName',  label: 'ชื่อ-นามสกุล',    headerAlign: 'text-left',   dataAlign: 'text-left' },
        { field: 'birthDate', label: 'อายุ',              headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-20' },
        { field: 'phone',     label: 'เบอร์โทร',          headerAlign: 'text-left',   dataAlign: 'text-left',   width: 'w-32' },
        { field: 'email',     label: 'อีเมล',             headerAlign: 'text-left',   dataAlign: 'text-left',   width: 'w-48' },
        { field: 'roleId',    label: 'สิทธิ์',            headerAlign: 'text-left',   dataAlign: 'text-left',   width: 'w-28' },
        { field: 'startDate', label: 'วันที่เริ่มงาน',   headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-28' },
        { field: 'status',    label: 'สถานะ',             headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-24' },
        { field: 'action',    label: 'จัดการ',            headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-20' },
      ] as any[],
    }
  },

  computed: {
    computedAge(): string {
      const v = this.formValues as any
      const birth = v.birthDate
      if (!birth) return ''
      const d = new Date(birth)
      if (isNaN(d.getTime())) return ''
      const today = new Date()
      let age = today.getFullYear() - d.getFullYear()
      const m = today.getMonth() - d.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
      return `${age} ปี`
    },

    searchField(): any {
      return {
        key: 'search', label: '', type: 'text',
        placeholder: 'ค้นหาชื่อ, อีเมล, เบอร์โทร...', value: this.searchText,
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

    personalFields(): any[] {
      const v = this.formValues as any
      return [
        {
          key: 'firstName', label: 'ชื่อ', type: 'text',
          placeholder: 'ชื่อ', flex: 'half', required: true, useForm: true,
          value: v.firstName,
        },
        {
          key: 'lastName', label: 'นามสกุล', type: 'text',
          placeholder: 'นามสกุล', flex: 'half', required: true, useForm: true,
          value: v.lastName,
        },
        {
          key: 'birthDate', label: 'วันเดือนปีเกิด', type: 'datepicker',
          flex: 'half', useForm: true,
          value: v.birthDate,
        },
        {
          key: 'phone', label: 'เบอร์โทร', type: 'text',
          placeholder: '0812345678', flex: 'half', useForm: true,
          value: v.phone,
        },
        {
          key: 'email', label: 'อีเมล', type: 'text',
          placeholder: 'example@email.com', flex: 'half', required: true, useForm: true,
          value: v.email,
        },
        {
          key: 'password', label: 'รหัสผ่าน (ขั้นต่ำ 6 ตัว)', type: 'password',
          placeholder: '••••••', flex: 'half', required: true, useForm: true,
          value: v.password,
        },
        {
          key: 'roleId', label: 'สิทธิ์', type: 'dropdown',
          flex: 'half', useForm: true,
          value: v.roleId,
          children: this.roleItems,
        },
        {
          key: 'startDate', label: 'วันที่เริ่มงาน', type: 'datepicker',
          flex: 'half', useForm: true,
          value: v.startDate,
        },
        {
          key: 'status', label: 'สถานะ', type: 'dropdown',
          flex: 'half', useForm: true,
          value: v.status,
          children: [
            { label: 'ใช้งาน',    value: 'active' },
            { label: 'ไม่ใช้งาน', value: 'inactive' },
          ],
        },
      ]
    },

    addressFields(): any[] {
      const v = this.formValues as any
      return [
        {
          key: 'houseNo', label: 'บ้านเลขที่', type: 'text',
          placeholder: 'เช่น 123/4', flex: 'half', useForm: true,
          value: v.houseNo,
        },
        {
          key: 'village', label: 'หมู่บ้าน / หมู่ที่', type: 'text',
          placeholder: 'เช่น หมู่ 5', flex: 'half', useForm: true,
          value: v.village,
        },
        {
          key: 'subDistrict', label: 'ตำบล', type: 'text',
          placeholder: 'ตำบล', flex: 'half', useForm: true,
          value: v.subDistrict,
        },
        {
          key: 'district', label: 'อำเภอ', type: 'text',
          placeholder: 'อำเภอ', flex: 'half', useForm: true,
          value: v.district,
        },
        {
          key: 'province', label: 'จังหวัด', type: 'text',
          placeholder: 'จังหวัด', flex: 'half', useForm: true,
          value: v.province,
        },
        {
          key: 'postalCode', label: 'รหัสไปรษณีย์', type: 'text',
          placeholder: 'เช่น 10200', flex: 'half', useForm: true,
          value: v.postalCode,
        },
      ]
    },
  },

  mounted() {
    this.reloadData()
  },

  methods: {
    computeAge(birthDate: string): string {
      if (!birthDate) return '-'
      const d = new Date(birthDate)
      if (isNaN(d.getTime())) return '-'
      const today = new Date()
      let age = today.getFullYear() - d.getFullYear()
      const m = today.getMonth() - d.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
      return `${age} ปี`
    },

    formatDate(dateStr: string): string {
      if (!dateStr) return '-'
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
    },

    statusLabel(status: string): string {
      return status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'
    },

    statusClass(status: string): string {
      return status === 'active' ? 'bg-green-100 text-appsuccess' : 'bg-gray-100 text-appgray'
    },

    async loadRoles() {
      try {
        const response = await useFetchGetClient(apiBffRoles, {
          params: { page: 1, limit: 999, filter: JSON.stringify({ status: 'active' }) },
        })
        const list = getSuccessDataClient(response)?.list ?? []
        this.roleItems = [
          { label: 'กรุณาเลือกสิทธิ์', value: '' },
          ...list.map((r: any) => ({ label: r.name, value: r._id })),
        ]
      } catch {}
    },

    async reloadData() {
      this.sLoadingState?.show()
      try {
        const response = await useFetchGetClient(apiBffUsers, {
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
      this.resetForm({ values: { ...EMPTY_FORM } })
      await this.loadRoles()
      this.$nextTick(() => this.modalForm?.show())
    },

    async onClickEdit(row: any) {
      this.currentId = row._id
      this.formError = ''
      this.resetForm({
        values: {
          firstName:   row.firstName   ?? '',
          lastName:    row.lastName    ?? '',
          birthDate:   row.birthDate   ?? '',
          phone:       row.phone       ?? '',
          email:       row.email       ?? '',
          password:    '',
          roleId:      row.roleId?._id ?? row.roleId ?? '',
          startDate:   row.startDate   ?? '',
          status:      row.status      ?? 'active',
          houseNo:     row.houseNo     ?? '',
          village:     row.village     ?? '',
          subDistrict: row.subDistrict ?? '',
          district:    row.district    ?? '',
          province:    row.province    ?? '',
          postalCode:  row.postalCode  ?? '',
        },
      })
      await this.loadRoles()
      this.$nextTick(() => this.modalForm?.show())
    },

    onClickDelete(id: string) {
      this.sAlertState?.show(defaultAlertConfirm(
        'ยืนยันการลบผู้ใช้งาน?',
        async () => {
          this.sLoadingState?.show()
          try {
            await useFetchDeleteClient(apiBffUsersById(id))
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
        const addressPayload = {
          houseNo:     v.houseNo     || null,
          village:     v.village     || null,
          subDistrict: v.subDistrict || null,
          district:    v.district    || null,
          province:    v.province    || null,
          postalCode:  v.postalCode  || null,
        }
        const response = !this.currentId
          ? await useFetchPostClient(apiBffUsers, {
              firstName: v.firstName.trim(),
              lastName:  v.lastName.trim(),
              birthDate: v.birthDate  || null,
              phone:     v.phone      || null,
              email:     v.email.trim(),
              password:  v.password,
              roleId:    v.roleId     || null,
              startDate: v.startDate  || null,
              ...addressPayload,
            })
          : await useFetchPutClient(apiBffUsersById(this.currentId), {
              firstName: v.firstName.trim(),
              lastName:  v.lastName.trim(),
              birthDate: v.birthDate  || null,
              phone:     v.phone      || null,
              email:     v.email.trim(),
              roleId:    v.roleId     || null,
              startDate: v.startDate  || null,
              status:    v.status,
              ...addressPayload,
            })
        if (!isSuccessClient(response)) { this.formError = getErrorMessageClient(response); return }
        this.modalForm?.hide()
        this.sAlertState?.show(defaultAlertSuccess(this.currentId ? 'แก้ไขผู้ใช้งานสำเร็จ' : 'เพิ่มผู้ใช้งานสำเร็จ'))
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
