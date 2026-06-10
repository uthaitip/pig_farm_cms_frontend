<template>
  <div>
    <!-- Header -->
    <div class="pb-4 border-b-[3px] border-b-primary rounded-t">
      <h3 class="pt-2 text-xl font-semibold text-primary">จัดการเมนู</h3>
    </div>

    <!-- Actions -->
    <div class="flex justify-end pt-4 pb-2">
      <button class="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
        @click="onClickAdd(null)">
        + เพิ่มเมนู
      </button>
    </div>

    <!-- Table -->
    <div class="pt-2">
      <UIBaseTable :options="tableOptions" :data-list="items" :enabled-children="true" :show-running="true">
        <template #status="{ data }">
          <div class="flex justify-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-medium"
              :class="data.status === 'active' ? 'bg-green-100 text-appsuccess' : 'bg-gray-100 text-appgray'">
              {{ data.status === 'active' ? 'ใช้งาน' : 'ปิด' }}
            </span>
          </div>
        </template>
        <template #action="{ data }">
          <div class="flex items-center justify-center gap-2">
            <button title="เพิ่มเมนูย่อย" @click="onClickAdd(data._id)">
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
        <template #children-status="{ data }">
          <div class="flex justify-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-medium"
              :class="data.status === 'active' ? 'bg-green-100 text-appsuccess' : 'bg-gray-100 text-appgray'">
              {{ data.status === 'active' ? 'ใช้งาน' : 'ปิด' }}
            </span>
          </div>
        </template>
        <template #children-action="{ data }">
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

    <!-- Modal: Add/Edit -->
    <UIBaseModal id="modal-menu-form" :title="currentId ? 'แก้ไขเมนู' : 'เพิ่มเมนู'"
      width="max-w-md" :show-footer="false" @on-created="(m: any) => (modalForm = m)">
      <div>
        <UIBaseGenerateFormGrid :fields="topFields" />

        <!-- Icon picker -->
        <div class="mb-3">
          <label class="text-xs text-appgray mb-1 block">Icon</label>
          <button type="button"
            class="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-gray-50 outline-none focus:ring-1 focus:ring-primary-500"
            @click="openIconPicker">
            <UIBaseHeroIcon v-if="iconValue" :name="iconValue" size="h-5 w-5" color="text-appblack" />
            <span v-if="iconValue" class="text-appblack truncate">{{ iconValue }}</span>
            <span v-else class="text-appgray">เลือก Icon...</span>
            <span v-if="iconValue" class="ml-auto text-appgray hover:text-apperror text-xs shrink-0"
              @click.stop="iconValue = null">✕</span>
          </button>
        </div>

        <UIBaseGenerateFormGrid :fields="bottomFields" :hide-fields="currentId ? [] : ['status']" />

        <p v-if="formError" class="text-sm text-apperror mt-1">{{ formError }}</p>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="px-4 py-2 text-sm border border-appborder rounded-lg hover:bg-gray-50"
            @click="modalForm?.hide()">ยกเลิก</button>
          <button type="button" class="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
            @click="onSubmit">บันทึก</button>
        </div>
      </div>
    </UIBaseModal>

    <!-- Modal: Icon Picker -->
    <UIBaseModal id="modal-icon-picker" title="เลือก Icon" width="max-w-2xl" :show-footer="false"
      @on-created="(m: any) => (modalIconPicker = m)">
      <div>
        <input v-model="iconSearch" type="text" placeholder="ค้นหาชื่อ icon เช่น home, chart, user..."
          class="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 mb-3 outline-none focus:ring-primary-500 focus:border-primary-500" />
        <div class="grid grid-cols-6 gap-1.5 max-h-96 overflow-y-auto pr-1">
          <button v-for="icon in filteredIcons" :key="icon" type="button"
            class="flex flex-col items-center gap-1 p-2 rounded-lg border hover:border-primary-400 hover:bg-primary-50 transition-colors"
            :class="iconValue === icon ? 'border-primary-500 bg-primary-50' : 'border-transparent'"
            @click="selectIcon(icon)">
            <UIBaseHeroIcon :name="icon" size="h-6 w-6" color="text-appblack" />
            <span class="text-[9px] text-appgray truncate w-full text-center leading-tight">{{ icon }}</span>
          </button>
        </div>
        <p class="text-xs text-appgray mt-2">{{ filteredIcons.length }} icons</p>
      </div>
    </UIBaseModal>
  </div>
</template>

<script lang="ts">
import { heroIcons } from '~/composables/icon'
import type { Modal } from 'flowbite'

