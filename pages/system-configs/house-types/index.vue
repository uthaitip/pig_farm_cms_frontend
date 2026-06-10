<template>
    <div>
        <!-- Header -->
        <div class="pb-4 border-b-[3px] border-b-primary rounded-t">
            <h3 class="pt-2 text-xl font-semibold text-primary">ประเภทคอกหมู</h3>
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
                <button
                    class="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
                    @click="onClickAdd">
                    + เพิ่มประเภทคอก
                </button>
            </div>
        </div>

        <!-- Table -->
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

        <!-- Modal -->
        <UIHouseTypesModalForm ref="modalForm" @onSubmit="onHandleSubmit" />
    </div>
</template>

<script lang="ts">
import UIHouseTypesModalForm from '~/components/house-types/ModalForm.vue'

export default {
    components: { UIHouseTypesModalForm },

    setup() {
        definePageMeta({ layout: 'back-office' })
        const sLoadingState = useState<ILoading>('globalBaseLoading')
        const sAlertState = useState<IModal>('globalAlertModal')
        return { sLoadingState, sAlertState }
    },

    data() {
        return {
            items: {} as IPagination<any>,
            currentPage: 1,
            searchText: '' as string,
            filterStatus: '' as string,
            debounceTimer: null as ReturnType<typeof setTimeout> | null,
            tableOptions: [
                { field: 'code', label: 'รหัส', headerAlign: 'text-left', dataAlign: 'text-left font-mono text-sm', width: 'w-28' },
                { field: 'name', label: 'ชื่อ', headerAlign: 'text-left', dataAlign: 'text-left' },
                { field: 'note', label: 'หมายเหตุ', headerAlign: 'text-left', dataAlign: 'text-left text-xs text-appgray', width: 'w-[30%]' },
                { field: 'status', label: 'สถานะ', headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-24' },
                { field: 'action', label: 'จัดการ', headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-24' },
            ] as any[],
        }
    },

    computed: {
        searchField(): any {
            return {
                key: 'search', label: '', type: 'text',
                placeholder: 'ค้นหาชื่อประเภทคอก...', value: this.searchText,
                useForm: false, prefixIcon: 'magnifying-glass',
            }
        },
        filterField(): any {
            return {
                key: 'filterStatus', label: '', type: 'dropdown', useForm: false,
                value: this.filterStatus,
                children: [
                    { label: 'ทุกสถานะ', value: '' },
                    { label: 'ใช้งาน', value: 'active' },
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
                const response = await useFetchGetClient(apiBffHouseTypes, {
                    params: {
                        page: this.currentPage,
                        limit: 10,
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
            (this.$refs.modalForm as any).show()
        },

        onClickEdit(row: any) {
            (this.$refs.modalForm as any).show(row)
        },

        onClickDelete(id: string) {
            this.sAlertState?.show(defaultAlertConfirm(
                'ยืนยันการลบประเภทคอกหมูนี้?',
                async () => {
                    this.sLoadingState?.show()
                    try {
                        await useFetchDeleteClient(apiBffHouseTypesById(id))
                        await this.reloadData()
                    } finally {
                        this.sLoadingState?.hide()
                    }
                },
            ))
        },

        async onHandleSubmit({ editId, payload }: { editId: string; payload: any }) {
            this.sLoadingState?.show()
            try {
                const response = !editId
                    ? await useFetchPostClient(apiBffHouseTypes, payload)
                    : await useFetchPutClient(apiBffHouseTypesById(editId), payload)
                if (!isSuccessClient(response)) {
                    ; (this.$refs.modalForm as any).setError(getErrorMessageClient(response))
                    return
                }
                ; (this.$refs.modalForm as any).hide()
                this.sAlertState?.show(defaultAlertSuccess(editId ? 'แก้ไขประเภทคอกสำเร็จ' : 'เพิ่มประเภทคอกสำเร็จ'))
                await this.reloadData()
            } catch (e: any) {
                ; (this.$refs.modalForm as any).setError(e?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
            } finally {
                this.sLoadingState?.hide()
            }
        },
    },
}
</script>
