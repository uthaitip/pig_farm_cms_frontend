<template>
  <UIBaseModal id="modal-mgmt-role-menus" title="กำหนดเมนูสำหรับสิทธิ์" width="max-w-2xl" :show-footer="false"
    @on-created="(m: any) => (modal = m)">
    <div>
      <div v-if="role" class="mb-4 px-3 py-2 bg-primary-50 rounded-lg">
        <p class="text-sm font-semibold text-primary">{{ role.name }}</p>
        <p class="text-xs text-appgray mt-0.5">
          {{ role.code }}{{ role.description ? ' · ' + role.description : '' }}
        </p>
      </div>

      <UIBaseTable :options="menuTableOptions" :data-list="flatMenuList" :is-mutiselect="true"
        :init-selected="selectedMenuObjects" @onSelected="onMenuSelected">
        <template #name="{ data }">
          <div v-if="!data.parentId" class="flex items-center gap-2 font-semibold text-appblack">
            <span>{{ data.icon ?? '📁' }}</span>
            <span>{{ data.name }}</span>
          </div>
          <div v-else class="flex items-center gap-2 pl-5 text-sm text-gray-600">
            <i class="fi fi-sr-angle-small-right text-appgray text-xs"></i>
            <span>{{ data.name }}</span>
          </div>
        </template>
      </UIBaseTable>

      <div class="flex items-center justify-between pt-3">
        <span class="text-xs text-appgray">เลือกแล้ว <strong>{{ selectedMenuIds.length }}</strong> รายการ</span>
        <div class="flex items-center gap-2">
          <p v-if="formError" class="text-sm text-apperror">{{ formError }}</p>
          <button type="button" class="px-4 py-2 text-sm border border-appborder rounded-lg hover:bg-gray-50"
            @click="modal?.hide()">ยกเลิก</button>
          <button type="button" class="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
            @click="onSave">บันทึก</button>
        </div>
      </div>
    </div>
  </UIBaseModal>
</template>

<script lang="ts">
import type { Modal } from 'flowbite'

export default {
  emits: ['onSave'],

  data() {
    return {
      modal:           null as Modal | null,
      role:            null as any,
      allMenus:        [] as any[],
      selectedMenuIds: [] as string[],
      formError:       '' as string,
      menuTableOptions: [
        { field: '_id',  hidden: true, isKey: true },
        { field: 'name', label: 'ชื่อเมนู', headerAlign: 'text-left',   dataAlign: 'text-left' },
        { field: 'path', label: 'Path',     headerAlign: 'text-left',   dataAlign: 'text-left font-mono text-xs', width: 'w-48' },
        { field: 'sort', label: 'ลำดับ',    headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-16' },
      ] as any[],
    }
  },

  computed: {
    flatMenuList(): any[] {
      const parents = this.allMenus
        .filter((m: any) => !m.parentId)
        .sort((a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0))
      const result: any[] = []
      for (const p of parents) {
        result.push(p)
        const children = this.allMenus
          .filter((c: any) => String(c.parentId) === String(p._id))
          .sort((a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0))
        result.push(...children)
      }
      return result
    },
    selectedMenuObjects(): any[] {
      return this.flatMenuList.filter((m: any) => this.selectedMenuIds.includes(String(m._id)))
    },
  },

  methods: {
    async show(role: any) {
      this.role            = role
      this.selectedMenuIds = (role.menuIds ?? []).map(String)
      this.formError       = ''
      await this.loadMenus()
      this.modal?.show()
    },
    hide() { this.modal?.hide() },
    setError(msg: string) { this.formError = msg },

    async loadMenus() {
      try {
        const response = await useFetchGetClient(CMS_API.menus.list, {
          params: { pagination: { page: 1, limit: 999 }, filter: {}, search: '' },
        })
        this.allMenus = getSuccessDataClient(response)?.list ?? []
      } catch {}
    },

    onMenuSelected(data: any) {
      this.selectedMenuIds = (data.selectedList ?? []).map((m: any) => String(m._id))
    },

    onSave() {
      if (!this.role) return
      this.$emit('onSave', { roleId: this.role._id, menuIds: this.selectedMenuIds })
    },
  },
}
</script>