export default {
  setup() {
    definePageMeta({ layout: 'back-office' })
    const sLoadingState = useState<ILoading>('globalBaseLoading')
    const sAlertState = useState<IModal>('globalAlertModal')
    const { validate, resetForm, values } = useForm({
      initialValues: { name: '', parentId: '', path: '', sort: 0, status: 'active' },
    })
    return { sLoadingState, sAlertState, validate, resetForm, formValues: values }
  },

  data() {
    return {
      flatMenus:       [] as any[],
      items:           [] as any[],
      currentId:       '' as string,
      formError:       '' as string,
      iconValue:       null as string | null,
      modalForm:       null as Modal | null,
      modalIconPicker: null as Modal | null,
      iconSearch:      '',
      tableOptions: [
        { field: 'icon',   label: 'Icon',    headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-16' },
        { field: 'name',   label: 'ชื่อเมนู', headerAlign: 'text-left',   dataAlign: 'text-left' },
        { field: 'path',   label: 'Path',    headerAlign: 'text-left',   dataAlign: 'text-left font-mono text-sm' },
        { field: 'sort',   label: 'ลำดับ',   headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-20' },
        { field: 'status', label: 'สถานะ',   headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-24' },
        { field: 'action', label: 'จัดการ',  headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-44' },
      ] as any[],
    }
  },

  computed: {
    parentMenuOptions(): any[] {
      return [
        { label: '— หมวดหลัก (ไม่มี parent) —', value: '' },
        ...this.flatMenus
          .filter((m: any) => !m.parentId)
          .map((m: any) => ({ label: `${m.icon ?? ''} ${m.name}`.trim(), value: m._id })),
      ]
    },

    topFields(): any[] {
      const v = this.formValues as any
      return [
        {
          key: 'name', label: 'ชื่อเมนู', type: 'text',
          placeholder: 'เช่น จัดการรุ่นหมู', flex: 'full', required: true, useForm: true,
          value: v.name,
        },
        {
          key: 'parentId', label: 'หมวดหลัก', type: 'dropdown',
          flex: 'full', useForm: true,
          value: v.parentId,
          children: this.parentMenuOptions,
        },
        {
          key: 'path', label: 'Path', type: 'text',
          placeholder: 'เช่น /pig-batches', flex: 'full', useForm: true,
          value: v.path,
        },
        {
          key: 'sort', label: 'ลำดับ (sort)', type: 'number',
          placeholder: '0', flex: 'full', min: 0, useForm: true,
          value: v.sort,
        },
      ]
    },

    bottomFields(): any[] {
      const v = this.formValues as any
      return [
        {
          key: 'status', label: 'สถานะ', type: 'dropdown', flex: 'full', useForm: true,
          value: v.status,
          children: [
            { label: 'ใช้งาน', value: 'active' },
            { label: 'ปิด',    value: 'inactive' },
          ],
        },
      ]
    },

    allIcons(): string[] {
      return Object.keys(heroIcons).map((k) =>
        k.replace(/Icon$/, '').replace(/([A-Z])/g, (m, l, i) => i === 0 ? l.toLowerCase() : '-' + l.toLowerCase())
      )
    },

    filteredIcons(): string[] {
      const q = this.iconSearch.toLowerCase().trim()
      return q ? this.allIcons.filter((n) => n.includes(q)) : this.allIcons
    },
  },

  mounted() {
    this.loadMenus()
  },

  methods: {
    async loadMenus() {
      this.sLoadingState?.show()
      try {
        const response = await useFetchGetClient(CMS_API.menus.list, {
          params: { page: 1, limit: 999 },
        })
        const flat: any[] = getSuccessDataClient(response)?.list ?? []
        this.flatMenus = flat
        this.buildTree(flat)
      } finally {
        this.sLoadingState?.hide()
      }
    },

    buildTree(flat: any[]) {
      const parents  = flat.filter((m: any) => !m.parentId).sort((a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0))
      const children = flat.filter((m: any) => !!m.parentId)
      this.items = parents.map((p: any) => ({
        ...p,
        children: children
          .filter((c: any) => c.parentId === String(p._id))
          .sort((a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0)),
      }))
    },

    openIconPicker() {
      this.iconSearch = ''
      this.$nextTick(() => this.modalIconPicker?.show())
    },

    selectIcon(icon: string) {
      this.iconValue = icon
      this.modalIconPicker?.hide()
    },

    onClickAdd(parentId: string | null) {
      this.currentId = ''
      this.formError = ''
      this.iconValue = null
      this.resetForm({ values: { name: '', parentId: parentId ?? '', path: '', sort: 0, status: 'active' } })
      this.$nextTick(() => this.modalForm?.show())
    },

    onClickEdit(menu: any) {
      this.currentId = menu._id
      this.formError = ''
      this.iconValue = menu.icon ?? null
      this.resetForm({
        values: {
          name:     menu.name     ?? '',
          parentId: menu.parentId ?? '',
          path:     menu.path     ?? '',
          sort:     menu.sort     ?? 0,
          status:   menu.status   ?? 'active',
        },
      })
      this.$nextTick(() => this.modalForm?.show())
    },

    onClickDelete(id: string) {
      this.sAlertState?.show(defaultAlertConfirm(
        'ยืนยันการลบเมนูนี้?',
        async () => {
          this.sLoadingState?.show()
          try {
            await useFetchDeleteClient(CMS_API.menus.byId(id))
            await this.loadMenus()
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
          name:     v.name.trim(),
          path:     v.path     || null,
          icon:     this.iconValue || null,
          parentId: v.parentId || null,
          sort:     Number(v.sort) ?? 0,
          ...(this.currentId ? { status: v.status } : {}),
        }
        const response = !this.currentId
          ? await useFetchPostClient(CMS_API.menus.list, payload)
          : await useFetchPutClient(CMS_API.menus.byId(this.currentId), payload)
        if (!isSuccessClient(response)) { this.formError = getErrorMessageClient(response); return }
        this.modalForm?.hide()
        this.sAlertState?.show(defaultAlertSuccess(this.currentId ? 'แก้ไขเมนูสำเร็จ' : 'เพิ่มเมนูสำเร็จ'))
        await this.loadMenus()
      } catch (e: any) {
        this.formError = e?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่'
      } finally {
        this.sLoadingState?.hide()
      }
    },
  },
}
</script>
