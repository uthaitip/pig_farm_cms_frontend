<template>
  <div>
    <div class="pb-4 border-b-[3px] border-b-primary rounded-t">
      <h3 class="pt-2 text-xl font-semibold text-primary">กำหนดสิทธิ์เมนู</h3>
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
        <template #menuIds="{ data }">
          <div class="flex justify-center">
            <span class="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600">
              {{ (data.menuIds ?? []).length }} เมนู
            </span>
          </div>
        </template>
        <template #status="{ data }">
          <div class="flex justify-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-medium"
              :class="data.status === 'active' ? 'bg-green-100 text-appsuccess' : 'bg-gray-100 text-appgray'">
              {{ data.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน' }}
            </span>
          </div>
        </template>
        <template #action="{ data }">
          <div class="flex justify-center">
            <button class="px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg"
              @click="onClickAssign(data)">
              กำหนดเมนู
            </button>
          </div>
        </template>
      </UIBaseTable>
    </div>

    <UIManagementRolesAddRoleModal ref="modalAdd" @onSubmit="onHandleAdd" />
    <UIManagementRolesAssignMenusModal ref="modalMenus" @onSave="onHandleSave" />
  </div>
</template>

<script lang="ts">
import UIManagementRolesAddRoleModal     from '~/components/management-roles/AddRoleModal.vue'
import UIManagementRolesAssignMenusModal from '~/components/management-roles/AssignMenusModal.vue'

export default {
  components: { UIManagementRolesAddRoleModal, UIManagementRolesAssignMenusModal },

  setup() {
    definePageMeta({ layout: 'back-office' })
    const sLoadingState = useState<ILoading>('globalBaseLoading')
    const sAlertState = useState<IModal>('globalAlertModal')
    return { sLoadingState, sAlertState }
  },

  data() {
    return {
      items:         {} as IPagination<any>,
      currentPage:   1,
      searchText:    '' as string,
      filterStatus:  '' as string,
      debounceTimer: null as ReturnType<typeof setTimeout> | null,
      tableOptions: [
        { field: 'code',        label: 'รหัสสิทธิ์', headerAlign: 'text-left',   dataAlign: 'text-left font-mono text-sm', width: 'w-28' },
        { field: 'name',        label: 'ชื่อสิทธิ์',  headerAlign: 'text-left',   dataAlign: 'text-left' },
        { field: 'description', label: 'คำอธิบาย',   headerAlign: 'text-left',   dataAlign: 'text-left text-xs text-appgray', width: 'w-[25%]' },
        { field: 'menuIds',     label: 'เมนู',        headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-24' },
        { field: 'status',      label: 'สถานะ',       headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-24' },
        { field: 'action',      label: 'จัดการ',      headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-28' },
      ] as any[],
    }
  },

  computed: {
    searchField(): any {
      return {
        key: 'search', label: '', type: 'text',
        placeholder: 'ค้นหาชื่อสิทธิ์, รหัสสิทธิ์...', value: this.searchText,
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
      (this.$refs.modalAdd as any).show()
    },

    async onHandleAdd({ payload }: { payload: any }) {
      this.sLoadingState?.show()
      try {
        const response = await useFetchPostClient(apiSvcRoles, payload)
        if (!isSuccessClient(response)) {
          ;(this.$refs.modalAdd as any).setError(getErrorMessageClient(response))
          return
        }
        ;(this.$refs.modalAdd as any).hide()
        this.sAlertState?.show(defaultAlertSuccess('เพิ่มสิทธิ์สำเร็จ'))
        await this.reloadData()
      } catch (e: any) {
        ;(this.$refs.modalAdd as any).setError(e?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
      } finally {
        this.sLoadingState?.hide()
      }
    },

    onClickAssign(role: any) {
      (this.$refs.modalMenus as any).show(role)
    },

    async onHandleSave({ roleId, menuIds }: { roleId: string; menuIds: string[] }) {
      this.sLoadingState?.show()
      try {
        const response = await useFetchPutClient(apiSvcRolesById(roleId), { menuIds })
        if (!isSuccessClient(response)) {
          ;(this.$refs.modalMenus as any).setError(getErrorMessageClient(response))
          return
        }
        ;(this.$refs.modalMenus as any).hide()
        this.sAlertState?.show(defaultAlertSuccess('บันทึกสิทธิ์เมนูสำเร็จ'))
        await this.reloadData()
      } catch (e: any) {
        ;(this.$refs.modalMenus as any).setError(e?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
      } finally {
        this.sLoadingState?.hide()
      }
    },
  },
}
</script>
